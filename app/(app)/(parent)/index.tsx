import { View, StyleSheet } from 'react-native'
import { Button, Text, IconButton } from 'react-native-paper'
import { router } from 'expo-router'
import { useAuth } from '@/context/auth'
import { colors } from '@/theme/colors'

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
          contentStyle={styles.buttonContent}
          onPress={() => router.push('/(app)/(parent)/children')}
        >
          Manage Children
        </Button>

        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          onPress={() => router.push('/(app)/(parent)/tasks')}
        >
          Manage Tasks
        </Button>

        <Button
          mode="contained"
          style={[styles.button, styles.secondaryButton]}
          contentStyle={styles.buttonContent}
          onPress={handleGoHome}
        >
          Return to dashboard
        </Button>

        <View style={styles.spacer} />

        <Button
          mode="outlined"
          style={[styles.button, styles.signOutButton]}
          contentStyle={styles.buttonContent}
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
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  button: {
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonContent: {
    paddingVertical: 8,
    height: 56,
  },
  secondaryButton: {
    backgroundColor: colors.cardBackground,
  },
  spacer: {
    flex: 1,
  },
  signOutButton: {
    borderColor: 'red',
    backgroundColor: 'transparent',
    elevation: 0,
    shadowColor: 'transparent',
  },
}) 