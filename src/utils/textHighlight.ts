import React from 'react';

export const highlightText = (text: string, searchQuery: string): React.ReactNode => {
  if (!searchQuery.trim()) return text;
  
  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    if (regex.test(part)) {
      return React.createElement('span', {
        key: index,
        className: 'bg-red-200 text-red-900 font-medium'
      }, part);
    }
    return part;
  });
};

export const searchInText = (text: string, searchQuery: string): boolean => {
  if (!searchQuery.trim()) return true;
  return text.toLowerCase().includes(searchQuery.toLowerCase());
}; 