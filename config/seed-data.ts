/**
 * Preset Categories & Sub-Categories Configuration
 * Based on the provided Categories & Sub-Categories document
 */

export interface PresetCategory {
  name: string;
  icon: string;
  color: string;
  subCategories: {
    name: string;
    icon: string;
  }[];
}

export const PRESET_CATEGORIES: PresetCategory[] = [
  {
    name: 'Food & Drinks',
    icon: 'Utensils',
    color: '#FF6B6B',
    subCategories: [
      { name: 'Breakfast', icon: 'Coffee' },
      { name: 'Lunch', icon: 'Utensils' },
      { name: 'Dinner', icon: 'UtensilsCrossed' },
      { name: 'Tea Time', icon: 'CupSoda' },
      { name: 'Coffee', icon: 'Coffee' },
      { name: 'Fast Food', icon: 'Pizza' },
      { name: 'Snacks', icon: 'Cookie' },
      { name: 'Desserts', icon: 'IceCream' },
    ],
  },
  {
    name: 'Transportation',
    icon: 'Car',
    color: '#4ECDC4',
    subCategories: [
      { name: 'Fuel', icon: 'Fuel' },
      { name: 'Parking', icon: 'ParkingCircle' },
      { name: 'Public Transport', icon: 'Bus' },
      { name: 'Ride Hailing', icon: 'CarTaxiFront' },
      { name: 'Toll', icon: 'Ticket' },
      { name: 'Maintenance', icon: 'Wrench' },
    ],
  },
  {
    name: 'Shopping',
    icon: 'ShoppingBag',
    color: '#95E1D3',
    subCategories: [
      { name: 'Groceries', icon: 'ShoppingCart' },
      { name: 'Clothing', icon: 'Shirt' },
      { name: 'Electronics', icon: 'Smartphone' },
      { name: 'Online Shopping', icon: 'Package' },
      { name: 'Accessories', icon: 'Watch' },
    ],
  },
  {
    name: 'Housing & Utilities',
    icon: 'Home',
    color: '#F38181',
    subCategories: [
      { name: 'Rent', icon: 'Building' },
      { name: 'Electricity', icon: 'Zap' },
      { name: 'Water', icon: 'Droplets' },
      { name: 'Internet', icon: 'Wifi' },
      { name: 'Gas', icon: 'Flame' },
      { name: 'Home Maintenance', icon: 'Hammer' },
    ],
  },
  {
    name: 'Bills & Subscriptions',
    icon: 'Receipt',
    color: '#AA96DA',
    subCategories: [
      { name: 'Mobile Bill', icon: 'Smartphone' },
      { name: 'Streaming', icon: 'PlayCircle' },
      { name: 'Software', icon: 'Monitor' },
      { name: 'Insurance', icon: 'Shield' },
      { name: 'Credit Card', icon: 'CreditCard' },
    ],
  },
  {
    name: 'Entertainment & Leisure',
    icon: 'Gamepad2',
    color: '#FCBAD3',
    subCategories: [
      { name: 'Movies', icon: 'Film' },
      { name: 'Games', icon: 'Gamepad2' },
      { name: 'Music', icon: 'Music' },
      { name: 'Events', icon: 'Calendar' },
      { name: 'Hobbies', icon: 'Palette' },
    ],
  },
  {
    name: 'Health & Medical',
    icon: 'HeartPulse',
    color: '#FF8CC6',
    subCategories: [
      { name: 'Doctor', icon: 'Stethoscope' },
      { name: 'Medicine', icon: 'Pill' },
      { name: 'Dental', icon: 'Smile' },
      { name: 'Fitness', icon: 'Dumbbell' },
      { name: 'Therapy', icon: 'Activity' },
    ],
  },
  {
    name: 'Education & Learning',
    icon: 'GraduationCap',
    color: '#A8E6CF',
    subCategories: [
      { name: 'Tuition', icon: 'BookOpen' },
      { name: 'Online Courses', icon: 'Laptop' },
      { name: 'Books', icon: 'Book' },
      { name: 'Certifications', icon: 'BadgeCheck' },
    ],
  },
  {
    name: 'Travel',
    icon: 'Plane',
    color: '#FFD3B6',
    subCategories: [
      { name: 'Flights', icon: 'Plane' },
      { name: 'Accommodation', icon: 'Hotel' },
      { name: 'Transport', icon: 'Bus' },
      { name: 'Food', icon: 'Utensils' },
      { name: 'Souvenirs', icon: 'Gift' },
    ],
  },
  {
    name: 'Personal & Lifestyle',
    icon: 'User',
    color: '#FFAAA5',
    subCategories: [
      { name: 'Personal Care', icon: 'Scissors' },
      { name: 'Skincare', icon: 'Sparkles' },
      { name: 'Gifts', icon: 'Gift' },
      { name: 'Donations', icon: 'HandHeart' },
    ],
  },
  {
    name: 'Work & Office',
    icon: 'Briefcase',
    color: '#C7CEEA',
    subCategories: [
      { name: 'Office Supplies', icon: 'Clipboard' },
      { name: 'Software', icon: 'Monitor' },
      { name: 'Meals', icon: 'Utensils' },
      { name: 'Travel', icon: 'Map' },
    ],
  },
  {
    name: 'Miscellaneous',
    icon: 'MoreHorizontal',
    color: '#B5B5B5',
    subCategories: [
      { name: 'Unexpected', icon: 'AlertCircle' },
      { name: 'Fees', icon: 'Info' },
      { name: 'Others', icon: 'MoreHorizontal' },
    ],
  },
];

/**
 * Preset Income Sources Configuration
 */

export interface PresetIncome {
  name: string;
  icon: string;
  color: string;
}

export const PRESET_INCOMES: PresetIncome[] = [
  { name: 'Salary', icon: 'Briefcase', color: '#4ECDC4' },
  { name: 'Freelance', icon: 'Laptop', color: '#95E1D3' },
  { name: 'Investment', icon: 'TrendingUp', color: '#AA96DA' },
  { name: 'Business', icon: 'Building2', color: '#FF8CC6' },
  { name: 'Rental', icon: 'Home', color: '#FFD3B6' },
  { name: 'Dividends', icon: 'PieChart', color: '#A8E6CF' },
  { name: 'Bonus', icon: 'Gift', color: '#FCBAD3' },
  { name: 'Side Hustle', icon: 'Zap', color: '#FF6B6B' },
  { name: 'Commission', icon: 'Percent', color: '#C7CEEA' },
  { name: 'Other', icon: 'Wallet', color: '#B5B5B5' },
];