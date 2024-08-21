import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PrivatePageLayout from "@/layouts/PrivatePageLayout";
import { toast, Toaster } from "sonner";
import { useSelector } from "react-redux";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  timezone: z.string().min(1, { message: "Timezone is required" }),
});

function ProfileSettingsPage() {
  const profile = useSelector((state) => state.profile);
  const { profileData } = profile;
  const [timezones, setTimezones] = useState([]);
  const [filteredTimezones, setFilteredTimezones] = useState([]);
  const [timezoneInput, setTimezoneInput] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profileData?.name || "",
      email: profileData?.email || "",
      timezone: profileData?.timezone || "",
    },
  });

  useEffect(() => {
    if (profileData) {
      form.reset({
        name: profileData.name || "",
        email: profileData.email || "",
        timezone: profileData.timezone || "",
      });
    }
  }, [profileData, form]);

  useEffect(() => {
    // Fetch time zones from API
    axios
      .get("http://worldtimeapi.org/api/timezone")
      .then((response) => {
        setTimezones(response.data);
      })
      .catch((error) => {
        console.error("Error fetching time zones:", error);
      });
  }, []);

  useEffect(() => {
    // Filter timezones based on input
    console.log("heloo", timezoneInput, timezones);
    if (timezoneInput) {
      const filtered = timezones.filter((tz) =>
        tz.toLowerCase().includes(timezoneInput.toLowerCase())
      );
      setFilteredTimezones(filtered);
    } else {
      setFilteredTimezones([]);
    }
  }, [timezoneInput, timezones]);

  const onSubmit = (data) => {
    // Handle form submission here
    console.log(data);
    toast.success("Profile updated successfully!");
  };

  const handleTimezoneChange = (e) => {
    console.log(e.target.value);
    setTimezoneInput(e.target.value);
    form.setValue("timezone", e.target.value);
  };

  const handleTimezoneSelect = (timezone) => {
    setTimezoneInput(timezone);
    setFilteredTimezones([]);
    form.setValue("timezone", timezone);
  };

  return (
    <PrivatePageLayout>
      <div className="container mx-auto p-4 md:max-w-[75%]">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden ">
              <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-25">
                <Button type="file" variant="ghost" className="text-white">
                  Upload Cover Image
                </Button>
              </div>
            </div>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent className="space-y-6">
                {/* Avatar Upload */}
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden">
                    <AvatarImage
                      src={profileData?.avatar}
                      alt="Avatar"
                      className="object-cover w-full h-full"
                    />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-4">
                  {/* Name Input */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Your Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Input */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Your Email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Timezone Selector */}
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="text"
                              placeholder="Select Timezone"
                              value={timezoneInput}
                              onChange={handleTimezoneChange}
                              {...field}
                            />
                            {filteredTimezones.length > 0 && (
                              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-48 overflow-auto">
                                {filteredTimezones.map((tz) => (
                                  <div
                                    key={tz}
                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleTimezoneSelect(tz)}
                                  >
                                    {tz}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
      <Toaster />
    </PrivatePageLayout>
  );
}

export default ProfileSettingsPage;
