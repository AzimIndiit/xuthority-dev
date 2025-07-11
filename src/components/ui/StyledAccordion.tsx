import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface AccordionItemData {
  value: string;
  rating?: number;
  reviews?: number;
  slug?: string;
}

interface StyledAccordionProps {
  title: string;
  items: AccordionItemData[] | string[];
  isOpenByDefault?: boolean;
}

export const StyledAccordion = ({
  title,
  items,
  isOpenByDefault = false,
}: StyledAccordionProps) => {
  const navigate = useNavigate();
  const hasItems = items && items.length > 0;

  // Normalize items to ensure they have a value property
  const normalizedItems = items.map((item) => {
    if (typeof item === 'string') {
      return { value: item };
    }
    return item;
  });

  const handleItemClick = (item: AccordionItemData) => {
    if (item.slug) {
      navigate(`/product-detail/${item.slug}`);
    }
  };

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={isOpenByDefault ? "item-1" : undefined}
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger
          className={cn(
            "bg-[#DCEDFF] px-6 py-4 rounded-t-xl text-sm sm:text-base font-bold flex justify-between items-center text-left",
            !hasItems && "rounded-b-xl"
          )}
        >
          {title}
        </AccordionTrigger>
        {hasItems && (
          <AccordionContent className="bg-white px-6 py-4 rounded-b-xl">
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-base">
              {normalizedItems.map((item, index) => (
                <li 
                  key={`${item.value}-${index}`} 
                  className={cn(
                    "transition-colors",
                    item.slug 
                      ? "hover:text-blue-600 cursor-pointer" 
                      : "hover:text-gray-800"
                  )}
                  onClick={() => handleItemClick(item)}
                >
                  {item.value}
                </li>
              ))}
            </ul>
          </AccordionContent>
        )}
      </AccordionItem>
    </Accordion>
  );
}; 