import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const integrations = [
  { name: 'Slack', logoUrl: 'https://www.vectorlogo.zone/logos/slack/slack-icon.svg' },
//   { name: 'Zoom', logoUrl: 'https://www.vectorlogo.zone/logos/zoom/zoom-icon.svg' },
  { name: 'AWS', logoUrl: 'https://www.vectorlogo.zone/logos/amazon_aws/amazon_aws-icon.svg' },
//   { name: 'Google Drive', logoUrl: 'https://www.vectorlogo.zone/logos/googledrive/googledrive-icon.svg' },
  { name: 'Dropbox', logoUrl: 'https://www.vectorlogo.zone/logos/dropbox/dropbox-icon.svg' },
  { name: 'HubSpot', logoUrl: 'https://www.vectorlogo.zone/logos/hubspot/hubspot-icon.svg' },
  { name: 'Salesforce', logoUrl: 'https://www.vectorlogo.zone/logos/salesforce/salesforce-icon.svg' },
//   { name: 'Tableau', logoUrl: 'https://www.vectorlogo.zone/logos/tableau/tableau-icon.svg' },
  { name: 'GitHub', logoUrl: 'https://www.vectorlogo.zone/logos/github/github-icon.svg' },
  { name: 'Jira', logoUrl: 'https://www.vectorlogo.zone/logos/atlassian_jira/atlassian_jira-icon.svg' },
//   { name: 'Mailchimp', logoUrl: 'https://www.vectorlogo.zone/logos/mailchimp/mailchimp-freddie-icon.svg' },
  { name: 'Zendesk', logoUrl: 'https://www.vectorlogo.zone/logos/zendesk/zendesk-icon.svg' },
  { name: 'Shopify', logoUrl: 'https://www.vectorlogo.zone/logos/shopify/shopify-icon.svg' },
  { name: 'Zapier', logoUrl: 'https://www.vectorlogo.zone/logos/zapier/zapier-icon.svg' },
];

const IntegrationCard = ({ name, image }: { name: string, image: string }) => (
  <div className="flex flex-col items-center text-center gap-2" title={name}>
    <div className="w-16 h-16  bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center justify-center p-3 transition-all duration-300 hover:shadow-md hover:border-gray-300">
      <img
        src={image}
        alt={`${name} logo`}
        className="w-full h-full object-contain"
      />
    </div>
    <p className="text-base font-semibold text-gray-800 line-clamp-1">{name}</p>
  </div>
);

const ProductIntegrations = ({integrations}: {integrations: any}) => {
  const [showAll, setShowAll] = useState(false);
  
  // Calculate items to show for 2 rows based on different screen sizes
  // Using 8 items which shows ~2 rows on small+ screens, 4 rows on mobile
  const itemsPerTwoRows = 24;
  const hasMoreItems = integrations.length > itemsPerTwoRows;
  const displayedIntegrations = showAll ? integrations : integrations.slice(0, itemsPerTwoRows);

  return (
    <div className="">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">
        Integrations
      </h2>
      <div className="border bg-white rounded-2xl p-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-12 gap-x-6 gap-y-8 place-items-center">
          {displayedIntegrations.map((integration: any) => (
            <IntegrationCard key={integration.name} {...integration} />
          ))}
        </div>
        
        {hasMoreItems && (
          <div className="flex justify-center mt-8">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="!text-sm px-6 py-2 rounded-full"
            >
              {showAll ? 'Show Less' : `View All Integrations (+${integrations.length - itemsPerTwoRows})`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductIntegrations; 