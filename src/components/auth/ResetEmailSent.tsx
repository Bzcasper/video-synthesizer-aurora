import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const ResetEmailSent = () => {
  return (
    <div className="w-full text-center space-y-4">
      <h2 className="text-2xl font-bold text-white font-orbitron">
        Check Your Email
      </h2>
      <p className="text-gray-400">
        We've sent a password reset link to your email address.
      </p>
      <Link to="/login">
        <Button
          variant="link"
          className="text-aurora-blue hover:text-aurora-purple"
        >
          Return to login
        </Button>
      </Link>
    </div>
  );
};
