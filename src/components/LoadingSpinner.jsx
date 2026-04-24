import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-[100]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-gray-600 font-medium animate-pulse">Loading ElectroStore...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
