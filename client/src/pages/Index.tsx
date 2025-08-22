import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ImageUpload from "@/components/ImageUpload";
import BodyTypeResult from "@/components/BodyTypeResult";
import WorkoutRecommendations from "@/components/WorkoutRecommendations";
import Footer from "@/components/Footer";

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    bodyType: 'Ectomorph' | 'Mesomorph' | 'Endomorph';
    confidence: number;
  } | null>(null);
  const { toast } = useToast();

  // Simulate ML model processing
  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock classification results (in real app, this would call your Python backend)
    const bodyTypes: Array<'Ectomorph' | 'Mesomorph' | 'Endomorph'> = ['Ectomorph', 'Mesomorph', 'Endomorph'];
    const randomBodyType = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
    const randomConfidence = Math.floor(Math.random() * 20) + 80; // 80-99% confidence
    
    setResult({
      bodyType: randomBodyType,
      confidence: randomConfidence
    });
    
    setIsProcessing(false);
    
    toast({
      title: "Analysis Complete!",
      description: `Your body type has been identified as ${randomBodyType} with ${randomConfidence}% confidence.`,
    });
  };

  const handleGetPlan = () => {
    toast({
      title: "Coming Soon!",
      description: "Detailed workout plans will be available in the next update.",
    });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      <ImageUpload 
        onImageUpload={handleImageUpload} 
        isProcessing={isProcessing}
      />
      {result && (
        <BodyTypeResult 
          bodyType={result.bodyType}
          confidence={result.confidence}
          onGetPlan={handleGetPlan}
        />
      )}
      <WorkoutRecommendations selectedBodyType={result?.bodyType} />
      <Footer />
    </div>
  );
};

export default Index;
