import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // For navigation
import { XCircleIcon } from "lucide-react";

const VITE_ZEGO_CLOUD_APP_ID = import.meta.env.VITE_ZEGO_CLOUD_APP_ID;
const VITE_ZEGO_CLOUD_SERVER_SECRETE = import.meta.env.VITE_ZEGO_CLOUD_SERVER_SECRETE;

function MeetingScreen({ roomId,closepopup }) {
  const myMeetingRef = useRef(null);
  const { profileData } = useSelector((state) => state.profile);
  const navigate = useNavigate(); // To handle navigation

  useEffect(() => {
    const myMeeting = async (element) => {
      const appID = VITE_ZEGO_CLOUD_APP_ID;
      const serverSecret = VITE_ZEGO_CLOUD_SERVER_SECRETE;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        Number(appID),
        serverSecret,
        roomId,
        Date.now().toString(),
        profileData?.name || "test user"
      );

      // Create instance object from Kit Token
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      // Start the call
      zp.joinRoom({
        container: element,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
      });
    };

    if (myMeetingRef.current) {
      myMeeting(myMeetingRef.current);
    }
  }, [roomId]);

  // Function to handle the close button
  const handleClose = () => {
    // Navigate to the homepage (or any other page) on close
    navigate('/home');  // Change '/home' to wherever you want to navigate after closing the meeting
  };


  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50 border"
   
    >
      <div    ref={myMeetingRef}>

      </div>
      <XCircleIcon className="absolute top-0 end-0" onClick={()=>closepopup(null)}/>
    </div>
  );
}

export default MeetingScreen;
