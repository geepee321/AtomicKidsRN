import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { Text, IconButton, Card, Checkbox, SegmentedButtons } from 'react-native-paper'
import { router } from 'expo-router'
import { useAuth } from '@/context/auth'
import { useTasks } from '@/context/tasks'
import { useChildren } from '@/context/children'
import { useState, useEffect } from 'react'
import ParentModeModal from '../../components/ParentModeModal'
import { MaterialCommunityIcons } from '@expo/vector-icons'

const DEFAULT_ICON = 'checkbox-blank-circle-outline'

export default function HomeScreen() {
  const { user, isParentMode, setParentMode } = useAuth()
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
        completed: !currentStatus
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

      {children.length > 0 ? (
        <>
          <View style={styles.childSelector}>
            {children.map(child => (
              <Card 
                key={child.id}
                style={[
                  styles.childCard,
                  selectedChild === child.id && styles.selectedChildCard
                ]}
                onPress={() => setSelectedChild(child.id)}
              >
                <Card.Content style={styles.childContent}>
                  <Text variant="titleMedium">{child.name}</Text>
                </Card.Content>
              </Card>
            ))}
          </View>

          <View style={styles.statsSection}>
            <View style={styles.statBox}>
              <Text variant="titleSmall" style={styles.statLabel}>Today's Tasks</Text>
              <Text variant="headlineMedium" style={styles.statValue}>
                {filteredTasks.filter(t => t.completed).length} out of {filteredTasks.length}
              </Text>
            </View>
            <View style={styles.statBox}>
              <Text variant="titleSmall" style={styles.statLabel}>Streak</Text>
              <Text variant="headlineMedium" style={styles.statValue}>
                1 <Text style={styles.statUnit}>days</Text>
              </Text>
            </View>
          </View>

          <ScrollView style={styles.taskList}>
            {filteredTasks.length === 0 ? (
              <Text style={styles.emptyText}>No tasks available</Text>
            ) : (
              filteredTasks.map((task) => (
                <Card 
                  key={task.id}
                  style={[
                    styles.taskCard,
                    task.completed && styles.completedTask
                  ]}
                  onPress={() => handleToggleComplete(task.id, task.completed)}
                >
                  <Card.Content style={styles.taskContent}>
                    <View style={styles.taskIcon}>
                      {task.completed ? (
                        <IconButton icon="check" size={24} iconColor="#fff" />
                      ) : (
                        <View style={styles.iconContainer}>
                          <MaterialCommunityIcons
                            name={(task.icon_name || DEFAULT_ICON) as any}
                            size={28}
                            color="#666"
                          />
                        </View>
                      )}
                    </View>
                    <View style={styles.taskInfo}>
                      <Text variant="titleLarge">{task.title}</Text>
                    </View>
                  </Card.Content>
                </Card>
              ))
            )}
          </ScrollView>
        </>
      ) : (
        <Text style={styles.emptyText}>No children added yet</Text>
      )}

      <IconButton
        icon={isParentMode ? 'account-lock' : 'account-lock-outline'}
        style={styles.parentModeButton}
        onPress={handleParentModeToggle}
      />

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
    backgroundColor: '#f5f9ff',
  },
  header: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  emoji: {
    fontWeight: 'normal',
  },
  childSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  childCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 0,
    shadowColor: 'transparent',
    elevation: 0,
  },
  selectedChildCard: {
    backgroundColor: '#e8f0fe',
    borderColor: '#4285f4',
    borderWidth: 2,
    elevation: 0,
  },
  childContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 16,
    paddingHorizontal: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
  },
  statLabel: {
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontWeight: 'bold',
  },
  statUnit: {
    fontSize: 16,
    color: '#666',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  taskCard: {
    marginBottom: 12,
    marginHorizontal: 2,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  completedTask: {
    backgroundColor: '#34c759',
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  taskIcon: {
    marginRight: 16,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.7,
  },
  parentModeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
}) 