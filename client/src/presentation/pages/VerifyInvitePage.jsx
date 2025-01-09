import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux"; 
import projectApi from "../../infrastructure/api/projectApi";
import { Button } from "@/components/ui/button"; 


const VerifyInvitationPage = () => {
  const { token } = useParams(); 
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const auth = useSelector((state) => state.auth);
  const { user } = auth; 

  // Function to verify invitation
  const handleVerify = async () => {
    setButtonLoading(true);
    try {
      const response = await projectApi.verifyInvitationToken(token); 
      const { projectId } = response.data;
      toast.success("Invitation successfully verified!");
      if (projectId) {
        navigate(`/projects/${projectId}/tasks`); 
      } else {
        navigate("/"); 
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
      setError(err.message); 
    } finally {
      setButtonLoading(false); 
    }
  };

  const renderError = () => (
    <div className="flex flex-col items-center justify-center h-screen px-6 py-8 bg-background">
      <h1 className="text-lg font-medium text-red-600">Verification Failed</h1>
      <p className="mt-2 text-gray-600">
        Please try again or contact support if the issue persists.
      </p>
      <Button onClick={() => navigate("/")} className="mt-4">
        Go to Homepage
      </Button>
    </div>
  );


  const renderContent = () => (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 md:px-8 bg-background">
      <h4 className="text-2xl font-semibold mb-6 text-muted-foreground">Verify Invitation</h4>

   
      {!user && (
        <div className="text-center mb-6">
          <h4 className=" text-gray-600 mb-4 text-2xl">
            If you are not a user, please create an account or log in.
          </h4>
          <Button onClick={() => window.open("/login", "_blank")} className="mb-4">
            Login
          </Button>
        </div>
      )}
      <Button
        onClick={handleVerify}
        className={`mt-4 w-full sm:w-auto ${!user && `hover:`} `}
        disabled={!user || buttonLoading} // Disable button if no user or if loading
      >
        {buttonLoading ? "Verifying..." : "Verify Invitation"}
      </Button>
    </div>
  );

  return error ? renderError() : renderContent();
};

export default VerifyInvitationPage;
