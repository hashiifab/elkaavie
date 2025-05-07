import React from "react";
import Container from "../ui/Container";
import CustomBadge from "../ui/CustomBadge";
import { MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const Location = () => {
  const { translations } = useLanguage();

  const nearbyPlaces = [
    {
      name: translations.home.location.nearbyPlaces.places.warteg,
      distance: "2.4 km",
      type: "restaurant",
    },
    {
      name: translations.home.location.nearbyPlaces.places.indomaret,
      distance: "2.9 km",
      type: "store",
    },
    {
      name: translations.home.location.nearbyPlaces.places.ugm,
      distance: "1.5 km",
      type: "education",
    },
    {
      name: translations.home.location.nearbyPlaces.places.hospital,
      distance: "3.1 km",
      type: "hospital",
    },
  ];

  const getIconForType = (type: string) => {
    switch (type) {
      case "restaurant":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.75977 2L6.75977 7C6.75977 8.10457 7.6542 9 8.75876 9L14.7598 9C15.8644 9 16.7588 8.10457 16.7588 7L16.7588 2M6.75977 22L6.75977 14C6.75977 13.4477 7.20748 13 7.75977 13L15.7588 13C16.3111 13 16.7588 13.4477 16.7588 14L16.7588 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "store":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3H5L5.4 5M5.4 5H21L17 13H7M5.4 5L7 13M7 13L4.707 15.293C4.077 15.923 4.523 17 5.414 17H17M17 17C16.4696 17 15.9609 17.2107 15.5858 17.5858C15.2107 17.9609 15 18.4696 15 19C15 19.5304 15.2107 20.0391 15.5858 20.4142C15.9609 20.7893 16.4696 21 17 21C17.5304 21 18.0391 20.7893 18.4142 20.4142C18.7893 20.0391 19 19.5304 19 19C19 18.4696 18.7893 17.9609 18.4142 17.5858C18.0391 17.2107 17.5304 17 17 17ZM9 19C9 19.5304 8.78929 20.0391 8.41421 20.4142C8.03914 20.7893 7.53043 21 7 21C6.46957 21 5.96086 20.7893 5.58579 20.4142C5.21071 20.0391 5 19.5304 5 19C5 18.4696 5.21071 17.9609 5.58579 17.5858C5.96086 17.2107 6.46957 17 7 17C7.53043 17 8.03914 17.2107 8.41421 17.5858C8.78929 17.9609 9 18.4696 9 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "education":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 10V15C22 15.5523 21.5523 16 21 16H15.7985C15.5311 16 15.2728 16.0971 15.071 16.2716L12.5 18.5L9.89104 16.2627C9.69005 16.0971 9.43287 16 9.16748 16H3C2.44772 16 2 15.5523 2 15V5C2 4.44772 2.44772 4 3 4H10M22 10L15 2M22 10H15.7985C15.5311 10 15.2728 9.90294 15.071 9.72843L12.5 7.5L9.89104 9.73726C9.69005 9.90294 9.43287 10 9.16748 10H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case "hospital":
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 10H15M12 7V13M12 20H19C20.1046 20 21 19.1046 21 18V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6V18C3 19.1046 3.89543 20 5 20H12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return <MapPin size={20} />;
    }
  };

  return (
    <section id="location" className="py-20 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <CustomBadge className="mb-3">{translations.navigation.location || "Lokasi"}</CustomBadge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {translations.home.location.title}
          </h2>
          <p className="text-lg text-gray-600">
            {translations.home.location.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-elkaavie-50 rounded-2xl p-8 animate-scale-in">
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

              <div className="space-y-4">
                {nearbyPlaces.map((place, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-full bg-elkaavie-100 flex items-center justify-center mr-4 text-elkaavie-700">
                      {getIconForType(place.type)}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{place.name}</h5>
                      <p className="text-sm text-gray-500">{place.distance}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-elkaavie-500 text-white font-medium rounded-lg shadow-md hover:bg-elkaavie-600 transition duration-200 text-center hover-scale"
                >
                  {translations.home.location.viewMap}
                  <svg className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
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
