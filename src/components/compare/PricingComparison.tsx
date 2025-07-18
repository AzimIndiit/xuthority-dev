// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import { Check } from "lucide-react";
// import { formatCurrency } from "@/utils/formatCurrency";
// import type { CompareProduct } from "@/store/useCompareStore";

// interface PricingPlan {
//   seats?: string;
//   planName?: string;
//   description?: string;
//   price: number | string;
//   billingPeriod?: string;
//   features?: string[] | { value: string }[];
//   currency?: string;
// }

// interface PricingComparisonProps {
//   products: CompareProduct[];
//   className?: string;
// }

// export default function PricingComparison({ products, className }: PricingComparisonProps) {
//   // Helper function to get pricing data from entryPrice
//   const getPricingData = (product: CompareProduct): PricingPlan | null => {
//     const entryPrices = product.entryPrice;
    
//     if (typeof entryPrices === 'string') {
//       const price = parseFloat(entryPrices);
//       if (!isNaN(price)) {
//         return {
//           price,
//           planName: "Entry Level",
//           description: `Entry level pricing for ${product.name}`,
//           billingPeriod: "month",
//           seats: "Per user",
//           features: []
//         };
//       }
//       return null;
//     } else if (Array.isArray(entryPrices) && entryPrices.length > 0) {
//       // Find the minimum price plan
//       let minPricePlan = entryPrices[0];
//       entryPrices.forEach(plan => {
//         const currentPrice = Number(plan.price);
//         const minPrice = Number(minPricePlan.price);
//         if (!isNaN(currentPrice) && !isNaN(minPrice) && currentPrice < minPrice) {
//           minPricePlan = plan;
//         }
//       });
      
//       return {
//         ...minPricePlan,
//         price: Number(minPricePlan.price),
//         planName: minPricePlan.planName || "Entry Level",
//         description: minPricePlan.description || `Entry level pricing for ${product.name}`,
//         billingPeriod: minPricePlan.billingPeriod || "month",
//         seats: minPricePlan.seats || "Per user",
//         features: minPricePlan.features || []
//       } as PricingPlan;
//     }
    
//     return null;
//   };

//   return (
//     <div className={cn("bg-blue-50 rounded-lg overflow-hidden", className)}>
//       <h2 className="text-xl sm:text-2xl font-bold p-4 sm:p-6 pb-0">Pricing</h2>
      
