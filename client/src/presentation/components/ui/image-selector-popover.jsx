import React, { useState } from "react";
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
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="w-full mt-2">
          Upload Cover Image
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <Input
          placeholder="Search Unsplash"
          value={imageSearchQuery}
          onChange={(e) => setImageSearchQuery(e.target.value)}
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
  );
}

export default ImageSelectorPopover;
