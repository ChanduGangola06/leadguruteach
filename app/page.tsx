import Header, { NAVBAR_HEIGHT } from "@/components/Header";
import ImageBanner from "@/components/ImageBanner";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import CourseContent from "@/components/sections/CourseContent";
import Stats from "@/components/sections/Stats";
import Process from "@/components/sections/Process";
import Courses from "@/components/sections/Courses";
import Instructors from "@/components/sections/Instructors";
import Testimonials from "@/components/sections/Testimonials";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-navy">
      <Header />
      <div style={{ height: NAVBAR_HEIGHT }} aria-hidden />
      <div className="pt-4 md:pt-5">
        <ImageBanner />
      </div>
      <Hero />
      <CourseContent />
      <Stats />
      <Process />
      <Courses />
      <Instructors />
      <Testimonials />
      <Footer />
    </main>
  );
}
