import React from 'react';
import { Spinner, Dots, Levels, Sentry, Windmill, Digital, Bounce } from 'react-activity';
import 'react-activity/dist/library.css';

interface SecondaryLoaderProps {
  type?: 'spinner' | 'dots' | 'levels' | 'sentry' | 'windmill' | 'digital' | 'bounce';
  size?: number;
  color?: string;
  text?: string;
  fullScreen?: boolean;
  minHeight?: string;
  containerClasses?: string;
}

const SecondaryLoader: React.FC<SecondaryLoaderProps> = ({ 
  size = 40,
  color = '#E91515', // Tailwind blue-500
  text,
  minHeight = '400px',
  containerClasses = ''
}) => {

  return (
    <div className={`flex flex-col items-center justify-center ${containerClasses}`}>
      <Sentry size={size} color={color} />
      {text && (
        <p className="mt-4 text-gray-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default SecondaryLoader; 