import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface ImageCompressionProgressProps {
  isOpen: boolean;
  progress: number;
  originalSize: number;
  compressedSize: number;
  previewUrl: string;
}

export function ImageCompressionProgress({ 
  isOpen, 
  progress, 
  originalSize, 
  compressedSize,
  previewUrl 
}: ImageCompressionProgressProps) {
  const formatSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(1);

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Comprimindo imagem...</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Tamanho original</p>
              <p className="font-medium">{formatSize(originalSize)}</p>
            </div>
            <div>
              <p className="text-gray-500">Tamanho comprimido</p>
              <p className="font-medium">{formatSize(compressedSize)}</p>
            </div>
          </div>

          <div className="text-center text-sm text-green-600">
            Redução de {compressionRatio}%
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 