import { Stack } from 'expo-router'

export default function AppLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: true,  // Show headers by default
        headerBackVisible: true,
        headerBackTitleVisible: true
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "AtomicKids",
          headerShown: true  // Show header for main screen
        }}
      />
      <Stack.Screen
        name="(parent)"
        options={{
          headerShown: false,
          headerBackTitle: "Home"
        }}
      />
    </Stack>
  )
} 