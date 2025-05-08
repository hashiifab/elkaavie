import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { authApi } from "@/lib/api";
import { Mail, AlertCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const ForgotPassword = () => {
  const { translations } = useLanguage();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await authApi.forgotPassword(email);
      setSuccessMessage(response.message || translations.auth.forgotPassword.success.message);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || translations.auth.forgotPassword.errors.generalError;
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      {errorMessage && (
        <div className="fixed top-20 left-0 right-0 flex justify-center items-center z-50 px-4">
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-lg flex items-start max-w-md">
            <AlertCircle className="h-5 w-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-grow">
              <p className="font-bold">{translations.auth.forgotPassword.errors.title}</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed top-20 left-0 right-0 flex justify-center items-center z-50 px-4">
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg flex items-start max-w-md">
            <div className="flex-grow">
              <p className="font-bold">{translations.auth.forgotPassword.success.title}</p>
              <p className="text-sm">{successMessage}</p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <main className="p-24">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{translations.auth.forgotPassword.title}</h1>
              <p className="text-gray-600">{translations.auth.forgotPassword.subtitle}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {translations.auth.forgotPassword.emailLabel}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-elkaavie-500 focus:border-elkaavie-500"
                      placeholder={translations.auth.forgotPassword.emailPlaceholder}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-elkaavie-600 text-white font-medium rounded-lg hover:bg-elkaavie-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? translations.auth.forgotPassword.sending : translations.auth.forgotPassword.sendButton}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {translations.auth.forgotPassword.rememberPassword}{" "}
                  <Link to="/login" className="text-elkaavie-600 hover:text-elkaavie-700 font-medium">
                    {translations.auth.forgotPassword.signIn}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default ForgotPassword;