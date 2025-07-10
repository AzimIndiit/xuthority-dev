import React from 'react';

interface UploadProgressProps {
  progress: number;
  fileName?: string;
  isVisible: boolean;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ 
  progress, 
  fileName, 
  isVisible 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[300px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">
          Uploading {fileName || 'file'}...
        </span>
        <span className="text-sm text-gray-500">{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      {progress === 100 && (
        <div className="mt-2 text-sm text-green-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Upload complete!
        </div>
      )}
    </div>
  );
};

export default UploadProgress; 