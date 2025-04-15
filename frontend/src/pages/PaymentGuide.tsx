import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { CreditCard, Phone, FileText, ChevronRight, Home, CheckCircle2, Banknote } from "lucide-react";

const PaymentGuide = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <Container>
          {/* Breadcrumb */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-gray-600">
              <button onClick={() => navigate("/")} className="hover:text-elkaavie-600">
                <Home className="h-4 w-4" />
              </button>
              <ChevronRight className="h-4 w-4 mx-2" />
              <button onClick={() => navigate("/profile")} className="hover:text-elkaavie-600">
                Profile
              </button>
              <ChevronRight className="h-4 w-4 mx-2" />
              <button onClick={() => navigate(`/bookings/${id}`)} className="hover:text-elkaavie-600">
                Booking Details
              </button>
              <ChevronRight className="h-4 w-4 mx-2" />
              <span>Payment Guide</span>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-elkaavie-600 to-elkaavie-800 px-6 py-8 text-white">
                <div className="flex items-center justify-center mb-4">
                  <CreditCard className="h-8 w-8 mr-2" />
                  <h1 className="text-2xl font-semibold">Payment Guide</h1>
                </div>
                <p className="text-center text-elkaavie-100">
                  Follow these steps to complete your payment
                </p>
              </div>

              <div className="p-6 space-y-8">
                {/* Bank Account Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Banknote className="h-5 w-5 text-elkaavie-600 mr-2" />
                    <h2 className="text-lg font-semibold">Bank Account Information</h2>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Bank Name</span>
                      <span className="font-medium">Bank Central Asia (BCA)</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Account Number</span>
                      <span className="font-medium">1234567890</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-600">Account Holder</span>
                      <span className="font-medium">Elkaavie Property</span>
                    </div>
                  </div>
                </div>

                {/* Payment Steps */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Payment Steps</h2>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-elkaavie-100 text-elkaavie-600 rounded-full flex items-center justify-center mr-4">
                        1
                      </div>
                      <div>
                        <h3 className="font-medium">Transfer the Payment</h3>
                        <p className="text-gray-600 mt-1">
                          Transfer the exact amount to the bank account provided above. Make sure to include your booking ID (#{id}) in the transfer description.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-elkaavie-100 text-elkaavie-600 rounded-full flex items-center justify-center mr-4">
                        2
                      </div>
                      <div>
                        <h3 className="font-medium">Take a Screenshot</h3>
                        <p className="text-gray-600 mt-1">
                          Take a screenshot of your payment confirmation or receipt.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-elkaavie-100 text-elkaavie-600 rounded-full flex items-center justify-center mr-4">
                        3
                      </div>
                      <div>
                        <h3 className="font-medium">Send to Admin</h3>
                        <p className="text-gray-600 mt-1">
                          Send the screenshot to our admin via WhatsApp at{" "}
                          <a href="https://wa.me/6281234567890" className="text-elkaavie-600 hover:underline">
                            +62 812-3456-7890
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-8 h-8 bg-elkaavie-100 text-elkaavie-600 rounded-full flex items-center justify-center mr-4">
                        4
                      </div>
                      <div>
                        <h3 className="font-medium">Wait for Confirmation</h3>
                        <p className="text-gray-600 mt-1">
                          Our admin will verify your payment and update your booking status within 24 hours.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Important Notes */}
                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <FileText className="h-5 w-5 text-yellow-600 mr-2" />
                    <h2 className="text-lg font-semibold text-yellow-800">Important Notes</h2>
                  </div>
                  <ul className="space-y-2 text-yellow-700">
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5" />
                      <span>Make sure to transfer the exact amount shown in your booking details.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5" />
                      <span>Include your booking ID (#{id}) in the transfer description.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5" />
                      <span>Keep your payment receipt until your booking is confirmed.</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 mr-2 mt-0.5" />
                      <span>Your booking will be automatically cancelled if payment is not received within 24 hours.</span>
                    </li>
                  </ul>
                </div>

                {/* Contact Support */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Phone className="h-5 w-5 text-elkaavie-600 mr-2" />
                    <h2 className="text-lg font-semibold">Need Help?</h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    If you encounter any issues during the payment process, please contact our support team:
                  </p>
                  <a
                    href="https://wa.me/6281234567890"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Contact via WhatsApp
                  </a>
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

export default PaymentGuide;