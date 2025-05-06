import React, { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MessageSquare,
  Search,
  Clock,
  User,
  CreditCard,
  Building,
  Coffee,
  MapPin,
  CheckCircle,
  Loader2,
} from "lucide-react";

// Define category type for FAQs
type FAQCategory = "booking" | "pembayaran" | "kebijakan" | "fasilitas" | "lokasi";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: FAQCategory;
  popular?: boolean;
}

// Categorized FAQs
const faqs: FAQ[] = [
  {
    id: 1,
    question: "Bagaimana cara saya melakukan reservasi?",
    answer: "Anda dapat melakukan reservasi dengan menelusuri kamar yang tersedia, memilih tanggal yang Anda inginkan, dan melengkapi formulir pemesanan. Pembayaran dapat dilakukan melalui sistem pembayaran kami yang aman. Setelah pemesanan Anda dikonfirmasi, Anda akan menerima email konfirmasi dengan semua detailnya.",
    category: "booking",
    popular: true,
  },
  {
    id: 2,
    question: "Jam berapa check-in dan check-out?",
    answer: "Waktu check-in adalah pukul 14.00, dan waktu check-out adalah pukul 12.00. Jika Anda memerlukan check-in lebih awal atau check-out lebih lambat, silakan hubungi kami terlebih dahulu, dan kami akan berusaha sebaik mungkin untuk mengakomodasi permintaan Anda, tergantung pada ketersediaan.",
    category: "kebijakan",
    popular: true,
  },
  {
    id: 3,
    question: "Apakah terdapat biaya pembatalan?",
    answer: "Pembatalan yang dilakukan setidaknya 48 jam sebelum tanggal check-in akan mendapatkan pengembalian uang penuh. Pembatalan yang dilakukan dalam waktu 48 jam sebelum check-in akan dikenakan biaya yang setara dengan biaya menginap satu malam. Pembatalan yang tidak hadir akan dikenakan biaya penuh untuk reservasi.",
    category: "kebijakan",
  },
  {
    id: 4,
    question: "menyediakan layanan antar-jemput bandara?",
    answer: "Ya, kami menawarkan layanan antar-jemput bandara dengan biaya tambahan. Silakan hubungi kami setidaknya 24 jam sebelum kedatangan Anda untuk mengatur layanan ini. Pengemudi kami akan menemui Anda di terminal kedatangan dengan membawa papan nama.",
    category: "fasilitas",
  },
  {
    id: 5,
    question: "Apakah Wi-Fi tersedia?",
    answer: "Ya, Wi-Fi berkecepatan tinggi gratis tersedia di seluruh area properti untuk semua tamu kami. Nama jaringan dan kata sandi akan diberikan saat check-in.",
    category: "fasilitas",
    popular: true,
  },
  {
    id: 6,
    question: "Apakah hewan peliharaan diperbolehkan?",
    answer: "Kami menyediakan kamar-kamar tertentu yang ramah hewan peliharaan. Harap beri tahu kami terlebih dahulu jika Anda akan membawa hewan peliharaan, karena biaya dan pembatasan tambahan mungkin berlaku. Hewan peliharaan harus diikat dengan tali di area umum.",
    category: "kebijakan",
  },
  {
    id: 7,
    question: "Metode pembayaran apa yang Anda terima?",
    answer: "Kami menerima semua kartu kredit utama (Visa, MasterCard, American Express), kartu debit, dan transfer bank. Pembayaran tunai diterima saat check-in untuk layanan tambahan apa pun.",
    category: "pembayaran",
    popular: true,
  },
  {
    id: 8,
    question: "Apakah sarapan termasuk dalam tarif kamar?",
    answer: "Sarapan sudah termasuk dalam sebagian besar paket kamar kami. Harap periksa detail pemesanan khusus Anda untuk mengonfirmasi apakah sarapan sudah termasuk dalam reservasi Anda. Prasmanan sarapan kami disajikan mulai pukul 06.30 hingga 10.30 setiap hari.",
    category: "fasilitas",
  },
  {
    id: 9,
    question: "Seberapa jauh properti dari pusat kota?",
    answer: "Properti kami berlokasi strategis, hanya 2 kilometer dari pusat kota. Dibutuhkan waktu sekitar 10 menit dengan mobil atau 20 menit dengan transportasi umum untuk mencapai sebagian besar tempat wisata di kota ini.",
    category: "lokasi",
  },
  {
    id: 10,
    question: "Apakah Anda menyediakan fasilitas parkir?",
    answer: "Ya, kami menyediakan tempat parkir gratis untuk tamu kami. Area parkir kami yang aman tersedia 24/7 dan dipantau oleh kamera CCTV.",
    category: "fasilitas",
  },
  {
    id: 11,
    question: "Bisakah saya meminta kamar dengan pemandangan tertentu?",
    answer: "Ya, Anda dapat meminta kamar dengan pemandangan tertentu (kota, taman, atau kolam renang) selama pemesanan. Meskipun kami berusaha sebaik mungkin untuk mengakomodasi semua permintaan, permintaan tersebut bergantung pada ketersediaan dan tidak dapat dijamin.",
    category: "booking",
  },
  {
    id: 12,
    question: "Apakah ada deposit yang diperlukan saat pemesanan?",
    answer: "Ya, deposit yang setara dengan biaya menginap satu malam diperlukan untuk mengamankan pemesanan Anda. Jumlah ini akan dipotong dari tagihan akhir Anda saat check-out.",
    category: "pembayaran",
  },
];

