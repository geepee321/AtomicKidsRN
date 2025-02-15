import { View, StyleSheet } from 'react-native'
import { Button, Text, IconButton } from 'react-native-paper'
import { router } from 'expo-router'
import { useAuth } from '@/context/auth'

export default function ParentDashboard() {
  const { setParentMode, signOut } = useAuth()

  const handleBack = async () => {
    await setParentMode(false)
    router.back()
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleGoHome = async () => {
    await setParentMode(false)
    router.back()
  }

  return (
    <View style={styles.container}>
      
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

        <Button
          mode="outlined"
          style={styles.button}
          onPress={handleGoHome}
        >
          Return to dashboard
        </Button>

        <View style={styles.spacer} />

        <Button
          mode="outlined"
          style={styles.signOutButton}
          textColor="red"
          onPress={handleSignOut}
        >
          Sign Out Parent
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
  spacer: {
    flex: 1,
  },
  signOutButton: {
    borderColor: 'red',
  },
}) 