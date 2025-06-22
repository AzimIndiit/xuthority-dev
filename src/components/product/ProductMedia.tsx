import React from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// A flexible card component that can handle images, videos, and custom content
const MediaCard = ({
  className,
  children,
  type = "image",
  imgSrc,
}: {
  className?: string;
  children?: React.ReactNode;
  type?: "image" | "video";
  imgSrc?: string;
}) => {
  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {imgSrc && (
        <img
          src={imgSrc}
          alt="Media background"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}
      {type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 group-hover:bg-black/40">
          <PlayCircle className="h-16 w-16 text-white/80 transition-transform duration-300 group-hover:scale-110" />
        </div>
      )}
      {children && <div className="relative z-10 h-full">{children}</div>}
    </div>
  );
};

const SecurityLeadershipCard = () => (
  <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white bg-orange-500/80">
    <div>
      <h3 className="text-2xl font-bold">The Security Leadership</h3>
      <p className="mt-2 text-sm">
        Bringing together the brightest minds in cybersecurity to discuss
        emerging threats and best practices.
      </p>
    </div>
    <Button className="mt-4 w-fit bg-blue-900 px-6 py-2 text-white hover:bg-blue-800">
      RSVP
    </Button>
  </div>
);

const IDCSpotlightCard = () => (
  <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white bg-blue-900/80">
    <div>
      <h3 className="text-xl font-bold">
        Empowering application modernization with comprehensive, performant
        security
      </h3>
      <p className="mt-2 text-xs">A Cloudflare and Accenture IDC Spotlight</p>
    </div>
    <div className="flex items-center justify-between mt-4">
      <Button className="w-fit bg-indigo-600 px-5 py-2 text-white hover:bg-indigo-500">
        Learn more
      </Button>
    </div>
  </div>
);

const ProductMedia = () => {
  return (
    <div className="py-16 sm:py-24">
      
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Cloudflare Application Security and Performance Media
        </h2>

        <div className="mt-12 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
          <MediaCard
            className="col-span-1 md:col-span-2 lg:col-span-1 lg:row-span-2 min-h-[250px]"
            type="image"
            imgSrc="https://placehold.co/400x450/e0f2fe/0ea5e9"
          />

          <MediaCard
            className="col-span-1 md:col-span-2 lg:col-span-2 min-h-[250px]"
            type="image"
            imgSrc="https://placehold.co/800x450/e0f2fe/0ea5e9"
          />

          <MediaCard
            className="col-span-1 md:col-span-1 lg:col-span-2 min-h-[250px]"
            type="image"
            imgSrc="https://placehold.co/800x450/f0f9ff/0284c7"
          />

          <MediaCard
            className="col-span-1 md:col-span-1 lg:col-span-1 min-h-[250px]"
            type="image"
            imgSrc="https://placehold.co/800x450/e0f2fe/0ea5e9"
          />

          <MediaCard
            className="col-span-1 md:col-span-2 lg:col-span-2 min-h-[250px]"
            type="video"
            imgSrc="https://placehold.co/800x450/e0f2fe/0ea5e9"
          />
        </div>
    </div>
  );
};

export default ProductMedia;
