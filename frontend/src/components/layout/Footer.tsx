import React from "react";
import Container from "../ui/Container";
import { MapPin, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

const Footer = () => {
  const { translations } = useLanguage();
  return (
    <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-6">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-xl font-bold text-elkaavie-800 mb-4">
              Elkaavie<span className="text-elkaavie-500">.</span>
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm">
              {translations.footer.description}
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
                href="https://wa.me/6282220760272"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-elkaavie-100 flex items-center justify-center text-elkaavie-600 hover:bg-elkaavie-200 transition"
                aria-label="WhatsApp"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">
              {translations.footer.quickLinks}
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="#home"
                  className="text-gray-600 hover:text-elkaavie-700 transition"
                >
                  {translations.navigation.home}
                </a>
              </li>
              <li>
                <a
                  href="/rooms"
                  className="text-gray-600 hover:text-elkaavie-700 transition"
                >
                  {translations.navigation.rooms}
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  className="text-gray-600 hover:text-elkaavie-700 transition"
                >
                  {translations.navigation.gallery}
                </a>
              </li>
              <li>
                <a
                  href="/help-center"
                  className="text-gray-600 hover:text-elkaavie-700 transition"
                >
                  {translations.navigation.helpCenter}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">{translations.footer.contact}</h4>
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
            {translations.footer.copyright.replace('{year}', new Date().getFullYear().toString())}
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