// Category configuration
const categoryConfig: Record<FAQCategory | 'all', { label: string; icon: React.ReactNode }> = {
  all: { label: "Semua Pertanya'an", icon: <CheckCircle size={18} /> },
  booking: { label: "Reservasi", icon: <Clock size={18} /> },
  pembayaran: { label: "Pembayaran", icon: <CreditCard size={18} /> },
  kebijakan: { label: "Kebijakan", icon: <User size={18} /> },
  fasilitas: { label: "Fasilitas", icon: <Coffee size={18} /> },
  lokasi: { label: "Lokasi", icon: <Building size={18} /> },
};

interface FormData {
  name: string;
  phone: string;
  subject: string;
  message: string;
}

const HelpCenter = () => {
  // States for FAQ interaction
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | 'semua'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>(faqs);

  // States for contact form
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Filter FAQs based on search and category
  useEffect(() => {
    let result = faqs;
    
    // Apply category filter
    if (selectedCategory !== 'semua') {
      result = result.filter(faq => faq.category === selectedCategory);
    }
    
    // Apply search filter if search query exists
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        faq => 
          faq.question.toLowerCase().includes(query) || 
          faq.answer.toLowerCase().includes(query)
      );
    }
    
    setFilteredFaqs(result);
  }, [selectedCategory, searchQuery]);

  // Popular FAQs
  const popularFaqs = faqs.filter(faq => faq.popular).slice(0, 4);

  // Toggle FAQ expansion
  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Format pesan untuk WhatsApp
      const message = `*Permintaan Bantuan Baru*\n
*Nama:* ${formData.name}\n
*Subjek:* ${formData.subject}\n
*Pesan:* ${formData.message}`;

      // Encode pesan untuk URL WhatsApp
      const encodedMessage = encodeURIComponent(message);
      
      // Nomor WhatsApp admin
      const adminPhone = "6282220760272";
      
      // Buka WhatsApp dengan pesan yang sudah disiapkan
      window.open(`https://wa.me/${adminPhone}?text=${encodedMessage}`, '_blank');
      
      setSubmitSuccess(true);
      setSubmitError(null);
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitError('Gagal mengirim pesan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        {/* Hero section */}
        <div className="bg-gradient-to-r from-elkaavie-600 to-elkaavie-800 py-16 mb-12">
          <Container>
            <div className="text-center text-white max-w-3xl mx-auto px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Bagaimana kami dapat membantu?</h1>
              <p className="text-xl text-white/90 mb-8">
              Temukan jawaban atas pertanyaan umum atau hubungi tim dukungan kami
              </p>
              
              {/* Search bar */}
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-white/70" />
                </div>
                <input
                  type="text"
                  placeholder="Mencari jawaban..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 text-white placeholder-white/70 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </div>
          </Container>
        </div>

        <Container>
          {/* Popular questions (visible when no search/filter) */}
          {searchQuery === '' && selectedCategory === 'semua' && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Pertanyaan Populer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {popularFaqs.map((faq) => (
                  <div 
                    key={`popular-${faq.id}`} 
                    className="p-6 border border-gray-200 rounded-xl hover:border-elkaavie-200 hover:bg-elkaavie-50/50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedCategory(faq.category);
                      setTimeout(() => setExpandedFaq(faq.id), 100);
                    }}
                  >
                    <h3 className="font-medium text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{faq.answer}</p>
                    <span className="block mt-3 text-sm font-medium text-elkaavie-600">Selengkapnya →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Category tabs */}
              <div className="mb-6 border-b border-gray-200">
                <div className="flex overflow-x-auto hide-scrollbar space-x-1 pb-2">
                  {Object.entries(categoryConfig).map(([key, { label, icon }]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedCategory(key as FAQCategory | 'semua')}
                      className={`px-4 py-2 rounded-lg flex items-center whitespace-nowrap transition ${
                        selectedCategory === key
                          ? "bg-elkaavie-100 text-elkaavie-800 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="mr-2">{icon}</span>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ list */}
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {selectedCategory !== 'semua' 
                      ? categoryConfig[selectedCategory].label 
                      : "Pertanyaan yang Sering Diajukan"}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'}
                  </span>
                </div>

                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-600 mb-4">Tidak ditemukan pertanyaan yang sesuai dengan pencarian Anda</p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('semua');
                      }}
                      className="text-elkaavie-600 font-medium hover:text-elkaavie-700"
                    >
                      Hapus filter
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFaqs.map((faq) => (
                      <div 
                        key={faq.id} 
                        className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:shadow-sm"
                      >
                        <button
                          className="w-full flex items-center justify-between p-5 text-left group"
                          onClick={() => toggleFaq(faq.id)}
                        >
                          <span className={`font-medium group-hover:text-elkaavie-700 transition-colors ${
                            expandedFaq === faq.id ? "text-elkaavie-700" : "text-gray-900"
                          }`}>{faq.question}</span>
                          <div className={`rounded-full p-1 transition-colors ${
                            expandedFaq === faq.id 
                              ? "bg-elkaavie-100 text-elkaavie-600" 
                              : "bg-gray-100 text-gray-500 group-hover:bg-elkaavie-50 group-hover:text-elkaavie-500"
                          }`}>
                            {expandedFaq === faq.id ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </div>
                        </button>
                        <div 
                          className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            expandedFaq === faq.id 
                              ? "max-h-96 opacity-100" 
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="p-5 pt-0 border-t border-gray-100 text-gray-600">
                            <p>{faq.answer}</p>
                            <div className="mt-4 flex items-center">
                              <span className="text-sm text-gray-500">Apakah ini membantu?</span>
                              <button className="ml-3 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition">
                                Ya
                              </button>
                              <button className="ml-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition">
                                Tidak
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              {/* Contact form */}
              <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-elkaavie-50 p-6 border-b border-elkaavie-100">
                  <h2 className="text-xl font-semibold text-gray-900">Masih butuh bantuan?</h2>
                  <p className="text-gray-600 mt-2 text-sm">
                    Isi formulir di bawah ini dan tim dukungan kami akan menghubungi Anda dalam waktu 24 jam.
                  </p>
                </div>
                
                <div className="p-6">
                  {submitSuccess ? (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-green-800">
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <p>Terima kasih! Pesan Anda telah berhasil dikirim. Kami akan segera menghubungi Anda kembali.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Nama lengkap
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elkaavie-500 focus:border-elkaavie-500"
                            placeholder="Nama lengkap kamu"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Nomer WhatsApp
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elkaavie-500 focus:border-elkaavie-500"
                            placeholder="e.g., 081234567890"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elkaavie-500 focus:border-elkaavie-500"
                        >
                          <option value="">Pilih topik</option>
                          <option value="Booking Inquiry">Pertanyaan Pemesanan</option>
                          <option value="Cancellation">Pembatalan</option>
                          <option value="Payment Issue">Masalah Pembayaran</option>
                          <option value="Feedback">Masukan</option>
                          <option value="Other">Lainnya</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Pesan
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elkaavie-500 focus:border-elkaavie-500"
                          placeholder="Jelaskan pertanyaan Anda secara rinci..."
                        ></textarea>
                      </div>
                      
                      {submitError && (
                        <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-red-800 text-sm">
                          {submitError}
                        </div>
                      )}
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 bg-elkaavie-600 text-white rounded-lg hover:bg-elkaavie-700 transition flex items-center justify-center"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Mengirim...
                          </>
                        ) : "Kirim"}
                      </button>
                    </form>
                  )}

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-4">Cara Lain untuk Menghubungi Kami</h3>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-elkaavie-100 rounded-full flex items-center justify-center text-elkaavie-600 mr-3">
                          <Mail className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email</p>
                          <p className="text-sm text-gray-600">support@elkaavie.com</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-elkaavie-100 rounded-full flex items-center justify-center text-elkaavie-600 mr-3">
                          <Phone className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Nomer Wa</p>
                          <p className="text-sm text-gray-600">+62 817-9370-631</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-elkaavie-100 rounded-full flex items-center justify-center text-elkaavie-600 mr-3">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Kunjungi Kami</p>
                          <p className="text-sm text-gray-600">Mlati, Kabupaten Sleman, Jogja</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default HelpCenter; 