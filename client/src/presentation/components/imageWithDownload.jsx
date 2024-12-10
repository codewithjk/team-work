import { DownloadIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

const ImageWithDownload = ({ message }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleDownload = async () => {
    setIsDownloading(true);
    setErrorMessage(""); // Reset error message
    try {
      const response = await fetch(message.attachmentUrl);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = message.attachmentUrl.split("/").pop() || "download";

      link.href = downloadUrl;
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download failed:", error);
      setErrorMessage("Download failed. Please try again."); // Set error message
      toast.error("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const getFileExtension = (url) => url.split(".").pop().toLowerCase();

  const fileExtension = getFileExtension(message.attachmentUrl);

  return (
    <div className="relative group">
      {fileExtension === "pdf" ? (
        <iframe
          src={message.attachmentUrl}
          title="Attachment Preview"
          className="w-full h-auto rounded"
          style={{ height: "300px" }} // Adjust height as needed
        />
      ) : (
        <img
          src={message.attachmentUrl}
          alt="Attachment Preview"
          className="w-full h-auto rounded"
        />
      )}
      {fileExtension !== "pdf" && (
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
      )}
    </div>
  );
};

export default ImageWithDownload;
