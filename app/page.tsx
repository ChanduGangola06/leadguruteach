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
import { getActiveBanners } from "@/lib/queries/banners";
import { getActivePackages } from "@/lib/queries/packages";
import { getActiveFeaturedCourses } from "@/lib/queries/featuredCourses";
import { getActiveTestimonials } from "@/lib/queries/testimonials";
import { getActiveInstructors } from "@/lib/queries/instructors";

export default async function Home() {
  const [banners, packages, featuredCourses, testimonials, instructors] = await Promise.all([
    getActiveBanners(),
    getActivePackages(),
    getActiveFeaturedCourses(),
    getActiveTestimonials(),
    getActiveInstructors(),
  ]);

  return (
    <main className="relative min-h-screen bg-navy">
      <Header />
      <div style={{ height: NAVBAR_HEIGHT }} aria-hidden />
      <div className="pt-4 md:pt-5">
        <ImageBanner slides={banners} />
      </div>
      <Hero />
      <CourseContent courses={featuredCourses} />
      <Stats />
      <Process />
      <Courses packages={packages} />
      <Instructors instructors={instructors} />
      <Testimonials testimonials={testimonials} />
      <Footer />
    </main>
  );
}
