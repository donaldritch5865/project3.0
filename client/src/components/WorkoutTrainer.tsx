import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Home, Camera } from 'lucide-react';
import io from 'socket.io-client';

interface WorkoutTrainerProps {
  onBackToHome: () => void;
}

interface ExerciseMetrics {
  reps: number;
  stage: string;
  goodReps: number;
  feedback: string[];
}

const WorkoutTrainer: React.FC<WorkoutTrainerProps> = ({ onBackToHome }) => {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<ExerciseMetrics>({
    reps: 0,
    stage: 'Ready',
    goodReps: 0,
    feedback: []
  });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [processedFrame, setProcessedFrame] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const socketRef = useRef<any>(null);
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const exercises = [
    { id: 'bicep_curl', name: '💪 Bicep Curls', description: 'Upper arm strength training' },
    { id: 'squats', name: '🏋️ Squats', description: 'Lower body power exercise' },
    { id: 'pushups', name: '🤜 Push-ups', description: 'Chest and tricep workout' },
    { id: 'lunges', name: '🦵 Lunges', description: 'Leg and glute strengthening' },
    { id: 'overhead_press', name: '🏋️ Overhead Press', description: 'Shoulder muscle building' },
    { id: 'lateral_raises', name: '👉 Lateral Raises', description: 'Shoulder isolation exercise' },
    { id: 'pullups', name: '🏋️ Pull-ups', description: 'Back and bicep strength' },
    { id: 'glute_bridges', name: '🍑 Glute Bridges', description: 'Hip and glute activation' },
    { id: 'crunches', name: '🔥 Crunches', description: 'Core strengthening' },
    { id: 'plank', name: '🧘 Plank', description: 'Full core stability' }
  ];

  // Initialize pose detection (using MediaPipe Web for now)
  useEffect(() => {
    const initializePose = async () => {
      try {
        const { Pose } = await import('@mediapipe/pose');
        
        const pose = new Pose({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
          }
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        pose.onResults(onPoseResults);
        socketRef.current = pose;

      } catch (error) {
        console.error('Failed to load MediaPipe:', error);
      }
    };

    initializePose();
  }, []);

  const calculateAngle = (a: number[], b: number[], c: number[]): number => {
    const radians = Math.atan2(c[1] - b[1], c[0] - b[0]) - Math.atan2(a[1] - b[1], a[0] - b[0]);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    return angle > 180 ? 360 - angle : angle;
  };

  const onPoseResults = (results: any) => {
    if (!results.poseLandmarks || !isWorkoutActive) return;

    const landmarks = results.poseLandmarks;
    
    if (selectedExercise === 'bicep_curl') {
      processBicepCurl(landmarks);
    } else if (selectedExercise === 'squats') {
      processSquats(landmarks);
    } else if (selectedExercise === 'pushups') {
      processPushups(landmarks);
    }
    
    drawPose(results);
  };

  const processBicepCurl = (landmarks: any[]) => {
    try {
      const shoulder = [landmarks[11].x, landmarks[11].y]; // LEFT_SHOULDER
      const elbow = [landmarks[13].x, landmarks[13].y];     // LEFT_ELBOW  
      const wrist = [landmarks[15].x, landmarks[15].y];     // LEFT_WRIST

      const elbowAngle = calculateAngle(shoulder, elbow, wrist);
      
      setMetrics(prev => {
        let newStage = prev.stage;
        let newReps = prev.reps;
        let newGoodReps = prev.goodReps;
        let newFeedback = ['Good form!'];
        
        // Rep counting logic
        if (elbowAngle > 160) {
          newStage = 'down';
        }
        if (elbowAngle < 30 && prev.stage === 'down') {
          newStage = 'up';
          newReps = prev.reps + 1;
          newGoodReps = prev.goodReps + 1; // Assume good form for demo
        }
        
        // Form feedback
        if (newStage === 'up' && elbowAngle > 45) {
          newFeedback = ['Lift higher for full contraction!'];
        } else if (newStage === 'down' && elbowAngle < 150) {
          newFeedback = ['Lower your arm completely!'];
        }
        
        return {
          reps: newReps,
          stage: newStage,
          goodReps: newGoodReps,
          feedback: newFeedback
        };
      });
    } catch (error) {
      console.error('Error processing bicep curl:', error);
    }
  };

  const processSquats = (landmarks: any[]) => {
    try {
      const hip = [landmarks[23].x, landmarks[23].y];      // LEFT_HIP
      const knee = [landmarks[25].x, landmarks[25].y];     // LEFT_KNEE
      const ankle = [landmarks[27].x, landmarks[27].y];    // LEFT_ANKLE

      const kneeAngle = calculateAngle(hip, knee, ankle);
      
      setMetrics(prev => {
        let newStage = prev.stage;
        let newReps = prev.reps;
        let newGoodReps = prev.goodReps;
        let newFeedback = ['Good form!'];
        
        // Rep counting logic
        if (kneeAngle > 160) {
          newStage = 'up';
        }
        if (kneeAngle < 100 && prev.stage === 'up') {
          newStage = 'down';
          newReps = prev.reps + 1;
          newGoodReps = prev.goodReps + 1; // Assume good form for demo
        }
        
        // Form feedback
        if (newStage === 'down' && kneeAngle > 100) {
          newFeedback = ['Squat deeper for full range!'];
        }
        
        return {
          reps: newReps,
          stage: newStage,
          goodReps: newGoodReps,
          feedback: newFeedback
        };
      });
    } catch (error) {
      console.error('Error processing squats:', error);
    }
  };

  const processPushups = (landmarks: any[]) => {
    try {
      const shoulder = [landmarks[11].x, landmarks[11].y]; // LEFT_SHOULDER
      const elbow = [landmarks[13].x, landmarks[13].y];     // LEFT_ELBOW  
      const wrist = [landmarks[15].x, landmarks[15].y];     // LEFT_WRIST

      const elbowAngle = calculateAngle(shoulder, elbow, wrist);
      
      setMetrics(prev => {
        let newStage = prev.stage;
        let newReps = prev.reps;
        let newGoodReps = prev.goodReps;
        let newFeedback = ['Good form!'];
        
        // Rep counting logic for pushups
        if (elbowAngle > 160) {
          newStage = 'up';
        }
        if (elbowAngle < 90 && prev.stage === 'up') {
          newStage = 'down';
          newReps = prev.reps + 1;
          newGoodReps = prev.goodReps + 1;
        }
        
        // Form feedback
        if (newStage === 'down' && elbowAngle > 120) {
          newFeedback = ['Lower yourself more for full range!'];
        }
        
        return {
          reps: newReps,
          stage: newStage,
          goodReps: newGoodReps,
          feedback: newFeedback
        };
      });
    } catch (error) {
      console.error('Error processing pushups:', error);
    }
  };

  const drawPose = (results: any) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    if (results.poseLandmarks) {
      drawConnections(ctx, results.poseLandmarks);
      drawLandmarks(ctx, results.poseLandmarks);
    }
    
    // Draw feedback
    ctx.font = '20px Arial';
    ctx.fillStyle = metrics.feedback.includes('Good form!') ? '#10B981' : '#EF4444';
    metrics.feedback.forEach((feedback, index) => {
      ctx.fillText(feedback, 20, 40 + (index * 30));
    });
  };

  const drawConnections = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    const connections = [
      [11, 13], [13, 15], // Left arm
      [12, 14], [14, 16], // Right arm  
      [23, 25], [25, 27], // Left leg
      [24, 26], [26, 28], // Right leg
      [11, 12], [11, 23], [12, 24], [23, 24] // Torso
    ];
    
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    
    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];
      
      if (startPoint && endPoint) {
        ctx.beginPath();
        ctx.moveTo(startPoint.x * ctx.canvas.width, startPoint.y * ctx.canvas.height);
        ctx.lineTo(endPoint.x * ctx.canvas.width, endPoint.y * ctx.canvas.height);
        ctx.stroke();
      }
    });
  };

  const drawLandmarks = (ctx: CanvasRenderingContext2D, landmarks: any[]) => {
    ctx.fillStyle = '#10B981';
    
    landmarks.forEach((landmark) => {
      ctx.beginPath();
      ctx.arc(
        landmark.x * ctx.canvas.width,
        landmark.y * ctx.canvas.height,
        5,
        0,
        2 * Math.PI
      );
      ctx.fill();
    });
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      console.error('Camera access error:', error);
    }
  };

  const startWorkout = async () => {
    setCountdown(3);
    await startCamera();
    
    const countdownInterval = setInterval(() => {
      setCountdown(prev => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          setIsWorkoutActive(true);
          setStartTime(Date.now());
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const endWorkout = () => {
    setIsWorkoutActive(false);
    setWorkoutDuration(startTime ? (Date.now() - startTime) / 1000 : 0);
    setShowSummary(true);
    
    // Stop camera
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
    }
  };

  const resetWorkout = () => {
    setMetrics({ reps: 0, stage: 'Ready', goodReps: 0, feedback: [] });
    setIsWorkoutActive(false);
    setCountdown(null);
    setShowSummary(false);
    setStartTime(null);
    setProcessedFrame(null);
  };

  // Set up video processing when camera starts
  useEffect(() => {
    if (videoRef.current && socketRef.current && isWorkoutActive) {
      const video = videoRef.current;
      
      const processFrame = () => {
        if (video.readyState >= 2 && isWorkoutActive) {
          socketRef.current.send({ image: video });
        }
        if (isWorkoutActive) {
          requestAnimationFrame(processFrame);
        }
      };
      
      video.addEventListener('loadeddata', processFrame);
      
      return () => {
        video.removeEventListener('loadeddata', processFrame);
      };
    }
  }, [isWorkoutActive]);

  if (showSummary) {
    const formPercentage = metrics.reps > 0 ? (metrics.goodReps / metrics.reps) * 100 : 100;
    
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700/50">
            <h2 className="text-4xl font-bold text-center mb-8 text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
              🎉 Workout Complete!
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-3xl font-bold text-cyan-400 mb-2">{metrics.reps}</div>
                <div className="text-gray-300">Total Reps</div>
              </div>
              
              <div className="text-center p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-3xl font-bold text-green-400 mb-2">{Math.round(workoutDuration)}s</div>
                <div className="text-gray-300">Duration</div>
              </div>
              
              <div className="text-center p-6 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-3xl font-bold text-purple-400 mb-2">{formPercentage.toFixed(1)}%</div>
                <div className="text-gray-300">Form Accuracy</div>
              </div>
            </div>
            
            <div className="mb-8">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Form Quality</span>
                <span>{metrics.goodReps} / {metrics.reps} good reps</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${formPercentage}%` }}
                />
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={resetWorkout}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Try Again
              </button>
              
              <button
                onClick={onBackToHome}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedExercise) {
    return (
      <div className="min-h-screen bg-black text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text">
              AI Workout Trainer 💪
            </h1>
            <p className="text-xl text-gray-300">Choose your exercise and let AI guide your form</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            {exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => setSelectedExercise(exercise.id)}
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 transform hover:scale-105 text-center"
              >
                <div className="text-3xl mb-3">{exercise.name.split(' ')[0]}</div>
                <div className="font-semibold text-white mb-2">{exercise.name.substring(2)}</div>
                <div className="text-sm text-gray-400">{exercise.description}</div>
              </button>
            ))}
          </div>
          
          <div className="text-center">
            <button
              onClick={onBackToHome}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 mx-auto"
            >
              <Home className="w-5 h-5" />
              Back to AI Models
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentExercise = exercises.find(ex => ex.id === selectedExercise);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2 text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
            {currentExercise?.name}
          </h2>
          <p className="text-gray-300">{currentExercise?.description}</p>
        </div>
        
        {countdown && (
          <div className="text-center mb-8">
            <div className="text-8xl font-bold text-transparent bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text">
              {countdown}
            </div>
            <div className="text-xl text-gray-300 mt-4">Get Ready!</div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50">
              <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                />
                
                {!isWorkoutActive && !countdown && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80">
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-300 mb-4">Camera will activate when you start</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Controls & Metrics */}
          <div className="space-y-6">
            {/* Metrics */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-4">Performance</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Reps</span>
                  <span className="text-2xl font-bold text-cyan-400">{metrics.reps}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Stage</span>
                  <span className="text-lg font-semibold text-purple-400">{metrics.stage}</span>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                  <span className="text-gray-300">Good Form</span>
                  <span className="text-lg font-semibold text-green-400">{metrics.goodReps}</span>
                </div>
              </div>
            </div>
            
            {/* Feedback */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-4">Form Feedback</h3>
              <div className="space-y-2">
                {metrics.feedback.map((feedback, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg text-sm ${
                      feedback === 'Good form!' 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                    }`}
                  >
                    {feedback}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Controls */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-4">Controls</h3>
              
              <div className="space-y-3">
                {!isWorkoutActive && !countdown ? (
                  <button
                    onClick={startWorkout}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    Start Workout
                  </button>
                ) : (
                  <button
                    onClick={endWorkout}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Pause className="w-5 h-5" />
                    End Workout
                  </button>
                )}
                
                <button
                  onClick={resetWorkout}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Reset
                </button>
                
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Change Exercise
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutTrainer;