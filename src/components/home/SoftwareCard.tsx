import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import StarRating from "../ui/StarRating";

interface SoftwareCardProps {
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  logoBackground?: string;
}

export default function SoftwareCard({ name, logo, rating, reviewCount, logoBackground = "bg-white" }: SoftwareCardProps) {
  const navigate = useNavigate();
  const viewProductPage = () => {
    const slug = name
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
    const subCategory = "sub-category";
    navigate(`/software/${subCategory}/${slug}`);
  };
  return (
    <div className="relative flex flex-col items-center w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto">
      {/* Floating Logo */}
      <div className="absolute -top-8  left-4 md:left-6 z-10 cursor-pointer" onClick={viewProductPage}>
        <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-md ${logoBackground} flex items-center justify-center  border border-white`}>
          <img src={logo} alt={name} className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-md" />
        </div>
      </div>
      <Card className="sm:pt-12 pb-6 px-4 sm:px-6 flex flex-col bg-gray-50 rounded-md shadow-none h-[215px] md:h-[250px] w-full">
        <div className="flex-1 flex flex-col items-start w-full mt-2">
          <h3 onClick={viewProductPage} className="font-semibold cursor-pointer text-left text-base sm:text-lg md:text-xl lg:text-xl text-gray-900 mb-2 mt-2 capitalize">{name}</h3>
         
          <div className=" flex items-center gap-2 justify-start">
                      <StarRating rating={rating} />
                      <span className="text-gray-600 text-xs sm:text-sm">
                        ({reviewCount}) {rating} out of 5
                      </span>
                    </div>
        </div>
        <div className="mt-auto ">
          <Button 
            variant="default" 
            className="w-full max-w-[180px] sm:max-w-[200px] bg-red-600 hover:bg-red-700 text-white font-semibold rounded-none py-2 shadow-none"
          >
            Write A Review
          </Button>
        </div>
      </Card>
    </div>
  );
} 