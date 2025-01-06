export interface Shop {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone_number: string;
  email: string;
  average_wait_time: number;
  has_advertisement: boolean;
  advertisement_image_url?: string;
  advertisement_start_date?: string;
  advertisement_end_date?: string;
  is_advertisement_active: boolean;
  owner_id: number;
}
