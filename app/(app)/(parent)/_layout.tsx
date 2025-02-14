import { Stack } from 'expo-router';

export default function ParentLayout() {
  return (
    <Stack 
      screenOptions={{
        headerShown: true,  // Show headers by default
        headerBackTitleVisible: true,  // Show back button text
        headerBackTitle: "Home",
        headerBackVisible: true  // Ensure back button is always visible
      }}
    >
      <Stack.Screen 
        name="index"
        options={{
          title: "Parent Dashboard",
          headerLargeTitle: false,
          headerBackVisible: true  // Explicitly enable back button
        }}
      />
      <Stack.Screen 
        name="children/index"  // Change back to children/index
        options={{
          title: "Children",
          headerBackTitle: "Dashboard"  // Text shown in back button
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
          headerBackTitle: "Dashboard"
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