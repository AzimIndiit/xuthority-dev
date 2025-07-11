import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  backgroundClass?: string;
  illustration?: string;
  illustrationAlt?: string;
  illustrationStyle?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  backgroundImage,
  backgroundClass = "bg-gradient-to-br from-yellow-100 via-yellow-50 to-yellow-200",
  illustration,
  illustrationAlt = "Hero illustration",
  illustrationStyle = { minWidth: 320, maxHeight: 320, objectFit: "contain" as const },
  children,
  className = ""
}) => {
  const sectionStyle = backgroundImage 
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }
    : {};

  return (
    <section 
      className={`relative flex flex-col min-h-[70dvh] w-full overflow-hidden ${backgroundClass} px-4 sm:px-6 lg:px-8 py-12 ${className}`}
      style={sectionStyle}
    >
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="text-center mx-auto my-20">
          <h1 className="text-3xl sm:text-6xl font-extrabold text-gray-900 mb-4">
            {title}
          </h1>
          <p className="  text-xl lg:text-2xl   text-gray-700 mb-6 w-full sm:max-w-5xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          {children}
        </div>
        
        {illustration && (
          <div className="flex justify-center  -mb-[60px]  px-4 sm:px-6">
            <img
              src={illustration}
              alt={illustrationAlt}
              className="w-full max-w-xl mx-auto h-[200px] md:h-[220px] lg:h-[330px]"
              style={illustrationStyle}
            />
          </div>
        )}
      </div>
    </section>
  );
}; 