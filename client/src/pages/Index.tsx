import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import FinalCTA from "@/components/FinalCTA";
import ImageUpload from "@/components/ImageUpload";
import BodyTypeResult from "@/components/BodyTypeResult";
import WorkoutRecommendations from "@/components/WorkoutRecommendations";
import DietForm from "@/components/DietForm";
import DietPlan from "@/components/DietPlan";
import Footer from "@/components/Footer";
import { DietPlanResponse } from "@/types/diet";

type AIModel = 'body-type' | 'diet-plan';

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    bodyType: 'Ectomorph' | 'Mesomorph' | 'Endomorph';
    confidence: number;
  } | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlanResponse | null>(null);
  const [dietLoading, setDietLoading] = useState(false);
  const { toast } = useToast();

  // Check URL params on mount
  useEffect(() => {
    const modelParam = searchParams.get('model') as AIModel;
    if (modelParam === 'body-type' || modelParam === 'diet-plan') {
      setSelectedModel(modelParam);
    }
  }, [searchParams]);

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

  const handleDietPlanGenerated = (plan: DietPlanResponse) => {
    setDietPlan(plan);
  };

  const handleNewDietPlan = () => {
    setDietPlan(null);
  };

  const handleStartWorkout = () => {
    setSelectedModel('body-type');
  };

  const handleExploreModels = () => {
    navigate('/ai-models');
  };

  const handleBeginTraining = () => {
    setSelectedModel('body-type');
  };

  // Landing page view
  if (!selectedModel) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <HeroSection 
          onStartWorkout={handleStartWorkout}
          onExploreModels={handleExploreModels}
        />
        <FeaturesSection />
        <FinalCTA onBeginTraining={handleBeginTraining} />
        <Footer />
      </div>
    );
  }

  // Model-specific views
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">
              {selectedModel === 'body-type' ? 'Body Type Analysis' : 'Diet Plan Generator'}
            </h2>
            <button
              onClick={() => setSelectedModel(null)}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>

          {selectedModel === 'body-type' && (
            <>
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
            </>
          )}

          {selectedModel === 'diet-plan' && !dietPlan && (
            <DietForm 
              onPlanGenerated={handleDietPlanGenerated}
              loading={dietLoading}
              setLoading={setDietLoading}
            />
          )}

          {selectedModel === 'diet-plan' && dietPlan && (
            <DietPlan 
              plan={dietPlan}
              onNewPlan={handleNewDietPlan}
            />
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Index;
