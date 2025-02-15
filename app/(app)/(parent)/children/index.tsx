import { View, StyleSheet, FlatList } from 'react-native'
import { Button, Card, FAB, Text, IconButton, ActivityIndicator } from 'react-native-paper'
import { router } from 'expo-router'
import { useChildren } from '@/context/children'

export default function ChildrenScreen() {
  const { children, loading } = useChildren()

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const renderChild = ({ item: child }) => (
    <Card style={styles.card}>
      <Card.Title
        title={child.name}
        right={(props) => (
          <IconButton
            {...props}
            icon="pencil"
            onPress={() => router.push(`/(app)/(parent)/children/${child.id}`)}
          />
        )}
      />
    </Card>
  )

  return (
    <View style={styles.container}>
      {children.length === 0 ? (
        <View style={styles.emptyState}>
          <Text variant="bodyLarge" style={styles.emptyText}>
            No children added yet
          </Text>
          <Button 
            mode="contained"
            onPress={() => router.push('/(app)/(parent)/children/new')}
          >
            Add First Child
          </Button>
        </View>
      ) : (
        <>
          <FlatList
            data={children}
            renderItem={renderChild}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
          />
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => router.push('/(app)/(parent)/children/new')}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginBottom: 20,
    opacity: 0.7,
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