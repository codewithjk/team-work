import axios from "@/utils/axiosInstance";


export const uploadFiles = async (files) => {
    // setIsUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    try {
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_API_BASE_URL}/upload`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data; // Array of file objects
    } catch (error) {
        console.error("File upload error:", error);
    } finally {
        // setIsUploading(false);
    }
};

