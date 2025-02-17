import React from 'react'
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native'
import { Text, IconButton, Card, Checkbox, SegmentedButtons } from 'react-native-paper'
import { router, useFocusEffect } from 'expo-router'
import { useAuth } from '../../context/auth'
import { useTasks } from '../../context/tasks'
import { useChildren } from '../../context/children'
import { useRewards } from '../../contexts/RewardsContext'
import { useState, useEffect, useCallback, useMemo } from 'react'
import ParentModeModal from '../../components/ParentModeModal'
import CelebrationModal from '../../components/CelebrationModal'
import { CharactersTile } from '../../components/CharactersTile'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  withSequence,
  withTiming,
  runOnJS,
  Easing
} from 'react-native-reanimated'
import { Audio } from 'expo-av'

const DEFAULT_ICON = 'checkbox-blank-circle-outline'
const GIPHY_API_KEY = 'fgUc6JXoNLhz9vJnqkLq1h8r7NGY73JL'
const SWIPE_THRESHOLD = 100

export default function HomeScreen() {
  const { user, isParentMode, setParentMode } = useAuth()
  const { tasks, updateTask, refreshTasks } = useTasks()
  const { children, updateStreak } = useChildren()
  const { rewards, refreshRewards, setActiveChild } = useRewards()
  const [selectedChild, setSelectedChild] = useState('')
  const [parentModeModalVisible, setParentModeModalVisible] = useState(false)
  const [celebrationGif, setCelebrationGif] = useState('')
  const [showCelebration, setShowCelebration] = useState(false)
  const translateX = useSharedValue(0)

  // Create a single shared animation value for all tasks
  const scale = useSharedValue(1)
  const rotate = useSharedValue('0deg')
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: rotate.value }
    ]
  }))

  const playCompletionAnimation = useCallback(() => {
    scale.value = withSequence(
      withSpring(1.2, { damping: 2 }),
      withSpring(1, { damping: 4 })
    )
    rotate.value = withSequence(
      withTiming('-10deg', { duration: 100 }),
      withTiming('10deg', { duration: 100 }),
      withTiming('0deg', { duration: 100 })
    )
  }, [])

  const [taskSound, setTaskSound] = useState<Audio.Sound | null>(null)
  const [allDoneSound, setAllDoneSound] = useState<Audio.Sound | null>(null)

  // Load sounds when component mounts
  useEffect(() => {
    async function loadSounds() {
      try {
        const { sound: taskCompletionSound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/ding-101492-taskdone.mp3'),
          { shouldPlay: false }
        )
        const { sound: allTasksCompletedSound } = await Audio.Sound.createAsync(
          require('../../assets/sounds/ding-47489-alltasksdone.mp3'),
          { shouldPlay: false }
        )
        
        setTaskSound(taskCompletionSound)
        setAllDoneSound(allTasksCompletedSound)
      } catch (error) {
        console.error('Error loading sounds:', error)
      }
    }

    loadSounds()

    // Cleanup sounds when component unmounts
    return () => {
      if (taskSound) {
        taskSound.unloadAsync()
      }
      if (allDoneSound) {
        allDoneSound.unloadAsync()
      }
    }
  }, [])

  const playTaskCompletionSound = async () => {
    try {
      if (taskSound) {
        await taskSound.setPositionAsync(0)
        await taskSound.playAsync()
      }
    } catch (error) {
      console.error('Error playing task completion sound:', error)
    }
  }

  const playAllTasksCompletedSound = async () => {
    try {
      if (allDoneSound) {
        await allDoneSound.setPositionAsync(0)
        await allDoneSound.playAsync()
      }
    } catch (error) {
      console.error('Error playing all tasks completed sound:', error)
    }
  }

  const handleToggleComplete = async (taskId: string, currentlyCompleted: boolean) => {
    try {
      if (!currentlyCompleted) {
        playCompletionAnimation()
        await playTaskCompletionSound()
      }

      // Update task completion status
      await updateTask(taskId, { completed: !currentlyCompleted })
      
      const childTasks = tasks.filter(t => t.child_id === selectedChild)
      const selectedChildData = children.find(child => child.id === selectedChild)
      
      if (currentlyCompleted) {
        // If uncompleting a task, check if we need to reset streak
        const lastCompletedAt = selectedChildData?.last_completed_at
        const today = new Date()
        const lastCompletedDate = lastCompletedAt ? new Date(lastCompletedAt) : null
        
        // Only reset streak if it was completed today
        if (lastCompletedDate && 
            lastCompletedDate.toDateString() === today.toDateString()) {
          await updateStreak(selectedChild, false)
          await refreshRewards(selectedChild)
        }
      } else {
        // If completing a task, check if all tasks are now complete
        const allTasksCompleted = childTasks
          .filter(t => t.id !== taskId)
          .every(t => t.completed)

        if (allTasksCompleted) {
          // Check if streak was already incremented today
          const lastCompletedAt = selectedChildData?.last_completed_at
          const today = new Date()
          const lastCompletedDate = lastCompletedAt ? new Date(lastCompletedAt) : null
          
          // Only increment streak if not already completed today
          if (!lastCompletedDate || 
              lastCompletedDate.toDateString() !== today.toDateString()) {
            await updateStreak(selectedChild, true)
            await refreshRewards(selectedChild)
            
            // Play celebration sound
            await playAllTasksCompletedSound()
            
            // Fetch a celebration GIF
            try {
              const response = await fetch(
                `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=celebration&rating=g`
              )
              const data = await response.json()
              setCelebrationGif(data.data.images.original.url)
              setShowCelebration(true)
            } catch (error) {
              console.error('Error fetching celebration GIF:', error)
            }
          }
        }
      }
    } catch (error) {
      console.error('Error toggling task completion:', error)
    }
  }

  // Refresh tasks when screen becomes active
  useFocusEffect(
    useCallback(() => {
      refreshTasks()
    }, [refreshTasks])
  )

  // Set first child as selected when children load
  useEffect(() => {
    if (children.length > 0 && !selectedChild) {
      const firstChild = children[0]
      setSelectedChild(firstChild.id)
      setActiveChild(firstChild.id)
    }
  }, [children])

  // Reset selected child if it doesn't exist in children array
  useEffect(() => {
    if (selectedChild && children.length > 0) {
      const childExists = children.some(child => child.id === selectedChild)
      if (!childExists) {
        setSelectedChild(children[0].id)
        setActiveChild(children[0].id)
      }
    }
  }, [children, selectedChild])

  useEffect(() => {
    if (selectedChild) {
      setActiveChild(selectedChild)
      refreshRewards(selectedChild)
    }
  }, [selectedChild, tasks])

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

  const fetchRandomGif = async () => {
    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=celebration+party+yay&limit=50&rating=g`
      )
      const data = await response.json()
      if (data.data && data.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.data.length)
        return data.data[randomIndex].images.original.url
      }
    } catch (error) {
      console.error('Error fetching GIF:', error)
    }
    return null
  }

  const childButtons = children.map(child => ({
    value: child.id,
    label: child.name
  }))

  const filteredTasks = tasks.filter(task => 
    task.child_id === selectedChild
  )

  const selectedChildData = children.find(child => child.id === selectedChild)

  const getChildAvatar = (childId: string): string | undefined => {
    const child = children.find(c => c.id === childId);
    if (!child || !child.selected_character_id) return undefined;
    
    const selectedCharacter = rewards.find(r => r.id === child.selected_character_id);
    return selectedCharacter?.image_url;
  };

  const switchToNextChild = () => {
    const currentIndex = children.findIndex(child => child.id === selectedChild)
    if (currentIndex < children.length - 1) {
      setSelectedChild(children[currentIndex + 1].id)
    }
  }

  const switchToPreviousChild = () => {
    const currentIndex = children.findIndex(child => child.id === selectedChild)
    if (currentIndex > 0) {
      setSelectedChild(children[currentIndex - 1].id)
    }
  }

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX
    })
    .onEnd((e) => {
      if (e.translationX > SWIPE_THRESHOLD) {
        runOnJS(switchToPreviousChild)()
      } else if (e.translationX < -SWIPE_THRESHOLD) {
        runOnJS(switchToNextChild)()
      }
      translateX.value = withSpring(0)
    })

  return (
    <GestureHandlerRootView style={styles.container}>
      {children.length > 0 ? (
        <>
          <View style={styles.childSelector}>
            {children.map(child => {
              const avatarUrl = getChildAvatar(child.id);
              return (
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
              );
            })}
          </View>

          <GestureDetector gesture={gesture}>
            <Animated.View style={[{ flex: 1 }, animatedStyle]}>
              <CharactersTile selectedChildId={selectedChild} />
              
              <View style={styles.statsSection}>
                <View style={styles.statBox}>
                  <Text variant="titleSmall" style={styles.statLabel}>Today's Tasks</Text>
                  <Text variant="headlineMedium" style={[
                    styles.statValue,
                    filteredTasks.length - filteredTasks.filter(t => t.completed).length === 0 && styles.allDoneText
                  ]}>
                    {filteredTasks.length - filteredTasks.filter(t => t.completed).length === 0 
                      ? "All done!" 
                      : <>{filteredTasks.length - filteredTasks.filter(t => t.completed).length} <Text style={styles.statUnit}>to go</Text></>
                    }
                  </Text>
                </View>

                <View style={styles.statBox}>
                  <Text variant="titleSmall" style={styles.statLabel}>Streak</Text>
                  <Text variant="headlineMedium" style={styles.statValue}>
                    {selectedChildData?.streak || 0} <Text style={styles.statUnit}>days</Text>
                  </Text>
                </View>
              </View>

              <ScrollView style={styles.content}>
                {filteredTasks.length === 0 ? (
                  <Text style={styles.emptyText}>No tasks. Add tasks in settings.</Text>
                ) : (
                  filteredTasks.map((task) => (
                    <Animated.View key={task.id} style={animatedStyle}>
                      <Card 
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
                    </Animated.View>
                  ))
                )}
              </ScrollView>
            </Animated.View>
          </GestureDetector>
        </>
      ) : (
        <Text style={styles.emptyText}>No children added yet. Click the settings button to get started.</Text>
      )}

      <ParentModeModal
        visible={parentModeModalVisible}
        onDismiss={() => setParentModeModalVisible(false)}
        onSuccess={handleParentModeSuccess}
      />

      <CelebrationModal
        visible={showCelebration}
        onDismiss={() => setShowCelebration(false)}
        gifUrl={celebrationGif}
      />
    </GestureHandlerRootView>
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
  },
  selectedChildCard: {
    backgroundColor: '#e8f0fe',
    borderColor: '#4285f4',
    borderWidth: 2,
  },
  childContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  childAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  statsSection: {
    flexDirection: 'row',
    marginBottom: 8,
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
    marginBottom: 4,
    fontSize: 18,
    fontWeight: 'bold',
  },
  statValue: {
    fontWeight: 'bold',
  },
  allDoneText: {
    color: '#34c759',
    fontWeight: 'bold',
  },
  statUnit: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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