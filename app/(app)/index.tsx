import { View, StyleSheet, ScrollView } from 'react-native'
import { Button, Text, List, IconButton, Card, Checkbox, SegmentedButtons } from 'react-native-paper'
import { router } from 'expo-router'
import { useAuth } from '@/context/auth'
import { useTasks } from '@/context/tasks'
import { useChildren } from '@/context/children'
import { useState, useEffect } from 'react'
import ParentModeModal from '../../components/ParentModeModal'

export default function HomeScreen() {
  const { signOut, user, isParentMode, setParentMode } = useAuth()
  const { tasks, updateTask } = useTasks()
  const { children } = useChildren()
  const [selectedChild, setSelectedChild] = useState('')
  const [parentModeModalVisible, setParentModeModalVisible] = useState(false)

  // Set first child as selected when children load
  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      setSelectedChild(children[0].id)
    }
  }, [children])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.replace('/auth/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const handleParentModeSuccess = async () => {
    setParentModeModalVisible(false)
    await setParentMode(true)
    setTimeout(() => {
      router.push('/(app)/(parent)')
    }, 100)
  }

  const handleParentModeToggle = async () => {
    if (isParentMode) {
      await setParentMode(false)
    } else {
      // Bypass PIN modal temporarily
      await setParentMode(true)
      router.push('/(app)/(parent)')
    }
  }

  const handleToggleComplete = async (taskId: string, currentStatus: boolean) => {
    try {
      await updateTask(taskId, {
        completed: !currentStatus,
        completed_at: !currentStatus ? new Date().toISOString() : null
      })
    } catch (error) {
      console.error('Error toggling task completion:', error)
    }
  }

  const childButtons = children.map(child => ({
    value: child.id,
    label: child.name
  }))

  const filteredTasks = tasks.filter(task => 
    task.child_id === selectedChild
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton
          icon={isParentMode ? 'account-lock' : 'account-lock-outline'}
          onPress={handleParentModeToggle}
        />
      </View>

      {children.length > 0 ? (
        <>
          <SegmentedButtons
            value={selectedChild}
            onValueChange={setSelectedChild}
            buttons={childButtons}
            style={styles.childSelector}
          />

          <Card style={styles.tasksCard}>
            <Card.Title title={`Tasks for ${children.find(c => c.id === selectedChild)?.name || ''}`} />
            <Card.Content>
              {filteredTasks.length === 0 ? (
                <Text style={styles.emptyText}>
                  No tasks available
                </Text>
              ) : (
                <ScrollView>
                  {filteredTasks.map((task) => (
                    <List.Item
                      key={task.id}
                      title={task.title}
                      left={props => (
                        <Checkbox.Android
                          status={task.completed ? 'checked' : 'unchecked'}
                          onPress={() => handleToggleComplete(task.id, task.completed)}
                        />
                      )}
                      style={[
                        styles.taskItem,
                        task.completed && styles.completedTask
                      ]}
                    />
                  ))}
                </ScrollView>
              )}
            </Card.Content>
          </Card>
        </>
      ) : (
        <Text style={styles.emptyText}>No children added yet</Text>
      )}

      <Text style={styles.email}>Signed in as: {user?.email}</Text>
      
      <Button 
        mode="contained" 
        onPress={handleSignOut}
        style={styles.button}
      >
        Sign Out
      </Button>

      <ParentModeModal
        visible={parentModeModalVisible}
        onDismiss={() => setParentModeModalVisible(false)}
        onSuccess={handleParentModeSuccess}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  childSelector: {
    marginBottom: 20,
  },
  tasksCard: {
    marginBottom: 20,
  },
  taskItem: {
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  completedTask: {
    opacity: 0.7,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  email: {
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.7,
  },
  button: {
    marginTop: 20,
  },
}) 