import React from "react";
import { Home } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-forground-800 animate-bounce">
          404
        </h1>
        <p className="text-2xl font-semibold text-gray-700 mb-4">
          Oops! Page not found
        </p>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a
          href="/home"
          className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        >
          <Home className="w-5 h-5 mr-2" />
          Go Home
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;
