import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";
import Pricing from "../components/landing/Pricing";
import Domains from "../components/landing/Domains";
import HowItWorks from "../components/landing/HowItWorks";
import Reviews from "../components/landing/Reviews";
import FAQ from "../components/landing/FAQ";
import Contact from "../components/landing/Contact";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <Domains />
      <HowItWorks />
      <Reviews />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
}
