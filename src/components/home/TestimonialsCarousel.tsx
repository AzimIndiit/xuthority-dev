import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useRef, useState } from "react";
import { useLandingPageSection } from "@/hooks/useLandingPageSection";

// Comment out old implementation - keeping for reference
// const testimonials = [
//   {
//     text: "While XUTHORITY has some useful features, I found it lacking in key integrations with other platforms we use. The interface is decent, but the reporting tools could be more detailed. It's a decent option for small businesses, but larger companies may need a more advanced solution.",
//     name: "Katherine",
//     avatar: "https://randomuser.me/api/portraits/women/68.jpg",
//   },
//   {
//     text: "XUTHORITY has transformed the way we manage customer feedback. With real-time tracking, seamless response management, and automation features, we can easily build trust and strengthen our reputation. The intuitive dashboard makes navigating reviews effortless, saving us valuable time.",
//     name: "Sarah",
//     avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//   },
//   {
//     text: "While XUTHORITY has some useful features, I found it lacking in key integrations with other platforms we use. The interface is decent, but the reporting tools could be more detailed. It's a decent option for small businesses, but larger companies may need a more advanced solution.",
//     name: "Katherine",
//     avatar: "https://randomuser.me/api/portraits/women/68.jpg",
//   },
//   {
//     text: "XUTHORITY offers great tools for review monitoring and responding, but some features feel a bit limited. The analytics are helpful, but more customization options would make it even better. Customer support is responsive, which is a plus. Overall, a solid tool, but a few enhancements would make it perfect.",
//     name: "Emily",
//     avatar: "https://randomuser.me/api/portraits/women/65.jpg",
//   },
//   {
//     text: "While XUTHORITY has some useful features, I found it lacking in key integrations with other platforms we use. The interface is decent, but the reporting tools could be more detailed. It's a decent option for small businesses, but larger companies may need a more advanced solution.",
//     name: "Katherine",
//     avatar: "https://randomuser.me/api/portraits/women/68.jpg",
//   },
//   {
//     text: "XUTHORITY has transformed the way we manage customer feedback. With real-time tracking, seamless response management, and automation features, we can easily build trust and strengthen our reputation. The intuitive dashboard makes navigating reviews effortless, saving us valuable time.",
//     name: "Sarah",
//     avatar: "https://randomuser.me/api/portraits/women/44.jpg",
//   },
// ];

