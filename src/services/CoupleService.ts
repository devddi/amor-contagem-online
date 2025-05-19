import { FormData } from '@/components/CreateSiteForm';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import imageCompression from 'browser-image-compression';

export interface LoveCouple {
  id: number;
  couple_names: string;
  relationship_start_date: string;
  relationship_start_time?: string;
  message?: string;
  site_id: string;
  created_at: string;
  updated_at: string;
}

export interface LovePhoto {
  id: number;
  couple_id: number;
  photo_url: string;
  photo_order: number;
}

// Generate a URL-friendly slug from couple names
export const generateSiteId = (coupleNames: string): string => {
  const slug = coupleNames
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
    
  // Add a short UUID suffix to ensure uniqueness
  const shortId = uuidv4().substring(0, 8);
  return `${slug}-${shortId}`;
};

// Save couple information and upload photos
export const createCoupleSite = async (formData: FormData, email?: string): Promise<LoveCouple | null> => {
  try {
    // Generate a site ID from the couple names
    const siteId = generateSiteId(formData.coupleNames);
    
    // Insert couple data into love_couples table
    const { data: coupleData, error: coupleError } = await supabase
      .from('love_couples')
      .insert([
        {
          couple_names: formData.coupleNames,
          relationship_start_date: formData.relationshipStartDate,
          relationship_start_time: formData.relationshipStartTime || null,
          message: formData.message || null,
          site_id: siteId,
          status: false,
          email: email || null  // Add the email field
        }
      ])
      .select('*')
      .single();
    
    if (coupleError) {
      console.error('Error creating couple:', coupleError);
      throw coupleError;
    }
    
    // Upload photos to Supabase storage and save references
    if (formData.photos.length > 0) {
      await uploadPhotos(coupleData.id, formData.photos);
    }
    
    return coupleData;
  } catch (error) {
    console.error('Error in createCoupleSite:', error);
    return null;
  }
};

// Função para comprimir a imagem
const compressImage = async (
  file: File, 
  onProgress?: (progress: number, compressedSize: number) => void
): Promise<{ file: File; previewUrl: string }> => {
  const options = {
    maxSizeMB: 1, // Tamanho máximo do arquivo em MB
    maxWidthOrHeight: 1920, // Dimensão máxima (largura ou altura)
    useWebWorker: true, // Usar web worker para não travar a UI
    fileType: 'image/jpeg', // Converter para JPEG para melhor compressão
    onProgress: (progress: number) => {
      if (onProgress) {
        onProgress(progress, 0); // O tamanho comprimido será atualizado depois
      }
    }
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const previewUrl = URL.createObjectURL(compressedFile);
    
    if (onProgress) {
      onProgress(100, compressedFile.size);
    }
    
    return {
      file: new File([compressedFile], file.name, { type: 'image/jpeg' }),
      previewUrl
    };
  } catch (error) {
    console.error('Erro ao comprimir imagem:', error);
    const previewUrl = URL.createObjectURL(file);
    return { file, previewUrl }; // Retorna o arquivo original em caso de erro
  }
};

// Upload photos to Supabase storage and save references to the database
export const uploadPhotos = async (
  coupleId: number, 
  photos: File[],
  onCompressionProgress?: (index: number, progress: number, originalSize: number, compressedSize: number, previewUrl: string) => void
): Promise<void> => {
  try {
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      
      // Comprime a imagem antes do upload
      const { file: compressedPhoto, previewUrl } = await compressImage(
        photo,
        (progress, compressedSize) => {
          if (onCompressionProgress) {
            onCompressionProgress(i, progress, photo.size, compressedSize, previewUrl);
          }
        }
      );
      
      const fileExt = 'jpg'; // Agora sempre será jpg devido à compressão
      const fileName = `${coupleId}/${uuidv4()}.${fileExt}`;
      
      // Upload to Supabase storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('love-photos')
        .upload(fileName, compressedPhoto);
        
      if (uploadError) {
        console.error('Error uploading photo:', uploadError);
        throw uploadError;
      }
      
      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('love-photos')
        .getPublicUrl(fileName);
        
      const photoUrl = publicUrlData.publicUrl;
      
      // Save photo reference in the database
      const { error: photoRefError } = await supabase
        .from('love_photos')
        .insert([
          {
            couple_id: coupleId,
            photo_url: photoUrl,
            photo_order: i
          }
        ]);
        
      if (photoRefError) {
        console.error('Error saving photo reference:', photoRefError);
        throw photoRefError;
      }

      // Limpa a URL do preview
      URL.revokeObjectURL(previewUrl);
    }
  } catch (error) {
    console.error('Error in uploadPhotos:', error);
  }
};

// Fetch couple data by site ID
export const getCoupleBySiteId = async (siteId: string): Promise<LoveCouple | null> => {
  try {
    const { data, error } = await supabase
      .from('love_couples')
      .select('*')
      .eq('site_id', siteId)
      .single();
      
    if (error) {
      console.error('Error fetching couple:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getCoupleBySiteId:', error);
    return null;
  }
};

// Fetch photos for a couple
export const getPhotosByRoupleId = async (coupleId: number): Promise<LovePhoto[] | null> => {
  try {
    const { data, error } = await supabase
      .from('love_photos')
      .select('*')
      .eq('couple_id', coupleId)
      .order('photo_order', { ascending: true });
      
    if (error) {
      console.error('Error fetching photos:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error in getPhotosByRoupleId:', error);
    return null;
  }
};

export const checkSiteStatus = async (siteId: string) => {
  try {
    const { data, error } = await supabase
      .from('love_couples')
      .select('status')
      .eq('id', siteId)
      .single();

    if (error) throw error;
    return data?.status || false;
  } catch (error) {
    console.error('Error checking site status:', error);
    return false;
  }
};
