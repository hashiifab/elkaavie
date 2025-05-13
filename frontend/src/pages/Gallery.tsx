import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
  featured?: boolean;
}

type Category = "all" | "rooms_facilities" | "surroundings" | "cultural" | "culinary";

const galleryImages: GalleryImage[] = [
  // Rooms & Facilities (4 images)
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304",
    alt: "Luxury king bedroom with spacious design",
    category: "rooms_facilities",
    featured: true,
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1624834452214-38c02f9ae3c9",
    alt: "Modern bathroom with rain shower",
    category: "rooms_facilities",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1560448204-603b3fc33ddc",
    alt: "Cozy living area with contemporary furnishings",
    category: "rooms_facilities",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1615874959474-d609969a20ed",
    alt: "Fully equipped kitchen with stainless steel appliances",
    category: "rooms_facilities",
  },

  // Surrounding Environment (4 images)
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3",
    alt: "Modern building exterior with landscaped entrance",
    category: "surroundings",
    featured: true,
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
    alt: "Tranquil garden with seating areas",
    category: "surroundings",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7",
    alt: "Night view of the building facade",
    category: "surroundings",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
    alt: "Rooftop terrace with panoramic views",
    category: "surroundings",
  },

  // Cultural Tourism (4 images)
  {
    id: 9,
    src: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa",
    alt: "Tugu Jogja landmark at sunset",
    category: "cultural",
    featured: true,
  },
  {
    id: 10,
    src: "https://images.unsplash.com/photo-1627567293910-8b5421fcf513",
    alt: "Malioboro street with traditional shops",
    category: "cultural",
  },
  {
    id: 11,
    src: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272",
    alt: "Yogyakarta Palace (Kraton) entrance",
    category: "cultural",
  },
  {
    id: 12,
    src: "https://images.unsplash.com/photo-1590136590531-7833759eca3a",
    alt: "Alun-Alun Kidul with its iconic twin banyan trees",
    category: "cultural",
  },

  // Culinary & Hangout Spots (4 images)
  {
    id: 13,
    src: "https://images.unsplash.com/photo-1544148103-0773bf10d330",
    alt: "Cozy cafe with comfortable seating",
    category: "culinary",
    featured: true,
  },
  {
    id: 14,
    src: "https://images.unsplash.com/photo-1519690889869-e705e59f72e1",
    alt: "Local food stall with traditional dishes",
    category: "culinary",
  },
  {
    id: 15,
    src: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c",
    alt: "Modern restaurant with outdoor seating",
    category: "culinary",
  },
  {
    id: 16,
    src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
    alt: "Coffee shop with study area for students",
    category: "culinary",
  },
];

const Gallery = () => {
  const { translations } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>(galleryImages);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Featured image - always the first in the list
  const featuredImages = galleryImages.filter(img => img.featured);

  useEffect(() => {
    if (selectedCategory === "all") {
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
    let newIndex: number;

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

  // Function to get the description for image
  const getImageDescriptionKey = (alt: string): string => {
    // Just return the alt text directly as the description
    return alt;
  };

  const categories: { value: Category; label: string }[] = [
    { value: "all", label: translations.gallery.categories.all },
    { value: "rooms_facilities", label: translations.gallery.categories.rooms_facilities },
    { value: "surroundings", label: translations.gallery.categories.surroundings },
    { value: "cultural", label: translations.gallery.categories.cultural },
    { value: "culinary", label: translations.gallery.categories.culinary },
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
              {translations.gallery.title}
            </motion.h1>
            <motion.p
              className="text-xl text-white/90 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {translations.gallery.description}
            </motion.p>
          </div>
        </div>

        <Container>
          {/* Category filters */}
          <div className="flex flex-col items-center mb-12">
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
                    <p className="text-sm text-gray-700 line-clamp-1">{getImageDescriptionKey(image.alt)}</p>
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