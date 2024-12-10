import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import { useSelector } from "react-redux";

const VITE_ZEGO_CLOUD_APP_ID = import.meta.env.VITE_ZEGO_CLOUD_APP_ID;
const VITE_ZEGO_CLOUD_SERVER_SECRETE = import.meta.env
  .VITE_ZEGO_CLOUD_SERVER_SECRETE;

function MeetingScreen({ roomId }) {
  console.log(roomId)
  const myMeetingRef = useRef(null);
  const { profileData } = useSelector((state) => state.profile);

  //TODO : update room Id realated to project id and the user details

  useEffect(() => {
    const myMeeting = async (element) => {
      // generate Kit Token
      const appID = VITE_ZEGO_CLOUD_APP_ID;
      const serverSecret = VITE_ZEGO_CLOUD_SERVER_SECRETE;
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        Number(appID),
        serverSecret,
        roomId,
        Date.now().toString(),
        profileData?.name || "test user"
      );
      // Create instance object from Kit Token.
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      // start the call
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

  return (
    <div
      className=" absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 border"
      ref={myMeetingRef}
    ></div>
  );
}

export default MeetingScreen;
