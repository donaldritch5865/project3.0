import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Zap, Target, User } from "lucide-react";

interface WorkoutRecommendationsProps {
  selectedBodyType?: 'Ectomorph' | 'Mesomorph' | 'Endomorph' | null;
}

const WorkoutRecommendations = ({ selectedBodyType }: WorkoutRecommendationsProps) => {
  const workoutPlans = [
    {
      bodyType: 'Ectomorph',
      title: 'Muscle Building Focus',
      description: 'Heavy lifting with longer rest periods to maximize muscle growth',
      focus: 'Bulk & Strength',
      exercises: [
        'Compound lifts (squats, deadlifts)',
        'Progressive overload training',
        'Minimal cardio, focus on weights'
      ],
      color: 'from-accent to-accent/70',
      icon: Zap,
      recommended: selectedBodyType === 'Ectomorph'
    },
    {
      bodyType: 'Mesomorph',
      title: 'Balanced Training',
      description: 'Mix of strength training and cardio for optimal body composition',
      focus: 'Athletic Performance',
      exercises: [
        'Strength training 4-5x/week',
        'HIIT cardio sessions',
        'Functional movement patterns'
      ],
      color: 'from-primary to-primary-glow',
      icon: Target,
      recommended: selectedBodyType === 'Mesomorph'
    },
    {
      bodyType: 'Endomorph',
      title: 'Fat Loss Priority',
      description: 'High-intensity workouts combined with metabolic training',
      focus: 'Lean & Tone',
      exercises: [
        'Circuit training',
        'Cardio 5-6x/week',
        'High-rep strength training'
      ],
      color: 'from-secondary to-secondary/70',
      icon: User,
      recommended: selectedBodyType === 'Endomorph'
    }
  ];

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Personalized Workout Plans
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Each body type responds differently to exercise. Choose the plan that matches your natural physique for optimal results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {workoutPlans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card
                key={plan.bodyType}
                className={`p-6 relative overflow-hidden transition-all duration-500 hover:scale-105 ${
                  plan.recommended 
                    ? 'shadow-strong ring-2 ring-primary/50 bg-gradient-to-br from-card to-primary/5' 
                    : 'shadow-medium hover:shadow-strong'
                }`}
              >
                {plan.recommended && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-primary to-secondary text-white">
                    Recommended for You
                  </Badge>
                )}

                <div className="space-y-6">
                  {/* Icon and Header */}
                  <div className="text-center">
                    <div className={`mx-auto w-16 h-16 bg-gradient-to-br ${plan.color} rounded-full flex items-center justify-center shadow-medium mb-4`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {plan.bodyType}
                    </h3>
                    <Badge variant="outline" className="text-sm">
                      {plan.focus}
                    </Badge>
                  </div>

                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">
                      {plan.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Exercise List */}
                  <div className="bg-gradient-to-br from-muted/20 to-muted/40 p-4 rounded-lg">
                    <h5 className="font-medium text-foreground mb-3 text-sm">Key Training Elements:</h5>
                    <ul className="space-y-2">
                      {plan.exercises.map((exercise, index) => (
                        <li key={index} className="text-muted-foreground text-sm flex items-start gap-2">
                          <Dumbbell className="h-3 w-3 mt-1 flex-shrink-0 text-primary" />
                          {exercise}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant={plan.recommended ? "hero" : "outline"} 
                    className="w-full"
                  >
                    Get {plan.bodyType} Plan
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorkoutRecommendations;