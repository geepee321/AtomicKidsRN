import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Button, List, FAB, Text, IconButton, ActivityIndicator } from 'react-native-paper'
import { router } from 'expo-router'
import { useChildren, Child } from '@/context/children'
import { useRewards } from '@/contexts/RewardsContext'
import { colors } from '@/theme/colors'
import { Image } from 'expo-image'

export default function ChildrenScreen() {
  const { children, loading } = useChildren()
  const { rewards } = useRewards()

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const getChildAvatar = (child: Child): string | undefined => {
    if (!child.selected_character_id) return undefined;
    const selectedCharacter = rewards.find(r => r.id === child.selected_character_id);
    return selectedCharacter?.image_url;
  };

  const renderChild = ({ item: child }: { item: Child }) => (
    <List.Item
      title={child.name}
      style={styles.childItem}
      contentStyle={styles.listItemContent}
      titleStyle={styles.childName}
      left={props => (
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: getChildAvatar(child) }}
            style={styles.avatar}
            contentFit="cover"
            placeholder={require('../../../../assets/default-avatar.png')}
          />
        </View>
      )}
      right={props => (
        <IconButton
          icon="chevron-right"
          size={24}
          onPress={() => router.push(`/(app)/(parent)/children/${child.id}`)}
        />
      )}
      onPress={() => router.push(`/(app)/(parent)/children/${child.id}`)}
    />
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
    padding: 20,
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
    paddingTop: 8,
  },
  childItem: {
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: colors.cardBackground,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  childName: {
    fontSize: 16,
  },
  listItemContent: {
    paddingLeft: 0,
  },
  avatarContainer: {
    paddingLeft: 16,
    paddingRight: 8,
    justifyContent: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  button: {
    marginVertical: 8,
    borderRadius: 16,
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