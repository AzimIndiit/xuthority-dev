import { Link } from "react-router-dom";
import { useLandingPageSection } from '@/hooks/useLandingPageSection';
import { useEffect, useState } from 'react';

export default function Footer() {
  // Fetch categories from landing page API
  const { data: categoriesData } = useLandingPageSection('user', 'categories');
  const [softwareLabels, setSoftwareLabels] = useState<Record<string, string>>({});
  
  // Transform categories data into the format we need
  const categoriesFromAPI = categoriesData?.categories?.map((category: any) => {
    // Handle populated name field (software)
    const softwareId = typeof category.name === 'object' && category.name?._id 
      ? category.name._id 
      : category.name || '';
    
    const softwareName = typeof category.name === 'object' && category.name?.name
      ? category.name.name
      : '';
    
    const softwareSlug = typeof category.name === 'object' && category.name?.slug
      ? category.name.slug
      : '';
    
    return {
      value: softwareId,
      slug: softwareSlug || softwareId, // Use slug if available, otherwise use ID
      label: softwareName || softwareId,
    };
  }) || [];
  
  // Fetch software labels for categories without names
  useEffect(() => {
    const fetchSoftwareLabels = async () => {
      if (categoriesFromAPI.length === 0) return;
      
      // Filter options that don't have labels
      const optionsWithoutLabels = categoriesFromAPI.filter((option: any) => !option.label || option.label === option.slug);
      
      if (optionsWithoutLabels.length === 0) return;
      
      try {
        const api = (await import('@/services/api')).default;
        
        // Fetch only software details that don't have labels
        const softwarePromises = optionsWithoutLabels.map((option: any) => 
          api.get(`/softwares/${option.slug || option.value}`).catch(() => null)
        );
        
        const responses = await Promise.all(softwarePromises);
        const labels: Record<string, string> = {};
        
        responses.forEach((res: any, index: number) => {
          if (res?.data?.data?.name) {
            const key = optionsWithoutLabels[index].slug || optionsWithoutLabels[index].value;
            labels[key] = res.data.data.name;
          }
        });
        
        setSoftwareLabels(labels);
      } catch (error) {
        console.error('Error fetching software labels:', error);
      }
    };
    
    fetchSoftwareLabels();
  }, [categoriesFromAPI.map((o: any) => o.slug).join(',')]);
  
  // Update categories with labels, take only first 5
  const topCategories = categoriesFromAPI.slice(0, 5).map((option: any) => ({
    ...option,
    label: softwareLabels[option.slug] || softwareLabels[option.value] || option.label || option.slug
  }));
  console.log('categoriesFromAPI', categoriesFromAPI)
  // Fallback to default categories if API data is not available
  const defaultCategories = [
    { label: "CRM Software", slug: "crm-software" },
    { label: "Project Management", slug: "project-management" },
    { label: "Marketing Automation", slug: "marketing-automation" },
    { label: "HR Management", slug: "hr-management" },
    { label: "E-commerce", slug: "e-commerce" }
  ];
  
  const finalCategories = topCategories.length > 0 ? topCategories : defaultCategories;
  return (
    <footer className="bg-[#111] text-white border-t border-neutral-800">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-10 md:gap-0">
        {/* Left: Logo and description */}
        <div className="md:w-1/3 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Link to="/">
              <img src="/xuthority_logo.svg" alt="Xuthority Logo" className="h-12" />
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
                <Link to="/software" className="hover:text-white transition-colors">
                  Software
                </Link>
              </li>
                <li>
                <Link to="/solutions" className="hover:text-white transition-colors">
                  Solutions
                </Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-white transition-colors">
                  Resources
                </Link>
              </li>
              
              <li>
                <Link to="/for-vendors" className="hover:text-white transition-colors">
                  For Vendor
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Top Categories</h4>
            <ul className="space-y-2 text-gray-200">
              {finalCategories.map((category: any, index: number) => (
                <li key={index}>
                  <Link to={`/software/${category.slug}`} className="hover:text-white transition-colors">
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Other</h4>
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
             
            
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
} 