import 'dotenv/config';

export default {
  expo: {
    name: "PushpakRide-User",
    slug: "PushpakRide-User",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    scheme: "pushpakrideuser",
    newArchEnabled: true,
    userInterfaceStyle: "automatic",

    splash: {
      image: "./src/assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },

    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.pushpakride.user",
      config: {
        googleMapsApiKey: process.env.GOOGLE_MAP_API_KEY,
      },
    },

    android: {
      package: "com.pushpakride.user",
      adaptiveIcon: {
        foregroundImage: "./src/assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAP_API_KEY,
        },
      },
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./src/assets/images/favicon.png",
    },

    plugins: [
      "expo-secure-store",
      "expo-router",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Allow $(PRODUCT_NAME) to use your location.",
        },
      ]
    ],

    experiments: {
      typedRoutes: true,
    },
  },
};