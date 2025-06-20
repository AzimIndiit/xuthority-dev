import SearchSection from "@/components/home/SearchSection";
import SoftwareGrid from "@/components/SoftwareGrid";
import LeaveReviewSection from "@/components/home/LeaveReviewSection";
import BuyerAnalysisSection from "@/components/home/BuyerAnalysisSection";
import ClaimProfileSection from "@/components/home/ClaimProfileSection";
import TestimonialsSection from "@/components/home/TestimonialsCarousel";
import PopularSoftwareSection from "@/components/home/PopularSoftwareSection";

export default function Home() {
  return (
    <main className="">
      <SearchSection />
      <SoftwareGrid />
      <LeaveReviewSection />
      <BuyerAnalysisSection />
      <TestimonialsSection />
      <ClaimProfileSection />

      <PopularSoftwareSection />
    </main>
  );
}
