import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Image, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateSiteFormProps {
  onFormChange: (formData: FormData) => void;
}

export interface FormData {
  coupleNames: string;
  relationshipStartDate: string;
  relationshipStartTime: string;
  message: string;
  photos: File[];
}

const CreateSiteForm: React.FC<CreateSiteFormProps> = ({ onFormChange }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    coupleNames: '',
    relationshipStartDate: '',
    relationshipStartTime: '',
    message: '',
    photos: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      onFormChange(newData);
      return newData;
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      
      // Check if we're exceeding the photo limit (3 photos max)
      if ((formData.photos.length + newPhotos.length) > 3) {
        toast({
          title: "Limite de fotos excedido",
          description: "O plano permite até 3 fotos.",
          variant: "destructive"
        });
        return;
      }
      
      setFormData(prev => {
        const updatedPhotos = [...prev.photos, ...newPhotos].slice(0, 3);
        const newData = { ...prev, photos: updatedPhotos };
        onFormChange(newData);
        return newData;
      });
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => {
      const newPhotos = [...prev.photos];
      newPhotos.splice(index, 1);
      
      const newData = { ...prev, photos: newPhotos };
      onFormChange(newData);
      return newData;
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-8">
        <div>
          <Label htmlFor="coupleNames">Nome do casal:</Label>
          <Input 
            id="coupleNames" 
            name="coupleNames"
            placeholder="André e Carol (Não use emoji)" 
            value={formData.coupleNames}
            onChange={handleInputChange}
            className="mt-1"
          />
        </div>
        
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <Label htmlFor="relationshipStartDate">Início do relacionamento:</Label>
            <div className="flex mt-1">
              <Input 
                id="relationshipStartDate" 
                name="relationshipStartDate"
                type="date" 
                value={formData.relationshipStartDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="flex-1">
            <Label htmlFor="relationshipStartTime">Hora do início:</Label>
            <div className="flex mt-1">
              <Input 
                id="relationshipStartTime" 
                name="relationshipStartTime"
                type="time" 
                value={formData.relationshipStartTime}
                onChange={handleInputChange}
                step="1"
              />
            </div>
          </div>
        </div>
        
        <div>
          <Label htmlFor="message">Mensagem:</Label>
          <Textarea 
            id="message" 
            name="message"
            placeholder="Escreva sua linda mensagem aqui. Capriche hein! 💕" 
            className="mt-1 h-32"
            value={formData.message}
            onChange={handleInputChange}
            maxLength={300}
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.message.length}/300 caracteres
          </p>
        </div>
        
        <div>
          <Label>Fotos do casal:</Label>
          <div className="mt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full h-20 border-dashed flex flex-col gap-2"
              onClick={() => document.getElementById('photo-input')?.click()}
            >
              <Image className="h-5 w-5" />
              <span>Escolher foto do casal</span>
            </Button>
            <input
              id="photo-input"
              type="file"
              accept="image/*"
              multiple={true}
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
          
          {formData.photos.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(photo)}
                    alt={`Foto do casal ${index + 1}`}
                    className="w-full h-40 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    onClick={() => removePhoto(index)}
                  >
                    <span className="text-xs">✕</span>
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <p className="text-sm text-gray-500 mt-2">
            {formData.photos.length}/3 fotos adicionadas
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateSiteForm;
