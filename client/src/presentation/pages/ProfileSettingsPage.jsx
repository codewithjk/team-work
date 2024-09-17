import React, { useEffect, useState } from "react";
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
import { toast, Toaster } from "sonner";
import { useSelector } from "react-redux";
import ImageSelectorPopover from "@/components/ui/image-selector-popover";
import profileApi from "../../infrastructure/api/profileApi";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  timezone: z.string().min(1, { message: "Timezone is required" }),
  coverPhoto: z.string().url({ message: "Invalid URL" }).optional(),
});

function ProfileSettingsPage() {
  const profile = useSelector((state) => state.profile);
  const { profileData } = profile;
  const [coverImage, setCoverPhoto] = useState("");

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
    const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    form.setValue("timezone", currentTimeZone);
  }, [form]);

  const handleImageSelect = (imageUrl) => {
    setCoverPhoto(imageUrl);
    form.setValue("coverPhoto", imageUrl);
  };

  useEffect(() => {
    if (profileData) {
      form.reset({
        name: profileData.name || "",
        email: profileData.email || "",
        timezone: profileData.timezone || form.getValues("timezone"),
        coverPhoto: profileData.coverPhoto || "",
      });
    }
  }, [profileData, form]);

  const onSubmit = async (data) => {
    const response = await profileApi.updateProfile(data);
    console.log(response);
    if (response.status === 200) {
      const updatedUser = await response.data.user;
      toast.success("Profile updated successfully");
      form.reset({
        name: updatedUser.name || "",
        email: updatedUser.email || "",
        timezone: updatedUser.timezone || form.getValues("timezone"),
        coverPhoto: updatedUser.coverPhoto || "",
      });
    } else {
      toast.error("Failed to up date profile");
    }
  };

  return (
    <div className=" p-4 overflow-scroll ">
      <Card className="shadow-lg md:max-w-[75%] mx-auto ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <div className="relative h-48 bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={coverImage || "default-cover.jpg"}
                  alt="Cover"
                  className="object-cover w-full h-full"
                />
                <div className="absolute bottom-0 right-1 flex justify-center items-center bg-opacity-25">
                  <ImageSelectorPopover onSelectImage={handleImageSelect} />
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
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className=" font-extrabold text-5xl">
                    {profileData?.name[0].toUpperCase()}
                  </AvatarFallback>
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
                        <Input type="text" placeholder="Your Name" {...field} />
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

                {/* Timezone Display */}
                <FormField
                  control={form.control}
                  name="timezone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timezone</FormLabel>
                      <FormControl>
                        <Input type="text" readOnly {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>

            <CardFooter className="space-x-2">
              <Button type="submit">Save</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Toaster />
    </div>
  );
}

export default ProfileSettingsPage;
