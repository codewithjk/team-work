import React, { useEffect, useRef, useCallback } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";

const VITE_ZEGO_CLOUD_APP_ID = import.meta.env.VITE_ZEGO_CLOUD_APP_ID;
const VITE_ZEGO_CLOUD_SERVER_SECRETE = import.meta.env.VITE_ZEGO_CLOUD_SERVER_SECRETE;

const MeetingScreen = ({ roomId, onClose }) => {
  const myMeetingRef = useRef(null);
  const zegoRef = useRef(null);
  const { profileData } = useSelector((state) => state.profile);

  const initializeZegoCloud = useCallback(
    async (element) => {
      const appID = VITE_ZEGO_CLOUD_APP_ID;
      const serverSecret = VITE_ZEGO_CLOUD_SERVER_SECRETE;

      // Generate token for Zego
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        Number(appID),
        serverSecret,
        roomId,
        Date.now().toString(),
        profileData?.name || "test user"
      );

      // Create and join room
      zegoRef.current = ZegoUIKitPrebuilt.create(kitToken);
      await zegoRef.current.joinRoom({
        container: element,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        onLeaveRoom: () => {
          handleLeaveRoom();
        },
      });
    },
    [roomId, profileData]
  );

  const handleLeaveRoom = useCallback(() => {
    if (zegoRef.current) {
      zegoRef.current.destroy();
      zegoRef.current = null;
    }
    if (myMeetingRef.current) {
      myMeetingRef.current.innerHTML = ""; // Clear DOM content
    }
    onClose(); // Notify parent to hide the MeetingScreen
  }, [onClose]);

  useEffect(() => {
    if (myMeetingRef.current) {
      initializeZegoCloud(myMeetingRef.current);
    }

    return () => {
      if (zegoRef.current) {
        zegoRef.current.destroy();
        zegoRef.current = null;
      }
      if (myMeetingRef.current) {
        myMeetingRef.current.innerHTML = ""; // Clear DOM content
      }
    };
  }, [initializeZegoCloud]);

  return (
    <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/75">
      <div className="relative w-full h-full">
       
        <div ref={myMeetingRef} className="w-full h-full"></div>
      </div>
    </div>
  );
};

export default MeetingScreen;
