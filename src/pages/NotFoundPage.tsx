import React from "react";
import { NotFoundPage } from "@/components/common";

export default function NotFound() {
  return (
    <NotFoundPage 
      title="404 - Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      buttonText="Go Back Home"
      navigateTo="/"
      containerHeight="min-h-screen"
    />
  );
} 