import React from "react";
import Container from "../ui/Container";
import CustomBadge from "../ui/CustomBadge";
import { Check, X } from "lucide-react";
import ImageGallery from "../layout/ImageGallery";
import { useLanguage } from "@/contexts/language-context";

const RoomDetails = () => {
  const { translations } = useLanguage();

  const roomAmenities = [
    { name: translations.home.room.amenities.items.ac, available: true },
    { name: translations.home.room.amenities.items.bed, available: true },
    { name: translations.home.room.amenities.items.deskChair, available: true },
    { name: translations.home.room.amenities.items.tv, available: true },
    { name: translations.home.room.amenities.items.wardrobe, available: true },
    { name: translations.home.room.amenities.items.pillows, available: true },
    { name: translations.home.room.amenities.items.window, available: true },
  ];

  const bathroomAmenities = [
    { name: translations.home.room.bathroom.items.private, available: true },
    { name: translations.home.room.bathroom.items.toilet, available: true },
    { name: translations.home.room.bathroom.items.shower, available: true },
  ];

  const roomRules = [
    { rule: translations.home.room.rules.items.maxOccupancy, allowed: false },
    { rule: translations.home.room.rules.items.noUnmarried, allowed: false },
    { rule: translations.home.room.rules.items.noChildren, allowed: false },
    { rule: translations.home.room.rules.items.occupationType, allowed: true },
    { rule: translations.home.room.rules.items.parking, allowed: true },
  ];

  return (
    <section id="room" className="py-20 bg-white">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <CustomBadge className="mb-3">{translations.home.room.details}</CustomBadge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {translations.home.room.subtitle}
          </h2>
          <p className="text-lg text-gray-600">
            {translations.home.room.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <ImageGallery />
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {translations.home.room.specifications.title}
              </h3>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">{translations.home.room.specifications.size}</span>
                  <span className="font-medium text-gray-900">{translations.home.room.specifications.sizeValue}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-gray-200">
                  <span className="text-gray-600">{translations.home.room.specifications.electricity}</span>
                  <span className="font-medium text-gray-900">{translations.home.room.specifications.electricityValue}</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-gray-600">{translations.home.room.specifications.type}</span>
                  <span className="font-medium text-gray-900">{translations.home.room.specifications.typeValue}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-elkaavie-100 inline-flex items-center justify-center mr-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 21V5C19 3.9 18.1 3 17 3H7C5.9 3 5 3.9 5 5V21M19 21H5M19 21H21M5 21H3M8 10H16M8 6H16M8 14H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  {translations.home.room.amenities.title}
                </h3>
                <ul className="space-y-3">
                  {roomAmenities.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-700">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-elkaavie-100 inline-flex items-center justify-center mr-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 22V17M4 17V4C4 3.45 4.45 3 5 3H13C13.55 3 14 3.45 14 4V17M4 17H14M14 22V17M15 7H20C20.55 7 21 7.45 21 8V17M15 17H21M21 22V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </span>
                  {translations.home.room.bathroom.title}
                </h3>
                <ul className="space-y-3">
                  {bathroomAmenities.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-700">{item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="w-8 h-8 rounded-full bg-elkaavie-100 inline-flex items-center justify-center mr-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {translations.home.room.rules.title}
              </h3>
              <ul className="space-y-3">
                {roomRules.map((item, index) => (
                  <li key={index} className="flex items-center">
                    {item.allowed ? (
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                    ) : (
                      <X className="w-5 h-5 text-red-500 mr-2" />
                    )}
                    <span className="text-gray-700">{item.rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default RoomDetails;
