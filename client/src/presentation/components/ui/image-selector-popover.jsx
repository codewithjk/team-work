import React, { useState, useEffect } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

function ImageSelectorPopover({ onSelectImage }) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [imageSearchQuery, setImageSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [initialImage, setInitialImage] = useState(null);

  useEffect(() => {
    fetchInitialImages();
  }, []);

  const fetchInitialImages = async () => {
    try {
      const response = await axios.get(`https://api.unsplash.com/photos`, {
        params: { per_page: 20 }, // Adjust the number of images you want to load initially
        headers: {
          Authorization: `Client-ID ${unsplashAccessKey}`,
        },
      });
      setSearchResults(response.data);
      if (response.data.length > 0) {
        setInitialImage(response.data[0].urls.full);
        onSelectImage(response.data[0].urls.full);
      }
    } catch (error) {
      console.error("Error fetching initial images:", error);
    }
  };

  const fetchImagesFromUnsplash = async () => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`,
        {
          params: { query: imageSearchQuery, per_page: 20 }, // Adjust the number of search results
          headers: {
            Authorization: `Client-ID ${unsplashAccessKey}`,
          },
        }
      );
      setSearchResults(response.data.results);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleImageSearchClick = () => {
    fetchImagesFromUnsplash();
  };

  const handleImageSelect = (imageUrl) => {
    onSelectImage(imageUrl);
    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen} className="flex justify-center w-10">
      <PopoverTrigger asChild>
        <Button variant="ghost" className="w-full mt-2">
          Change Cover
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-4 bg-background text-foreground rounded-lg ">
        <div className="flex items-center space-x-2 mb-4 ">
          <Input
            placeholder="Search Unsplash"
            value={imageSearchQuery}
            onChange={(e) => setImageSearchQuery(e.target.value)}
            className="flex-1 rounded-lg bg-background text-foreground"
          />
          <Button type="button" onClick={handleImageSearchClick}>
            Search
          </Button>
        </div>
        <div className="grid grid-cols-4 gap-2 max-h-60 overflow-auto">
          {searchResults.map((image) => (
            <img
              key={image.id}
              src={image.urls.small}
              alt={image.alt_description}
              className="cursor-pointer object-cover w-full h-24 rounded-lg hover:opacity-80 transition-opacity"
              onClick={() => handleImageSelect(image.urls.full)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ImageSelectorPopover;
