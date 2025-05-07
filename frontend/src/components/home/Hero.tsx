
import React from "react";
import Container from "../ui/Container";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const Hero = () => {
  const { translations } = useLanguage();
  return (
    <section id="home" className="pt-32 pb-24 md:pt-44 md:pb-32 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-elkaavie-50/80 to-white pointer-events-none" />
      
      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in">
            <span className="inline-block px-3 py-1 bg-elkaavie-100 text-elkaavie-800 rounded-full text-sm font-medium mb-6">
              {translations.home.hero.title}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {translations.home.hero.subtitle}
            </h1>
            <p className="text-lg text-gray-700 mb-8 max-w-lg">
              {translations.home.hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#book"
                className="inline-flex items-center justify-center px-6 py-3 bg-elkaavie-500 text-white font-medium rounded-lg shadow-md hover:bg-elkaavie-600 transition duration-200 text-center hover-scale"
              >
                {translations.home.hero.cta.inquire}
                <ArrowRight size={18} className="ml-2" />
              </a>
              <a
                href="#facilities"
                className="inline-flex items-center justify-center px-6 py-3 border border-elkaavie-200 text-elkaavie-700 font-medium rounded-lg hover:bg-elkaavie-50 transition duration-200 text-center"
              >
                {translations.home.hero.cta.viewFacilities}
              </a>
            </div>
          </div>

          <div className="relative animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-[4/3]">
              <div className="absolute inset-0 bg-gradient-to-r from-elkaavie-400/20 to-elkaavie-300/10 mix-blend-multiply z-10 rounded-2xl" />
              <img
                src="../public/WhatsApp Image 2025-04-19 at 21.40.09.jpeg"
                alt="Elkaavie Kost"
                className="object-cover w-full h-full transform transition duration-700 hover:scale-105"
                loading="lazy"
              />
            </div>
            
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-elkaavie-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />
            <div className="absolute -top-6 -right-6 w-40 h-40 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" />

            {/* Floating Card */}
            <div className="absolute bottom-6 -right-6 md:right-6 bg-white rounded-lg shadow-lg p-4 w-56 animate-fade-in">
              <div className="flex items-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <p className="text-sm font-medium text-gray-900">Tersedia</p>
              </div>
              <p className="text-lg font-bold text-gray-900">Kamar Eksklusif</p>
              <p className="text-sm text-gray-500">3x3 meter dengan AC & Kamar Mandi Dalam</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
