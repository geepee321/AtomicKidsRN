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
      // Use replace with immediate option to prevent animation
      router.replace('/auth/login', { immediate: true });
    } else if (user && inAuthGroup) {
      // Use replace with immediate option to prevent animation
      router.replace('/(app)', { immediate: true });
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