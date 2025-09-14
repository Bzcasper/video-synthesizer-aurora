import React from "react";

interface PasswordStrengthProps {
  passwordStrength: {
    score: number;
    hasMinLength: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    hasUppercase: boolean;
  };
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthProps> = ({
  passwordStrength,
}) => {
  const getPasswordStrengthColor = () => {
    const { score } = passwordStrength;
    if (score === 0) return "bg-gray-500";
    if (score === 1) return "bg-red-500";
    if (score === 2) return "bg-yellow-500";
    if (score === 3) return "bg-blue-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    const { score } = passwordStrength;
    if (score === 0) return "Too Weak";
    if (score === 1) return "Weak";
    if (score === 2) return "Fair";
    if (score === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="space-y-2 animate-in fade-in-50 duration-300">
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium">
          Password Strength: {getPasswordStrengthText()}
        </div>
        <div className="text-xs text-gray-400">{passwordStrength.score}/4</div>
      </div>
      <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`}
          style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
        />
      </div>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
        <li
          className={
            passwordStrength.hasMinLength ? "text-green-500" : "text-gray-400"
          }
        >
          • At least 8 characters
        </li>
        <li
          className={
            passwordStrength.hasUppercase ? "text-green-500" : "text-gray-400"
          }
        >
          • At least 1 uppercase letter
        </li>
        <li
          className={
            passwordStrength.hasNumber ? "text-green-500" : "text-gray-400"
          }
        >
          • At least 1 number
        </li>
        <li
          className={
            passwordStrength.hasSpecial ? "text-green-500" : "text-gray-400"
          }
        >
          • At least 1 special character
        </li>
      </ul>
    </div>
  );
};
