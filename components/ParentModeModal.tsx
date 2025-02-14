import React, { useState } from 'react'
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
  const { verifyParentPin } = useAuth()

  const handleSubmit = () => {
    if (verifyParentPin(pin)) {
      setPin('')
      setError(null)
      onSuccess()
    } else {
      setError('Incorrect PIN')
    }
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Enter Parent PIN</Text>
        <TextInput
          value={pin}
          onChangeText={setPin}
          keyboardType="numeric"
          secureTextEntry
          maxLength={4}
          mode="outlined"
          style={styles.input}
          error={!!error}
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <View style={styles.buttons}>
          <Button mode="outlined" onPress={onDismiss} style={styles.button}>
            Cancel
          </Button>
          <Button mode="contained" onPress={handleSubmit} style={styles.button}>
            Submit
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
  input: {
    marginBottom: 8,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  button: {
    minWidth: 100,
  },
}) 