//       <div className="p-4 sm:p-6 space-y-6">
//         {/* Entry Level Pricing Row */}
//         <div>
//           <h3 className="font-semibold text-gray-700 mb-4">Entry Level Pricing</h3>
          
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             {products.map((product) => {
//               const pricingData = getPricingData(product);
              
//               if (!pricingData) {
//                 return (
//                   <div key={product.id} className="bg-white rounded-lg p-6 space-y-4">
//                     <div className="text-center text-gray-500">
//                       No pricing information available
//                     </div>
//                   </div>
//                 );
//               }
              
//               return (
//                 <div key={product.id} className="bg-white rounded-lg p-6 space-y-4">
//                   {/* Header */}
//                   <div className="flex items-center gap-3">
//                     <div
//                       className="w-10 h-10 rounded-lg flex items-center justify-center"
//                       style={{ backgroundColor: product.logoBackground }}
//                     >
//                       <img
//                         src={product.logo}
//                         alt={product.name}
//                         className="w-6 h-6 object-contain"
//                       />
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">For {pricingData.seats}</p>
//                       <h4 className="font-bold text-lg">{pricingData.planName}</h4>
//                     </div>
//                   </div>
                  
//                   {/* Description */}
//                   <p className="text-sm text-gray-600">{pricingData.description}</p>
                  
//                   {/* Price */}
//                   <div className="py-2">
//                     <span className="text-3xl font-bold">{formatCurrency(Number(pricingData.price) || 0)}</span>
//                     <span className="text-gray-600 ml-1">/{pricingData.billingPeriod}</span>
//                   </div>
                  
//                   {/* Features */}
//                   {pricingData.features && pricingData.features.length > 0 && (
//                     <div className="space-y-3">
//                       <h5 className="font-semibold text-sm">What's included</h5>
//                       <ul className="space-y-2">
//                         {pricingData.features.map((feature, index) => (
//                           <li key={index} className="flex items-start gap-2">
//                             <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//                             <span className="text-sm text-gray-700">
//                               {typeof feature === 'string' 
//                                 ? feature 
//                                 : typeof feature === 'object' && feature !== null
//                                   ? feature.value || feature.name || 'Feature available'
//                                   : String(feature)}
//                             </span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   )}
                  
//                   {/* CTA Button */}
//                   <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full">
//                     Browse all pricing plans
//                   </Button>
//                 </div>
//               );
//             })}
            
//             {/* Empty slots */}
//             {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
//               <div key={`empty-${index}`} className="bg-white/50 rounded-lg p-6 opacity-50">
//                 <div className="h-full flex items-center justify-center text-gray-400">
//                   No product selected
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
        
//         {/* Free Trials Row */}
//         <div className="bg-white rounded-lg p-4">
//           <table className="w-full">
//             <tbody>
//               <tr>
//                 {products.map((product) => (
//                   <td key={product.id} className="p-2 text-center w-1/4">
//                     <div className="flex items-center justify-start gap-2">
//                       <Check className="w-5 h-5 text-green-600" />
//                       <span className="text-sm font-medium">Free Trial is available</span>
//                     </div>
//                   </td>
//                 ))}
//                 {products.length < 3 && [...Array(3 - products.length )].map((_, index) => (
//                   <td key={`empty-${index}`} className="p-2 text-center w-1/4">
//                     <span className="text-sm text-gray-400">-</span>
//                   </td>
//                 ))}
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// } 


import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";
import type { CompareProduct } from "@/store/useCompareStore";

interface PricingPlan {
  seats?: string;
  planName?: string;
  description?: string;
  price: number | string;
  billingPeriod?: string;
  features?: string[] | { value: string }[];
  currency?: string;
  isFree?: boolean;
}

interface PricingComparisonProps {
  products: CompareProduct[];
  className?: string;
}

export default function PricingComparison({ products, className }: PricingComparisonProps) {
  // Helper function to get pricing data from entryPrice
  const getPricingData = (product: CompareProduct): PricingPlan | null => {
    const entryPrices = product.entryPrice;
    
    if (typeof entryPrices === 'string') {
      const price = parseFloat(entryPrices);
      if (!isNaN(price)) {
        return {
          price,
          planName: "Entry Level",
          description: `Entry level pricing for ${product.name}`,
          billingPeriod: "month",
          seats: "Per user",
          features: []
        };
      }
      return null;
    } else if (Array.isArray(entryPrices) && entryPrices.length > 0) {
      // Find the minimum price plan
      let minPricePlan = entryPrices[0];
      entryPrices.forEach(plan => {
        const currentPrice = Number(plan.price);
        const minPrice = Number(minPricePlan.price);
        if (!isNaN(currentPrice) && !isNaN(minPrice) && currentPrice < minPrice) {
          minPricePlan = plan;
        }
      });
      
      return {
        ...minPricePlan,
        price: Number(minPricePlan.price),
        planName: minPricePlan.planName || "Entry Level",
        description: minPricePlan.description || `Entry level pricing for ${product.name}`,
        billingPeriod: minPricePlan.billingPeriod || "month",
        seats: minPricePlan.seats || "Per user",
        features: minPricePlan.features || []
      } as PricingPlan;
    }
    
    return null;
  };

  return (
    <div className={cn("bg-blue-50 rounded-lg border overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr>
              <th className="text-left p-3 sm:p-4 font-medium text-gray-700 w-1/4 bg-blue-50 border-b border-blue-100 border-r">
                Pricing
              </th>
              {products.map((product) => (
                <th
                  key={product.id}
                  className="text-center p-3 sm:p-4 font-semibold bg-blue-50 border-b border-blue-100 w-1/4 border-r"
                >
                  {product.name}
                </th>
              ))}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <th key={`empty-${index}`} className="text-center p-3 sm:p-4 bg-blue-50 border-b border-blue-100 w-1/4 border-r">
                  {/* Empty header */}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {/* Entry Level Pricing Row */}
            <tr className="border-t">
              <td className="p-3 sm:p-4 font-medium text-gray-700 align-top w-1/4 border-r">
                Entry Level Pricing
              </td>
              {products.map((product) => {
                const pricingData = getPricingData(product);
                console.log(pricingData,"pricingData");
                return (
                  <td key={product.id} className="p-3 sm:p-4 text-left align-top w-1/4 border-r">
                    {pricingData ? (
                      <div className="space-y-2">
                        <div className="font-semibold text-gray-900">
                          {pricingData.planName}
                        </div>
                        <div className="text-sm text-gray-600">
                          For {pricingData.seats} Seats
                        </div>
                        <div className="text-lg font-bold text-blue-600">
                          {formatCurrency(Number(pricingData.price) || 0)}
                          <span className="text-sm text-gray-600 font-normal">
                            /{pricingData.billingPeriod}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {pricingData.description}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        No pricing available
                      </span>
                    )}
                  </td>
                );
              })}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <td key={`empty-pricing-${index}`} className="p-3 sm:p-4 text-center align-top w-1/4 border-r">
                  <span className="text-gray-300 italic text-sm">
                    No product selected
                  </span>
                </td>
              ))}
            </tr>

            {/* Free Trial Row */}
            <tr className="border-t">
              <td className="p-3 sm:p-4 font-medium text-gray-700 align-top w-1/4 border-r">
                Free Trial
              </td>
              {products.map((product,index) => {
             console.log(product,"produc11t",index);
                return (
                <td key={product.id} className="p-3 sm:p-4 text-left align-top w-1/4 border-r">
                  <div className="flex items-center gap-2">
                  {product ? product?.isFree ? <Check className="w-4 h-4 text-green-600" /> : <X className="w-4 h-4 text-red-600" /> : <span className="text-gray-300 italic text-sm">No Free Trial Available</span>}
                    <span className="text-sm text-gray-700">{product ? product?.isFree ? 'Available' : 'Not Available' : ''}</span>
                  </div>
                </td>
              )})}
              {products.length < 3 && [...Array(3 - products.length)].map((_, index) => (
                <td key={`empty-trial-${index}`} className="p-3 sm:p-4 text-center align-top w-1/4 border-r">
                  <span className="text-gray-300 italic text-sm">
                    No product selected
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
} 