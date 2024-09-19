import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import GlobalProvider from '@/context/GlobalProvider';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />

        <Stack.Screen name="(modals)/onbording" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/welcome" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/customerOrAgency" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/signup" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/forgotPassword" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/verify" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/accountCreatedDone" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/premiumDone" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/resetPasswordDone" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/resetPassword" options={{ headerShown: false }} />

        <Stack.Screen name="(modals)/drivers_all" options={{ headerShadowVisible: false, headerTitle: "Drivers for you", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/hire_vehicles' options={{ headerShadowVisible: false, headerTitle: "Hire Vehicles", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/technician_support' options={{ headerShadowVisible: false, headerTitle: "Technician Support", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/bus_tickets' options={{ headerShadowVisible: false, headerTitle: "Bus Tickets", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/favourite_bus_tickets' options={{ headerShadowVisible: false, headerTitle: "Favourite Bus Tickets", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/holiday_yatra' options={{ headerShadowVisible: false, headerTitle: "Holiday Yatra", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/favourite_holiday_yatra' options={{ headerShadowVisible: false, headerTitle: "Favourite Holiday Yatra", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/vehicle_list' options={{ headerShadowVisible: false, headerTitle: "My Vehicles", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/add_car' options={{ headerShadowVisible: false, headerTitle: "Add Vehicles", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/edit_car' options={{ headerShadowVisible: false, headerTitle: "Edit Vehicles", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/vehicle_servicing_history' options={{ headerShadowVisible: false, headerTitle: "Servicing History", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/add_vehicle_servicing_history' options={{ headerShadowVisible: false, headerTitle: "Add Servicing History", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/edit_vehicle_servicing_history' options={{ headerShadowVisible: false, headerTitle: "Edit Servicing History", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/vehicle_documents' options={{ headerShadowVisible: false, headerTitle: "Vehicle Documents", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/add_vehicle_documents' options={{ headerShadowVisible: false, headerTitle: "Add Vehicle documents", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/edit_vehicle_documents' options={{ headerShadowVisible: false, headerTitle: "Edit Vehicle documents", headerTitleAlign: "center" }} />
        <Stack.Screen name='(modals)/sell_vehicle_list' options={{ headerShadowVisible: false, headerTitle: "Sell Vehicle List", headerTitleAlign: "center" }} />
      </Stack>
    </GlobalProvider>
  );
}
