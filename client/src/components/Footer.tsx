import { Brain } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <div className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              FitnessAI
            </div>
            <div className="text-gray-400">•</div>
            <span className="text-gray-400 text-sm">© 2024 All rights reserved</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <Brain className="h-4 w-4" />
            <span>Powered by Advanced AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;