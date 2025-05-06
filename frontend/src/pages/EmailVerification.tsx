import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { authApi } from "@/lib/api";

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifikasi" | "berhasil" | "error">("verifikasi");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const code = searchParams.get("code");

        if (!code) {
          throw new Error("Verifikasi tidak valid");
        }

        // Call the API to verify the email with the code and log in
        await authApi.authenticateWithVerificationCode(code);
        
        setStatus("berhasil");
        
        // Redirect to home page after 2 seconds
        setTimeout(() => {
          navigate("/", { 
            state: { 
              message: "Email berhasil diverifikasi. Anda sekarang sudah masuk." 
            } 
          });
        }, 2000);
      } catch (err) {
        setStatus("error");
        setError(err instanceof Error ? err.message : "Gagal memverifikasi email. Kode mungkin telah kedaluwarsa atau tidak valid.");
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {status === "verifikasi" && "Verifikasi Email..."}
                {status === "berhasil" && "Email Terverifikasi"}
                {status === "error" && "Verifikasi Gagal"}
              </h1>
              <p className="text-gray-600">
                {status === "verifikasi" && "Mohon tunggu selagi kami memverifikasi email Anda..."}
                {status === "berhasil" && "Email Anda telah berhasil diverifikasi. Mengalihkan ke beranda..."}
                {status === "error" && error}
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="text-center space-y-4">
                {status === "verifikasi" && (
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-elkaavie-600 mx-auto"></div>
                )}
                
                {status === "berhasil" && (
                  <div className="text-green-600">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                )}

                {status === "error" && (
                  <div className="text-red-600">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default EmailVerification; 