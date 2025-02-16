import { Stack, router } from 'expo-router';
import { IconButton } from 'react-native-paper';

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
          headerLeft: () => (
            <IconButton
              icon="close"
              onPress={() => router.back()}
            />
          )
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
        name="children/[id]"
        options={{
          title: "Edit Child",
          headerBackTitle: "Children"
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
      <Stack.Screen 
        name="rewards/index"
        options={({ route }) => ({
          title: route.params?.childName ? `${route.params.childName}'s Characters` : 'Characters',
          headerLeft: () => (
            <IconButton
              icon="close"
              onPress={() => router.back()}
            />
          )
        })}
      />
    </Stack>
  );
}