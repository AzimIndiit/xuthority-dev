import { Button } from "../ui/button";

export default function BuyerAnalysisSection() {
  return (
    <section className="w-full bg-[#f5f9fd] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full lg:max-w-screen-xl mx-auto flex flex-col-reverse md:flex-row items-center  md:gap-12 justify-between">
        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Analysis of Buyer<br className="hidden sm:block" /> Behavior!
          </h2>
          <p className="text-gray-600 mb-6 max-w-lg">
            AI drives increased software spending, but buyers demand quick ROI, according to a 2024 Buyer Behavior Report based on a survey of over 1,900 B2B buyers worldwide
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-3 shadow transition-all"
          >
            Download Report <span aria-hidden className="ml-2">→</span>
          </Button>
        </div>
        {/* Illustration */}
        <div className="w-full sm:w-1/2 flex justify-center mb-8 md:mb-0">
          <img
            src="/svg/home/home_section_2.svg"
    
            alt="Buyer analysis illustration"
            className="w-full h-40 sm:h-60 object-contain " 
          />
        </div>
      </div>
    </section>
  );
} 