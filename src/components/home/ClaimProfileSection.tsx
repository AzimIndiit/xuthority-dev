import { Button } from "../ui/button";

export default function ClaimProfileSection() {
  return (
    <section className="w-full bg-[#fdf3ed] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full lg:max-w-screen-xl mx-auto flex flex-col-reverse md:flex-row items-center  sm:gap-12 justify-between">
        {/* Text Content */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left justify-between">
          <h2 className="text-2xl  md:text-3xl font-bold text-gray-900 mb-4">
            Reach More Potential Buyers<br className="hidden sm:block" /> for Your Software.
          </h2>
          <p className="text-gray-600 mb-6 max-w-lg">
            Expand your market presence and connect with the right audience. Our platform helps you showcase your software to millions of interested buyers, ensuring greater visibility and increased opportunities for sales.
          </p>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-3 shadow transition-all"
          >
            Claim Your Profile <span aria-hidden className="ml-2">→</span>
          </Button>
        </div>
        {/* Illustration */}
        <div className="w-full sm:w-1/2 flex justify-center mb-8 md:mb-0">
          <img
            src="https://placehold.co/480x280?text=Profile+Illustration"
            alt="Claim profile illustration"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
} 