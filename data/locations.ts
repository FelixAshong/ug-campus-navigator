import { Location } from '../types/location';

export const locations: Location[] = [
  // Academic Buildings
  {
    id: 'balme-library',
    name: 'Balme Library',
    description: 'Main University Library with extensive collection of books and research materials',
    category: 'academic',
    coordinates: {
      latitude: 5.6502,
      longitude: -0.1864,
    },
    operatingHours: 'Mon-Fri: 8am-10pm, Sat: 9am-5pm',
    contact: {
      phone: '+233 30 250 0000',
      email: 'library@ug.edu.gh',
    },
  },
  {
    id: 'great-hall',
    name: 'Great Hall',
    description: 'Main Auditorium for university events and ceremonies',
    category: 'academic',
    coordinates: {
      latitude: 5.6500,
      longitude: -0.1860,
    },
  },
  {
    id: 'computer-science',
    name: 'Department of Computer Science',
    description: 'Computer Science Department with modern computing facilities',
    category: 'academic',
    coordinates: {
      latitude: 5.6505,
      longitude: -0.1862,
    },
  },
  {
    id: 'mathematics',
    name: 'Department of Mathematics',
    description: 'Mathematics Department with research and teaching facilities',
    category: 'academic',
    coordinates: {
      latitude: 5.6503,
      longitude: -0.1861,
    },
  },
  {
    id: 'physics',
    name: 'Department of Physics',
    description: 'Physics Department with laboratories and research facilities',
    category: 'academic',
    coordinates: {
      latitude: 5.6504,
      longitude: -0.1863,
    },
  },
  {
    id: 'chemistry',
    name: 'Department of Chemistry',
    description: 'Chemistry Department with state-of-the-art laboratories',
    category: 'academic',
    coordinates: {
      latitude: 5.6506,
      longitude: -0.1865,
    },
  },
  {
    id: 'psychology',
    name: 'Department of Psychology',
    description: 'Psychology Department with research and counseling facilities',
    category: 'academic',
    coordinates: {
      latitude: 5.6507,
      longitude: -0.1866,
    },
  },
  {
    id: 'sociology',
    name: 'Department of Sociology',
    description: 'Sociology Department with research and teaching facilities',
    category: 'academic',
    coordinates: {
      latitude: 5.6508,
      longitude: -0.1867,
    },
  },
  {
    id: 'political-science',
    name: 'Department of Political Science',
    description: 'Political Science Department with research and teaching facilities',
    category: 'academic',
    coordinates: {
      latitude: 5.6509,
      longitude: -0.1868,
    },
  },
  {
    id: 'economics',
    name: 'Department of Economics',
    description: 'Economics Department with research and teaching facilities',
    category: 'academic',
    coordinates: {
      latitude: 5.6510,
      longitude: -0.1869,
    },
  },
  {
    id: 'business',
    name: 'Department of Business Administration',
    description: 'Business Administration Department with modern facilities',
    category: 'academic',
    coordinates: {
      latitude: 5.6511,
      longitude: -0.1870,
    },
  },
  {
    id: 'law',
    name: 'Department of Law',
    description: 'Law Department with moot court and library',
    category: 'academic',
    coordinates: {
      latitude: 5.6512,
      longitude: -0.1871,
    },
  },
  {
    id: 'medicine',
    name: 'Department of Medicine',
    description: 'Medical School with teaching hospital and research facilities',
    category: 'academic',
    coordinates: {
      latitude: 5.6513,
      longitude: -0.1872,
    },
  },
  {
    id: 'pharmacy',
    name: 'Department of Pharmacy',
    description: 'Pharmacy Department with laboratories and research facilities',
    category: 'academic',
    coordinates: {
      latitude: 5.6514,
      longitude: -0.1873,
    },
  },
  {
    id: 'nursing',
    name: 'Department of Nursing',
    description: 'Nursing Department with simulation labs and training facilities',
    category: 'academic',
    coordinates: {
      latitude: 5.6515,
      longitude: -0.1874,
    },
  },
  {
    id: 'agriculture',
    name: 'Department of Agriculture',
    description: 'Agriculture Department with research farms and laboratories',
    category: 'academic',
    coordinates: {
      latitude: 5.6516,
      longitude: -0.1875,
    },
  },
  {
    id: 'engineering',
    name: 'Department of Engineering',
    description: 'Engineering Department with workshops and laboratories',
    category: 'academic',
    coordinates: {
      latitude: 5.6517,
      longitude: -0.1876,
    },
  },

  // Traditional Halls
  {
    id: 'legon-hall',
    name: 'Legon Hall',
    description: 'Traditional male hall of residence',
    category: 'residence',
    coordinates: {
      latitude: 5.6502,
      longitude: -0.1864,
    },
  },
  {
    id: 'commonwealth-hall',
    name: 'Commonwealth Hall',
    description: 'Traditional male hall of residence',
    category: 'residence',
    coordinates: {
      latitude: 5.6500,
      longitude: -0.1860,
    },
  },
  {
    id: 'volta-hall',
    name: 'Volta Hall',
    description: 'Traditional female hall of residence',
    category: 'residence',
    coordinates: {
      latitude: 5.6505,
      longitude: -0.1862,
    },
  },
  {
    id: 'akuafo-hall',
    name: 'Akuafo Hall',
    description: 'Traditional male hall of residence',
    category: 'residence',
    coordinates: {
      latitude: 5.6503,
      longitude: -0.1861,
    },
  },
  {
    id: 'mensah-sarbah-hall',
    name: 'Mensah Sarbah Hall',
    description: 'Traditional male hall of residence',
    category: 'residence',
    coordinates: {
      latitude: 5.6504,
      longitude: -0.1863,
    },
  },

  // Diaspora Halls
  {
    id: 'hilla-limann-hall',
    name: 'Hilla Limann Hall',
    description: 'Mixed diaspora hall of residence',
    category: 'residence',
    coordinates: {
      latitude: 5.6506,
      longitude: -0.1865,
    },
  },
  {
    id: 'jean-nelson-aka-hall',
    name: 'Jean Nelson Aka Hall',
    description: 'Female diaspora hall of residence',
    category: 'residence',
    coordinates: {
      latitude: 5.6507,
      longitude: -0.1866,
    },
  },
  {
    id: 'elizabeth-sey-hall',
    name: 'Elizabeth Frances Sey Hall',
    description: 'Female diaspora hall of residence',
    category: 'residence',
    coordinates: {
      latitude: 5.6508,
      longitude: -0.1867,
    },
  },
  {
    id: 'alexander-kwapong-hall',
    name: 'Alexander Kwapong Hall',
    description: 'Mixed diaspora hall of residence',
    category: 'residence',
    coordinates: {
      latitude: 5.6509,
      longitude: -0.1868,
    },
  },

  // UGEL Halls
  {
    id: 'international-hostel',
    name: 'International Students Hostel',
    description: 'UGEL hostel for international students',
    category: 'residence',
    coordinates: {
      latitude: 5.6510,
      longitude: -0.1869,
    },
  },
  {
    id: 'pent-hall',
    name: 'Pent Hall',
    description: 'UGEL hostel for postgraduate students',
    category: 'residence',
    coordinates: {
      latitude: 5.6511,
      longitude: -0.1870,
    },
  },
  {
    id: 'valco-trust-hostel',
    name: 'Valco Trust Hostel',
    description: 'UGEL hostel for undergraduate students',
    category: 'residence',
    coordinates: {
      latitude: 5.6512,
      longitude: -0.1871,
    },
  },

  // Campuses
  {
    id: 'main-campus',
    name: 'Main Campus (Legon)',
    description: 'Main University of Ghana campus',
    category: 'campus',
    coordinates: {
      latitude: 5.6502,
      longitude: -0.1864,
    },
  },
  {
    id: 'korle-bu-campus',
    name: 'Korle Bu Campus',
    description: 'Medical and health sciences campus',
    category: 'campus',
    coordinates: {
      latitude: 5.5333,
      longitude: -0.2167,
    },
  },
  {
    id: 'accra-city-campus',
    name: 'Accra City Campus',
    description: 'City campus for business and law',
    category: 'campus',
    coordinates: {
      latitude: 5.5500,
      longitude: -0.2000,
    },
  },
  {
    id: 'agric-campus',
    name: 'Agricultural Research Station',
    description: 'Agricultural research and extension campus',
    category: 'campus',
    coordinates: {
      latitude: 5.6000,
      longitude: -0.2500,
    },
  },

  // Administrative Buildings
  {
    id: 'jubilee-house',
    name: 'Jubilee House',
    description: 'Vice Chancellor\'s Office and main administration building',
    category: 'administrative',
    coordinates: {
      latitude: 5.6530,
      longitude: -0.1890,
    },
  },
  {
    id: 'registrar-office',
    name: 'Registrar\'s Office',
    description: 'Office of the University Registrar',
    category: 'administrative',
    coordinates: {
      latitude: 5.6531,
      longitude: -0.1891,
    },
  },
  {
    id: 'finance-office',
    name: 'Finance Office',
    description: 'University Finance and Accounts Department',
    category: 'administrative',
    coordinates: {
      latitude: 5.6532,
      longitude: -0.1892,
    },
  },
  {
    id: 'student-affairs',
    name: 'Student Affairs Office',
    description: 'Office for student welfare and activities',
    category: 'administrative',
    coordinates: {
      latitude: 5.6533,
      longitude: -0.1893,
    },
  },
  {
    id: 'international-office',
    name: 'International Programmes Office',
    description: 'Office for international students and programs',
    category: 'administrative',
    coordinates: {
      latitude: 5.6534,
      longitude: -0.1894,
    },
  },
  {
    id: 'academic-affairs',
    name: 'Academic Affairs Office',
    description: 'Office for academic programs and curriculum',
    category: 'administrative',
    coordinates: {
      latitude: 5.6535,
      longitude: -0.1895,
    },
  },
  {
    id: 'human-resource',
    name: 'Human Resource Office',
    description: 'Office for staff recruitment and management',
    category: 'administrative',
    coordinates: {
      latitude: 5.6536,
      longitude: -0.1896,
    },
  },

  // Sports and Recreation
  {
    id: 'sports-stadium',
    name: 'Sports Stadium',
    description: 'Main sports stadium for athletics and football',
    category: 'sports',
    coordinates: {
      latitude: 5.6540,
      longitude: -0.1900,
    },
  },
  {
    id: 'sports-complex',
    name: 'Sports Complex',
    description: 'Multi-purpose sports facility',
    category: 'sports',
    coordinates: {
      latitude: 5.6541,
      longitude: -0.1901,
    },
  },
  {
    id: 'swimming-pool',
    name: 'Swimming Pool',
    description: 'Olympic-sized swimming pool',
    category: 'sports',
    coordinates: {
      latitude: 5.6542,
      longitude: -0.1902,
    },
  },
  {
    id: 'tennis-courts',
    name: 'Tennis Courts',
    description: 'Multiple tennis courts for recreational and competitive play',
    category: 'sports',
    coordinates: {
      latitude: 5.6543,
      longitude: -0.1903,
    },
  },
  {
    id: 'basketball-courts',
    name: 'Basketball Courts',
    description: 'Multiple basketball courts for recreational and competitive play',
    category: 'sports',
    coordinates: {
      latitude: 5.6544,
      longitude: -0.1904,
    },
  },
  {
    id: 'volleyball-courts',
    name: 'Volleyball Courts',
    description: 'Multiple volleyball courts for recreational and competitive play',
    category: 'sports',
    coordinates: {
      latitude: 5.6545,
      longitude: -0.1905,
    },
  },
  {
    id: 'football-fields',
    name: 'Football Fields',
    description: 'Multiple football fields for recreational and competitive play',
    category: 'sports',
    coordinates: {
      latitude: 5.6546,
      longitude: -0.1906,
    },
  },

  // Dining and Shopping
  {
    id: 'legon-dining',
    name: 'Legon Hall Dining Hall',
    description: 'Dining hall for Legon Hall residents',
    category: 'dining',
    coordinates: {
      latitude: 5.6550,
      longitude: -0.1910,
    },
  },
  {
    id: 'commonwealth-dining',
    name: 'Commonwealth Hall Dining Hall',
    description: 'Dining hall for Commonwealth Hall residents',
    category: 'dining',
    coordinates: {
      latitude: 5.6551,
      longitude: -0.1911,
    },
  },
  {
    id: 'akuafo-dining',
    name: 'Akuafo Hall Dining Hall',
    description: 'Dining hall for Akuafo Hall residents',
    category: 'dining',
    coordinates: {
      latitude: 5.6552,
      longitude: -0.1912,
    },
  },
  {
    id: 'sarbah-dining',
    name: 'Mensah Sarbah Hall Dining Hall',
    description: 'Dining hall for Mensah Sarbah Hall residents',
    category: 'dining',
    coordinates: {
      latitude: 5.6553,
      longitude: -0.1913,
    },
  },
  {
    id: 'volta-dining',
    name: 'Volta Hall Dining Hall',
    description: 'Dining hall for Volta Hall residents',
    category: 'dining',
    coordinates: {
      latitude: 5.6554,
      longitude: -0.1914,
    },
  },
  {
    id: 'shopping-mall',
    name: 'Legon Shopping Mall',
    description: 'Modern shopping mall with various retail outlets',
    category: 'dining',
    coordinates: {
      latitude: 5.6555,
      longitude: -0.1915,
    },
  },
  {
    id: 'night-market',
    name: 'Night Market',
    description: 'Evening market with food and retail vendors',
    category: 'dining',
    coordinates: {
      latitude: 5.6556,
      longitude: -0.1916,
    },
  },
  {
    id: 'bookshop',
    name: 'Bookshop',
    description: 'University bookshop with academic materials',
    category: 'dining',
    coordinates: {
      latitude: 5.6557,
      longitude: -0.1917,
    },
  },

  // Health and Wellness
  {
    id: 'university-hospital',
    name: 'University Hospital',
    description: 'Main university hospital with comprehensive medical services',
    category: 'health',
    coordinates: {
      latitude: 5.6560,
      longitude: -0.1920,
    },
  },
  {
    id: 'university-clinic',
    name: 'University Clinic',
    description: 'Primary healthcare clinic for students and staff',
    category: 'health',
    coordinates: {
      latitude: 5.6561,
      longitude: -0.1921,
    },
  },
  {
    id: 'university-pharmacy',
    name: 'University Pharmacy',
    description: 'Pharmacy with prescription and over-the-counter medications',
    category: 'health',
    coordinates: {
      latitude: 5.6562,
      longitude: -0.1922,
    },
  },
  {
    id: 'counseling-center',
    name: 'Counseling Center',
    description: 'Mental health and counseling services',
    category: 'health',
    coordinates: {
      latitude: 5.6563,
      longitude: -0.1923,
    },
  },
  {
    id: 'sports-center',
    name: 'Sports Center',
    description: 'Fitness and wellness center',
    category: 'health',
    coordinates: {
      latitude: 5.6564,
      longitude: -0.1924,
    },
  },

  // Other Facilities
  {
    id: 'university-chapel',
    name: 'University Chapel',
    description: 'Christian worship center',
    category: 'other',
    coordinates: {
      latitude: 5.6570,
      longitude: -0.1930,
    },
  },
  {
    id: 'university-mosque',
    name: 'University Mosque',
    description: 'Islamic worship center',
    category: 'other',
    coordinates: {
      latitude: 5.6571,
      longitude: -0.1931,
    },
  },
  {
    id: 'guest-house',
    name: 'University Guest House',
    description: 'Accommodation for visiting scholars and guests',
    category: 'other',
    coordinates: {
      latitude: 5.6572,
      longitude: -0.1932,
    },
  },
  {
    id: 'university-press',
    name: 'University Press',
    description: 'Publishing house for academic materials',
    category: 'other',
    coordinates: {
      latitude: 5.6573,
      longitude: -0.1933,
    },
  },
  {
    id: 'printing-press',
    name: 'University Printing Press',
    description: 'Printing services for university materials',
    category: 'other',
    coordinates: {
      latitude: 5.6574,
      longitude: -0.1934,
    },
  },
  {
    id: 'security-office',
    name: 'University Security Office',
    description: 'Campus security headquarters',
    category: 'other',
    coordinates: {
      latitude: 5.6575,
      longitude: -0.1935,
    },
  },
  {
    id: 'post-office',
    name: 'University Post Office',
    description: 'Postal services for the university community',
    category: 'other',
    coordinates: {
      latitude: 5.6576,
      longitude: -0.1936,
    },
  },
  {
    id: 'university-bank',
    name: 'University Bank',
    description: 'Banking services for the university community',
    category: 'other',
    coordinates: {
      latitude: 5.6577,
      longitude: -0.1937,
    },
  },
  {
    id: 'atm-locations',
    name: 'University ATM Locations',
    description: 'Multiple ATM locations across campus',
    category: 'other',
    coordinates: {
      latitude: 5.6578,
      longitude: -0.1938,
    },
  },
]; 