import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/ui/Container";
import { authApi } from "@/lib/api";
import { User, Mail, Home, ChevronRight, AlertCircle, Trash2, X } from "lucide-react";
import { AxiosError } from "axios";
import { useLanguage } from "@/contexts/language-context";

interface UserData {
  id?: number;
  name?: string;
  email?: string;
  role?: string;
  created_at?: string;
  updated_at?: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const user = await authApi.getUser();
      setUserData(user);
      setFormData({
        name: user.name || "",
        email: user.email || "",
      });
      return user;
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load your profile information.");
      navigate("/login");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchUserData();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await authApi.updateProfile(formData);
      setSuccessMessage("Profile updated successfully!");

      // Refresh user data
      await fetchUserData();

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setError(null);

    try {
      await authApi.deleteAccount();
      // Redirect to home page after successful deletion
      navigate("/");
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      setError(axiosError.response?.data?.message || "Failed to delete account. Please try again.");
      setShowDeleteConfirm(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-16">
          <Container>
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-elkaavie-600"></div>
            </div>
          </Container>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-16">
        <Container>
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center text-sm text-gray-600">
            <button onClick={() => navigate("/")} className="hover:text-elkaavie-600">
              <Home className="h-4 w-4" />
            </button>
            <ChevronRight className="h-4 w-4 mx-2" />
            <button onClick={() => navigate("/profile")} className="hover:text-elkaavie-600">
              Profile
            </button>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span>Settings</span>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-red-700">{error}</p>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-700">{successMessage}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-elkaavie-500 focus:border-elkaavie-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-elkaavie-500 focus:border-elkaavie-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4">
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {translations.settings?.deleteAccount || "Delete Account"}
                    </button>

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => navigate("/profile")}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                      >
                        {translations.common?.cancel || "Cancel"}
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-elkaavie-600 text-white rounded-lg hover:bg-elkaavie-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {saving ? translations.common?.saving || "Saving..." : translations.common?.save || "Save Changes"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Delete Account Confirmation Dialog */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="text-center mb-6">
                  <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {translations.settings?.deleteAccountConfirm?.title || "Delete Your Account?"}
                  </h3>
                  <p className="text-gray-600">
                    {translations.settings?.deleteAccountConfirm?.message ||
                      "This action cannot be undone. All your data including bookings will be permanently deleted."}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-center">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    {translations.common?.cancel || "Cancel"}
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {deleting ?
                      (translations.settings?.deleteAccountConfirm?.deleting || "Deleting...") :
                      (translations.settings?.deleteAccountConfirm?.confirm || "Yes, Delete My Account")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
};

export default Settings;