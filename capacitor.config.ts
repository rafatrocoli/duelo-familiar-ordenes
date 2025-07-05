
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.d126b6ef19464daf92eb7044eb0d458b',
  appName: 'duelo-familiar-ordenes',
  webDir: 'dist',
  server: {
    url: "https://d126b6ef-1946-4daf-92eb-7044eb0d458b.lovableproject.com?forceHideBadge=true",
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#f59e0b",
      showSpinner: false
    }
  }
};

export default config;
