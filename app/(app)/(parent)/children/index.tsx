import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Button, Card, FAB, Text, IconButton, ActivityIndicator } from 'react-native-paper'
import { router } from 'expo-router'
import { useChildren, Child } from '@/context/children'
import { colors } from '@/theme/colors'

export default function ChildrenScreen() {
  const { children, loading } = useChildren()

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const renderChild = ({ item: child }: { item: Child }) => (
    <Card 
      style={styles.card}
      onPress={() => router.push(`/(app)/(parent)/children/${child.id}`)}
    >
      <Card.Content style={styles.cardContent}>
        <Text variant="titleLarge">{child.name}</Text>
        <IconButton
          icon="pencil"
          size={24}
          onPress={() => router.push(`/(app)/(parent)/children/${child.id}`)}
        />
      </Card.Content>
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
            style={styles.button}
            contentStyle={styles.buttonContent}
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
    backgroundColor: colors.background,
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
    borderRadius: 16,
    backgroundColor: colors.cardBackground,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    height: 56,
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
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
}) 