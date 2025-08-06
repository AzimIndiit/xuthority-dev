import React from 'react';

interface FeatureSectionProps {
  title: string;
  description: string;
  illustration: string;
  illustrationAlt: string;
  buttonText?: string;
  onButtonClick?: () => void;
  reverse?: boolean;
  backgroundColor?: string;
  className?: string;
  children?: React.ReactNode;
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({
  title,
  description,
  illustration,
  illustrationAlt,
  buttonText,
  onButtonClick,
  reverse = false,
  backgroundColor = "bg-white",
  className = "",
  children
}) => {
  return (
    <section className={`w-full ${backgroundColor} py-24 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className={`w-full lg:max-w-screen-xl mx-auto flex flex-col-reverse ${reverse ? 'sm:flex-row-reverse' : 'sm:flex-row'} items-center sm:gap-12`}>
        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-gray-600 mb-6 max-w-lg">
            {description}
          </p>
          {children}
          {buttonText && onButtonClick && (
            <button
              onClick={onButtonClick}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-3 shadow transition-all"
            >
              {buttonText}
            </button>
          )}
        </div>
        
        {/* Illustration */}
        <div className="w-full sm:w-1/2 flex justify-center mb-8 md:mb-0">
          <img
            src={illustration}
            alt={illustrationAlt}
            className="w-full h-40 sm:h-80 object-contain"
          />
        </div>
      </div>
    </section>
  );
}; 