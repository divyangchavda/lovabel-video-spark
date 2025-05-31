
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, X } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-black/50 shadow-2xl">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-auto max-h-[500px] object-contain"
        controls
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        Your browser does not support the video tag.
      </video>
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Button
            onClick={togglePlay}
            size="lg"
            className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 rounded-full w-16 h-16 p-0"
          >
            <Play className="w-8 h-8 ml-1" fill="currentColor" />
          </Button>
        </div>
      )}
    </div>
  );
};
