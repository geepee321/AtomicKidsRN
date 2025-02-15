import { View, StyleSheet } from 'react-native'
import { Button, Text, List, FAB, ActivityIndicator, IconButton } from 'react-native-paper'
import { router } from 'expo-router'
import { useTasks } from '@/context/tasks'
import { useChildren } from '@/context/children'
import DraggableFlatList, { 
  ScaleDecorator,
  OpacityDecorator,
  ShadowDecorator,
  RenderItemParams
} from 'react-native-draggable-flatlist'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useMemo, useCallback } from 'react'
import { Task } from '@/types/task'

type TaskWithSection = {
  id: string
  type: 'header' | 'task'
  childName?: string
  task?: Task
}

export default function TasksScreen() {
  const { tasks, loading, error, reorderTasks } = useTasks()
  const { children } = useChildren()

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Error: {error}</Text>
      </View>
    )
  }

  // Create a flat list with headers and tasks
  const flatListData: TaskWithSection[] = useMemo(() => {
    const result: TaskWithSection[] = []
    
    // Sort children alphabetically
    const sortedChildren = [...children].sort((a, b) => 
      a.name.localeCompare(b.name)
    )

    // Add child sections
    sortedChildren.forEach(child => {
      const childTasks = tasks.filter(task => task.child_id === child.id)
      if (childTasks.length > 0) {
        // Add header
        result.push({
          id: `header-${child.id}`,
          type: 'header',
          childName: child.name
        })
        // Add tasks
        childTasks.forEach(task => {
          result.push({
            id: task.id,
            type: 'task',
            task
          })
        })
      }
    })

    // Add unassigned section
    const unassignedTasks = tasks.filter(task => !task.child_id)
    if (unassignedTasks.length > 0) {
      result.push({
        id: 'header-unassigned',
        type: 'header',
        childName: 'Unassigned Tasks'
      })
      unassignedTasks.forEach(task => {
        result.push({
          id: task.id,
          type: 'task',
          task
        })
      })
    }

    return result
  }, [tasks, children])

  const handleDragEnd = useCallback(async ({ data }: { data: TaskWithSection[] }) => {
    try {
      const reorderedTasks = data
        .filter(item => item.type === 'task')
        .map(item => item.task!)
      
      await reorderTasks(reorderedTasks)
    } catch (error) {
      console.error('Error reordering tasks:', error)
    }
  }, [reorderTasks])

  const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<TaskWithSection>) => {
    if (item.type === 'header') {
      return (
        <List.Subheader style={styles.subheader}>
          {item.childName}
        </List.Subheader>
      )
    }

    return (
      <OpacityDecorator>
        <ShadowDecorator>
          <ScaleDecorator>
            <List.Item
              title={item.task!.title}
              left={props => (
                <View 
                  onTouchStart={() => {
                    drag();
                  }}
                >
                  <IconButton
                    icon="drag"
                    style={styles.dragHandle}
                  />
                </View>
              )}
              right={props => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => router.push(`/(app)/(parent)/tasks/${item.task!.id}`)}
              style={[
                styles.taskItem,
                isActive && styles.draggingItem
              ]}
            />
          </ScaleDecorator>
        </ShadowDecorator>
      </OpacityDecorator>
    )
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {tasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No tasks created yet
            </Text>
            <Button 
              mode="contained"
              onPress={() => router.push('/(app)/(parent)/tasks/new')}
            >
              Create First Task
            </Button>
          </View>
        ) : (
          <DraggableFlatList
            data={flatListData}
            onDragEnd={handleDragEnd}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            dragItemOverflow={true}
          />
        )}
        
        {tasks.length > 0 && (
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => router.push('/(app)/(parent)/tasks/new')}
          />
        )}
      </View>
    </GestureHandlerRootView>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginBottom: 20,
    opacity: 0.7,
  },
  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    marginTop: 8,
    borderRadius: 4,
  },
  list: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  taskItem: {
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  draggingItem: {
    backgroundColor: '#e0e0e0',
    elevation: 4,
  },
  dragHandle: {
    marginLeft: -10,
  },
}) 