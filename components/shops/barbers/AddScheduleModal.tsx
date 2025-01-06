"use client"

import { useForm, Controller } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Label } from "@/components/ui/label"

interface AddScheduleFormData {
  day_of_week: string
  start_time: string
  end_time: string
}

interface AddScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  barberId: number
  shopId: number
  accessToken: string
  onSuccess: () => void
  existingSchedules: BarberSchedule[]
}

const dayOptions = [
  { label: "Sunday", value: "0" },
  { label: "Monday", value: "1" },
  { label: "Tuesday", value: "2" },
  { label: "Wednesday", value: "3" },
  { label: "Thursday", value: "4" },
  { label: "Friday", value: "5" },
  { label: "Saturday", value: "6" },
]

const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const getDayName = (dayNumber: number | string): string => {
  return dayNames[Number(dayNumber)] || dayNumber.toString()
}

export function AddScheduleModal({ isOpen, onClose, barberId, shopId, accessToken, onSuccess, existingSchedules }: AddScheduleModalProps) {
  const { control, handleSubmit, reset } = useForm<AddScheduleFormData>({
    defaultValues: {
      day_of_week: '',
      start_time: '',
      end_time: ''
    }
  })

  const availableDays = dayOptions.filter(day => 
    !existingSchedules.some(schedule => 
      schedule.day_of_week === parseInt(day.value)
    )
  )

  const onSubmit = async (data: AddScheduleFormData) => {
    try {
      const requestBody = {
        barber_id: barberId,
        day_of_week: parseInt(data.day_of_week),
        start_time: data.start_time,
        end_time: data.end_time
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shop-owners/shops/${shopId}/barbers/${barberId}/schedules/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody),
        }
      )

      const responseData = await response.json()

      if (!response.ok) {
        if (responseData.detail && responseData.detail.includes("Schedule already exists for day")) {
          const dayNumber = responseData.detail.match(/\d+/)[0]
          throw new Error(responseData.detail.replace(
            `day ${dayNumber}`,
            `${getDayName(dayNumber)}`
          ))
        }
        throw new Error(responseData.detail || 'Failed to add schedule')
      }

      toast.success('Schedule added successfully')
      reset()
      onSuccess()
      onClose()
    } catch (error) {
      console.error('Error adding schedule:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add schedule')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Schedule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="day_of_week">Day of Week</Label>
            <Controller
              name="day_of_week"
              control={control}
              rules={{ required: "Day is required" }}
              render={({ field: { onChange, value } }) => (
                <Select
                  onValueChange={onChange}
                  defaultValue={value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDays.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="start_time">Start Time</Label>
            <Controller
              name="start_time"
              control={control}
              rules={{ required: "Start time is required" }}
              render={({ field: { onChange, value } }) => (
                <Input
                  type="time"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end_time">End Time</Label>
            <Controller
              name="end_time"
              control={control}
              rules={{ required: "End time is required" }}
              render={({ field: { onChange, value } }) => (
                <Input
                  type="time"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </div>

          <Button type="submit" className="w-full">Add Schedule</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
