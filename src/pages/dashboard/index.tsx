
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Plus, Zap, Star, Clock, Video } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import RecentVideosList from '@/components/dashboard/RecentVideosList';
import UpgradeCard from '@/components/dashboard/UpgradeCard';

type Subscription = {
  tier: 'free' | 'pro' | 'enterprise';
  status: string;
};

type UsageStats = {
  usedCount: number;
  limit: number;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription>({ tier: 'free', status: 'active' });
  const [usage, setUsage] = useState<UsageStats>({ usedCount: 0, limit: 5 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Fetch subscription data
          const { data: subData, error: subError } = await supabase
            .from('subscriptions')
            .select('tier, status')
            .eq('user_id', session.user.id)
            .single();
          
          if (subError && subError.code !== 'PGRST116') {
            console.error("Error fetching subscription:", subError);
          }
          
          if (subData) {
            setSubscription(subData);
          }
          
          // Fetch usage stats for current month
          const currentDate = new Date();
          const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
          
          const { data: usageData, error: usageError } = await supabase
            .from('monthly_usage')
            .select('video_count')
            .eq('user_id', session.user.id)
            .eq('month', firstDayOfMonth)
            .single();
          
          if (usageError && usageError.code !== 'PGRST116') {
            console.error("Error fetching usage:", usageError);
          }
          
          if (usageData) {
            setUsage({
              usedCount: usageData.video_count,
              limit: subscription.tier === 'free' ? 5 : Infinity
            });
          } else {
            setUsage({
              usedCount: 0,
              limit: subscription.tier === 'free' ? 5 : Infinity
            });
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error loading data",
          description: "We couldn't load your subscription and usage information.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const handleCreateVideo = () => {
    // Check if user is on free tier and has used all videos
    if (subscription.tier === 'free' && usage.usedCount >= usage.limit) {
      toast({
        title: "Free tier limit reached",
        description: "You've reached your 5 videos/month limit. Upgrade to Pro for unlimited videos.",
        variant: "destructive"
      });
      return;
    }
    
    navigate('/dashboard/generate');
  };

  return (
    <div className="space-y-6 px-4 w-full max-w-[2000px] mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="font-orbitron text-white text-4xl font-semibold">
          Welcome to Aurora
        </h1>
        <Button 
          onClick={handleCreateVideo}
          className="flex items-center gap-2 bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple"
        >
          <Plus size={16} />
          Create New Video
        </Button>
      </div>

      {subscription.tier === 'free' && (
        <div className="mb-8">
          <Card className="glass-panel border-aurora-purple/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-aurora-purple" />
                Monthly Video Generation
              </CardTitle>
              <CardDescription>
                {usage.usedCount} of {usage.limit} videos used this month
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <Progress
                value={(usage.usedCount / usage.limit) * 100}
                className="h-2 bg-white/10"
                indicatorClassName={
                  usage.usedCount >= usage.limit 
                    ? "bg-red-500" 
                    : usage.usedCount >= usage.limit * 0.8 
                      ? "bg-yellow-500" 
                      : "bg-aurora-green"
                }
              />
            </CardContent>
            <CardFooter className="pt-0">
              <p className="text-xs text-gray-400">
                {usage.usedCount >= usage.limit 
                  ? "You've reached your limit. Upgrade to continue generating videos." 
                  : `${usage.limit - usage.usedCount} videos remaining this month.`}
              </p>
            </CardFooter>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass-panel h-full border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="h-5 w-5 text-aurora-blue" />
                Recent Videos
              </CardTitle>
              <CardDescription>
                Your recently generated videos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentVideosList limit={5} />
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard/videos')}
                className="w-full text-sm border-white/20 hover:bg-white/5"
              >
                View All Videos
              </Button>
            </CardFooter>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  AI Styles
                </CardTitle>
                <CardDescription>
                  {subscription.tier === 'free' ? 'Basic AI styles available' : 'All premium AI styles unlocked'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                    Cinematic
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400"></div>
                    Animation
                  </li>
                  {subscription.tier !== 'free' && (
                    <>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                        Photorealistic 4K
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-400"></div>
                        Abstract Art
                      </li>
                    </>
                  )}
                  {subscription.tier === 'free' && (
                    <li className="flex items-center gap-2 text-gray-500">
                      <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                      Premium styles (Pro only)
                    </li>
                  )}
                </ul>
              </CardContent>
            </Card>
            
            <Card className="glass-panel border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-aurora-green" />
                  Processing Priority
                </CardTitle>
                <CardDescription>
                  {subscription.tier === 'free' 
                    ? 'Standard processing queue' 
                    : subscription.tier === 'pro' 
                      ? 'Priority processing' 
                      : 'Enterprise-level priority'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Processing Speed</span>
                      <span>{subscription.tier === 'free' ? 'Standard' : 'Fast'}</span>
                    </div>
                    <Progress
                      value={subscription.tier === 'free' ? 30 : subscription.tier === 'pro' ? 70 : 100}
                      className="h-2 bg-white/10"
                      indicatorClassName={
                        subscription.tier === 'free' 
                          ? "bg-white/30" 
                          : subscription.tier === 'pro' 
                            ? "bg-aurora-blue" 
                            : "bg-aurora-purple"
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Max Resolution</span>
                      <span>{subscription.tier === 'free' ? '720p' : '4K'}</span>
                    </div>
                    <Progress
                      value={subscription.tier === 'free' ? 30 : 100}
                      className="h-2 bg-white/10"
                      indicatorClassName={
                        subscription.tier === 'free' 
                          ? "bg-white/30" 
                          : "bg-aurora-purple"
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-1">
          <UpgradeCard currentTier={subscription.tier} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
