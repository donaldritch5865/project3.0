import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  isProcessing: boolean;
}

const ImageUpload = ({ onImageUpload, isProcessing }: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    multiple: false
  });

  return (
    <section id="upload-section" className="py-20 px-6 bg-gradient-to-br from-background to-muted">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          Upload Your Photo
        </h2>
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Our AI will analyze your body type in seconds and provide personalized recommendations
        </p>

        <Card className="p-8 max-w-2xl mx-auto shadow-medium hover:shadow-strong transition-all duration-300">
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-lg p-12 cursor-pointer transition-all duration-300 hover:scale-[1.02]",
              isDragActive
                ? "border-primary bg-primary/5 shadow-inner"
                : "border-border hover:border-primary/50 hover:bg-primary/5",
              isProcessing && "pointer-events-none opacity-50"
            )}
          >
            <input {...getInputProps()} />
            
            {preview ? (
              <div className="space-y-6">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-full h-64 object-cover rounded-lg mx-auto shadow-medium"
                />
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span className="text-lg font-medium">Analyzing your body type...</span>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Click to upload a different image or wait for results
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                  {isDragActive ? (
                    <ImageIcon className="h-8 w-8 text-white" />
                  ) : (
                    <Upload className="h-8 w-8 text-white" />
                  )}
                </div>
                
                <div>
                  <p className="text-xl font-semibold text-foreground mb-2">
                    {isDragActive ? "Drop your image here" : "Upload your photo"}
                  </p>
                  <p className="text-muted-foreground">
                    Drag & drop or click to select • JPEG, PNG, WebP • Max 10MB
                  </p>
                </div>
                
                <Button variant="outline" size="lg" className="mt-4">
                  Choose File
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ImageUpload;