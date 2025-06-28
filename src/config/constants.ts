export const regionOptions = [
  { value: 'USA', label: 'USA' },
  { value: 'Canada', label: 'Canada' },
  { value: 'UK', label: 'UK' },
  { value: 'Europe', label: 'Europe' },
  { value: 'Asia', label: 'Asia' },
  { value: 'Other', label: 'Other' },
];

// Industry options are now fetched from the API via useIndustryOptions hook
// export const industryOptions = [...]; // Removed - now using API

export const companySizeOptions = [
  { value: '1-10 Employees', label: '1-10 Employees' },
  { value: '11-50 Employees', label: '11-50 Employees' },
  { value: '51-100 Employees', label: '51-100 Employees' },
  { value: '100-200 Employees', label: '100-200 Employees' },
  { value: '201-500 Employees', label: '201-500 Employees' },
  { value: '500+ Employees', label: '500+ Employees' },
];

// Generate year founded options (from 1900 to current year)
const currentYear = new Date().getFullYear();
export const yearFoundedOptions = Array.from(
  { length: currentYear - 1899 }, 
  (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  }
);
