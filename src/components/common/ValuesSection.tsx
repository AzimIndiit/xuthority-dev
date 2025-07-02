import React from 'react';

export interface Value {
  id: string | number;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}

interface ValuesSectionProps {
  title?: string;
  values?: Value[];
  showJoinButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

const defaultValues: Value[] = [
  {
    id: 1,
    title: "Real People, Real Reviews, 100% Verified",
    description: "Every reviewer is verified by multi-step processes to ensure only genuine product reviews surface.",
    image: "/svg/about-us/section_2_2.svg",
    imageAlt: "Real People, Real Reviews, 100% Verified"
  },
  {
    id: 2,
    title: "Ad-Free, Unbiased Reviews",
    description: "We maintain complete transparency by not selling paid placements. Every review and ranking is based on genuine user feedback.",
    image: "/svg/about-us/section_2_3.svg",
    imageAlt: "Ad-Free, Unbiased Reviews"
  },
  {
    id: 3,
    title: "Prioritizing Excellence",
    description: "Each review is vetted for quality, depth, and detail by our Research Team before publishing.",
    image: "/svg/about-us/section_2_1.svg",
    imageAlt: "Prioritizing Excellence"
  }
];

export const ValuesSection: React.FC<ValuesSectionProps> = ({
  title = "Our Values",
  values = defaultValues,
  showJoinButton = true,
  buttonText = "Join Us →",
  onButtonClick,
  className = ""
}) => {
  return (
    <div className={`py-16 bg-white ${className}`}>
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {values.map((value) => (
            <div key={value.id} className="bg-gray-50 rounded-lg p-8 text-center">
              <div className="flex justify-center mb-6">
                <img
                  src={value.image}
                  alt={value.imageAlt}
                  className="w-32 h-32 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {showJoinButton && (
          <div className="text-center">
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors"
              onClick={onButtonClick}
            >
              {buttonText} <span aria-hidden className="ml-2">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}; 