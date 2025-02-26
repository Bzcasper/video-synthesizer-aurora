
export interface UserSettings {
  username: string;
  email: string;
  betaFeatures: boolean;
  developerMode: boolean;
  enhancedLogging: boolean;
  emailNotifications: boolean;
  apiKey: string;
}

export interface TabProps {
  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}
