import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/auth';
import { ChildrenProvider } from '../context/children';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { TasksProvider } from '../context/tasks';
import { RewardsProvider } from '../contexts/RewardsContext';
import 'react-native-reanimated'

// Auth state listener component
function AuthStateListener() {
  const segments = useSegments();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth';

    if (!user && !inAuthGroup) {
      // Redirect to the sign-in page if not signed in
      router.replace('/auth/login');
    } else if (user && inAuthGroup) {
      // Redirect away from auth group if signed in
      router.replace('/(app)');
    }
  }, [user, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={MD3LightTheme}>
        <AuthProvider>
          <ChildrenProvider>
            <TasksProvider>
              <RewardsProvider>
                <AuthStateListener />
              </RewardsProvider>
            </TasksProvider>
          </ChildrenProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 