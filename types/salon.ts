export interface Salon {
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone_number: string;
  email: string;
  opening_time: string;
  closing_time: string;
  average_wait_time: number;
  has_advertisement: boolean;
  advertisement_image_url: string | null;
  advertisement_start_date: string | null;
  advertisement_end_date: string | null;
  is_advertisement_active: boolean;
}

export interface SalonSearchParams {
  query?: string;
  location?: string;
  page?: number;
  limit?: number;
} 