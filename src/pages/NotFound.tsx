import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { DashboardLayout } from "../App";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <DashboardLayout>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
        <EmptyState
          title="404 - Side ikke fundet"
          description={`Siden '${location.pathname}' eksisterer ikke.`}
          icon="alert"
          actionLabel="Gå til forsiden"
          onAction={handleGoHome}
        />
      </div>
    </DashboardLayout>
  );
};

export default NotFound;
