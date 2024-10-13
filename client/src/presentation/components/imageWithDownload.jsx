import { DownloadIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ImageWithDownload = ({ message }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(message.attachmentUrl);
      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      const filename = message.attachmentUrl.split("/").pop() || "download.jpg";
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      // Add error notification here
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative group">
      <img
        src={message.attachmentUrl}
        alt="Attachment Preview"
        className="w-full h-auto rounded"
      />
      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          onClick={handleDownload}
          className="text-sm hover:bg-primary/90"
          size="sm"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <DownloadIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ImageWithDownload;
