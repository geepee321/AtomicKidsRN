import { View, StyleSheet } from 'react-native'
import { Button, Text, IconButton } from 'react-native-paper'
import { router } from 'expo-router'
import { useAuth } from '@/context/auth'

export default function ParentDashboard() {
  const { setParentMode } = useAuth()

  const handleBack = async () => {
    await setParentMode(false)
    router.back()
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          onPress={handleBack}
          size={24}
        />
        <Text variant="headlineMedium">Parent Dashboard</Text>
      </View>
      
      <View style={styles.content}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => router.push('/(app)/(parent)/children')}
        >
          Manage Children
        </Button>

        <Button
          mode="contained"
          style={styles.button}
          onPress={() => router.push('/(app)/(parent)/tasks')}
        >
          Manage Tasks
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  button: {
    marginVertical: 8,
  },
}) 