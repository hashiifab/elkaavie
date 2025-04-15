import React from "react";
import Container from "../ui/Container";
import { MapPin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-bold text-elkaavie-800 mb-4">
              Elkaavie<span className="text-elkaavie-500">.</span>
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              Kos eksklusif dengan lokasi strategis di tengah kota. Nyaman,
              tenang, dan dekat dengan berbagai fasilitas.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-elkaavie-100 flex items-center justify-center text-elkaavie-600 hover:bg-elkaavie-200 transition"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-elkaavie-100 flex items-center justify-center text-elkaavie-600 hover:bg-elkaavie-200 transition"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-elkaavie-100 flex items-center justify-center text-elkaavie-600 hover:bg-elkaavie-200 transition"
                aria-label="WhatsApp"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.2.3-.754.966-.925 1.164-.17.199-.34.223-.64.075-.301-.15-1.269-.467-2.419-1.483-.893-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.613.136-.135.301-.353.452-.528.151-.175.2-.301.3-.502.099-.2.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.522.074-.796.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.209 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.571-.347h-.002Z" />
                  <path d="M5.027 22.025l.999-.943a11.945 11.945 0 0 1-1.3-5.094c0-6.627 5.373-12 12-12s12 5.373 12 12-5.373 12-12 12c-1.79 0-3.526-.393-5.079-1.128" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              Tautan Cepat
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#home"
                  className="text-gray-600 hover:text-elkaavie-700 transition"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/rooms"
                  className="text-gray-600 hover:text-elkaavie-700 transition"
                >
                  Rooms
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  className="text-gray-600 hover:text-elkaavie-700 transition"
                >
                  Gallery
                </a>
              </li>
              <li>
                <a
                  href="/help-center"
                  className="text-gray-600 hover:text-elkaavie-700 transition"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Kontak</h4>
            <ul className="space-y-4">
              <li className="flex">
                <MapPin className="flex-shrink-0 w-5 h-5 text-elkaavie-500 mt-0.5" />
                <span className="ml-3 text-gray-600">
                  Mlati, Kabupaten Sleman, Jogja
                </span>
              </li>
              <li className="flex">
                <Phone className="flex-shrink-0 w-5 h-5 text-elkaavie-500 mt-0.5" />
                <span className="ml-3 text-gray-600">+62 812 3456 7890</span>
              </li>
              <li className="flex">
                <Mail className="flex-shrink-0 w-5 h-5 text-elkaavie-500 mt-0.5" />
                <span className="ml-3 text-gray-600">info@elkaavie.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Elkaavie. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
