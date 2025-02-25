
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
  return (
    <div className="w-full max-w-md mx-auto text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-white font-orbitron">Check Your Email</h2>
        <p className="text-gray-400">
          We've sent you a verification link. Please check your email and click the link to verify your account.
        </p>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Didn't receive the email? Check your spam folder or try signing in to resend the verification email.
        </p>
        
        <Link to="/login">
          <Button className="bg-gradient-to-r from-aurora-purple to-aurora-blue hover:from-aurora-blue hover:to-aurora-purple">
            Return to Login
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
