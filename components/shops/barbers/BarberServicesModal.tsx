import { useState, useEffect } from "react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface Service {
  id: number
  name: string
  duration: number
  price: number
  shop_id: number
}

interface BarberServicesModalProps {
  shopId: number
  barberId: number
  barberName: string
  isOpen: boolean
  onClose: () => void
  accessToken: string
}

export function BarberServicesModal({
  shopId,
  barberId,
  barberName,
  isOpen,
  onClose,
  accessToken,
}: BarberServicesModalProps) {
  const [allServices, setAllServices] = useState<Service[]>([])
  const [selectedServices, setSelectedServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      try {
        // Fetch all shop services
        const allServicesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/shop-owners/shops/${shopId}/services/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        if (!allServicesResponse.ok) {
          throw new Error('Failed to fetch all services')
        }

        const allServicesData = await allServicesResponse.json()
        console.log("allServicesData", allServicesData)

        // Ensure allServicesData is an array
        const servicesArray = Array.isArray(allServicesData)
          ? allServicesData
          : allServicesData.services || []

        setAllServices(servicesArray)

        // Fetch barber's current services
        const barberServicesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/shop-owners/shops/${shopId}/barbers/${barberId}/services`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )

        if (!barberServicesResponse.ok) {
          throw new Error('Failed to fetch barber services')
        }

        const barberServicesData = await barberServicesResponse.json()
        console.log("barberServicesData", barberServicesData)

        // Ensure barberServicesData is an array
        const barberServicesArray = Array.isArray(barberServicesData)
          ? barberServicesData
          : barberServicesData.services || []

        setSelectedServices(barberServicesArray)
      } catch (error) {
        console.error('Error fetching services:', error)
        toast.error('Failed to fetch services')
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchServices()
    }
  }, [isOpen, shopId, barberId, accessToken])

  const toggleService = async (service: Service) => {
    try {
      const isSelected = selectedServices.some(s => s.id === service.id)
      
      if (isSelected) {
        // Remove service
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/shop-owners/shops/${shopId}/barbers/${barberId}/services/${service.id}/`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
  
        if (response.status !== 204) {
          const errorData = await response.json();
          console.error('API Error removing service:', errorData);
          throw new Error(errorData.message || 'Failed to remove service');
        }
  
        setSelectedServices(prev => prev.filter(s => s.id !== service.id))
        toast.success(`Removed ${service.name} from ${barberName}'s services`)
      } else {
        // Add service
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/shop-owners/shops/${shopId}/barbers/${barberId}/services`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify([service.id]), // Changed from object to array
          }
        )
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error adding service:', errorData);
          throw new Error(errorData.message || 'Failed to add service');
        }
  
        setSelectedServices(prev => [...prev, service])
        toast.success(`Added ${service.name} to ${barberName}'s services`)
      }
    } catch (error) {
      console.error('Error toggling service:', error)
      if (error instanceof Error && error.message) {
        toast.error(error.message)
      } else {
        toast.error('Failed to toggle service')
      }
    }
  }
  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Manage Services for {barberName}</DialogTitle>
        </DialogHeader>
        {loading ? (
          <p>Loading services...</p>
        ) : (
          <div className="space-y-4">
            {/* Service Selection */}
            <div>
              <h4 className="text-sm font-medium mb-2">Assign Services:</h4>
              <div className="space-y-2">
                {allServices.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No services available.</p>
                ) : (
                  allServices.map((service) => {
                    const isSelected = selectedServices.some(s => s.id === service.id)
                    return (
                      <div key={service.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`service-${service.id}`}
                          checked={isSelected}
                          onChange={() => toggleService(service)}
                          className="mr-2"
                        />
                        <label htmlFor={`service-${service.id}`} className="flex-1">
                          <span className="font-semibold">{service.name}</span> - ${service.price} - {service.duration}min
                        </label>
                        {isSelected && <Check className="h-4 w-4 text-green-500" />}
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* Selected Services */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Services:</h4>
              <div className="space-y-2">
                {selectedServices.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No services selected</p>
                ) : (
                  selectedServices.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between rounded-md border p-2"
                    >
                      <span>{service.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          ${service.price} - {service.duration}min
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => toggleService(service)}
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end">
              <Button onClick={onClose}>Close</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
