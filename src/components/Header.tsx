
import React from 'react';
import { Play } from 'lucide-react';

export const Header = () => {
  return (
    <header className="w-full py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Play className="w-6 h-6 text-white" fill="currentColor" />
            </div>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur opacity-30 animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              🎬 Lovabel
            </h1>
            <p className="text-gray-400 text-sm md:text-base">AI Video Generator</p>
          </div>
        </div>
      </div>
    </header>
  );
};
