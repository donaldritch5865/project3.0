import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

interface HeroSectionProps {
  onStartWorkout: () => void;
  onExploreModels: () => void;
}

const HeroSection = ({ onStartWorkout, onExploreModels }: HeroSectionProps) => {
  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features-section");
    featuresSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-blue-900/20 to-pink-900/30" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
          Transform Your
          <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Fitness Journey
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
          Unlock your potential with AI-powered body analysis and personalized nutrition plans. 
          Get started with our advanced fitness intelligence platform.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={onStartWorkout}
            className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Start AI Workout
          </button>
          <button
            onClick={onExploreModels}
            className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
          >
            Explore AI Models
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={scrollToFeatures}
      >
        <ArrowDown className="h-6 w-6 text-white/70" />
      </div>
    </section>
  );
};

export default HeroSection;