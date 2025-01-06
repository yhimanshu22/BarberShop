import { BarberSchedule } from "./schedule"

export interface Barber {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
  status: string;
  shop_id: number;
  schedules: BarberSchedule[]
} 