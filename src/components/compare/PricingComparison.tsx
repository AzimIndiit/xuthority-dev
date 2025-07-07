import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

interface PricingPlan {
  seats: string;
  planName: string;
  description: string;
  price: number;
  billingPeriod: string;
  features: string[];
}

interface Product {
  id: string;
  name: string;
  logo?: string;
  logoBackground: string;
  pricingPlan?: PricingPlan;
  hasFreeTrial?: boolean;
}

interface PricingComparisonProps {
  products: Product[];
  className?: string;
}

// Mock pricing data - replace with actual data from API
const mockPricingData: Record<string, PricingPlan> = {
  "Monday Work Management": {
    seats: "N/A",
    planName: "Standard",
    description: "Collaborate and optimize your team processes",
    price: 12,
    billingPeriod: "monthly",
    features: [
      "Unlimited boards",
      "Unlimited docs",
      "200+ templates",
      "Over 20 column types"
    ]
  },
  "Smartsheet": {
    seats: "-1",
    planName: "Standard",
    description: "Collaborate and optimize your team processes",
    price: 14,
    billingPeriod: "monthly",
    features: [
      "Unlimited boards",
      "Unlimited docs",
      "200+ templates",
      "Over 20 column types"
    ]
  },
  "Asana": {
    seats: "-2",
    planName: "Standard",
    description: "Collaborate and optimize your team processes",
    price: 15,
    billingPeriod: "monthly",
    features: [
      "Unlimited boards",
      "Unlimited docs",
      "200+ templates",
      "Over 20 column types"
    ]
  }
};

export default function PricingComparison({ products, className }: PricingComparisonProps) {
  return (
    <div className={cn("bg-blue-50 rounded-lg overflow-hidden", className)}>
      <h2 className="text-xl sm:text-2xl font-bold p-4 sm:p-6 pb-0">Pricing</h2>
      
      <div className="p-4 sm:p-6 space-y-6">
        {/* Entry Level Pricing Row */}
        <div>
          <h3 className="font-semibold text-gray-700 mb-4">Entry Level Pricing</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => {
              const pricingData = mockPricingData[product.name] || {
                seats: "N/A",
                planName: "Standard",
                description: "Collaborate and optimize your team processes",
                price: 0,
                billingPeriod: "monthly",
                features: []
              };
              
              return (
                <div key={product.id} className="bg-white rounded-lg p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: product.logoBackground }}
                    >
                      <img
                        src={product.logo}
                        alt={product.name}
                        className="w-6 h-6 object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">For {pricingData.seats} Seats</p>
                      <h4 className="font-bold text-lg">{pricingData.planName}</h4>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-600">{pricingData.description}</p>
                  
                  {/* Price */}
                  <div className="py-2">
                    <span className="text-3xl font-bold">${pricingData.price}</span>
                    <span className="text-gray-600 ml-1">/{pricingData.billingPeriod}</span>
                  </div>
                  
                  {/* Features */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">What's included</h5>
                    <ul className="space-y-2">
                      {pricingData.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  {/* CTA Button */}
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full">
                    Browse all 3 pricing plans
                  </Button>
                </div>
              );
            })}
            
            {/* Empty slots */}
            {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
              <div key={`empty-${index}`} className="bg-white/50 rounded-lg p-6 opacity-50">
                <div className="h-full flex items-center justify-center text-gray-400">
                  No product selected
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Free Trials Row */}
        <div className="bg-white rounded-lg p-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-semibold text-gray-700 p-2 w-1/4">Free Trials</td>
                {products.map((product) => (
                  <td key={product.id} className="p-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium">Free Trial is available</span>
                    </div>
                  </td>
                ))}
                {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                  <td key={`empty-${index}`} className="p-2 text-center">
                    <span className="text-sm text-gray-400">-</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 