import React from "react";
import Container from "../ui/Container";
import CustomBadge from "../ui/CustomBadge";
import { Check } from "lucide-react";

const Facilities = () => {
  const mainFacilities = [
    { name: "WiFi kencang", icon: "wifi" },
    { name: "Ruang cuci", icon: "washer" },
    { name: "Kulkas bersama", icon: "fridge" },
    { name: "Penjaga kos", icon: "security" },
    { name: "Ruang makan", icon: "dining" },
    { name: "Ruang jemur", icon: "sun" },
    { name: "Dapur bersama", icon: "kitchen" },
    { name: "Balkon", icon: "balcony" },
    { name: "CCTV", icon: "camera" },
    { name: "Jemuran pakaian", icon: "clothes" },
  ];

  const parkingFacilities = [
    { name: "Parkir mobil", icon: "car" },
    { name: "Parkir motor", icon: "motorcycle" },
    { name: "Parkir sepeda", icon: "bicycle" },
  ];

  const koskosanRules = [
    { name: "Akses 24 jam", icon: "clock" },
    { name: "Dilarang membawa hewan", icon: "pet" },
    { name: "Lawan jenis dilarang masuk kamar", icon: "restriction" },
    { name: "Maksimal 1 orang/kamar", icon: "person" },
  ];

  return (
    <section id="facilities" className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <CustomBadge className="mb-3">Fasilitas</CustomBadge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Fasilitas Lengkap untuk Kenyamanan Anda
          </h2>
          <p className="text-lg text-gray-600">
            Elkaavie menyediakan berbagai fasilitas yang akan membuat penghuni merasa nyaman dan betah.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-scale-in">
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="relative h-full min-h-[300px] lg:min-h-full">
                <img
                  src="https://images.unsplash.com/photo-1515965885361-f1e0095517ea?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
                  alt="Fasilitas Umum"
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Fasilitas Umum</h3>
                  <p className="text-white/90">
                    Dirancang untuk memenuhi kebutuhan sehari-hari Anda
                  </p>
                </div>
              </div>
              <div className="lg:col-span-2 p-8">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {mainFacilities.map((facility, index) => (
                    <div key={index} className="flex items-start">
                      <span className="w-8 h-8 rounded-full bg-elkaavie-100 flex items-center justify-center mr-3 flex-shrink-0">
                        {getFacilityIcon(facility.icon)}
                      </span>
                      <span className="text-gray-700">{facility.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-md p-8 animate-scale-in">
              <div className="flex items-center mb-6">
                <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 12.5V6C22 4.9 21.1 4 20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H13.5M16 13V18M18.5 15.5H13.5M8 16H8.01M12 16H12.01M12 12H12.01M8 12H8.01M8 8H8.01M12 8H12.01M16 8H16.01M16 12H16.01" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <h3 className="text-xl font-bold text-gray-900">Fasilitas Parkir</h3>
              </div>
              <div className="space-y-4">
                {parkingFacilities.map((facility, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">{facility.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-8 animate-scale-in">
              <div className="flex items-center mb-6">
                <span className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#D97706" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </span>
                <h3 className="text-xl font-bold text-gray-900">Peraturan Kos</h3>
              </div>
              <div className="space-y-4">
                {koskosanRules.map((rule, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-700">{rule.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

const getFacilityIcon = (iconName: string) => {
  const iconMap: Record<string, JSX.Element> = {
    wifi: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 16.01C12.3762 16.01 12.68 16.3138 12.68 16.69C12.68 17.0662 12.3762 17.37 12 17.37C11.6238 17.37 11.32 17.0662 11.32 16.69C11.32 16.3138 11.6238 16.01 12 16.01Z" fill="#166534" stroke="#166534" strokeWidth="1.5"/>
        <path d="M17 11.9996C17 9.3997 14.7614 7.2998 12 7.2998C9.23858 7.2998 7 9.40086 7 11.9996M14.5 14.1996C14.5 12.8797 13.3807 11.7998 12 11.7998C10.6193 11.7998 9.5 12.8816 9.5 14.1996M2 6.2998C4.6 3.1998 8.33333 1.59961 12 1.59961C15.6667 1.59961 19.4 3.1998 22 6.2998" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    washer: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.9999 8C20.9999 6.9 20.0999 6 18.9999 6H6.00008C4.90008 6 4.00008 6.9 4.00008 8M20.9999 8V18C20.9999 19.1 20.0999 20 18.9999 20H6.00008C4.90008 20 4.00008 19.1 4.00008 18V8M20.9999 8H4.00008M8.00008 12C8.00008 14.2091 9.79094 16 12.0001 16C14.2092 16 16.0001 14.2091 16.0001 12M12.0001 10.5V8M9.00008 4H15.0001" stroke="#166534" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    fridge: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 6V10M5 14V18M19 10V6C19 4.89543 18.1046 4 17 4H7C5.89543 4 5 4.89543 5 6V10M19 10V18C19 19.1046 18.1046 20 17 20H7C5.89543 20 5 19.1046 5 18V10M19 10H5" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    security: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12H15M12 15V9M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    dining: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18M20 18V5C20 3.89543 19.1046 3 18 3H6C4.89543 3 4 3.89543 4 5V18M20 18H4M12 8H12.01M8 12H8.01M12 12H12.01M16 12H16.01M8 16H8.01M12 16H12.01M16 16H16.01" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    sun: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3V5M12 19V21M21 12H19M5 12H3M18.364 5.63604L16.95 7.04999M7.05001 16.95L5.63606 18.364M18.364 18.364L16.95 16.95M7.05001 7.04999L5.63606 5.63604M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="#166534" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    kitchen: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 15V17M14 15V17M4 5H20M4 19H20M20 5V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V5C4 3.89543 4.89543 3 6 3H18C19.1046 3 20 3.89543 20 5ZM15 11H9C8.44772 11 8 10.5523 8 10V8C8 7.44772 8.44772 7 9 7H15C15.5523 7 16 7.44772 16 8V10C16 10.5523 15.5523 11 15 11Z" stroke="#166534" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    balcony: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 13H20M4 13V21H20V13M4 13V8C4 5.79086 5.79086 4 8 4H16C18.2091 4 20 5.79086 20 8V13M9 21V17M15 21V17" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    camera: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.99902 7H5.99902M5.99902 7H7.5M5.99902 7V5M7.5 7H15M7.5 7C7.5 8.10457 6.60359 9 5.49902 9C4.39445 9 3.49902 8.10457 3.49902 7M15 7H16.5M15 7C15 8.10457 14.1046 9 13 9C11.8954 9 11 8.10457 11 7M16.5 7H19M16.5 7C16.5 8.10457 15.6046 9 14.5 9C13.3954 9 12.5 8.10457 12.5 7M19 7H21M19 7C19 8.10457 18.1046 9 17 9C15.8954 9 15 8.10457 15 7M3.49902 7C3.49902 5.89543 4.39445 5 5.49902 5M5.49902 5H7.5M7.5 5H15M7.5 5C7.5 3.89543 8.39445 3 9.5 3C10.6046 3 11.5 3.89543 11.5 5M15 5H16.5M15 5C15 3.89543 15.8954 3 17 3C18.1046 3 19 3.89543 19 5M16.5 5H19M19 5C19 3.89543 19.8954 3 21 3C22.1046 3 23 3.89543 23 5C23 6.10457 22.1046 7 21 7M2 15C2 13.8954 2.89543 13 4 13H20C21.1046 13 22 13.8954 22 15V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V15Z" stroke="#166534" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
    clothes: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 14V17M16 14V17M9 6L12 3L15 6M18 6L21 3L21 21H3L3 3L6 6M18 6C18 8.20914 15.3137 10 12 10C8.68629 10 6 8.20914 6 6M18 6H6" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    car: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 19C7 20.1046 6.10457 21 5 21C3.89543 21 3 20.1046 3 19M7 19C7 17.8954 6.10457 17 5 17C3.89543 17 3 17.8954 3 19M7 19H17M3 19V13M21 19C21 20.1046 20.1046 21 19 21C17.8954 21 17 20.1046 17 19M21 19C21 17.8954 20.1046 17 19 17C17.8954 17 17 17.8954 17 19M21 19V13M3 13L6 6H18L21 13M3 13H21" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    motorcycle: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 16V8L14 14M7 4L13 8L17 6M19 14H17M14 14H3M14 14L17 6M17 6H20M5 19C5 20.1046 4.10457 21 3 21C1.89543 21 1 20.1046 1 19C1 17.8954 1.89543 17 3 17C4.10457 17 5 17.8954 5 19ZM22 19C22 20.1046 21.1046 21 20 21C18.8954 21 18 20.1046 18 19C18 17.8954 18.8954 17 20 17C21.1046 17 22 17.8954 22 19Z" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    bicycle: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 19C7.20914 19 9 17.2091 9 15C9 12.7909 7.20914 11 5 11C2.79086 11 1 12.7909 1 15C1 17.2091 2.79086 19 5 19ZM5 19H19M19 19C21.2091 19 23 17.2091 23 15C23 12.7909 21.2091 11 19 11C16.7909 11 15 12.7909 15 15M19 19C16.7909 19 15 17.2091 15 15M9 9H12M12 9L16 15M12 9L8 15M4 5L8 15" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    clock: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    pet: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 3L8 6L11 9L8 14L12 16L16 11L19 13L21 11L19 4L14 6L10 3ZM10 3L4 7L7 13L8 14M19 22L12.5 16" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    restriction: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.364 18.364C21.8787 14.8492 21.8787 9.15076 18.364 5.63604C14.8492 2.12132 9.15076 2.12132 5.63604 5.63604M18.364 18.364C14.8492 21.8787 9.15076 21.8787 5.63604 18.364C2.12132 14.8492 2.12132 9.15076 5.63604 5.63604M18.364 18.364L5.63604 5.63604" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    person: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11ZM12 11V21M9.5 14.5L12 17M12 17L14.5 14.5" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  };

  return iconMap[iconName] || (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" />
    </svg>
  );
};

export default Facilities;
