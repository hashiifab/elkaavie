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
type FAQCategory = "booking" | "payment" | "policies" | "facilities" | "location";

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
    question: "How do I make a reservation?",
    answer: "You can make a reservation by browsing our available rooms, selecting your preferred dates, and completing the booking form. Payment can be made through our secure payment system. Once your booking is confirmed, you'll receive a confirmation email with all details.",
    category: "booking",
    popular: true,
  },
  {
    id: 2,
    question: "What is the check-in and check-out time?",
    answer: "Check-in time is at 2:00 PM, and check-out time is at 12:00 PM. If you need early check-in or late check-out, please contact us in advance, and we'll do our best to accommodate your request, subject to availability.",
    category: "policies",
    popular: true,
  },
  {
    id: 3,
    question: "Is there a cancellation fee?",
    answer: "Cancellations made at least 48 hours before the check-in date receive a full refund. Cancellations made within 48 hours of check-in will incur a fee equivalent to one night's stay. No-shows will be charged the full amount of the reservation.",
    category: "policies",
  },
  {
    id: 4,
    question: "Do you provide airport transfers?",
    answer: "Yes, we offer airport transfer services for an additional fee. Please contact us at least 24 hours before your arrival to arrange this service. Our driver will meet you at the arrival terminal with a name sign.",
    category: "facilities",
  },
  {
    id: 5,
    question: "Is Wi-Fi available?",
    answer: "Yes, complimentary high-speed Wi-Fi is available throughout the property for all our guests. The network name and password will be provided during check-in.",
    category: "facilities",
    popular: true,
  },
  {
    id: 6,
    question: "Are pets allowed?",
    answer: "We have select pet-friendly rooms available. Please inform us in advance if you'll be bringing a pet, as additional fees and restrictions may apply. Pets must be kept on a leash in common areas.",
    category: "policies",
  },
  {
    id: 7,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and bank transfers. Cash payments are accepted at check-in for any additional services.",
    category: "payment",
    popular: true,
  },
  {
    id: 8,
    question: "Is breakfast included in the room rate?",
    answer: "Breakfast is included in most of our room packages. Please check your specific booking details to confirm if breakfast is included in your reservation. Our breakfast buffet is served from 6:30 AM to 10:30 AM daily.",
    category: "facilities",
  },
  {
    id: 9,
    question: "How far is the property from the city center?",
    answer: "Our property is conveniently located just 2 kilometers from the city center. It takes approximately 10 minutes by car or 20 minutes by public transportation to reach most city attractions.",
    category: "location",
  },
  {
    id: 10,
    question: "Do you offer parking facilities?",
    answer: "Yes, we provide complimentary parking for our guests. Our secure parking area is available 24/7 and is monitored by CCTV cameras.",
    category: "facilities",
  },
  {
    id: 11,
    question: "Can I request a room with a specific view?",
    answer: "Yes, you can request a room with a specific view (city, garden, or pool) during booking. While we try our best to accommodate all requests, they are subject to availability and cannot be guaranteed.",
    category: "booking",
  },
  {
    id: 12,
    question: "Is there a deposit required when booking?",
    answer: "Yes, a deposit equivalent to one night's stay is required to secure your booking. This amount will be deducted from your final bill upon check-out.",
    category: "payment",
  },
];

// Category configuration
const categoryConfig: Record<FAQCategory | 'all', { label: string; icon: React.ReactNode }> = {
  all: { label: "All Questions", icon: <CheckCircle size={18} /> },
  booking: { label: "Reservations", icon: <Clock size={18} /> },
  payment: { label: "Payment", icon: <CreditCard size={18} /> },
  policies: { label: "Policies", icon: <User size={18} /> },
  facilities: { label: "Amenities", icon: <Coffee size={18} /> },
  location: { label: "Location", icon: <Building size={18} /> },
};

const HelpCenter = () => {
  // States for FAQ interaction
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>(faqs);

  // States for contact form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Filter FAQs based on search and category
  useEffect(() => {
    let result = faqs;
    
    // Apply category filter
    if (selectedCategory !== 'all') {
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
    setSubmitError('');
    
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, you would send this data to your backend
      console.log("Form submitted:", formData);
      
      // Reset form and show success
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitSuccess(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError('There was an error submitting your message. Please try again.');
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">How Can We Help?</h1>
              <p className="text-xl text-white/90 mb-8">
                Find answers to common questions or reach out to our support team
              </p>
              
              {/* Search bar */}
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-white/70" />
                </div>
                <input
                  type="text"
                  placeholder="Search for answers..."
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
          {searchQuery === '' && selectedCategory === 'all' && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 text-gray-900">Popular Questions</h2>
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
                    <span className="block mt-3 text-sm font-medium text-elkaavie-600">Read more →</span>
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
                      onClick={() => setSelectedCategory(key as FAQCategory | 'all')}
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
                    {selectedCategory !== 'all' 
                      ? categoryConfig[selectedCategory].label 
                      : "Frequently Asked Questions"}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {filteredFaqs.length} {filteredFaqs.length === 1 ? 'result' : 'results'}
                  </span>
                </div>

                {filteredFaqs.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-xl">
                    <p className="text-gray-600 mb-4">No questions found matching your search</p>
                    <button 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="text-elkaavie-600 font-medium hover:text-elkaavie-700"
                    >
                      Clear filters
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
                              <span className="text-sm text-gray-500">Was this helpful?</span>
                              <button className="ml-3 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition">
                                Yes
                              </button>
                              <button className="ml-2 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition">
                                No
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
                  <h2 className="text-xl font-semibold text-gray-900">Still Need Help?</h2>
                  <p className="text-gray-600 mt-2 text-sm">
                    Fill out the form below and our support team will get back to you within 24 hours.
                  </p>
                </div>
                
                <div className="p-6">
                  {submitSuccess ? (
                    <div className="bg-green-50 border border-green-100 rounded-lg p-4 text-green-800">
                      <div className="flex">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <p>Thank you! Your message has been sent successfully. We'll get back to you shortly.</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
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
                            placeholder="Your full name"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elkaavie-500 focus:border-elkaavie-500"
                            placeholder="your.email@example.com"
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
                          <option value="">Select a topic</option>
                          <option value="booking">Booking Inquiry</option>
                          <option value="cancellation">Cancellation</option>
                          <option value="payment">Payment Issue</option>
                          <option value="feedback">Feedback</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elkaavie-500 focus:border-elkaavie-500"
                          placeholder="Please describe your inquiry in detail..."
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
                            Sending...
                          </>
                        ) : "Send Message"}
                      </button>
                    </form>
                  )}

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="font-medium text-gray-900 mb-4">Other Ways to Contact Us</h3>
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
                          <p className="text-sm font-medium text-gray-900">Phone</p>
                          <p className="text-sm text-gray-600">+62 812-3456-7890</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-elkaavie-100 rounded-full flex items-center justify-center text-elkaavie-600 mr-3">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Visit Us</p>
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