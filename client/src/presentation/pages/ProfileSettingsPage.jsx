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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { TIMEZONES } from "../../constants/timezones";

const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  timezone: z.string().min(1, { message: "Timezone is required" }),
  coverPhoto: z.string().url({ message: "Invalid URL" }).optional(),
});

function ProfileSettingsPage() {
  const profile = useSelector((state) => state.profile);
  const { profileData } = profile;
  const [timezones, setTimezones] = useState([]);
  const [filteredTimezones, setFilteredTimezones] = useState([]);
  const [timezoneInput, setTimezoneInput] = useState("");
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: profileData?.name || "",
      email: profileData?.email || "",
      timezone: profileData?.timezone || "",
      coverPhoto: profileData?.coverPhoto || "",
    },
  });

  useEffect(() => {
    if (profileData) {
      form.reset({
        name: profileData.name || "",
        email: profileData.email || "",
        timezone: profileData.timezone || "",
        coverPhoto: profileData.coverPhoto || "",
      });
    }
  }, [profileData, form]);

  useEffect(() => {
    // Filter timezones based on input
    if (timezoneInput) {
      const filtered = TIMEZONES.filter((tz) =>
        tz.toLowerCase().includes(timezoneInput.toLowerCase())
      );
      setFilteredTimezones(filtered);
    } else {
      setFilteredTimezones([]);
    }
  }, [timezoneInput]);

  const fetchImagesFromUnsplash = async () => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`,
        {
          params: { query: imageSearchQuery },
          headers: {
            Authorization: `Client-ID ${unsplashAccessKey}`,
          },
        }
      );
      setSearchResults(response.data.results);
      console.log(response.data.results);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const onSubmit = (data) => {
    // Handle form submission here
    console.log("Submitted data: ", data);
    toast.success("Profile updated successfully!");
  };

  const handleTimezoneChange = (e) => {
    setTimezoneInput(e.target.value);
    form.setValue("timezone", e.target.value);
  };

  const handleTimezoneSelect = (timezone) => {
    setTimezoneInput(timezone);
    setFilteredTimezones([]);
    form.setValue("timezone", timezone);
  };

  const handleImageSearchQueryChange = (e) => {
    setImageSearchQuery(e.target.value);
  };

  const handleImageSearchClick = () => {
    fetchImagesFromUnsplash();
  };

  const handleImageSelect = (imageUrl) => {
    form.setValue("coverPhoto", imageUrl);
    setPopoverOpen(false);
  };

  return (
    <PrivatePageLayout>
      <div className="container mx-auto p-4 md:max-w-[75%]">
        <Card className="shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="coverPhoto"
                render={({ field }) => {}}
              />
              <CardHeader>
                <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={form.watch("coverPhoto") || "default-cover.jpg"}
                    alt="Cover"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-25">
                    <Popover open={isPopoverOpen} onOpenChange={setPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-white"
                          onClick={() => setPopoverOpen(true)}
                        >
                          Upload Cover Image
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 p-4">
                        <Input
                          placeholder="Search Unsplash"
                          value={imageSearchQuery}
                          onChange={handleImageSearchQueryChange}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          className="mt-2 w-full"
                          onClick={handleImageSearchClick}
                        >
                          Search
                        </Button>
                        <div className="mt-4 grid grid-cols-2 gap-2 max-h-60 overflow-auto">
                          {searchResults.map((image) => (
                            <img
                              key={image.id}
                              src={image.urls.small}
                              alt={image.alt_description}
                              className="cursor-pointer object-cover w-full h-28 rounded"
                              onClick={() => handleImageSelect(image.urls.full)}
                            />
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <CardTitle>Profile Settings</CardTitle>
              </CardHeader>

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

              <CardFooter className="space-x-2">
                <Button type="submit" variant="primary">
                  Save
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
