import React, { useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
  "https://images.unsplash.com/photo-1585412727339-54e4bae3bbf9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
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
