
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";

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
    toast({
      title: "Imagen eliminada",
      description: "La imagen ha sido eliminada exitosamente.",
    });
  };

  const setMainImage = (index: number) => {
    const newImages = [...images];
    const mainImage = newImages.splice(index, 1)[0];
    newImages.unshift(mainImage);
    onImagesChange(newImages);
    toast({
      title: "Imagen principal actualizada",
      description: "La imagen principal ha sido actualizada.",
    });
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newImages = Array.from(images);
    const [reorderedItem] = newImages.splice(result.source.index, 1);
    newImages.splice(result.destination.index, 0, reorderedItem);

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
            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
              <Star className="h-3 w-3 mr-1" />
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

      {/* Additional Images Grid with Drag and Drop */}
      {images.length > 1 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">
            Imágenes Adicionales ({images.length - 1})
          </h4>
          <p className="text-xs text-gray-500 mb-3">
            Arrastra las imágenes para reordenarlas o haz clic en la estrella para establecer como principal
          </p>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="images" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {images.slice(1).map((image, index) => (
                    <Draggable 
                      key={`${image}-${index + 1}`} 
                      draggableId={`${image}-${index + 1}`} 
                      index={index + 1}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`relative group cursor-move ${
                            snapshot.isDragging ? 'opacity-75' : ''
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Imagen ${index + 2}`}
                            className="w-full h-32 object-cover rounded-lg border-2 border-transparent hover:border-blue-300 transition-colors"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMainImage(index + 1);
                            }}
                            className="absolute top-2 left-2 p-1 bg-yellow-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-yellow-600"
                            disabled={disabled}
                            title="Establecer como imagen principal"
                          >
                            <Star className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index + 1);
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            disabled={disabled}
                            title="Eliminar imagen"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {images.length > 0 && (
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-700 text-center">
            <Star className="inline h-4 w-4 mr-1" />
            {images.length} imagen{images.length > 1 ? 'es' : ''} subida{images.length > 1 ? 's' : ''}. 
            La primera imagen será la principal en tu anuncio.
          </p>
          <p className="text-xs text-blue-600 text-center mt-1">
            Tip: Arrastra las imágenes para cambiar el orden o usa el botón de estrella para establecer una como principal
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
