import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

interface StyledAccordionProps {
  title: string;
  items: string[];
  isOpenByDefault?: boolean;
}

export const StyledAccordion = ({
  title,
  items,
  isOpenByDefault = false,
}: StyledAccordionProps) => {
  const hasItems = items && items.length > 0;

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={isOpenByDefault ? "item-1" : undefined}
    >
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger
          className={cn(
            "bg-[#e6f0fa] px-6 py-4 rounded-t-xl text-sm sm:text-base font-bold flex justify-between items-center text-left",
            !hasItems && "rounded-b-xl"
          )}
        >
          {title}
        </AccordionTrigger>
        {hasItems && (
          <AccordionContent className="bg-white px-6 py-4 rounded-b-xl">
            <ul className="list-disc pl-5 space-y-2 text-gray-700 text-base">
              {items.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </AccordionContent>
        )}
      </AccordionItem>
    </Accordion>
  );
}; 