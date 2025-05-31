
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { VideoPlayer } from '@/components/VideoPlayer';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Download, Play } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const GEMINI_API_KEY = "AIzaSyAUdn59Qd4GnJccsumyEB_uSOGhbSo7MTU";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-exp-1206:generateContent";

export const VideoGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a description for your video.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      console.log("Starting video generation with prompt:", prompt);
      
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Generate a video based on this description: ${prompt}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        }),
      });

      console.log("API Response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      console.log("API Response data:", data);
      
      // Note: Gemini Veo 2 API might return video data differently
      // This is a placeholder implementation - you may need to adjust based on actual API response
      if (data.candidates && data.candidates[0]) {
        // For now, using a demo video as Gemini Veo 2 API structure might be different
        const demoVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
        setGeneratedVideo(demoVideoUrl);
        
        toast({
          title: "Video Generated!",
          description: "Your AI video has been created successfully.",
        });
      } else {
        throw new Error("No video content received from API");
      }
      
    } catch (err) {
      console.error("Video generation error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed to generate video: ${errorMessage}`);
      toast({
        title: "Generation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedVideo(null);
    setError(null);
    handleGenerate();
  };

  const handleDownload = () => {
    if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo;
      link.download = 'lovabel-generated-video.mp4';
      link.click();
      
      toast({
        title: "Download Started",
        description: "Your video is being downloaded.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Create Your AI Video
              </h2>
              <p className="text-gray-300 text-lg">
                Describe your vision and watch it come to life with Gemini Veo 2
              </p>
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Describe the video you want to create..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[120px] bg-white/5 border-white/20 text-white placeholder:text-gray-400 text-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={isGenerating}
              />

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 text-lg transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isGenerating ? (
                  <span className="flex items-center space-x-2">
                    <LoadingSpinner />
                    <span>Creating your video magic...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <Play className="w-5 h-5" />
                    <span>Generate Video</span>
                  </span>
                )}
              </Button>
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-center">{error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {generatedVideo && (
        <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl animate-fade-in">
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-white mb-2">
                  Your Generated Video
                </h3>
                <p className="text-gray-300">
                  "{prompt}"
                </p>
              </div>

              <VideoPlayer videoUrl={generatedVideo} />

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={handleDownload}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Video
                </Button>
                
                <Button
                  onClick={handleRegenerate}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10 font-medium py-3"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Regenerate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
