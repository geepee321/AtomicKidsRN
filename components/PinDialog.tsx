import React, { useState } from 'react'
import { StyleSheet } from 'react-native'
import { Dialog, Portal, TextInput, Button, Text } from 'react-native-paper'
import { colors } from '@/theme/colors'

type PinDialogProps = {
  visible: boolean
  onDismiss: () => void
  onSubmit: (pin: string) => void
  mode: 'set' | 'verify'
  error?: string
}

export default function PinDialog({ visible, onDismiss, onSubmit, mode, error }: PinDialogProps) {
  const [pin, setPin] = useState('')

  const handleSubmit = () => {
    if (pin.length === 0) return
    onSubmit(pin)
    setPin('')
  }

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>
          {mode === 'set' ? 'Set Parent PIN' : 'Enter Parent PIN'}
        </Dialog.Title>
        <Dialog.Content>
          {mode === 'set' && (
            <Text style={styles.description}>
              Please set a PIN to protect parent settings. Remember this PIN as you'll need it to access parent settings in the future.
            </Text>
          )}
          <TextInput
            label="PIN"
            value={pin}
            onChangeText={setPin}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.input}
            error={!!error}
          />
          {error && <Text style={styles.error}>{error}</Text>}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={handleSubmit}>
            {mode === 'set' ? 'Set PIN' : 'Submit'}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  )
}

const styles = StyleSheet.create({
  description: {
    marginBottom: 16,
  },
  input: {
    marginTop: 8,
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
}) 