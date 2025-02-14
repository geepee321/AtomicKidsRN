import { View, StyleSheet, ScrollView } from 'react-native'
import { Button, TextInput, HelperText, Text, List, RadioButton } from 'react-native-paper'
import { router } from 'expo-router'
import { useState } from 'react'
import { useChildren } from '@/context/children'
import { useTasks } from '@/context/tasks'

export default function NewTaskScreen() {
  const [title, setTitle] = useState('')
  const [selectedChild, setSelectedChild] = useState('')
  const [loading, setLoading] = useState(false)
  
  const { children } = useChildren()
  const { addTask } = useTasks()

  const handleCreateTask = async () => {
    if (!title.trim()) return
    
    setLoading(true)
    try {
      await addTask({
        title: title.trim(),
        child_id: selectedChild || undefined
      })
      
      router.back()
    } catch (error) {
      console.error('Error creating task:', error)
    } finally {
      setLoading(false)
    }
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
        onPress={handleCreateTask}
        loading={loading}
        disabled={!title.trim() || loading}
        style={styles.button}
      >
        Create Task
      </Button>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    marginBottom: 40,
  },
}) 