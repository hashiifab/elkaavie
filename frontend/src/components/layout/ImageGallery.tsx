import React, { useState } from "react";

const images = [
  "../public/Frame 33644 (1).png",
  "../public/WhatsApp Image 2025-04-19 at 21.40.09.jpeg",
  "../public/Frame 33662.png"
];

const ImageGallery = () => {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    
      <div>
        <div className="relative rounded-2xl overflow-hidden shadow-lg aspect-[4/3] mb-6 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 z-10" />
          <img
            src={selectedImage}
            alt="Selected Room"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {images.slice(1).map((img, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden shadow-md hover:scale-105 transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedImage(img)}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover aspect-[4/3]"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    
  );
};

export default ImageGallery;
