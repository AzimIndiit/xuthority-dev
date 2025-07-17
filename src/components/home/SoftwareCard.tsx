import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import StarRating from "../ui/StarRating";
import useUserStore from "@/store/useUserStore";
import useUIStore from "@/store/useUIStore";
import { useReviewStore } from "@/store/useReviewStore";

interface SoftwareCardProps {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  slug?: string;
  logoBackground?: string;
  hasUserReviewed?: boolean;
}

export default function SoftwareCard({id, name, logo, rating, reviewCount, logoBackground = "bg-white",slug, hasUserReviewed }: SoftwareCardProps) {
  const { isLoggedIn ,user  } = useUserStore();
  const openAuthModal = useUIStore((state) => state.openAuthModal);
  const { setSelectedSoftware, setCurrentStep } = useReviewStore();
  const navigate = useNavigate();
  const viewProductPage = () => {
   
    navigate(`/product-detail/${slug}`);
  };
  return (
    <div className="relative flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto h-full">
      {/* Floating Logo */}
      <div className="absolute -top-8  left-4 md:left-6 z-10 cursor-pointer" onClick={viewProductPage}>
        <div className={`w-16 h-16 rounded-md  flex items-center justify-center  border border-white`} style={{ backgroundColor: logoBackground }}>
          <img src={logo} alt={name} className="w-10 h-10  object-contain rounded-md" />
        </div>
      </div>
      <Card className=" px-4 sm:px-6 flex flex-col bg-gray-50 rounded-md shadow-none w-full h-full">
        <div className="flex-1 flex flex-col items-start w-full mt-2">
          <h3 onClick={viewProductPage} className="font-semibold cursor-pointer text-left text-base sm:text-lg md:text-xl lg:text-xl text-gray-900 mb-2 mt-2 capitalize line-clamp-2">{name}</h3>
         
          <div className=" flex flex-col lg:flex-row lg:items-center gap-2 justify-start">
                      <StarRating rating={rating} />
                      <span className="text-black font-semibold text-xs sm:text-sm">
                        ({reviewCount}) {rating.toFixed(1)} out of 5.0
                      </span>
                    </div>
        </div>
      { (!isLoggedIn ||  user?.role !== 'vendor') &&  <div className="mt-auto ">
          <Button 
            onClick={() => {
              if(!isLoggedIn) {
                openAuthModal('login', {
                  type: 'navigate-to-write-review',
                  payload: {
                    software: {
                      id: id,
                      name: name,
                      logoUrl: logo
                    },
                    currentStep: 2
                  }
                });
                return;
              }
              setSelectedSoftware({id,name,logoUrl:logo});
              setCurrentStep(2);
              navigate("/write-review");
            }}
            variant="default" 
            className="w-full max-w-[180px]  bg-red-600 hover:bg-red-700 text-white font-semibold rounded-none py-2 shadow-none "
          >
            {hasUserReviewed ? 'Edit Review' : 'Write A Review'}
          </Button>
        </div>}
      </Card>
    </div>
  );
} 