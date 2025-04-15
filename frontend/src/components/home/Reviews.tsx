import React from "react";
import Container from "../ui/Container";
import CustomBadge from "../ui/CustomBadge";
import RatingStars from "../ui/RatingStars";

interface ReviewData {
  name: string;
  time: string;
  rating: number;
  comment: string;
  ownerReply?: string;
}

const Reviews = () => {
  const overallRatings = {
    overall: 4.8,
    cleanliness: 4.8,
    comfort: 4.8,
    security: 4.5,
    price: 4.8,
    roomFacilities: 4.8,
    publicFacilities: 4.5,
  };

  const reviews: ReviewData[] = [
    {
      name: "Anonim",
      time: "1 tahun lalu",
      rating: 3.6,
      comment: "Kamarnya bersih dan fasilitas lumayan lengkap.",
    },
    {
      name: "Sutejo Heru",
      time: "1 tahun lalu",
      rating: 5.0,
      comment: "Kosan Elkaavie sangat bagus, fasilitas seperti hotel tapi serasa di rumah.",
      ownerReply: "Alhamdulillah, terima kasih. Semoga sukses dan bahagia selalu, Kak.",
    },
    {
      name: "Rieqy Muwachid Erysya",
      time: "2 tahun lalu",
      rating: 4.8,
      comment: "Kamar mandinya bersih, AC masih sejuk di kamar saya.",
    },
  ];

  return (
    <section id="reviews" className="py-20 bg-gray-50">
      <Container>
        <div className="max-w-3xl mx-auto text-center mb-16">
          <CustomBadge className="mb-3">Ulasan</CustomBadge>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Apa Kata Penghuni Kami
          </h2>
          <p className="text-lg text-gray-600">
            Lihat ulasan dari penghuni yang telah merasakan kenyamanan tinggal di Elkaavie.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="bg-white rounded-2xl shadow-md p-8 order-2 lg:order-1 animate-scale-in">
            <div className="text-center mb-8">
              <h3 className="text-4xl font-bold text-gray-900 mb-1">{overallRatings.overall}</h3>
              <div className="flex justify-center mb-2">
                <RatingStars rating={overallRatings.overall} size={24} />
              </div>
              <p className="text-gray-600">Berdasarkan 6 review</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Kebersihan</span>
                <div className="flex items-center">
                  <span className="text-gray-900 font-medium mr-2">{overallRatings.cleanliness}</span>
                  <RatingStars rating={overallRatings.cleanliness} className="flex-shrink-0" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Kenyamanan</span>
                <div className="flex items-center">
                  <span className="text-gray-900 font-medium mr-2">{overallRatings.comfort}</span>
                  <RatingStars rating={overallRatings.comfort} className="flex-shrink-0" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Keamanan</span>
                <div className="flex items-center">
                  <span className="text-gray-900 font-medium mr-2">{overallRatings.security}</span>
                  <RatingStars rating={overallRatings.security} className="flex-shrink-0" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Harga</span>
                <div className="flex items-center">
                  <span className="text-gray-900 font-medium mr-2">{overallRatings.price}</span>
                  <RatingStars rating={overallRatings.price} className="flex-shrink-0" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Fasilitas Kamar</span>
                <div className="flex items-center">
                  <span className="text-gray-900 font-medium mr-2">{overallRatings.roomFacilities}</span>
                  <RatingStars rating={overallRatings.roomFacilities} className="flex-shrink-0" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Fasilitas Umum</span>
                <div className="flex items-center">
                  <span className="text-gray-900 font-medium mr-2">{overallRatings.publicFacilities}</span>
                  <RatingStars rating={overallRatings.publicFacilities} className="flex-shrink-0" />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition-shadow animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      <p className="text-sm text-gray-500">{review.time}</p>
                    </div>
                    <RatingStars rating={review.rating} />
                  </div>
                  <p className="text-gray-700 mb-4">{review.comment}</p>
                  
                  {review.ownerReply && (
                    <div className="bg-gray-50 p-4 rounded-lg mt-3">
                      <div className="flex items-center mb-2">
                        <span className="w-6 h-6 rounded-full bg-elkaavie-100 flex items-center justify-center mr-2">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 10L10 17L21 6" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        <span className="text-sm font-medium text-gray-700">Balasan Pemilik</span>
                      </div>
                      <p className="text-gray-600 text-sm">{review.ownerReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Reviews;
