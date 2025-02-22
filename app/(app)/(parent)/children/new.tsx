import { View, StyleSheet } from 'react-native'
import { Button, TextInput, Text } from 'react-native-paper'
import { useState } from 'react'
import { router } from 'expo-router'
import { useChildren } from '@/context/children'

export default function NewChildScreen() {
  const { addChild } = useChildren()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await addChild(name.trim())
      router.back()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Add New Child</Text>

      <TextInput
        label="Child's Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        error={!!error}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Create Child Profile
      </Button>

      <Button
        mode="outlined"
        onPress={() => router.back()}
        disabled={loading}
        style={styles.button}
      >
        Cancel
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
}) 