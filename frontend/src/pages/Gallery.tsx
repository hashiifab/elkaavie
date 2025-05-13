import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  MapPin,
  Coffee,
} from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  featured?: boolean;
}

type Category = "all" | "cultural" | "culinary";

const galleryImages: GalleryImage[] = [
  // Cultural Tourism (4 images)
  {
    id: 1,
    src: "/tourism/tugu.jpg",
    alt: "Tugu Jogja - Iconic landmark of Yogyakarta",
    category: "cultural",
    featured: true,
  },
  {
    id: 2,
    src: "/tourism/malioboro.jpg",
    alt: "Malioboro - Famous shopping street with traditional crafts",
    category: "cultural",
  },
  {
    id: 3,
    src: "/tourism/keraton.jpg",
    alt: "Keraton Yogyakarta - The Sultan's Palace with rich history",
    category: "cultural",
  },
  {
    id: 4,
    src: "/tourism/taman.jpeg",
    alt: "Taman Sari - Historic royal garden and water castle",
    category: "cultural",
  },

  // Culinary & Hangout Spots (4 images)
  {
    id: 5,
    src: "/culinary/tanahresto.png",
    alt: "Tanah Kita Resto - Popular restaurant near Elkaavie",
    category: "culinary",
    featured: true,
  },
  {
    id: 6,
    src: "/culinary/tongkah.png",
    alt: "TONGKAH KOPI - Cozy coffee shop for studying",
    category: "culinary",
  },
  {
    id: 7,
    src: "/culinary/longkang.png",
    alt: "Longkangkopi - Unique coffee shop with great ambiance",
    category: "culinary",
  },
  {
    id: 8,
    src: "/culinary/kebon.png",
    alt: "Kebon Plandi - Garden-themed cafe with outdoor seating",
    category: "culinary",
  },
];

const Gallery = () => {
  const { translations } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [filteredImages, setFilteredImages] =
    useState<GalleryImage[]>(galleryImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // No longer need featured images since we're using a gradient background

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredImages(galleryImages);
    } else {
      setFilteredImages(
        galleryImages.filter((img) => img.category === selectedCategory)
      );
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

    const currentIndex = filteredImages.findIndex(
      (img) => img.id === selectedImage.id
    );
    let newIndex: number;

    if (direction === "next") {
      newIndex = (currentIndex + 1) % filteredImages.length;
    } else {
      newIndex =
        (currentIndex - 1 + filteredImages.length) % filteredImages.length;
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

  // Function to get the description for image
  const getImageDescriptionKey = (alt: string): string => {
    // Just return the alt text directly as the description
    return alt;
  };

  const categories: { value: Category; label: string }[] = [
    { value: "all", label: translations.gallery.categories.all },
    { value: "cultural", label: translations.gallery.categories.cultural },
    { value: "culinary", label: translations.gallery.categories.culinary },
  ];

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-elkaavie-600 to-elkaavie-800 py-16 mb-12">
          <Container>
            <div className="text-left text-white max-w-3xl px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {translations.gallery.title}
              </h1>
              <div className="w-20 h-1 bg-elkaavie-400 mb-6"></div>
              <p className="text-xl text-white/90 mb-8">
                {translations.gallery.description}
              </p>

              {/* Feature badges to add more visual elements */}
              <div className="flex flex-wrap gap-4 items-center mb-1">
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
                  <MapPin className="h-4 w-4 text-elkaavie-200" />
                  <span>{translations.gallery.categories.cultural}</span>
                </div>
                <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 text-sm backdrop-blur-sm">
                  <Coffee className="h-4 w-4 text-elkaavie-200" />
                  <span>{translations.gallery.categories.culinary}</span>
                </div>
              </div>
            </div>
          </Container>
        </div>

        <Container>
          {/* Category filters */}
          <div
            id="gallery-categories"
            className="flex flex-col items-center mb-12"
          >
            <div className="flex flex-wrap justify-center gap-3 mb-6">
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

            {/* Category description */}
            <div className="max-w-3xl text-center px-4">
              <p className="text-gray-600 leading-relaxed">
                {translations.gallery.descriptions[selectedCategory]}
              </p>
            </div>
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
                      alt={getImageDescriptionKey(image.alt)}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-white font-medium text-sm bg-black/60 px-3 py-1 rounded-full">
                        {translations.gallery.viewButton}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 bg-white">
                    <p className="text-sm text-gray-700 line-clamp-1">
                      {getImageDescriptionKey(image.alt)}
                    </p>
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
              aria-label={translations.gallery.lightbox.close}
            >
              <X size={24} />
            </button>

            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 transition z-50"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("prev");
              }}
              aria-label={translations.gallery.lightbox.previous}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 transition z-50"
              onClick={(e) => {
                e.stopPropagation();
                navigateImage("next");
              }}
              aria-label={translations.gallery.lightbox.next}
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
                alt={getImageDescriptionKey(selectedImage.alt)}
                className="max-h-[85vh] max-w-[85vw] object-contain rounded-lg shadow-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-4 text-center rounded-b-lg">
                <p>{getImageDescriptionKey(selectedImage.alt)}</p>
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
