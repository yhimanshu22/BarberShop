// components/shops/barbers/EditScheduleModal.tsx

"use client"

import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { BarberSchedule } from "@/types/schedule"
import { Label } from "@/components/ui/label"

interface EditScheduleFormData {
  start_time: string
  end_time: string
}

interface EditScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  schedule: BarberSchedule
  accessToken: string
  onSuccess: () => void
}

export function EditScheduleModal({ isOpen, onClose, schedule, accessToken, onSuccess }: EditScheduleModalProps) {
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors }
  } = useForm<EditScheduleFormData>({
    defaultValues: {
      start_time: schedule.start_time,
      end_time: schedule.end_time,
    }
  })

  const onSubmit = async (data: EditScheduleFormData) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shop-owners/shops/${schedule.shop_id}/barbers/${schedule.barber_id}/schedules/${schedule.id}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to update schedule')
      }

      await onSuccess()
      toast.success('Schedule updated successfully')
      onClose()
    } catch (error) {
      console.error('Error updating schedule:', error)
      toast.error((error as Error).message || 'Failed to update schedule')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Schedule</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <p className="font-medium">Day: {["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][schedule.day_of_week]}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_time">Start Time</Label>
            <Input
              id="start_time"
              type="time"
              {...register('start_time', { required: "Start time is required" })}
            />
            {errors.start_time && (
              <p className="text-red-500 text-sm">{errors.start_time.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_time">End Time</Label>
            <Input
              id="end_time"
              type="time"
              {...register('end_time', { required: "End time is required" })}
            />
            {errors.end_time && (
              <p className="text-red-500 text-sm">{errors.end_time.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full">Update Schedule</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
