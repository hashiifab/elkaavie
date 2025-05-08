import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { Home, ChevronRight, Upload, Send, FileText, AlertCircle, Loader2, CreditCard, ImageIcon, Clock, ClipboardCopy, Check, ChevronDown, ChevronUp, Landmark } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import axios from 'axios';
import { useLanguage } from "@/contexts/language-context";

const api = axios.create({
  baseURL: 'http://localhost:8000'
});

const PaymentGuide = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { translations } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
    if (!savedToken) {
      toast({
        title: translations.paymentGuide.notifications.authRequired.title,
        description: translations.paymentGuide.notifications.authRequired.message,
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    setToken(savedToken);
  }, [navigate, toast]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile: File) => {
    if (selectedFile.size > 2 * 1024 * 1024) {
      toast({
        title: translations.paymentGuide.notifications.fileTooLarge.title,
        description: translations.paymentGuide.notifications.fileTooLarge.message,
        variant: "destructive",
      });
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: translations.paymentGuide.notifications.invalidFileType.title,
        description: translations.paymentGuide.notifications.invalidFileType.message,
        variant: "destructive",
      });
      return;
    }

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    setFile(selectedFile);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const sendWhatsAppNotification = (bookingId: string, imageUrl: string) => {
    try {
      const message = `*Payment Proof Uploaded*\n\nBooking ID: #${bookingId}\n\nA user has uploaded payment proof for booking #${bookingId}. Please verify the payment and update the booking status.\n\nImage: ${imageUrl}`;
      const encodedMessage = encodeURIComponent(message);
      const adminPhone = "6282220760272";
      window.open(`https://wa.me/${adminPhone}?text=${encodedMessage}`, '_blank');
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error);
      toast({
        title: translations.paymentGuide.notifications.notificationFailed.title,
        description: translations.paymentGuide.notifications.notificationFailed.message,
        variant: "destructive",
      });
    }
  };

  const handleCopyAccountNumber = () => {
    const accountNumber = translations.paymentGuide.guide.bankAccount.accountNumber;
    navigator.clipboard.writeText(accountNumber)
      .then(() => {
        setCopied(true);
        toast({
          title: translations.paymentGuide.guide.bankAccount.copied,
          variant: "default",
        });
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  const handleUpload = async () => {
    if (!file || !id || !token) return;

    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('payment_proof', file);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      const response = await api.post(`/api/bookings/${id}/payment-proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.data.success && response.data.payment_proof_url) {
        sendWhatsAppNotification(id, response.data.payment_proof_url);
      }

      toast({
        title: translations.paymentGuide.notifications.uploadSuccess.title,
        description: translations.paymentGuide.notifications.uploadSuccess.message,
        variant: "default",
      });

      setTimeout(() => {
        navigate(`/bookings/${id}`);
      }, 1000);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: translations.paymentGuide.notifications.uploadFailed.title,
        description: translations.paymentGuide.notifications.uploadFailed.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-20 pb-16 bg-gray-50 min-h-screen">
        <Container className="px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center space-x-2 text-sm font-medium text-gray-600">
              <li>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center hover:text-elkaavie-600 transition-colors"
                  aria-label="Home"
                >
                  <Home className="h-4 w-4" />
                </button>
              </li>
              <li><ChevronRight className="h-4 w-4 text-gray-400" /></li>
              <li>
                <button
                  onClick={() => navigate("/profile")}
                  className="hover:text-elkaavie-600 transition-colors"
                >
                  {translations.auth.profile.navigation.profile}
                </button>
              </li>
              <li><ChevronRight className="h-4 w-4 text-gray-400" /></li>
              <li>
                <button
                  onClick={() => navigate(`/bookings/${id}`)}
                  className="hover:text-elkaavie-600 transition-colors"
                >
                  {translations.auth.bookingDetails.navigation.bookingDetails}
                </button>
              </li>
              <li><ChevronRight className="h-4 w-4 text-gray-400" /></li>
              <li>
                <span className="text-elkaavie-600 font-semibold">{translations.paymentGuide.navigation.paymentGuide}</span>
              </li>
            </ol>
          </nav>

          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:grid md:grid-cols-3 gap-6">
              {/* Upload Form */}
              <div className="md:col-span-2 order-1 md:order-2">
                <Card className="shadow-lg border-0 h-full flex flex-col">
                  <CardHeader className="bg-elkaavie-50">
                    <CardTitle className="text-lg font-semibold">{translations.paymentGuide.uploadForm.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      {translations.paymentGuide.uploadForm.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-6 flex-grow">
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all duration-200",
                        dragActive ? "border-elkaavie-500 bg-elkaavie-50" : "border-gray-300 hover:border-elkaavie-400",
                        previewUrl ? "bg-gray-50" : ""
                      )}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      role="region"
                      aria-label="File upload area"
                    >
                      <input
                        id="payment-proof"
                        type="file"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleFileChange}
                        disabled={isUploading}
                        className="hidden"
                        aria-label="Upload payment proof"
                      />
                      {previewUrl ? (
                        <div className="space-y-4">
                          <div className="relative mx-auto max-w-sm overflow-hidden rounded-lg border shadow-sm">
                            <img
                              src={previewUrl}
                              alt="Payment proof preview"
                              className="h-auto w-full object-contain max-h-64"
                            />
                            <button
                              onClick={() => {
                                URL.revokeObjectURL(previewUrl);
                                setPreviewUrl(null);
                                setFile(null);
                              }}
                              className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full shadow hover:bg-white transition-colors"
                              disabled={isUploading}
                              aria-label="Remove uploaded image"
                            >
                              <AlertCircle className="h-5 w-5 text-red-500" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600">
                            {file?.name} - {(file?.size / 1024 / 1024).toFixed(2)}{'MB'}
                          </p>
                        </div>
                      ) : (
                        <label
                          htmlFor="payment-proof"
                          className="flex flex-col items-center justify-center gap-3 cursor-pointer py-6"
                        >
                          <div className="p-4 bg-elkaavie-100 rounded-full">
                            <FileText className="h-8 w-8 text-elkaavie-600" />
                          </div>
                          <div className="text-center space-y-1">
                            <p className="font-semibold text-gray-800">
                              {translations.paymentGuide.uploadForm.dragDrop.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {translations.paymentGuide.uploadForm.dragDrop.format}
                            </p>
                          </div>
                        </label>
                      )}
                    </div>

                    {isUploading && (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm font-medium text-gray-700">
                          <span>{translations.paymentGuide.uploadForm.uploading}</span>
                          <span>{Math.round(uploadProgress)}%</span>
                        </div>
                        <Progress
                          value={uploadProgress}
                          className="h-2 rounded-full"

                        />
                      </div>
                    )}

                    <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                      <AlertCircle className="h-5 w-5" />
                      <AlertTitle className="text-sm font-semibold">{translations.paymentGuide.uploadForm.important.title}</AlertTitle>
                      <AlertDescription className="text-sm">
                        {translations.paymentGuide.uploadForm.important.message}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4 sm:flex-row bg-gray-50 border-t p-5">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/bookings/${id}`)}
                      disabled={isUploading}
                      className="w-full sm:w-auto"
                    >
                      {translations.paymentGuide.uploadForm.buttons.cancel}
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={!file || isUploading}
                      className="w-full sm:w-auto bg-elkaavie-600 hover:bg-elkaavie-700"
                    >
                      {isUploading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {translations.paymentGuide.uploadForm.buttons.uploading}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          {translations.paymentGuide.uploadForm.buttons.send}
                        </span>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* Payment Guide */}
              <div className="md:col-span-1 order-2 md:order-1">
                <Card className="shadow-sm h-full flex flex-col">
                  <CardHeader className="bg-elkaavie-50 border-b">
                    <CardTitle className="text-xl">{translations.paymentGuide.guide.title}</CardTitle>
                    <CardDescription>{translations.paymentGuide.guide.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      {/* Bank Account Details Dropdown - More Compact */}
                      <div className="border rounded-lg overflow-hidden mb-2">
                        <button
                          className="w-full flex items-center justify-between p-2 bg-elkaavie-50 hover:bg-elkaavie-100 transition-colors text-left"
                          onClick={() => setShowBankDetails(!showBankDetails)}
                          aria-expanded={showBankDetails}
                        >
                          <div className="flex items-center">
                            <Landmark className="h-4 w-4 text-elkaavie-600 mr-1.5" />
                            <span className="font-medium text-sm">{translations.paymentGuide.guide.bankAccount.title}</span>
                          </div>
                          {showBankDetails ? (
                            <ChevronUp className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-500" />
                          )}
                        </button>

                        {showBankDetails && (
                          <div className="p-2 border-t bg-white">
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2 text-xs">
                              <div className="flex items-center">
                                <span className="text-gray-500 mr-1">Bank:</span>
                                <span className="text-gray-700">
                                  {translations.paymentGuide.guide.bankAccount.bankName}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <span className="text-gray-500 mr-1">Atas Nama:</span>
                                <span className="text-gray-700">
                                  {translations.paymentGuide.guide.bankAccount.accountName}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center bg-elkaavie-50 rounded border p-1.5">
                              <span className="text-xs font-medium flex-grow ml-1">
                                {translations.paymentGuide.guide.bankAccount.accountNumber}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-elkaavie-600 hover:text-elkaavie-700 hover:bg-elkaavie-100"
                                onClick={handleCopyAccountNumber}
                              >
                                {copied ? (
                                  <Check className="h-3 w-3 mr-1" />
                                ) : (
                                  <ClipboardCopy className="h-3 w-3 mr-1" />
                                )}
                                <span className="text-xs">
                                  {copied
                                    ? translations.paymentGuide.guide.bankAccount.copied
                                    : translations.paymentGuide.guide.bankAccount.copy}
                                </span>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Steps */}
                      {[
                          {
                            icon: <CreditCard className="w-5 h-5 text-elkaavie-600" />,
                            title: translations.paymentGuide.guide.steps.transfer.title,
                            description: translations.paymentGuide.guide.steps.transfer.description
                          },
                          {
                            icon: <ImageIcon className="w-5 h-5 text-elkaavie-600" />,
                            title: translations.paymentGuide.guide.steps.screenshot.title,
                            description: translations.paymentGuide.guide.steps.screenshot.description
                          },
                          {
                            icon: <Upload className="w-5 h-5 text-elkaavie-600" />,
                            title: translations.paymentGuide.guide.steps.upload.title,
                            description: translations.paymentGuide.guide.steps.upload.description
                          },
                          {
                            icon: <Send className="w-5 h-5 text-elkaavie-600" />,
                            title: translations.paymentGuide.guide.steps.notify.title,
                            description: translations.paymentGuide.guide.steps.notify.description
                          },
                          {
                            icon: <Clock className="w-5 h-5 text-elkaavie-600" />,
                            title: translations.paymentGuide.guide.steps.wait.title,
                            description: translations.paymentGuide.guide.steps.wait.description
                          }
                        ].map((step, index) => (
                          <div key={index} className="flex gap-2">
                            <div className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-elkaavie-100 text-elkaavie-700">
                              {step.icon}
                            </div>
                            <div>
                              <h3 className="font-medium text-sm">{step.title}</h3>
                              <p className="text-xs text-gray-500">{step.description}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 text-sm text-gray-500 italic p-4">
                    {translations.paymentGuide.guide.support}
                  </CardFooter>
                </Card>
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