import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { Home, ChevronRight, Upload, Send, FileText, AlertCircle, CheckCircle2, Loader2, BadgeCheck, CreditCard, ImageIcon, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000'
});

const PaymentGuide = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [token, setToken] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    // Get token from localStorage with correct key
    const savedToken = localStorage.getItem('auth_token');
    if (!savedToken) {
      toast({
        title: "Authentication required",
        description: "Please login to upload payment proof",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    setToken(savedToken);
  }, [navigate, toast]);

  // Clear file preview when component unmounts
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
    // Validate file size (2MB limit - matching backend validation)
    if (selectedFile.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 2MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG)",
        variant: "destructive",
      });
      return;
    }

    // Clear previous preview if exists
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    
    // Create preview URL
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
      // Format message for admin
      const message = `*Payment Proof Uploaded*\n\nBooking ID: #${bookingId}\n\nA user has uploaded payment proof for booking #${bookingId}. Please verify the payment and update the booking status.\n\nImage: ${imageUrl}`;
      
      // Encode message for WhatsApp URL
      const encodedMessage = encodeURIComponent(message);
      
      // Admin WhatsApp number
      const adminPhone = "6282220760272"; // Use your admin's WhatsApp number
      
      // Open WhatsApp with prepared message
      window.open(`https://wa.me/${adminPhone}?text=${encodedMessage}`, '_blank');
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error);
    }
  };

  const handleUpload = async () => {
    if (!file || !id || !token) return;

    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('payment_proof', file);

    try {
      // Simulate progress during upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.random() * 15;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      // Upload payment proof
      const response = await api.post(`/api/bookings/${id}/payment-proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);
      
      console.log('Upload response:', response.data);

      // Send WhatsApp notification to admin
      if (response.data.success && response.data.payment_proof_url) {
        sendWhatsAppNotification(id, response.data.payment_proof_url);
      }

      toast({
        title: "Payment proof uploaded",
        description: "Admin will verify your payment soon.",
        variant: "default",
      });
      
      // Add a small delay to show completed progress bar before navigating
      setTimeout(() => {
        // Navigate back to booking details
        navigate(`/bookings/${id}`);
      }, 1000);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload payment proof. Please try again.",
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
        <Container>
          {/* Breadcrumb */}
          <nav className="mb-8">
            <ol className="flex items-center text-sm text-gray-500 font-medium">
              <li className="flex items-center">
                <button 
                  onClick={() => navigate("/")} 
                  className="hover:text-elkaavie-600 transition-colors flex items-center"
                  aria-label="Home"
                >
                  <Home className="h-4 w-4" />
                </button>
                <ChevronRight className="h-3 w-3 mx-2 text-gray-400" />
              </li>
              <li className="flex items-center">
                <button 
                  onClick={() => navigate("/profile")} 
                  className="hover:text-elkaavie-600 transition-colors"
                >
                  Profile
                </button>
                <ChevronRight className="h-3 w-3 mx-2 text-gray-400" />
              </li>
              <li className="flex items-center">
                <button 
                  onClick={() => navigate(`/bookings/${id}`)} 
                  className="hover:text-elkaavie-600 transition-colors"
                >
                  Booking Details
                </button>
                <ChevronRight className="h-3 w-3 mx-2 text-gray-400" />
              </li>
              <li>
                <span className="font-semibold text-elkaavie-600">Payment Guide</span>
              </li>
            </ol>
          </nav>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left column: Payment Instructions */}
              <div className="md:col-span-1">
                <Card className="shadow-sm">
                  <CardHeader className="bg-elkaavie-50 border-b">
                    <CardTitle className="text-xl">Payment Guide</CardTitle>
                    <CardDescription>Follow these steps to complete your payment</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="space-y-4">
                        {[
                          {
                            icon: <CreditCard className="w-5 h-5 text-elkaavie-600" />,
                            title: "Transfer Payment",
                            description: "Transfer the payment amount to our bank account"
                          },
                          {
                            icon: <ImageIcon className="w-5 h-5 text-elkaavie-600" />,
                            title: "Take Screenshot",
                            description: "Take a screenshot of your payment confirmation"
                          },
                          {
                            icon: <Upload className="w-5 h-5 text-elkaavie-600" />,
                            title: "Upload Proof",
                            description: "Upload your payment proof using the form"
                          },
                          {
                            icon: <Send className="w-5 h-5 text-elkaavie-600" />,
                            title: "Send Notification",
                            description: "Notify the admin about your payment"
                          },
                          {
                            icon: <Clock className="w-5 h-5 text-elkaavie-600" />,
                            title: "Wait for Verification",
                            description: "Admin will verify your payment within 24 hours"
                          }
                        ].map((step, index) => (
                          <div key={index} className="flex gap-3">
                            <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-elkaavie-100 text-elkaavie-700">
                              {step.icon}
                            </div>
                            <div>
                              <h3 className="font-medium">{step.title}</h3>
                              <p className="text-sm text-gray-500">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="bg-gray-50 text-sm text-gray-500 italic">
                    For assistance, please contact our support.
                  </CardFooter>
                </Card>
              </div>

              {/* Right column: Upload Form */}
              <div className="md:col-span-2">
                <Card className="shadow-sm">
                  <CardHeader className="bg-elkaavie-50 border-b">
                    <CardTitle className="text-xl">Upload Payment Proof</CardTitle>
                    <CardDescription>
                      Please upload a clear image of your payment receipt
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {/* File Upload Area */}
                      <div 
                        className={cn(
                          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
                          dragActive ? "border-elkaavie-500 bg-elkaavie-50" : "border-gray-300 hover:border-gray-400",
                          previewUrl ? "bg-gray-50" : ""
                        )}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          id="payment-proof"
                          type="file"
                          accept="image/jpeg,image/png,image/jpg"
                          onChange={handleFileChange}
                          disabled={isUploading}
                          className="hidden"
                        />

                        {previewUrl ? (
                          <div className="space-y-4">
                            <div className="relative mx-auto max-w-xs overflow-hidden rounded-lg border shadow-sm">
                              <img 
                                src={previewUrl} 
                                alt="Payment proof preview" 
                                className="h-auto w-full object-cover" 
                              />
                              <button
                                onClick={() => {
                                  URL.revokeObjectURL(previewUrl);
                                  setPreviewUrl(null);
                                  setFile(null);
                                }}
                                className="absolute top-2 right-2 bg-white/90 p-1 rounded-full shadow hover:bg-white"
                                disabled={isUploading}
                                aria-label="Remove image"
                              >
                                <AlertCircle className="h-5 w-5 text-red-500" />
                              </button>
                            </div>
                            <p className="text-sm text-gray-500">
                              {file?.name} - {(file?.size / 1024 / 1024).toFixed(2)}MB
                            </p>
                          </div>
                        ) : (
                          <label
                            htmlFor="payment-proof"
                            className="flex flex-col items-center justify-center gap-2 cursor-pointer py-4"
                          >
                            <div className="p-3 bg-elkaavie-100 rounded-full">
                              <FileText className="h-7 w-7 text-elkaavie-600" />
                            </div>
                            <div className="space-y-1">
                              <p className="font-medium text-base">
                                Click to upload or drag & drop
                              </p>
                              <p className="text-sm text-gray-500">
                                JPG or PNG (Max 2MB)
                              </p>
                            </div>
                          </label>
                        )}
                      </div>

                      {/* Upload Progress */}
                      {isUploading && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">Uploading...</span>
                            <span>{Math.round(uploadProgress)}%</span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}

                      {/* Upload note */}
                      <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription className="text-sm">
                          Please ensure that all payment details are clearly visible in the 
                          uploaded image, including transaction ID, amount, and date.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4 sm:flex-row bg-gray-50 border-t">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/bookings/${id}`)}
                      disabled={isUploading}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpload}
                      disabled={!file || isUploading}
                      className="w-full sm:w-auto bg-elkaavie-600 hover:bg-elkaavie-700"
                    >
                      {isUploading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Submit Payment Proof
                        </span>
                      )}
                    </Button>
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