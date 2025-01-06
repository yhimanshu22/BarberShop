import { Salon, SalonSearchParams } from "@/types/salon";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export async function getSalons({ query }: { query: string; location: string }) {
  try {
    const searchParams = new URLSearchParams();
    if (query) {
      searchParams.append('search', query);
    }
    
    const response = await fetch(`${API_URL}/appointments/shops?${searchParams.toString()}`);
    if (!response.ok) throw new Error('Failed to fetch salons');
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error in getSalons:', error);
    throw error;
  }
}

export async function getSalonDetails(salonId: string) {
  try {
    const response = await fetch(`${API_URL}/appointments/shop/${salonId}`);
    if (!response.ok) {
      console.error('Response status:', response.status);
      throw new Error('Failed to fetch salon details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in getSalonDetails:', error);
    throw error;
  }
}