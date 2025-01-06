import { Salon } from "@/types/salon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface SalonListProps {
  salons: Salon[];
  isLoading: boolean;
}

export default function SalonList({ salons, isLoading }: SalonListProps) {
  const router = useRouter();

  if (isLoading) {
    return <div className="text-center">Loading salons...</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {salons.map((salon, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">{salon.name}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {salon.address}, {salon.city}, {salon.state}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {salon.opening_time.slice(0, 5)} - {salon.closing_time.slice(0, 5)}
              </p>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Wait time: {salon.average_wait_time} min
            </p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button 
                onClick={() => router.push(`/salons/${salon.id}/check-in`)}
                variant="default"
              >
                Check In
              </Button>
              <Button 
                onClick={() => router.push(`/salons/${salon.id}/appointment`)}
                variant="outline"
              >
                Book Appointment
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
} 