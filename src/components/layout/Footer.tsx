import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#111] text-white border-t border-neutral-800">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10 md:gap-0">
        {/* Left: Logo and description */}
        <div className="md:w-1/3 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Link to="/">
              <img src="/xuthority_logo.svg" alt="Xuthority Logo" className="h-10" />
            </Link>
          </div>
          <p className="text-gray-300 text-base max-w-md">
            Help millions of buyers make better decisions by writing a review. Your insights could guide others to their perfect match!
          </p>
          <div>
            <span className="font-semibold">Follow Us On:</span>
            <div className="flex gap-3 mt-2">
              {/* Facebook */}
              <a 
                href="https://facebook.com/xuthority" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Facebook" 
                className="bg-white rounded p-1.5 inline-flex hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-[#111]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.522-4.477-10-10-10S2 6.478 2 12c0 5 3.657 9.127 8.438 9.877v-6.987h-2.54v-2.89h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.632.771-1.632 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.127 22 17 22 12"/>
                </svg>
              </a>
              {/* Instagram */}
              <a 
                href="https://instagram.com/xuthority" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Instagram" 
                className="bg-white rounded p-1.5 inline-flex hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-[#111]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 2.25a6.25 6.25 0 1 1 0 12.5 6.25 6.25 0 0 1 0-12.5zm0 1.5a4.75 4.75 0 1 0 0 9.5 4.75 4.75 0 0 0 0-9.5zm5.25 1.25a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a 
                href="https://linkedin.com/company/xuthority" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="LinkedIn" 
                className="bg-white rounded p-1.5 inline-flex hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-[#111]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/>
                </svg>
              </a>
              {/* Twitter/X */}
              <a 
                href="https://twitter.com/xuthority" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Twitter" 
                className="bg-white rounded p-1.5 inline-flex hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6 text-[#111]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        {/* Right: Links */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-8 md:pl-16">
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-gray-200">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/write-review" className="hover:text-white transition-colors">
                  Write Review
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Profile
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Categories</h4>
            <ul className="space-y-2 text-gray-200">
              <li>
                <Link to="/project-management" className="hover:text-white transition-colors">
                  Project Management
                </Link>
              </li>
              <li>
                <Link to="/video-conferencing" className="hover:text-white transition-colors">
                  Video Conferencing
                </Link>
              </li>
              <li>
                <Link to="/e-commerce-platforms" className="hover:text-white transition-colors">
                  E-Commerce Platforms
                </Link>
              </li>
              <li>
                <Link to="/marketing-automation" className="hover:text-white transition-colors">
                  Marketing Automation
                </Link>
              </li>
              <li>
                <Link to="/accounting" className="hover:text-white transition-colors">
                  Accounting Software
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-gray-200">
              <li>
                <a href="/terms" className="hover:text-white transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/refund" className="hover:text-white transition-colors">
                  Refund Policy
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/help" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
} 