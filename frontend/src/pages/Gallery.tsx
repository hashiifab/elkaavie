import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  featured?: boolean;
}

type Category = "semua" | "kamar" | "wisata" | "rumah sakit" | "tempat makan";

const galleryImages: GalleryImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
    alt: "Luxury king bedroom with spacious design",
    category: "kamar",
    featured: true,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1624834452214-38c02f9ae3c9",
    alt: "Modern bathroom with rain shower",
    category: "kamar",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
    alt: "Cozy living area with contemporary furnishings",
    category: "kamar",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1646736121441-c6163d77627a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHR1Z3UlMjBqb2dqYXxlbnwwfHwwfHx8MA%3D%3D",
    alt: "Stasiun Yogyakarta",
    category: "wisata",
    featured: true,
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1631795617958-3ddcf718d6aa?q=80&w=3328&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Tugu Yogya",
    category: "wisata",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1543874768-af0b9c4090d5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHlvZ3lha2FydGF8ZW58MHx8MHx8fDA%3D",
    alt: "Jalan Malioboro",
    category: "wisata",
    featured: true,
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1617098474202-0d0d7f60c56a",
    alt: "Deluxe room with balcony and city view",
    category: "kamar",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fHlvZ3lha2FydGF8ZW58MHx8MHx8fDA%3D",
    alt: "Candi",
    category: "wisata",
  },
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
    alt: "Tranquil garden with seating areas",
    category: "exterior",
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    alt: "Premium twin bedroom with desk area",
    category: "kamar",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
    alt: "Rooftop terrace with panoramic views",
    category: "fasilitas",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1544148103-0773bf10d330",
    alt: "Fine dining restaurant with elegant decor",
    category: "makan",
    featured: true,
  },
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1572267447684-c625798b99cd",
    alt: "Pusat kesehatan dengan peralatan olahraga",
    category: "fasilitas",
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1519690889869-e705e59f72e1",
    alt: "Prasmanan sarapan dengan pilihan segar",
    category: "makan",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7",
    alt: "Pemandangan malam dari fasad bangunan",
    category: "exterior",
  },
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("semua");
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(galleryImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  // Featured image - always the first in the list
  const featuredImages = galleryImages.filter(img => img.featured);

  useEffect(() => {
    if (selectedCategory === "semua") {
      setFilteredImages(galleryImages);
    } else {
      setFilteredImages(galleryImages.filter(img => img.category === selectedCategory));
    }
  }, [selectedCategory]);

  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    setIsLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = "auto";
  };

  const navigateImage = (direction: "next" | "prev") => {
    if (!selectedImage) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex;
    
    if (direction === "next") {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    }
    
    setSelectedImage(filteredImages[newIndex]);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") navigateImage("next");
      if (e.key === "ArrowLeft") navigateImage("prev");
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, selectedImage]);

  const categories: { value: Category; label: string }[] = [
    { value: "semua", label: "Semua" },
    { value: "kamar", label: "Kamar" },
    { value: "wisata", label: "wisata" },
    { value: "rumah sakit", label: "rumah sakit" },
    { value: "tempat makan", label: "Tempat makan" },
  ];

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero section with featured images */}
        <div className="relative h-[50vh] mb-16 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/10 z-10" />
          <img 
            src={`${featuredImages[0]?.src}?w=1920&auto=format&fit=crop&q=80`} 
            alt={featuredImages[0]?.alt}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
            <motion.h1 
              className="text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Galeri kami
            </motion.h1>
            <motion.p 
              className="text-xl text-white/90 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Rasakan keanggunan dan kenyamanan Elkaavie melalui galeri gambar kami yang dikurasi dengan cermat
            </motion.p>
          </div>
        </div>

        <Container>
          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.value
                    ? "bg-elkaavie-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Gallery grid */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            layout
          >
            <AnimatePresence>
              {filteredImages.map((image) => (
                <motion.div
                  key={image.id}
                  layoutId={`image-${image.id}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden rounded-xl shadow-md cursor-pointer group"
                  onClick={() => openLightbox(image)}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={`${image.src}?w=600&auto=format&fit=crop&q=80`}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-medium text-sm bg-black/60 px-3 py-1 rounded-full">
                        View
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-sm text-gray-700 line-clamp-1">{image.alt}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </Container>
      </main>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <button 
              className="absolute top-4 right-4 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 transition z-50"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
            >
              <X size={24} />
            </button>
            
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 transition z-50"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("prev");
              }}
            >
              <ChevronLeft size={24} />
            </button>
            
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 transition z-50"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("next");
              }}
            >
              <ChevronRight size={24} />
            </button>
            
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-h-[85vh] max-w-[85vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${selectedImage.src}?w=1920&auto=format&fit=crop&q=90`}
                alt={selectedImage.alt}
                className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 text-center rounded-b-lg">
                <p>{selectedImage.alt}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
};

export default Gallery; 