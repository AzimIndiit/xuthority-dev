import React from 'react';
import DisputeCard from '@/components/dispute/DisputeCard';
import { DisputedReview, Dispute } from '@/types/dispute';

const dummyReview: DisputedReview = {
  id: 'review1',
  title: 'Monday - Not the Best for Task Tracking',
  rating: 2,
  date: 'Jan 27, 2025',
  content: 'Monday.com promises to be an easy-to-use work management tool, but in reality, it feels unnecessarily complicated. The interface is visually appealing but overwhelming, requiring too much time to set up and customize. Simple task tracking can become a hassle due to excessive options and cluttered dashboards.',
};

const dummyDispute: Dispute = {
  id: 'dispute1',
  disputer: {
    name: 'monday',
    avatarUrl: 'https://cdn.monday.com/images/logos/monday_logo_icon.png',
  },
  date: 'Jan 27, 2025',
  reason: 'False or Misleading Information',
  status: 'Active',
  explanation: 'The review contains inaccurate or misleading statements that do not reflect the actual functionality, features, or performance of the product. This may include:',
  claims: [
    'Claims that misrepresent the product’s capabilities or limitations.',
    'Statements that conflict with verified specifications or documentation.',
  ],
};

const dummyDisputeResolved: Dispute = {
  ...dummyDispute,
  id: 'dispute2',
  status: 'Resolved',
};

const DisputesPage = () => {
  return (
    <div className="bg-white min-h-screen">
      <div className="w-full lg:max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Disputes</h1>
        <div className="space-y-8">
          <DisputeCard review={dummyReview} dispute={dummyDispute} />
          <DisputeCard review={dummyReview} dispute={dummyDisputeResolved} />
        </div>
      </div>
    </div>
  );
};

export default DisputesPage; 