import Navbar from "@/components/Navbar";
import PageHeader from "@/components/PageHeader";
import FeatureCards from "@/components/FeatureCards";
import AboutBusiness from "@/components/AboutBusiness";
import Experts from "@/components/Experts";
import Footer from "@/components/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <PageHeader title="About us" breadcrumb="Home | About" />
      <FeatureCards />
      <AboutBusiness />
      <Experts />
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default About;
