import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Target, Zap } from "lucide-react";

interface BodyTypeResultProps {
  bodyType: 'Ectomorph' | 'Mesomorph' | 'Endomorph';
  confidence: number;
  onGetPlan: () => void;
}

const BodyTypeResult = ({ bodyType, confidence, onGetPlan }: BodyTypeResultProps) => {
  const getBodyTypeInfo = (type: string) => {
    switch (type) {
      case 'Ectomorph':
        return {
          description: 'Naturally lean with a fast metabolism',
          traits: ['Lean build', 'Fast metabolism', 'Difficulty gaining weight'],
          color: 'from-accent to-accent/70',
          icon: Zap
        };
      case 'Mesomorph':
        return {
          description: 'Naturally muscular with balanced metabolism',
          traits: ['Athletic build', 'Balanced metabolism', 'Gains muscle easily'],
          color: 'from-primary to-primary-glow',
          icon: Target
        };
      case 'Endomorph':
        return {
          description: 'Naturally curvy with slower metabolism',
          traits: ['Rounded build', 'Slower metabolism', 'Gains weight easily'],
          color: 'from-secondary to-secondary/70',
          icon: User
        };
      default:
        return {
          description: '',
          traits: [],
          color: 'from-primary to-primary-glow',
          icon: User
        };
    }
  };

  const info = getBodyTypeInfo(bodyType);
  const IconComponent = info.icon;

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-muted/50 to-background">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-foreground">
          Your Body Type Result
        </h2>

        <Card className="p-8 max-w-2xl mx-auto shadow-strong hover:shadow-[0_20px_60px_hsl(var(--primary)/0.2)] transition-all duration-500">
          <div className="text-center space-y-6">
            {/* Icon and Body Type */}
            <div className={`mx-auto w-20 h-20 bg-gradient-to-br ${info.color} rounded-full flex items-center justify-center shadow-medium`}>
              <IconComponent className="h-10 w-10 text-white" />
            </div>

            <div>
              <h3 className="text-3xl font-bold text-foreground mb-2">
                You are a {bodyType}
              </h3>
              <p className="text-lg text-muted-foreground">
                {info.description}
              </p>
            </div>

            {/* Confidence Score */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">Confidence Score</span>
                <Badge variant="secondary" className="bg-gradient-to-r from-primary to-secondary text-white">
                  {confidence}% Match
                </Badge>
              </div>
              <Progress value={confidence} className="h-3" />
            </div>

            {/* Traits */}
            <div className="bg-gradient-to-br from-card to-muted/30 p-6 rounded-lg">
              <h4 className="font-semibold text-foreground mb-3">Key Characteristics</h4>
              <ul className="space-y-2">
                {info.traits.map((trait, index) => (
                  <li key={index} className="text-muted-foreground text-sm flex items-center gap-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full" />
                    {trait}
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <Button 
              variant="hero" 
              size="lg" 
              onClick={onGetPlan}
              className="w-full group"
            >
              Get My Personalized Workout Plan
              <Target className="ml-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default BodyTypeResult;