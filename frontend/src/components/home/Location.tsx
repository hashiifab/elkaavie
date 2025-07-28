import { useState, useEffect } from "react";
import Container from "../ui/Container";
import CustomBadge from "../ui/CustomBadge";
import { MapPin, School, Building, Home, Store, Utensils, Hotel, Building2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

// Map of place names to their Google Maps URLs
const placeLinks: Record<string, string> = {
  // English place names
  "Budi Utama School": "https://g.co/kgs/YyBhnq8",
  "TVRI Yogyakarta": "https://g.co/kgs/P7TsEV5",
  "Al-Ikhlas Mosque": "https://maps.app.goo.gl/Dm1XtLSi14v7GUnF7",
  "Warmindo Latanza": "https://maps.app.goo.gl/3EbaGhPsxXxekmpE8",
  "Sakinah Mart": "https://g.co/kgs/beFXZfh",
  "Sakinah Idaman General Hospital": "https://g.co/kgs/HJcdU9C",
  "Sardjito Hospital": "https://g.co/kgs/UbrgKcx",
  "Gadjah Mada University": "https://g.co/kgs/GFCD6ZW",
  "Hotel Tentrem": "https://www.google.com/search?q=Hotel+Tentrem+sleman&sourceid=chrome&ie=UTF-8",
  "MAN 3 Sleman": "https://g.co/kgs/4nbdsGy",
  "Warteg Al Rizki": "https://g.co/kgs/vzRJ6ZM",
  "Indomaret Godean": "https://g.co/kgs/YQgVpgi",

  // Indonesian place names
  "Sekolah Budi Utama": "https://g.co/kgs/YyBhnq8",
  "Masjid Al-Ikhlas": "https://maps.app.goo.gl/Dm1XtLSi14v7GUnF7",
  "RS Umum Sakinah Idaman": "https://g.co/kgs/HJcdU9C",
  "RS dr. Sardjito": "https://g.co/kgs/UbrgKcx",
  "Universitas Gadjah Mada": "https://g.co/kgs/GFCD6ZW",
};

const Location = () => {
  const { translations } = useLanguage();
  const [showAllPlaces, setShowAllPlaces] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if screen is mobile/tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getIconForType = (type: string) => {
    switch (type) {
      case "restaurant":
        return <Utensils size={20} />;
      case "store":
        return <Store size={20} />;
      case "education":
        return <School size={20} />;
      case "hospital":
        return <Building2 size={20} />;
      case "hotel":
        return <Hotel size={20} />;
      case "worship":
        return <Home size={20} />;
      case "landmark":
        return <Building size={20} />;
      default:
        return <MapPin size={20} />;
    }
  };

  return (
    <section id="location" className="py-20 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <CustomBadge className="mb-3">{translations.home.location.badge || "Lokasi"}</CustomBadge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {translations.home.location.title}
          </h2>
          <p className="text-lg text-gray-600">
            {translations.home.location.subtitle}
          </p>
        </div>

        <div className={`grid grid-cols-1 ${showAllPlaces && !isMobile ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-12 items-start transition-all duration-700 ease-in-out`}>
          <div className={`transition-all duration-700 ease-in-out ${showAllPlaces && !isMobile ? 'col-span-1' : 'order-2 lg:order-1'}`}>
            <div className={`bg-elkaavie-50 rounded-2xl p-8 animate-scale-in relative transition-all duration-700 ease-in-out ${showAllPlaces ? '' : ''}`}>
              <div
                className={`transition-all duration-700 ease-in-out ${showAllPlaces ? 'max-h-[2000px]' : 'max-h-[320px] md:max-h-[420px] overflow-hidden'}`}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <MapPin className="text-elkaavie-500 mr-2" size={24} />
                  {translations.home.location.address}
                </h3>

                <p className="text-gray-700 mb-8">
                  {translations.home.location.description}
                </p>

                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  {translations.home.location.nearbyPlaces.title}
                </h4>

                <div className={`grid grid-cols-1 ${showAllPlaces ? (isMobile ? 'md:grid-cols-2' : 'md:grid-cols-3 lg:grid-cols-4') : 'md:grid-cols-2'} gap-3 transition-all duration-700 ease-in-out`}>
                  {translations.home.location.nearbyPlaces.places.map((place, index) => (
                    <a
                      key={index}
                      href={placeLinks[place.name] || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:bg-elkaavie-50 transition-all cursor-pointer group"
                    >
                      <div className="w-10 h-10 rounded-full bg-elkaavie-100 flex items-center justify-center mr-3 text-elkaavie-700 group-hover:bg-elkaavie-200 transition-colors">
                        {getIconForType(place.type)}
                      </div>
                      <div className="flex-grow">
                        <h5 className="font-medium text-gray-900 group-hover:text-elkaavie-700 transition-colors">{place.name}</h5>
                        <p className="text-sm text-gray-500">{place.distance}</p>
                      </div>
                      <ExternalLink size={16} className="text-gray-400 group-hover:text-elkaavie-500 transition-colors" />
                    </a>
                  ))}
                </div>


              </div>

              <div
                className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-elkaavie-50 to-transparent h-24 flex items-end justify-center pb-4 rounded-b-2xl transition-opacity duration-700 ease-in-out ${showAllPlaces ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
              >
                <button
                  onClick={() => setShowAllPlaces(true)}
                  className="flex items-center justify-center px-6 py-2 text-elkaavie-600 font-medium rounded-lg border border-elkaavie-200 bg-white hover:bg-elkaavie-100 transition duration-200 shadow-sm"
                >
                  {translations.home.location.nearbyPlaces.seeMore}
                  <ChevronDown className="ml-1" size={18} />
                </button>
              </div>

              <div
                className={`mt-6 w-full flex justify-center transition-all duration-700 ease-in-out ${showAllPlaces ? 'opacity-100 h-auto' : 'opacity-0 h-0 overflow-hidden pointer-events-none'}`}
              >
                <button
                  onClick={() => setShowAllPlaces(false)}
                  className="flex items-center justify-center px-6 py-2 text-elkaavie-600 font-medium rounded-lg border border-elkaavie-200 bg-white hover:bg-elkaavie-100 transition duration-200 shadow-sm"
                >
                  {translations.home.location.nearbyPlaces.seeLess}
                  <ChevronUp className="ml-1" size={18} />
                </button>
              </div>
            </div>
          </div>

          <div className={`${showAllPlaces && !isMobile ? 'mt-8' : 'order-1 lg:order-2'} transition-all duration-700 ease-in-out`}>
            <div className="relative rounded-2xl overflow-hidden shadow-lg h-[400px] md:h-[500px] animate-scale-in">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.2217300641523!2d110.3646763!3d-7.7662954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7a58453c3f9ca1%3A0xf0e252b6131c38ba!2sKOS%20EXCLUSIVE%20ELKAAVIE!5e0!3m2!1sen!2sid!4v1745549796972!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold text-white mb-2">{translations.home.location.fullAddress.split('\n')[0]}</h3>
                <p className="text-white/90">
                  {translations.home.location.fullAddress.split('\n')[1]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Location;
