import React from 'react'
import { Stack } from 'expo-router'
import { IconButton } from 'react-native-paper'
import { useAuth } from '../../context/auth'
import { router } from 'expo-router'
import { useState } from 'react'
import ParentModeModal from '../../components/ParentModeModal'

export default function AppLayout() {
  const [parentModeModalVisible, setParentModeModalVisible] = useState(false)

  const handleParentModeSuccess = () => {
    setParentModeModalVisible(false)
    router.push('/(app)/(parent)')
  }

  return (
    <>
      <Stack 
        screenOptions={{
          headerShown: true,  // Show headers by default
          headerBackVisible: true,
          animation: 'none'
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Atomic Kids ⚛️",
            headerShown: true,  // Show header for main screen
            headerRight: () => (
              <IconButton
                icon="cog"
                onPress={() => setParentModeModalVisible(true)}
              />
            )
          }}
        />
        <Stack.Screen
          name="(parent)"
          options={{
            headerShown: false  // Hide header for parent section since it will be handled by parent layout
          }}
        />
      </Stack>

      <ParentModeModal
        visible={parentModeModalVisible}
        onDismiss={() => setParentModeModalVisible(false)}
        onSuccess={handleParentModeSuccess}
      />
    </>
  )
} 