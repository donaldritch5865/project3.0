import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ImageUpload from "@/components/ImageUpload";
import BodyTypeResult from "@/components/BodyTypeResult";
import WorkoutRecommendations from "@/components/WorkoutRecommendations";
import DietForm from "@/components/DietForm";
import DietPlan from "@/components/DietPlan";
import Footer from "@/components/Footer";
import { DietPlanResponse } from "@/types/diet";
import { Brain, Camera, Utensils } from "lucide-react";

type AIModel = 'body-type' | 'diet-plan';

const Index = () => {
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    bodyType: 'Ectomorph' | 'Mesomorph' | 'Endomorph';
    confidence: number;
  } | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlanResponse | null>(null);
  const [dietLoading, setDietLoading] = useState(false);
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

  const handleDietPlanGenerated = (plan: DietPlanResponse) => {
    setDietPlan(plan);
  };

  const handleNewDietPlan = () => {
    setDietPlan(null);
  };

  const resetToModelSelection = () => {
    setSelectedModel(null);
    setResult(null);
    setDietPlan(null);
    setIsProcessing(false);
    setDietLoading(false);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSection />
      
      {!selectedModel && (
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your AI Model
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-12">
              Select the AI model that best fits your fitness goals
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Body Type Classification Model */}
              <div 
                onClick={() => setSelectedModel('body-type')}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Camera className="w-12 h-12 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Body Type Classifier
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Upload your photo to discover your body type (Ectomorph, Mesomorph, or Endomorph) and get personalized workout recommendations.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    <span>Image-based AI classification</span>
                  </div>
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    <span>Instant body type identification</span>
                  </div>
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    <span>Workout recommendations</span>
                  </div>
                </div>
              </div>

              {/* Diet & Goal Recommender Model */}
              <div 
                onClick={() => setSelectedModel('diet-plan')}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-transparent hover:border-primary"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-green-500/10 p-4 rounded-full">
                    <Utensils className="w-12 h-12 text-green-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  Diet & Goal Recommender
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Get personalized diet plans and nutrition recommendations based on your goals, preferences, and lifestyle.
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    <span>Personalized meal planning</span>
                  </div>
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    <span>BMI calculation & tracking</span>
                  </div>
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 mr-2" />
                    <span>Nutrition optimization</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                Both models use advanced AI to provide you with the most accurate and personalized recommendations
              </p>
            </div>
          </div>
        </div>
      )}

      {selectedModel && (
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedModel === 'body-type' ? 'Body Type Classifier' : 'Diet & Goal Recommender'}
            </h2>
            <button
              onClick={resetToModelSelection}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Change Model
            </button>
          </div>
        </div>
      )}

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
        <div className="container mx-auto px-4 py-8">
          <DietForm 
            onPlanGenerated={handleDietPlanGenerated}
            loading={dietLoading}
            setLoading={setDietLoading}
          />
        </div>
      )}

      {selectedModel === 'diet-plan' && dietPlan && (
        <div className="container mx-auto px-4 py-8">
          <DietPlan 
            plan={dietPlan}
            onNewPlan={handleNewDietPlan}
          />
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Index;
