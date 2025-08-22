import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navbar from "@/components/Navbar";
import ImageUpload from "@/components/ImageUpload";
import BodyTypeResult from "@/components/BodyTypeResult";
import WorkoutRecommendations from "@/components/WorkoutRecommendations";
import { User, Activity, Target, Calendar } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  created_at: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    bodyType: 'Ectomorph' | 'Mesomorph' | 'Endomorph';
    confidence: number;
  } | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load profile data.",
          });
        } else {
          setProfile(data);
        }
      }
    };

    fetchProfile();
  }, [user, toast]);

  const handleImageUpload = async (file: File) => {
    setIsProcessing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock classification results
    const bodyTypes: Array<'Ectomorph' | 'Mesomorph' | 'Endomorph'> = ['Ectomorph', 'Mesomorph', 'Endomorph'];
    const randomBodyType = bodyTypes[Math.floor(Math.random() * bodyTypes.length)];
    const randomConfidence = Math.floor(Math.random() * 20) + 80;
    
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

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/20 to-accent/20 border-0">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 bg-primary text-primary-foreground">
                  <AvatarFallback className="text-lg font-semibold">
                    {getInitials(profile?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">
                    Welcome back, {profile?.full_name || 'Fitness Enthusiast'}!
                  </CardTitle>
                  <CardDescription className="text-foreground/70">
                    Ready to discover your body type and optimize your workouts?
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Body type scans completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Workout Plans</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Personalized plans generated</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Days Active</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Since joining FitType</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Body Type Analysis
              </CardTitle>
              <CardDescription>
                Upload a photo to get your personalized body type classification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload 
                onImageUpload={handleImageUpload} 
                isProcessing={isProcessing}
              />
            </CardContent>
          </Card>

          {result && (
            <BodyTypeResult 
              bodyType={result.bodyType}
              confidence={result.confidence}
              onGetPlan={handleGetPlan}
            />
          )}

          <WorkoutRecommendations selectedBodyType={result?.bodyType} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;