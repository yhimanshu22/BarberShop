'use client'

import { BarberSchedule } from "@/types/schedule"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Trash2, Edit2, Plus } from 'lucide-react'
import { toast } from "sonner"
import { motion } from "framer-motion"

interface ScheduleListProps {
  schedules: BarberSchedule[]
  onEdit: (schedule: BarberSchedule) => void
  onDelete: (schedule: BarberSchedule) => void
  onAdd: () => void
  accessToken: string
  shopId: number
  barberId: number
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export function ScheduleList({ schedules, onEdit, onDelete, onAdd, accessToken, shopId, barberId }: ScheduleListProps) {
  const handleDelete = async (schedule: BarberSchedule) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shop-owners/shops/${shopId}/barbers/${barberId}/schedules/${schedule.id}/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete schedule')
      }

      toast.success('Schedule deleted successfully')
      onDelete(schedule)
    } catch (error) {
      console.error('Error deleting schedule:', error)
      toast.error('Failed to delete schedule')
    }
  }

  const getScheduleForDay = (day: number) => {
    return schedules.find(schedule => schedule.day_of_week === day)
  }

  return (
    <Card className="mt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium">Weekly Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        {schedules.length === 0 ? (
          <p className="text-sm text-muted-foreground">No schedules set for this barber.</p>
        ) : (
          <div className="grid grid-cols-7 gap-2">
            {dayNames.map((day, index) => {
              const schedule = getScheduleForDay(index)
              return (
                <motion.div
                  key={day}
                  className={`p-2 rounded-md ${
                    schedule ? 'bg-primary/10' : 'bg-muted'
                  } flex flex-col items-center justify-center`}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="text-xs font-medium mb-1">{day}</span>
                  {schedule ? (
                    <div className="text-center">
                      <p className="text-xs">{schedule.start_time.slice(0, 5)}</p>
                      <p className="text-xs mb-1">{schedule.end_time.slice(0, 5)}</p>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onEdit(schedule)}
                          className="h-6 w-6 p-0"
                        >
                          <Edit2 className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDelete(schedule)}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

