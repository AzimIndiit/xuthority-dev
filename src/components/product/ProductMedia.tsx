import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// A flexible card component that can handle images, videos, and custom content
const MediaCard = ({
  className,
  children,
  type = "image",
  mediaSrc,
}: {
  className?: string;
  children?: React.ReactNode;
  type?: "image" | "video";
  mediaSrc?: string;
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const handlePlay = () => {
    setIsPlaying(true);
    videoRef.current?.play();
  };

  const handlePause = () => {
    setIsPlaying(false);
    videoRef.current?.pause();
  };

  const handleEnded = () => {
    setIsPlaying(false);
    videoRef.current?.pause();
  };

  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      {mediaSrc && type === "image" && (
        <img
          src={mediaSrc}
          alt="Media background"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      )}
      {mediaSrc && type === "video" && (
        <>
          <video
            src={mediaSrc}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            controls
            preload="metadata"
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            ref={videoRef}
            />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 group-hover:bg-black/40 cursor-pointer" onClick={handlePlay}  >
              <PlayCircle className="h-16 w-16 text-white/80 transition-transform duration-300 group-hover:scale-110" />
            </div>
          )}
        </>
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

const ProductMedia = ({mediaUrls}: {mediaUrls: string[]}) => {
  // Helper function to detect if a URL is a video
  const isVideoUrl = (url: string): boolean => {
    return /\.(mp4|webm|mov|avi|mkv|flv|wmv|m4v|3gp|ogv)(\?.*)?$/i.test(url);
  };

  return (
    <div className="py-16 sm:py-24">
      
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Cloudflare Application Security and Performance Media
        </h2>

        <div className="mt-12 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
          {mediaUrls.map((url, index) => {
            const isVideo = isVideoUrl(url);
            const gridClasses = [
              "col-span-1 md:col-span-2 lg:col-span-1 lg:row-span-2 min-h-[250px]", // First item
              "col-span-1 md:col-span-2 lg:col-span-2 min-h-[250px]", // Second item
              "col-span-1 md:col-span-1 lg:col-span-2 min-h-[250px]", // Third item
              "col-span-1 md:col-span-1 lg:col-span-1 min-h-[250px]", // Fourth item
              "col-span-1 md:col-span-2 lg:col-span-2 min-h-[250px]", // Fifth item
            ];

            return (
              <MediaCard
                key={index}
                className={gridClasses[index] || "col-span-1 min-h-[250px]"}
                type={isVideo ? "video" : "image"}
                mediaSrc={url}
              />
            );
          })}
        </div>
    </div>
  );
};

export default ProductMedia;
