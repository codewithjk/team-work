import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import projectApi from "../../infrastructure/api/projectApi";

function VerifyInvitationPage() {
  const { token } = useParams(); // Extract the token from URL parameters
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function verifyToken() {
      try {
        const response = await projectApi.verifyInvitationToken(token);
        console.log(response)
        // if (response.status === 200) {
        //   // Successfully verified
        //   toast.success("Invitation verified successfully!");
        //   // Redirect to the login or dashboard page
        //   navigate("/home");
        // } else {
        //   // Verification failed
          
        //   toast.error("Invalid or expired token.");
        //   navigate("/error");
        // }
      } catch (err) {
        // Handle errors   
        toast.error("An error occurred. Please try again.");
        setError(err.message);
        navigate("/error");
      } finally {
        setLoading(false);
        setError('')
      }
    }
    verifyToken();
    return ()=>{
      setError("")
    }
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="mt-4 text-gray-600">Verifying your invitation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-lg font-medium text-red-600">
          Verification Failed
        </h1>
        <p className="mt-2 text-gray-600">
          Please try again or contact support if the issue persists.
        </p>
        <Button onClick={() => navigate("/")} className="mt-4">
          Go to Homepage
        </Button>
      </div>
    );
  }

  return null; // Should not reach here if loading and error states are handled properly
}

export default VerifyInvitationPage;
