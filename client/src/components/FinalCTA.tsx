interface FinalCTAProps {
  onBeginTraining: () => void;
}

const FinalCTA = ({ onBeginTraining }: FinalCTAProps) => {
  return (
    <section className="py-32 bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-bold text-white mb-8">
          Ready to Experience
          <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            AI Fitness?
          </span>
        </h2>
        
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Join thousands of users who have transformed their fitness journey with our AI-powered platform.
        </p>

        <button
          onClick={onBeginTraining}
          className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white font-bold py-6 px-12 rounded-lg text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
        >
          Begin AI Training
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;