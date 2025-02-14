import { View, StyleSheet, FlatList } from 'react-native'
import { Button, Card, FAB, Text, IconButton } from 'react-native-paper'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../../context/auth'
import { Child } from '../../../../types/child'
import { getChildren } from '../../../../services/children'
import { router } from 'expo-router'

export default function ChildrenScreen() {
  const { user } = useAuth()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChildren()
  }, [])

  const loadChildren = async () => {
    try {
      setLoading(true)
      const data = await getChildren(user!.id)
      setChildren(data)
    } catch (error) {
      console.error('Error loading children:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderChild = ({ item: child }: { item: Child }) => (
    <Card style={styles.card}>
      <Card.Title
        title={child.name}
        right={(props) => (
          <IconButton
            {...props}
            icon="pencil"
            onPress={() => router.push(`/children/${child.id}`)}
          />
        )}
      />
    </Card>
  )

  return (
    <View style={styles.container}>
      <FlatList
        data={children}
        renderItem={renderChild}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/(parent)/children/new')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}) 