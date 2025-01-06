"use client";

import { useEffect, useState } from "react";
import { getSalonDetails } from "@/lib/services/salonService";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, Mail, User, Calendar, AlertCircle } from 'lucide-react';
import { motion } from "framer-motion";
import Link from "next/link";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Service {
  id: number;
  name: string;
  duration: number;
  price: number;
}

interface Schedule {
  id: number;
  day_name: string;
  formatted_time: string;
}

interface Barber {
  id: number;
  full_name: string;
  services: { id: number }[];
  schedules: {
    id: number;
    day_name: string;
    formatted_time: string;
  }[];
}

interface SalonDetails {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  phone_number: string;
  email: string;
  formatted_hours: string;
  is_open: boolean;
  barbers: Barber[];
  services: Service[];
}

interface AppointmentRequest {
  shop_id: number;
  barber_id: number | null;
  service_id: number | null;
  appointment_time: string;
  number_of_people: number;
  user_id: number | null;
  full_name: string;
  phone_number: string;
}

export default function AppointmentPage({ params }: { params: { id: string } }) {
  const [salon, setSalon] = useState<SalonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState("1");
  const [errors, setErrors] = useState({
    fullName: "",
    phoneNumber: "",
  });
  const [isAdvanceBooking, setIsAdvanceBooking] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [timeError, setTimeError] = useState("");
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchSalonDetails = async () => {
      try {
        const data = await getSalonDetails(params.id);
        setSalon(data);
      } catch (error) {
        console.error('Error fetching salon details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSalonDetails();
  }, [params.id]);

  const validateFullName = (name: string) => {
    if (name.length < 3) {
      setErrors(prev => ({ ...prev, fullName: "Name should contain at least 3 characters" }));
    } else {
      setErrors(prev => ({ ...prev, fullName: "" }));
    }
  };

  const validatePhoneNumber = (phone: string) => {
    if (phone.length < 7 || phone.length > 12) {
      setErrors(prev => ({ ...prev, phoneNumber: "Phone number should be between 7-12 characters" }));
    } else {
      setErrors(prev => ({ ...prev, phoneNumber: "" }));
    }
  };

  const getFormattedDateTime = () => {
    if (!appointmentDate || !appointmentTime) return "";
    return new Date(`${appointmentDate}T${appointmentTime}`).toISOString();
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const parseBusinessHours = (formattedHours: string) => {
    const [start, end] = formattedHours.split(' - ');
    return {
      start: new Date(`1970/01/01 ${start}`).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      end: new Date(`1970/01/01 ${end}`).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
    };
  };

  const isWithinBusinessHours = (time: string) => {
    if (!salon?.formatted_hours || !time) return false;
    
    const { start, end } = parseBusinessHours(salon.formatted_hours);
    return time >= start && time <= end;
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = e.target.value;
    setAppointmentTime(selectedTime);
    
    if (!isWithinBusinessHours(selectedTime)) {
      setTimeError(`Please select a time between ${salon?.formatted_hours}`);
    } else {
      setTimeError("");
    }
  };

  const handleBookAppointment = async () => {
    try {
      setIsBooking(true);
      
      const appointmentData: AppointmentRequest = {
        shop_id: Number(params.id),
        barber_id: isAdvanceBooking ? selectedBarber : null,
        service_id: isAdvanceBooking ? selectedService : null,
        appointment_time: getFormattedDateTime(),
        number_of_people: Number(numberOfPeople),
        user_id: null,
        full_name: fullName,
        phone_number: phoneNumber,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to book appointment');
      }

      // Show success message using sonner toast
      toast.success("Appointment Booked!", {
        description: "Your appointment has been successfully scheduled.",
      });

      // Optional: Reset form or redirect
      // router.push(`/appointments/${data.id}`);
      
    } catch (error) {
      // Show error message using sonner toast
      toast.error("Booking Failed", {
        description: error instanceof Error ? error.message : "Failed to book appointment",
      });
    } finally {
      setIsBooking(false);
    }
  };

  // Add this helper function to filter barbers based on selected service
  const getBarbersByService = (serviceId: number | null) => {
    if (!serviceId) return salon.barbers;
    
    return salon.barbers.filter(barber => 
      barber.services.some(service => service.id === serviceId)
    );
  };

  // Update the service selection handler to reset barber selection
  const handleServiceSelection = (serviceId: number) => {
    setSelectedService(serviceId);
    setSelectedBarber(null); // Reset barber selection when service changes
  };

  if (loading) {
    return (
      <div className="container py-8 text-center">
        <div className="animate-pulse">Loading salon details...</div>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="container py-8 text-center">
        <div className="text-red-500">Salon not found</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container py-8 min-h-screen"
    >
      <Card className="p-8 max-w-3xl mx-auto shadow-lg rounded-lg">
        <div className="space-y-6">
          {/* Salon Header */}
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold mb-6 text-primary">{salon.name}</h1>
            
            {/* Improved Shop Details Layout */}
            <div className="grid md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">{salon.address}</p>
                    <p className="text-muted-foreground">{salon.city}, {salon.state} {salon.zip_code}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <p className="text-muted-foreground">{salon.formatted_hours}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Contact</p>
                    <p className="text-muted-foreground">{salon.phone_number}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">{salon.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Section - Moved Up */}
          <div className="border-t pt-6">
            <h2 className="text-2xl font-semibold mb-4">Your Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    validateFullName(e.target.value);
                  }}
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    validatePhoneNumber(e.target.value);
                  }}
                  className={errors.phoneNumber ? 'border-red-500' : ''}
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
              </div>
              <div>
                <Label htmlFor="numberOfPeople">Number of People</Label>
                <Select value={numberOfPeople} onValueChange={setNumberOfPeople}>
                  <SelectTrigger id="numberOfPeople">
                    <SelectValue placeholder="Select number of people" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'Person' : 'People'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="appointmentDate">Appointment Date</Label>
                <Input
                  id="appointmentDate"
                  type="date"
                  min={getTomorrowDate()}
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="appointmentTime">Appointment Time</Label>
                <Input
                  id="appointmentTime"
                  type="time"
                  value={appointmentTime}
                  onChange={handleTimeChange}
                  className={timeError ? 'border-red-500' : ''}
                />
                {timeError && (
                  <p className="text-red-500 text-sm mt-1">{timeError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Advance Booking Toggle */}
          <div className="border-t pt-6">
            <div className="flex items-center justify-between mb-6">
              <Label htmlFor="advanceBooking" className="text-lg font-medium">Advance Booking</Label>
              <Switch
                id="advanceBooking"
                checked={isAdvanceBooking}
                onCheckedChange={setIsAdvanceBooking}
              />
            </div>

            {isAdvanceBooking && (
              <>
                {/* Services Section */}
                <div className="space-y-4 mb-6">
                  <h2 className="text-xl font-semibold">Select a Service</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {salon.services.map((service) => (
                      <Card
                        key={service.id}
                        className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                          selectedService === service.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleServiceSelection(service.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{service.name}</p>
                            <p className="text-sm text-muted-foreground">
                              Duration: {service.duration} min
                            </p>
                          </div>
                          <p className="font-medium text-primary">${service.price}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Updated Barbers Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Select a Barber</h2>
                  {selectedService ? (
                    <>
                      {getBarbersByService(selectedService).length > 0 ? (
                        <div className="grid md:grid-cols-2 gap-4">
                          {getBarbersByService(selectedService).map((barber) => (
                            <Card
                              key={barber.id}
                              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                                selectedBarber === barber.id ? 'ring-2 ring-primary' : ''
                              }`}
                              onClick={() => setSelectedBarber(barber.id)}
                            >
                              <div className="flex items-center gap-4">
                                <div className="bg-primary/10 p-3 rounded-full">
                                  <User className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{barber.full_name}</p>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {barber.schedules.map((schedule) => (
                                      <p key={schedule.id}>
                                        {schedule.day_name}: {schedule.formatted_time}
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>No Barbers Available</AlertTitle>
                          <AlertDescription>
                            Unfortunately, no barber is currently available for this service. Please select a different service or try again later.
                          </AlertDescription>
                        </Alert>
                      )}
                    </>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Select a Service</AlertTitle>
                      <AlertDescription>
                        Please select a service first to see available barbers.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Navigation Link and Book Button Container */}
          <div className="border-t pt-6 space-y-4">
            <Link 
              href={`/salons/${params.id}/check-in`}
              className="block text-center text-primary hover:underline"
            >
              Prefer to check in now? Click here
            </Link>
            
            <div className="flex justify-center">
              <Button
                size="lg"
                className="min-w-[200px]"
                disabled={
                  isBooking ||
                  !fullName || 
                  !phoneNumber || 
                  !appointmentDate ||
                  !appointmentTime ||
                  timeError || 
                  errors.fullName || 
                  errors.phoneNumber ||
                  (isAdvanceBooking && (!selectedService || !selectedBarber))
                }
                onClick={handleBookAppointment}
              >
                {isBooking ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Booking...
                  </>
                ) : (
                  <>
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Appointment
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Error Alert */}
          {(errors.fullName || errors.phoneNumber || timeError) && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Please correct the following errors:
                <ul className="list-disc list-inside mt-2">
                  {errors.fullName && <li>{errors.fullName}</li>}
                  {errors.phoneNumber && <li>{errors.phoneNumber}</li>}
                  {timeError && <li>{timeError}</li>}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

