import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlayCircle, X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

// Media Preview Modal Component
const MediaPreviewModal = ({
  isOpen,
  mediaUrls,
  currentIndex,
  onClose,
  onNext,
  onPrevious,
}: {
  isOpen: boolean;
  mediaUrls: string[];
  currentIndex: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Helper function to detect if a URL is a video
  const isVideoUrl = (url: string): boolean => {
    return /\.(mp4|webm|mov|avi|mkv|flv|wmv|m4v|3gp|ogv)(\?.*)?$/i.test(url);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          onPrevious();
          break;
        case 'ArrowRight':
          onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrevious]);

  // Reset video playing state when changing media
  useEffect(() => {
    setIsVideoPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [currentIndex]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !mediaUrls[currentIndex]) return null;

  const currentMedia = mediaUrls[currentIndex];
  const isVideo = isVideoUrl(currentMedia);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>

      {/* Navigation buttons */}
      {mediaUrls.length > 1 && (
        <>
          <button
            onClick={onPrevious}
            className="absolute left-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Media counter */}
      {mediaUrls.length > 1 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 px-3 py-1 rounded-full text-white text-sm">
          {currentIndex + 1} / {mediaUrls.length}
        </div>
      )}

      {/* Media content */}
      <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {isVideo ? (
          <video
            ref={videoRef}
            src={currentMedia}
            className="max-w-full max-h-full object-contain"
            controlsList="nodownload noplaybackrate nopictureinpicture"
            autoPlay={false}
            controls
            onPlay={() => setIsVideoPlaying(true)}
            onPause={() => setIsVideoPlaying(false)}
            onEnded={() => setIsVideoPlaying(false)}
            disablePictureInPicture
            height={'500px'}

            style={{
              // Attempt to hide the native "3 dot" overflow menu in Chromium browsers
              // and further restrict PiP via attribute above
              // @ts-ignore
              WebkitMediaControlsEnclosure: { overflow: 'hidden' }
            } as React.CSSProperties}
          />
        ) : (
          <img
            src={currentMedia}
            alt={`Media ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        )}
      </div>

      {/* Click outside to close */}
      <div
        className="absolute inset-0 -z-10"
        onClick={onClose}
      />
    </div>
  );
};

// A flexible card component that can handle images, videos, and custom content
const MediaCard = ({
  className,
  children,
  type = "image",
  mediaSrc,
  onClick,
}: {
  className?: string;
  children?: React.ReactNode;
  type?: "image" | "video";
  mediaSrc?: string;
  onClick?: () => void;
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

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger preview if clicking on video controls
    if (type === 'video' && (e.target as HTMLElement).tagName === 'VIDEO') {
      return;
    }
    onClick?.();
  };

  return (
    <div
      className={cn(
        "relative group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md cursor-pointer",
        className
      )}
      onClick={handleCardClick}
    >
      {/* Preview overlay */}
      {mediaSrc && type === "image"  &&<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
        <div className="bg-white/90 rounded-full p-2">
          <ZoomIn className="h-6 w-6 text-gray-700" />
        </div>
      </div>}

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
            controlsList="nodownload noplaybackrate nopictureinpicture"
            autoPlay={false}
            controls
     
            disablePictureInPicture
            preload="metadata"
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            ref={videoRef}
          />
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-300 group-hover:bg-black/40 cursor-pointer" onClick={handlePlay}>
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

const ProductMedia = ({mediaUrls, product}: {mediaUrls: string[], product: any}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  // Helper function to detect if a URL is a video
  const isVideoUrl = (url: string): boolean => {
    return /\.(mp4|webm|mov|avi|mkv|flv|wmv|m4v|3gp|ogv)(\?.*)?$/i.test(url);
  };

  const openPreview = (index: number) => {
    setCurrentPreviewIndex(index);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  const goToNext = () => {
    setCurrentPreviewIndex((prev) => 
      prev < mediaUrls.length - 1 ? prev + 1 : 0
    );
  };

  const goToPrevious = () => {
    setCurrentPreviewIndex((prev) => 
      prev > 0 ? prev - 1 : mediaUrls.length - 1
    );
  };

  return (
    <div className="py-10 ">
      
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
         {product?.name} Media
        </h2>

        <div className="mt-5 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
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
                onClick={() => openPreview(index)}
              />
            );
          })}
        </div>

        {/* Media Preview Modal */}
        <MediaPreviewModal
          isOpen={isPreviewOpen}
          mediaUrls={mediaUrls}
          currentIndex={currentPreviewIndex}
          onClose={closePreview}
          onNext={goToNext}
          onPrevious={goToPrevious}
        />
    </div>
  );
};

export default ProductMedia;
