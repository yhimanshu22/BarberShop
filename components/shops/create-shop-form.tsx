"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const shopFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zip_code: z.string().min(1, "ZIP code is required"),
  phone_number: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  average_wait_time: z.number().min(0),
  has_advertisement: z.boolean().default(false),
  advertisement_start_date: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid start date format",
    }),
  advertisement_end_date: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), {
      message: "Invalid end date format",
    }),
  is_advertisement_active: z.boolean().default(false),
  opening_time: z.string().min(1, "Opening time is required"),
  closing_time: z.string().min(1, "Closing time is required"),
});

export default function CreateShopForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof shopFormSchema>>({
    resolver: zodResolver(shopFormSchema),
    defaultValues: {
      has_advertisement: false,
      is_advertisement_active: false,
      opening_time: "",
      closing_time: "",
    },
  });

  async function uploadAdvertisement(
    shopId: number,
    file: File,
    startDate: string | undefined,
    endDate: string | undefined,
    isActive: boolean
  ): Promise<void> {
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      // Format dates to match backend expected format: "YYYY-MM-DDTHH:mm:ss.SSSZ"
      if (startDate) {
        const date = new Date(startDate);
        const formattedStartDate = date.toISOString(); // This will give us the exact format needed
        console.log('Formatted start date:', formattedStartDate); // For debugging
        formData.append("advertisement_start_date", formattedStartDate);
      }
      
      if (endDate) {
        const date = new Date(endDate);
        const formattedEndDate = date.toISOString(); // This will give us the exact format needed
        console.log('Formatted end date:', formattedEndDate); // For debugging
        formData.append("advertisement_end_date", formattedEndDate);
      }

      formData.append("is_active", isActive.toString());

      // Log the FormData for debugging
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const session = await getSession();
      if (!session?.user?.accessToken) {
        throw new Error("No access token found");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/shop-owners/shops/${shopId}/advertisement`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `Failed to upload advertisement: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Advertisement upload error:", error);
      throw error;
    }
  }

  async function onSubmit(values: z.infer<typeof shopFormSchema>) {
    try {
      setIsLoading(true);

      const session = await getSession();
      if (!session?.user?.accessToken) {
        toast.error("No access token found. Please login again.");
        return;
      }

      // Create shop first
      const shopPayload = {
        name: values.name,
        address: values.address,
        city: values.city,
        state: values.state,
        zip_code: values.zip_code,
        phone_number: values.phone_number,
        email: values.email,
        average_wait_time: values.average_wait_time,
        has_advertisement: values.has_advertisement,
        opening_time: values.opening_time,
        closing_time: values.closing_time,
      };

      const shopResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shop-owners/shops/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
        body: JSON.stringify(shopPayload),
      });

      if (!shopResponse.ok) {
        const errorData = await shopResponse.json().catch(() => null);
        throw new Error(errorData?.detail || `Failed to create shop: ${shopResponse.statusText}`);
      }

      const shopData = await shopResponse.json();

      // If has advertisement, upload the image
      if (values.has_advertisement && imageFile) {
        try {
          await uploadAdvertisement(
            shopData.id,
            imageFile,
            values.advertisement_start_date,
            values.advertisement_end_date,
            values.is_advertisement_active
          );
          toast.success("Shop and advertisement created successfully");
        } catch (uploadError) {
          toast.error("Shop created but failed to upload advertisement");
          return;
        }
      } else {
        toast.success("Shop created successfully");
      }

      router.push("/shop/shops");
    } catch (error) {
      console.error("Submit error:", error);
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Shop Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter shop name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter street address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Enter city" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="Enter state" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="Enter ZIP code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Enter email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="opening_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="closing_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Closing Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="average_wait_time"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Average Wait Time (minutes)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter average wait time" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="has_advertisement"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel>Has Advertisement</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("has_advertisement") && (
          <>
            <FormItem>
              <FormLabel>Advertisement Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 5 * 1024 * 1024) {
                        toast.error("Image size should be less than 5MB");
                        e.target.value = '';
                        return;
                      }
                      if (!file.type.startsWith('image/')) {
                        toast.error("Please upload an image file");
                        e.target.value = '';
                        return;
                      }
                      setImageFile(file);
                    } else {
                      setImageFile(null);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            
            <FormField
              control={form.control}
              name="advertisement_start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Advertisement Start Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        // Validate end date is after start date
                        const endDate = form.getValues("advertisement_end_date");
                        if (endDate && new Date(e.target.value) >= new Date(endDate)) {
                          form.setError("advertisement_end_date", {
                            message: "End date must be after start date"
                          });
                        } else {
                          form.clearErrors("advertisement_end_date");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="advertisement_end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Advertisement End Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="datetime-local" 
                      {...field}
                      min={form.getValues("advertisement_start_date")}
                      onChange={(e) => {
                        field.onChange(e);
                        // Validate end date is after start date
                        const startDate = form.getValues("advertisement_start_date");
                        if (startDate && new Date(e.target.value) <= new Date(startDate)) {
                          form.setError("advertisement_end_date", {
                            message: "End date must be after start date"
                          });
                        } else {
                          form.clearErrors("advertisement_end_date");
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Shop"}
        </Button>
      </form>
    </Form>
  );
} 