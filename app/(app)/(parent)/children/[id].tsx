import { View, StyleSheet } from 'react-native'
import { Button, TextInput, Text } from 'react-native-paper'
import { useState, useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { useChildren } from '../../../../context/children'
import { colors } from '@/theme/colors'

export default function EditChildScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { children, updateChild, deleteChild } = useChildren()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Find the child and initialize form
  useEffect(() => {
    const child = children.find(c => c.id === id)
    if (child) {
      setName(child.name)
    }
  }, [id, children])

  const handleUpdate = async () => {
    if (!name.trim()) {
      setError('Name is required')
      return
    }

    try {
      setLoading(true)
      setError(null)
      await updateChild(id, name.trim())
      router.back()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      setError(null)
      await deleteChild(id)
      router.back()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
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
        onPress={handleUpdate}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Update Child Profile
      </Button>

      <Button
        mode="outlined"
        onPress={handleDelete}
        loading={loading}
        disabled={loading}
        style={[styles.button, styles.deleteButton]}
        contentStyle={styles.buttonContent}
        textColor="red"
      >
        Delete Child Profile
      </Button>

      <Button
        mode="contained"
        onPress={() => router.back()}
        disabled={loading}
        style={[styles.button, styles.secondaryButton]}
        contentStyle={styles.buttonContent}
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
    backgroundColor: colors.background,
  },
  input: {
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 12,
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
  deleteButton: {
    borderColor: 'red',
    backgroundColor: 'transparent',
    elevation: 0,
    shadowColor: 'transparent',
  },
}) 