import { View, StyleSheet } from 'react-native'
import { Button, Text, IconButton, Portal, Dialog, ActivityIndicator, TextInput } from 'react-native-paper'
import { router } from 'expo-router'
import { useAuth } from '@/context/auth'
import { colors } from '@/theme/colors'
import { useState } from 'react'

export default function ParentDashboard() {
  const { signOut, setParentPin, user, loading } = useAuth()
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)
  const [showChangePinDialog, setShowChangePinDialog] = useState(false)
  const [newPin, setNewPin] = useState('')
  const [pinError, setPinError] = useState<string>()

  const handleSignOut = async () => {
    setShowSignOutDialog(false)
    try {
      await signOut()
      router.replace('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleChangePin = async () => {
    try {
      await setParentPin(newPin)
      setNewPin('')
      setPinError(undefined)
      setShowChangePinDialog(false)
    } catch (error) {
      setPinError('An error occurred while updating PIN')
    }
  }

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          textColor="black"
          onPress={() => router.push('/(app)/(parent)/children')}
        >
          Manage Children
        </Button>

        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          textColor="black"
          onPress={() => router.push('/(app)/(parent)/tasks')}
        >
          Manage Tasks
        </Button>

        <Button
          mode="contained"
          style={styles.button}
          contentStyle={styles.buttonContent}
          textColor="black"
          onPress={() => {
            setNewPin('')
            setPinError(undefined)
            setShowChangePinDialog(true)
          }}
        >
          Change PIN
        </Button>

        <View style={styles.spacer} />

        <Button
          mode="outlined"
          style={[styles.button, styles.signOutButton]}
          contentStyle={styles.buttonContent}
          textColor="red"
          onPress={() => setShowSignOutDialog(true)}
        >
          Sign Out Parent
        </Button>
      </View>

      <Portal>
        <Dialog visible={showSignOutDialog} onDismiss={() => setShowSignOutDialog(false)}>
          <Dialog.Title>Sign Out</Dialog.Title>
          <Dialog.Content>
            <Text>Do you really want to sign out?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowSignOutDialog(false)}>Cancel</Button>
            <Button textColor="red" onPress={handleSignOut}>Sign Out</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={showChangePinDialog} onDismiss={() => setShowChangePinDialog(false)}>
          <Dialog.Title style={styles.dialogTitle}>Enter New Parent PIN</Dialog.Title>
          <Dialog.Content>
            <TextInput
              placeholder="Enter PIN"
              value={newPin}
              onChangeText={setNewPin}
              keyboardType="number-pad"
              maxLength={6}
              mode="outlined"
              style={styles.pinInput}
              outlineStyle={styles.pinInputOutline}
              error={!!pinError}
            />
            {pinError && <Text style={styles.error}>{pinError}</Text>}
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button 
              mode="outlined" 
              onPress={() => setShowChangePinDialog(false)}
              style={styles.cancelButton}
              labelStyle={styles.cancelButtonText}
            >
              Cancel
            </Button>
            <Button 
              mode="contained" 
              onPress={handleChangePin}
              style={styles.submitButton}
              labelStyle={styles.submitButtonText}
            >
              Submit
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  dialogTitle: {
    textAlign: 'center',
    fontSize: 24,
  },
  pinInput: {
    backgroundColor: 'white',
    marginTop: 8,
  },
  pinInputOutline: {
    borderRadius: 8,
    borderColor: '#6750A4',
  },
  dialogActions: {
    justifyContent: 'center',
    padding: 16,
    gap: 8,
  },
  cancelButton: {
    borderColor: '#6750A4',
    borderRadius: 20,
  },
  cancelButtonText: {
    color: '#6750A4',
  },
  submitButton: {
    backgroundColor: '#6750A4',
    borderRadius: 20,
  },
  submitButtonText: {
    color: 'white',
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
}) 