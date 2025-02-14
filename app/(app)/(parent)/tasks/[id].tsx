import { View, StyleSheet, ScrollView } from 'react-native'
import { Button, TextInput, HelperText, Text, List, RadioButton, ActivityIndicator } from 'react-native-paper'
import { router, useLocalSearchParams } from 'expo-router'
import { useState, useEffect } from 'react'
import { useChildren } from '@/context/children'
import { useTasks } from '@/context/tasks'

export default function EditTaskScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const [title, setTitle] = useState('')
  const [selectedChild, setSelectedChild] = useState('')
  const [loading, setLoading] = useState(false)
  const [initializing, setInitializing] = useState(true)
  
  const { children } = useChildren()
  const { tasks, updateTask, deleteTask } = useTasks()

  // Find the task and initialize form
  useEffect(() => {
    const task = tasks.find(t => t.id === id)
    if (task) {
      setTitle(task.title)
      setSelectedChild(task.child_id || '')
      setInitializing(false)
    }
  }, [id, tasks])

  const handleUpdateTask = async () => {
    if (!title.trim()) return
    
    setLoading(true)
    try {
      await updateTask(id, {
        title: title.trim(),
        child_id: selectedChild || null
      })
      
      router.back()
    } catch (error) {
      console.error('Error updating task:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTask = async () => {
    setLoading(true)
    try {
      await deleteTask(id)
      router.back()
    } catch (error) {
      console.error('Error deleting task:', error)
    } finally {
      setLoading(false)
    }
  }

  if (initializing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <TextInput
        label="Task Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <HelperText type="error" visible={!title.trim()}>
        Title is required
      </HelperText>

      <Text style={styles.label}>Assign to Child (Optional)</Text>
      
      <View style={styles.childList}>
        <RadioButton.Group onValueChange={value => setSelectedChild(value)} value={selectedChild}>
          <List.Item
            title="Unassigned"
            left={props => <RadioButton {...props} value="" />}
            onPress={() => setSelectedChild('')}
            style={styles.childItem}
          />
          {children.map(child => (
            <List.Item
              key={child.id}
              title={child.name}
              left={props => <RadioButton {...props} value={child.id} />}
              onPress={() => setSelectedChild(child.id)}
              style={styles.childItem}
            />
          ))}
        </RadioButton.Group>
      </View>

      <Button
        mode="contained"
        onPress={handleUpdateTask}
        loading={loading}
        disabled={!title.trim() || loading}
        style={styles.button}
      >
        Update Task
      </Button>

      <Button
        mode="outlined"
        onPress={handleDeleteTask}
        loading={loading}
        disabled={loading}
        style={styles.deleteButton}
        textColor="red"
      >
        Delete Task
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    marginBottom: 10,
  },
  label: {
    marginTop: 10,
    marginBottom: 10,
    opacity: 0.7,
  },
  childList: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  childItem: {
    paddingHorizontal: 0,
  },
  button: {
    marginTop: 20,
  },
  deleteButton: {
    marginTop: 10,
    marginBottom: 40,
    borderColor: 'red',
  },
}) 