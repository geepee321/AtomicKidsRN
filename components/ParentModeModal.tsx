import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import { Modal, Portal, Text, TextInput, Button } from 'react-native-paper'
import { useAuth } from '../context/auth'

type ParentModeModalProps = {
  visible: boolean
  onDismiss: () => void
  onSuccess: () => void
}

export default function ParentModeModal({ visible, onDismiss, onSuccess }: ParentModeModalProps) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState<string | null>(null)
  const { verifyParentPin, getParentPin, setParentPin } = useAuth()
  const inputRef = useRef<any>(null)
  const [isCheckingPin, setIsCheckingPin] = useState(true)
  const [hasPin, setHasPin] = useState(false)

  useEffect(() => {
    if (visible) {
      checkForExistingPin()
    }
  }, [visible])

  const checkForExistingPin = async () => {
    try {
      setIsCheckingPin(true)
      const existingPin = await getParentPin()
      setHasPin(!!existingPin)
    } catch (error) {
      console.error('Error checking PIN:', error)
    } finally {
      setIsCheckingPin(false)
    }
  }

  useEffect(() => {
    if (visible && !isCheckingPin) {
      // Reset state when modal opens
      setPin('')
      setError(null)
      // Focus the input after a short delay to ensure the modal is fully visible
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [visible, isCheckingPin])

  const handleSubmit = async () => {
    if (!pin.trim()) {
      setError('PIN is required')
      return
    }

    try {
      if (!hasPin) {
        // Set new PIN
        await setParentPin(pin)
        setPin('')
        setError(null)
        onSuccess()
      } else {
        // Verify existing PIN
        const isValid = await verifyParentPin(pin)
        if (isValid) {
          setPin('')
          setError(null)
          onSuccess()
        } else {
          setError('Incorrect PIN')
        }
      }
    } catch (error) {
      console.error('Error handling PIN:', error)
      setError('An error occurred')
    }
  }

  if (isCheckingPin) {
    return null // Or show a loading indicator if you prefer
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>
          {hasPin ? 'Enter Parent PIN' : 'Create Parent PIN'}
        </Text>
        {!hasPin && (
          <Text style={styles.description}>
            Please set a PIN to protect parent settings. Remember this PIN as you'll need it to access parent settings in the future.
          </Text>
        )}
        <TextInput
          ref={inputRef}
          value={pin}
          onChangeText={setPin}
          keyboardType="numeric"
          maxLength={6}
          mode="outlined"
          style={styles.input}
          error={!!error}
          placeholder={hasPin ? 'Enter PIN' : 'Create new PIN'}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.buttons}>
          <Button mode="outlined" onPress={onDismiss} style={styles.button}>
            Cancel
          </Button>
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            {hasPin ? 'Submit' : 'Set PIN'}
          </Button>
        </View>
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  button: {
    minWidth: 100,
  },
}) 