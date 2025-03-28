
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
      <EmptyState
        title="404 - Side ikke fundet"
        description={`Siden '${location.pathname}' eksisterer ikke.`}
        icon="alert"
        actionLabel="Gå til forsiden"
        onAction={() => window.location.href = "/"}
      />
    </div>
  );
};

export default NotFound;
