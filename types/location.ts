export type Location = {
  id: string;
  name: string;
  description: string;
  category: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  operatingHours?: string;
  contact?: {
    phone?: string;
    email?: string;
  };
}; 