import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import useUserStore from "@/store/useUserStore";
import useUIStore from "@/store/useUIStore";
import { useReviewStore } from "@/store/useReviewStore";

export default function LeaveReviewSection() {
  const { setSelectedSoftware, setCurrentStep } = useReviewStore();
  const { isLoggedIn } = useUserStore();
  const { openAuthModal } = useUIStore();
  const navigate = useNavigate();
  return (
    <section className="w-full bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="w-full lg:max-w-screen-xl mx-auto flex flex-col-reverse sm:flex-row-reverse items-center  sm:gap-12">
        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-2xl  md:text-5xl  text-gray-900 mb-4">
            Experience with <br className="hidden sm:block" />
            Software? <strong className="text-black">Leave a Review!</strong>
          </h2>
          <p className="text-gray-600 mb-6 max-w-lg leading-relaxed">
            Experience seamless coordination and personalized attention with our Dedicated Project Manager. From inception to execution, your project will be in expert hands, ensuring efficient communication, timely deliverables, and a tailored approach that meets your unique objectives.
          </p>
          <Button
            onClick={()=>{
              if (!isLoggedIn) {
                openAuthModal();
                return;
              }
              setSelectedSoftware(null);
              setCurrentStep(1);
              navigate('/write-review');
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-3 shadow transition-all"
          >
            Write a Review <span aria-hidden className="ml-2">→</span>
          </Button>
        </div>
        {/* Illustration */}
        <div className="w-full sm:w-1/2 flex justify-center mb-8 md:mb-0">
          <img
            src="/svg/home/home_section_1.svg"
      
            alt="Leave a review illustration"
            className="w-full h-40 sm:h-80 object-contain " 
          />
        </div>
      </div>
    </section>
  );
} 