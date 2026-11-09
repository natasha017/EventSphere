import React from "react";
import { Link } from "react-router-dom";
import { Layers, Mail, Phone, MapPin, ArrowRight } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 font-sans border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        {/* Main Footer Grid Layout */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* Section 1: EventSphere Branding */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <Layers className="h-5 w-5" />
              </div>
              <span className="font-bold text-xl text-white tracking-tight">
                EventSphere
              </span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted platform for discovering, organizing, and managing expos, exhibitions, and trade shows. EventSphere brings organizers, exhibitors, and attendees together in one digital ecosystem.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link to="/" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/expos" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Expos
                </Link>
              </li>
              <li>
                <Link to="/exhibitors" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Exhibitors
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Schedule
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Section 3: EventSphere Services / Platform */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Our Platform
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>Expo Management</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>Exhibitor Management</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>Event Scheduling</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>Attendee Information</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>Event Analytics</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Get in Touch
            </h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-1" />
                <span>support@eventsphere.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-1" />
                <span>+1 (555) 234-5678</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-indigo-400 flex-shrink-0 mt-1" />
                <span>100 Convention Center Dr, Suite 400, NY</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {currentYear} EventSphere Management. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link to="/contact" className="hover:text-slate-400 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;