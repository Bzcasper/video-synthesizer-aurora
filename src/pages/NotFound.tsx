import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-aurora-black">
      <div className="text-center w-full max-w-md px-4">
        <h1 className="text-4xl font-bold mb-4 text-aurora-blue">404</h1>
        <p className="text-xl text-gray-400 mb-8">Oops! Page not found</p>
        <Button
          className="bg-aurora-blue hover:bg-aurora-purple transition-colors"
          onClick={() => (window.location.href = "/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
