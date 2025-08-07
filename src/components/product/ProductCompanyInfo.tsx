import React from "react";
import {
  User,
  Globe,
  Calendar,
  MapPin,
  Linkedin,
  UserCheck,
} from "lucide-react";
import { getUserDisplayName, getUserInitials } from "@/utils/userHelpers";
import useUserStore from "@/store/useUserStore";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

// A custom X/Twitter Icon
const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const DetailItem = ({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-3 border-b border-gray-200 py-4">
    <Icon className="h-5 w-5 flex-shrink-0 text-gray-500 " />
    <div className="flex-grow text-sm text-gray-800">
      <span className="font-semibold">{label}</span>
      <span className="text-gray-600 ml-2">{children}</span>
    </div>
  </div>
);

const ProductCompanyInfo = ({companyDescription}: {companyDescription: any}) => {
  const {user} = useUserStore();
  
  // Safety check for undefined companyDescription
  if (!companyDescription) {
    return null;
  }
  
  const companyData = {
    name: companyDescription?.companyName,
    logoUrl: companyDescription?.companyAvatar,
    description: companyDescription?.description,
    seller: getUserDisplayName(companyDescription),
    website: companyDescription?.companyWebsiteUrl,
    founded: companyDescription?.yearFounded,
    hq: companyDescription?.hqLocation,
    twitter: companyDescription?.socialLinks?.twitter,
    twitterFollowers: companyDescription?.twitterFollowers,
    linkedin: companyDescription?.socialLinks?.linkedin,
    linkedinEmployees: companyDescription?.linkedinEmployees,
    ownership: getUserDisplayName(companyDescription),
    slug: companyDescription?.slug,
    sellerId: companyDescription?._id,
  };

  return (
    <div className="relative pb-10 sm:pb-24 sm:pt-12">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-0 h-full"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 800'%3e%3cg fill-opacity='0.03' fill='gray'%3e%3cpath d='M-20.9,418.2C29.7,350.5,123.4,321,213.4,323.4c90,2.4,175.9,33.8,248.1,91.2c72.2,57.4,130.6,139.3,212,192.8c81.4,53.5,185,78.8,284.2,73.1c99.2-5.7,193.3-41.2,268.3-102.7c75-61.5,130.6-148.1,215.8-204.9c85.2-56.8,200.1-82.6,305.3-73.2c105.2,9.4,200.2,56.6,275.2,129.2l0,432.8l-1800,0L-20.9,418.2z'/%3e%3c/g%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center',
          backgroundSize: 'cover',
        }}
      />
      <div className="relative z-10 lg:max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-6">

        <Avatar className="h-14 w-14 cursor-pointer" >
              <AvatarImage src={companyData.logoUrl} alt={getUserDisplayName(companyData as any)} className="object-cover" />
              <AvatarFallback>{getUserInitials(companyData as any)}</AvatarFallback>
            </Avatar>
         {/* {companyData.logoUrl && <img
            src={companyData.logoUrl}
            alt="Company Logo"
            className="h-16 w-16 rounded-full  object-cover"
          />} */}
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 ">
            {companyData.name} Company Info
          </h2>
        </div>

        <p className="mt-8 text-base leading-relaxed text-gray-600">
          {companyData.description}
        </p>

        <div className="mt-5">
          <h3 className="text-2xl font-bold text-gray-900">Seller Details</h3>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 md:gap-x-44">
            <div className="">
              {companyData.seller && <DetailItem icon={User} label="Seller">
                (<a href={user?._id === companyData.sellerId  ?  `/profile` : `/public-profile/${companyData.slug}`} className="text-blue-600 hover:underline">{companyData.seller}</a>)
              </DetailItem>}
              {companyData.website && <DetailItem icon={Globe} label="Company Website">
                (<a target="_blank" href={companyData.website} className="text-blue-600 hover:underline">{companyData?.website?.length > 30 ? companyData.website.substring(0, 30) + "..." : companyData.website}</a>)
              </DetailItem>}
              {companyData.founded && <DetailItem icon={Calendar} label="Year Founded">({companyData.founded})</DetailItem>}
            {companyData.hq && <DetailItem icon={MapPin} label="HQ Location">({companyData.hq})</DetailItem>}
            </div>
            <div>
              {companyData.twitter && <DetailItem icon={XIcon} label="Twitter">
                (<a href={`${companyData.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{companyData?.twitter?.length > 30 ? companyData.twitter.substring(0, 30) + "..." : companyData.twitter}</a>{companyData.twitterFollowers ? `, ${companyData.twitterFollowers?.length > 30 ? companyData.twitterFollowers.substring(0, 30) + "..." : companyData.twitterFollowers} Twitter followers` : ''})
              </DetailItem>}
              {companyData.linkedin && <DetailItem icon={Linkedin} label="LinkedIn Page">
                (<a href={`${companyData.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{companyData?.linkedin?.length > 30 ? companyData.linkedin.substring(0, 30) + "..." : companyData.linkedin }</a>{companyData.linkedinEmployees ? `, ${companyData.linkedinEmployees?.length > 30 ? companyData.linkedinEmployees.substring(0, 30) + "..." : companyData.linkedinEmployees} employees on LinkedIn®` : ''})
              </DetailItem>}
              {/* {companyData.ownership && <DetailItem icon={UserCheck} label="Ownership"> (<a href={user?._id === companyData.sellerId  ?  `/profile` : `/public-profile/${companyData.slug}`}  className="text-blue-600 hover:underline">{companyData.ownership}</a>)</DetailItem>} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCompanyInfo; 