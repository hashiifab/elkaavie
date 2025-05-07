
import React, { useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import RoomDetails from "@/components/home/RoomDetails";
import Facilities from "@/components/home/Facilities";
import Location from "@/components/home/Location";
import Reviews from "@/components/home/Reviews";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const Index = () => {
  const { translations } = useLanguage();

  useEffect(() => {
    // Smooth scroll to section when URL hash changes
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    // Initial check for hash in URL
    handleHashChange();

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      <Header />
      <main className="flex-grow">
        <Hero />
        <RoomDetails />
        <Facilities />
        <Location />
        <Reviews />

        {/* Book Section/CTA */}
        <section id="book" className="py-20 bg-elkaavie-50">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {translations.home.cta.title}
            </h2>
            <p className="text-lg text-gray-700 mb-8 mx-auto">
              {translations.home.cta.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
                href="#book"
                className="inline-flex items-center justify-center px-6 py-3 bg-elkaavie-500 text-white font-medium rounded-lg shadow-md hover:bg-elkaavie-600 transition duration-200 text-center hover-scale"
              >
                {translations.home.cta.buttons.inquire}
                <ArrowRight size={18} className="ml-2" />
              </a>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-white border border-elkaavie-200 text-elkaavie-700 font-medium rounded-lg hover:bg-elkaavie-50 transition duration-200 text-center min-w-[200px]"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.9 12C3.9 10.2883 4.43458 8.72271 5.37788 7.42889M20.1 12C20.1 16.4183 16.4183 20.1 12 20.1C10.2883 20.1 8.72271 19.5654 7.42889 18.6221L3.9 20.1L5.37788 16.5711C4.43458 15.2773 3.9 13.7117 3.9 12C3.9 7.58172 7.58172 3.9 12 3.9C16.4183 3.9 20.1 7.58172 20.1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.56998 10.252C9.74753 8.80028 11.673 8.70635 12.0621 10.0999C12.6765 12.2399 15.02 11.9313 14.4503 14.9531" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {translations.home.cta.buttons.whatsapp}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
