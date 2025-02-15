import { Stack } from 'expo-router';

export default function ParentLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: true,  // Show headers by default
        headerBackVisible: true  // Ensure back button is always visible
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          title: "Settings",
          headerBackTitle: "Home"
        }}
      />

      <Stack.Screen 
        name="children/index"
        options={{
          title: "Children",
          headerBackTitle: "Settings"
        }}
      />
      <Stack.Screen 
        name="children/new"
        options={{
          title: "Add Child",
          presentation: 'modal'
        }}
      />
      <Stack.Screen 
        name="tasks/index"
        options={{
          title: "Tasks",
          headerBackTitle: "Settings"
        }}
      />
      <Stack.Screen 
        name="tasks/new"
        options={{
          title: "New Task",
          presentation: 'modal'
        }}
      />
      <Stack.Screen 
        name="tasks/[id]"
        options={{
          title: "Edit Task",
          headerBackTitle: "Tasks"
        }}
      />
    </Stack>
  );
}