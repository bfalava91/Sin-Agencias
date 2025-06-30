
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  disabled?: boolean;
}

const ImageUpload = ({ images, onImagesChange, disabled }: ImageUploadProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadImage = async (file: File) => {
    if (!user) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('listing-images')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('listing-images')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleFileSelect = async (files: FileList) => {
    if (!files.length || uploading) return;

    setUploading(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const url = await uploadImage(file);
        if (url) newImages.push(url);
      }
    }

    if (newImages.length > 0) {
      onImagesChange([...images, ...newImages]);
      toast({
        title: "Imágenes subidas",
        description: `Se han subido ${newImages.length} imagen${newImages.length > 1 ? 'es' : ''} exitosamente.`,
      });
    }

    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Main Thumbnail - Show first image prominently */}
      {images.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Imagen Principal</h4>
          <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
            <img
              src={images[0]}
              alt="Imagen principal de la propiedad"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium">
              Principal
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeImage(0);
              }}
              className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Card
        className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleButtonClick}
      >
        <CardContent className="p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">
            Arrastra y suelta imágenes aquí o haz clic para seleccionar
          </p>
          <Button type="button" variant="outline" disabled={uploading || disabled}>
            {uploading ? 'Subiendo...' : 'Seleccionar Imágenes'}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          />
        </CardContent>
      </Card>

      {/* Additional Images Grid - Show remaining images */}
      {images.length > 1 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Imágenes Adicionales ({images.length - 1})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.slice(1).map((image, index) => (
              <div key={index + 1} className="relative group">
                <img
                  src={image}
                  alt={`Imagen ${index + 2}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index + 1);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={disabled}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <p className="text-sm text-gray-500 text-center">
          {images.length} imagen{images.length > 1 ? 'es' : ''} subida{images.length > 1 ? 's' : ''}. La primera imagen será la principal en tu anuncio.
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
