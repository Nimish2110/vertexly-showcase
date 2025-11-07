import { Link } from "react-router-dom";
import { BookOpen, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    templates: [
      "Business Templates",
      "Portfolio Templates",
      "E-commerce Templates",
      "Landing Pages",
      "Blog Templates",
    ],
    support: [
      "FAQs",
      "Documentation",
      "Licensing",
      "Getting Started",
      "Video Tutorials",
    ],
    company: [
      "About Us",
      "Our Mission",
      "Terms & Conditions",
      "Privacy Policy",
      "Contact Us",
    ],
  };

  return (
    <footer className="bg-footer-bg text-white pt-16 pb-8 px-4 rounded-t-3xl">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">Courses</span>
            </Link>
            <p className="text-white/80 text-sm leading-relaxed">
              Professional website templates for startups, portfolios, and e-commerce.
              Launch your vision in minutes.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Twitter, label: "Twitter" },
                { icon: Facebook, label: "Facebook" },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white hover:text-footer-bg transition-all duration-300 hover:scale-110"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Templates Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Templates</h3>
            <ul className="space-y-2">
              {footerLinks.templates.map((link) => (
                <li key={link}>
                  <Link
                    to="#"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link}>
                  <Link
                    to="#"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <Link
                    to="#"
                    className="text-white/70 hover:text-white transition-colors duration-200 text-sm"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-white/60 text-sm">
            Copyright ©2025 All rights reserved by vertexly.in
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
