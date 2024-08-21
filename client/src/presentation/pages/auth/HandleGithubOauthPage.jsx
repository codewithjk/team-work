import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { signup } from "../../../application/actions/authActions";
// import { Loader } from "shadcn/ui";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
// import { Spinner } from '@/components/ui/spinner'

function HandleGithubOauthPage() {
  const auth = useSelector((state) => state.auth);
  const { loading, isAuthenticated } = auth;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  useEffect(() => {
    async function getUserData(token) {
      try {
        const user = await axios.get("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const emails = await axios.get("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return {
          email: emails.data[0].email,
          name: user.data.login,
          oauthId: user.data.id,
          avatar: user.data.avatar_url,
        };
      } catch (error) {
        console.error("Error fetching user data: ", error);
        return null;
      }
    }

    if (token) {
      getUserData(token).then(async (user) => {
        if (user) {
          console.log("github :", user);
          await dispatch(signup(user));
          if (isAuthenticated) {
            navigate("/home");
          } else {
            navigate("/login");
          }
        }
      });
    }
  }, [token, dispatch, isAuthenticated, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50">
      <Card className="max-w-md w-full p-6 shadow-lg rounded-md">
        <CardHeader>
          <CardTitle>Processing GitHub OAuth</CardTitle>
          <CardDescription>
            Please wait while we authenticate your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center">
          {loading ? (
            // <Loader size="lg" className="text-blue-600" />
            "Loading"
          ) : (
            <p>Redirecting...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default HandleGithubOauthPage;
