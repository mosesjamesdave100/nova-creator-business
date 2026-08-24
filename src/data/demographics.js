// Audience demographic breakdown for the Media Kit and public profile. A
// real integration would derive this from each platform's audience-insights
// endpoint (YouTube Analytics demographics, Instagram Insights, etc.) and
// blend them the way this file's numbers were hand-authored to look, each
// list sums to 100.
export const ageBreakdown = [
  { id: "13-17", label: "13-17", value: 6 },
  { id: "18-24", label: "18-24", value: 34 },
  { id: "25-34", label: "25-34", value: 38 },
  { id: "35-44", label: "35-44", value: 15 },
  { id: "45+", label: "45+", value: 7 },
];

export const genderBreakdown = [
  { id: "male", label: "Male", value: 68 },
  { id: "female", label: "Female", value: 29 },
  { id: "other", label: "Other", value: 3 },
];

export const topLocations = [
  { id: "us", label: "United States", value: 46 },
  { id: "uk", label: "United Kingdom", value: 12 },
  { id: "ca", label: "Canada", value: 9 },
  { id: "de", label: "Germany", value: 6 },
  { id: "au", label: "Australia", value: 5 },
  { id: "other", label: "Rest of world", value: 22 },
];
