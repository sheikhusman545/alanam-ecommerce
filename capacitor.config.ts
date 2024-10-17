import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.usman.alanam',
  appName: 'Alanaam',
  webDir: 'www',
  plugins: {
    SplashScreen: {
      "launchShowDuration": 100,
      "launchAutoHide": true,
      "backgroundColor": "#FFFFFF",
      "androidSplashResourceName": "splash_screen",
      "androidScaleType": "CENTER_CROP",
      "showSpinner": false
    },
  },
};

export default config;
