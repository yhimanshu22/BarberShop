// types/schedule.ts

export interface BarberSchedule {
    id: number
    barber_id: number
    day_of_week: number // 0=Sunday, 1=Monday, ..., 6=Saturday
    start_time: string // "HH:MM"
    end_time: string // "HH:MM"
    shop_id: number
  }
  