// Fallback testimonials in case API fails
const fallbackTestimonials = [
  {
    text: "While XUTHORITY has some useful features, I found it lacking in key integrations with other platforms we use. The interface is decent, but the reporting tools could be more detailed. It's a decent option for small businesses, but larger companies may need a more advanced solution.",
    name: "Katherine",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    text: "XUTHORITY has transformed the way we manage customer feedback. With real-time tracking, seamless response management, and automation features, we can easily build trust and strengthen our reputation. The intuitive dashboard makes navigating reviews effortless, saving us valuable time.",
    name: "Sarah",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    text: "While XUTHORITY has some useful features, I found it lacking in key integrations with other platforms we use. The interface is decent, but the reporting tools could be more detailed. It's a decent option for small businesses, but larger companies may need a more advanced solution.",
    name: "Katherine",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    text: "XUTHORITY offers great tools for review monitoring and responding, but some features feel a bit limited. The analytics are helpful, but more customization options would make it even better. Customer support is responsive, which is a plus. Overall, a solid tool, but a few enhancements would make it perfect.",
    name: "Emily",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    text: "While XUTHORITY has some useful features, I found it lacking in key integrations with other platforms we use. The interface is decent, but the reporting tools could be more detailed. It's a decent option for small businesses, but larger companies may need a more advanced solution.",
    name: "Katherine",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    text: "XUTHORITY has transformed the way we manage customer feedback. With real-time tracking, seamless response management, and automation features, we can easily build trust and strengthen our reputation. The intuitive dashboard makes navigating reviews effortless, saving us valuable time.",
    name: "Sarah",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
];

// Note: Categories were not related to testimonials - removed from this component

export default function TestimonialsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(1);
  
  // Fetch testimonials from admin-configured data
  const { data: testimonialsData, isLoading: testimonialsLoading } = useLandingPageSection('user', 'testimonials');
  
  // Transform the API data to match our component structure
  const testimonials = testimonialsData?.testimonials?.map((testimonial: any) => ({
    text: testimonial.text,
    name: testimonial.userName,
    avatar: testimonial.userImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.userName)}&background=random`,
  })) || fallbackTestimonials;
  
  const sectionHeading = testimonialsData?.heading || "What they Say About Us!";

  // Responsive: update cardsPerSlide
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) setCardsPerSlide(1); // mobile
      else if (window.innerWidth < 1024) setCardsPerSlide(1); // laptop
      else setCardsPerSlide(3); // desktop
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (!api || testimonials.length === 0) return;
    const interval = setInterval(() => {
      const next = (api.selectedScrollSnap() + cardsPerSlide) % Math.ceil(testimonials.length / cardsPerSlide);
      api.scrollTo(next);
    }, 5000);
    return () => clearInterval(interval);
  }, [api, cardsPerSlide, testimonials.length]);

  // Update current index
  useEffect(() => {
    if (!api) return;
    api.on("select", () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  // Calculate number of slides and dots
  const totalSlides = Math.ceil(testimonials.length / cardsPerSlide);
  const currentSlide = Math.floor(current / cardsPerSlide);
  console.log('totalSlides', totalSlides, 'current', current, 'currentSlide', currentSlide);

  // Map current slide to dot index
  let dotActive = 0;
  if (totalSlides <= 3) {
    dotActive = current;
  } else {
    if (current === 0) {  
      dotActive = 0;
    } else if (current === totalSlides - 1) {
      dotActive = totalSlides - 1;
    } else {
      dotActive = 1;
    }
  }
  console.log('dotActive', dotActive)
  return (
    <section className="relative w-full bg-[#f8f8f8] py-24 px-2 sm:px-6 flex flex-col items-center overflow-hidden">
      <div className="w-full lg:max-w-screen-xl mx-auto flex flex-col items-center ">
        {/* Decorative Circles */}
        <div className="absolute left-0 top-10 w-32 h-32 sm:w-40 sm:h-40 bg-blue-200 rounded-full opacity-60 -z-10" />
        <div className="absolute left-10 top-20 w-20 h-20 bg-blue-100 rounded-full opacity-80 -z-10" />
        <div className="absolute right-0 bottom-0 w-64 h-32 bg-red-100 rounded-tl-full opacity-60 -z-10" />

        <h2 className="text-3xl sm:text-5xl font-bold text-center mb-12 text-gray-900">
          {sectionHeading}
        </h2>
    
       
        <div className="w-full max-w-6xl flex justify-center relative">
        <div className="w-full h-full absolute -top-18  -left-13">
       <img src="/svg/testimonial.svg" alt="testimonials" className="w-40 h-40 object-contain" />

        </div>

          {testimonialsLoading ? (
            // Loading skeleton
            <div className="w-full">
              <div className="flex gap-4 animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-md h-80 flex-1"></div>
                ))}
              </div>
            </div>
          ) : (
            <Carousel
              setApi={setApi}
              opts={{
                align: "center",
                loop: true,
                slidesToScroll: 1,
                watchDrag: false,
              }}
              className="w-full"
            >
              <CarouselContent>
                {testimonials.map((t: any, idx: number) => (
                  <CarouselItem
                    key={t.name + idx}
                    className="md:basis-1/2 lg:basis-1/3 flex flex-col"
                  > 
                    <div className="bg-white rounded-md  border border-gray-200 p-4 flex flex-col justify-between min-h-[320px] mx-2 flex-1">
                      <p className="text-gray-800 text-base mb-8 leading-relaxed font-semibold ">{t.text}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-red-600 text-4xl font-family-buffalo">
                          {t.name}
                        </span>
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                          onError={(e) => {
                            // Fallback to avatar generator if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=random`;
                          }}
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* Optional: Show arrows on desktop */}
              {/* <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" /> */}
            </Carousel>
          )}
        </div>
        {/* Dots */}
        {!testimonialsLoading && testimonials.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-8 ">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                className={`w-3 h-3 rounded-full border-2 border-red-200 transition-all ${
                  idx === dotActive ? "bg-red-600 border-red-600" : "bg-white"
                }`}
                onClick={() => api?.scrollTo(idx)}
                aria-label={`Go to testimonial slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
