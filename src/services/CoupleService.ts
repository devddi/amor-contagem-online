import { FormData } from '@/components/CreateSiteForm';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';

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
export const createCoupleSite = async (formData: FormData): Promise<LoveCouple | null> => {
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
          status: false
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

// Upload photos to Supabase storage and save references to the database
export const uploadPhotos = async (coupleId: number, photos: File[]): Promise<void> => {
  try {
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const fileExt = photo.name.split('.').pop();
      const fileName = `${coupleId}/${uuidv4()}.${fileExt}`;
      
      // Upload to Supabase storage
      const { data: fileData, error: uploadError } = await supabase.storage
        .from('love-photos')
        .upload(fileName, photo);
        
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
