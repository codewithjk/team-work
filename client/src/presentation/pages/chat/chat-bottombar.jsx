import {
  FileImage,
  Mic,
  Paperclip,
  PlusCircle,
  SendHorizontal,
  XCircleIcon,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { EmojiPicker } from "./emoji-picker";
import { useSelector, useDispatch } from "react-redux";
import { getSocket } from "@/utils/socketClient.config";
import { setMessages } from "../../../application/slice/chatSlice";
import WaveSurfer from "wavesurfer.js";
import RecordRTC from "recordrtc";
import axios from "@/utils/axiosInstance";

export default function ChatBottombar({ isMobile, selectedGroup }) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const wavesurferRef = useRef(null);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { profileData } = useSelector((state) => state.profile);

  useEffect(() => {
    const container = document.getElementById("waveform");
    if (container && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container,
        waveColor: "#ddd",
        progressColor: "#4a90e2",
        cursorWidth: 0,
        height: 50,
        responsive: true,
      });
    }
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const uploadFile = async () => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_API_BASE_URL}/upload`,
        formData
      );
      return response.data;
    } catch (error) {
      console.error("File upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRecordingStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newRecorder = new RecordRTC(stream, { type: "audio" });
      newRecorder.startRecording();
      setRecorder(newRecorder);
      setIsRecording(true);
      wavesurferRef.current.loadBlob(new Blob());
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  const handleRecordingStop = () => {
    if (recorder) {
      recorder.stopRecording(() => {
        const blob = recorder.getBlob();
        if (wavesurferRef.current) {
          wavesurferRef.current.loadBlob(blob);
        }
        sendMessage(createMessage(blob, "audio"));
        setIsRecording(false);
      });
    }
  };

  const createMessage = (content, messageType = "text") => ({
    senderName: profileData.name,
    senderId: profileData._id,
    avatar: profileData.avatar,
    content,
    messageType,
  });

  const sendMessage = (message) => {
    const socket = getSocket();
    socket.emit("sendMessage", { groupId: selectedGroup._id, message });
    setMessage("");
    setFile(null);
    setPreviewUrl(null);
    inputRef.current?.focus();
  };

  const handleSend = async () => {
    if (message.trim() && file == null) {
      sendMessage(createMessage(message.trim()));
    }
    if (file) {
      const urlObject = await uploadFile();
      if (urlObject) {
        sendMessage({
          ...createMessage(message.trim(), "file"),
          attachmentUrl: urlObject.url,
          downloadLink: urlObject.downloadLink,
        });
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    } else if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + "\n");
    }
  };

  return (
    <>
      {previewUrl && (
        <div className="flex items-center justify-between space-x-2 ml-2 bg-slate-900">
          <img
            src={previewUrl}
            alt="Preview"
            className="h-20 object-cover rounded"
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => {
              setFile(null);
              setPreviewUrl(null);
            }}
          >
            <XCircleIcon className="text-red-500" />
          </Button>
        </div>
      )}

      <div className="px-2 py-4 flex justify-between w-full items-center gap-2">
        <div className="flex">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                <PlusCircle size={22} className="text-muted-foreground" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" className="w-full p-2">
              <div className="flex">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  onClick={
                    isRecording ? handleRecordingStop : handleRecordingStart
                  }
                >
                  <Mic size={22} className="text-muted-foreground" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                >
                  <label htmlFor="file-upload">
                    <Paperclip size={22} className="text-muted-foreground" />
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    hidden
                  />
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {!message.trim() && !isMobile && (
            <div className="flex">
              <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0">
                <label htmlFor="file-upload">
                  <Paperclip size={22} className="text-muted-foreground" />
                </label>
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange}
                  hidden
                />
              </Button>
            </div>
          )}
        </div>

        <AnimatePresence initial={false}>
          <motion.div
            key="input"
            className="w-full relative"
            layout
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              opacity: { duration: 0.05 },
              layout: { type: "spring", bounce: 0.15 },
            }}
          >
            {isRecording && <div id="waveform" className="w-full" />}
            <ChatInput
              value={message}
              ref={inputRef}
              onKeyDown={handleKeyPress}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="rounded-full"
            />
            <div className="absolute right-4 bottom-2">
              <EmojiPicker
                onChange={(emoji) => {
                  setMessage((prev) => prev + emoji);
                  inputRef.current?.focus();
                }}
              />
            </div>
          </motion.div>

          {isUploading ? (
            <Button
              className="h-9 w-9 shrink-0"
              variant="ghost"
              size="icon"
              disabled
            >
              <span className="loader" />
            </Button>
          ) : isRecording ? (
            <Button
              onMouseUp={handleRecordingStop}
              className="h-9 w-9 shrink-0"
              variant="ghost"
              size="icon"
            >
              <SendHorizontal size={22} />
            </Button>
          ) : message.trim() || file ? (
            <Button
              onClick={handleSend}
              className="h-9 w-9 shrink-0"
              variant="ghost"
              size="icon"
            >
              <SendHorizontal size={22} />
            </Button>
          ) : (
            <Button
              onMouseDown={handleRecordingStart}
              className="h-9 w-9 shrink-0"
              variant="ghost"
              size="icon"
            >
              <Mic size={22} />
            </Button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
