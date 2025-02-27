
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { ResetEmailSent } from '@/components/auth/ResetEmailSent';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      {!isSubmitted ? (
        <>
          <AuthHeader 
            title="Reset Password" 
            description="Enter your email to reset your password" 
          />
          <ResetPasswordForm 
            email={email}
            setEmail={setEmail}
            onSuccess={() => setIsSubmitted(true)}
          />
          <p className="text-center text-sm text-gray-400">
            Remember your password?{" "}
            <Link to="/login" className="text-aurora-blue hover:text-aurora-purple transition-colors">
              Sign in
            </Link>
          </p>
        </>
      ) : (
        <ResetEmailSent />
      )}
    </div>
  );
};

export default ResetPassword;
