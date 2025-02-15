import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { Image } from 'expo-image';
import { useRewards } from '../contexts/RewardsContext';
import { useChildren } from '../context/children';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useLocalSearchParams, router } from 'expo-router';

export const RewardsScreen = () => {
  const { rewards, unlockedRewards, selectedCharacterId, selectCharacter, isLoading, refreshRewards, setActiveChild } = useRewards();
  const { children } = useChildren();
  const { childId } = useLocalSearchParams<{ childId: string }>();

  const activeChild = children.find(child => child.id === childId);

  useEffect(() => {
    if (childId) {
      setActiveChild(childId);
      refreshRewards(childId);
    }
  }, [childId]);

  const handleRefresh = async () => {
    if (childId) {
      await refreshRewards(childId);
    }
  };

  const handleCharacterSelect = async (rewardId: string) => {
    await selectCharacter(rewardId);
    router.back();
  };

  const isRewardUnlocked = (rewardId: string) => {
    return unlockedRewards.some(ur => ur.reward_id === rewardId);
  };

  if (!activeChild) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
          />
        }
      >
        <Text style={styles.subtitle}>
          Unlock new characters by maintaining your task streak!
        </Text>
        
        <View style={styles.streakInfo}>
          <MaterialCommunityIcons name="fire" size={24} color={colors.primary} />
          <Text style={styles.streakText}>
            Current Streak: {activeChild.streak} days
          </Text>
        </View>

        <View style={styles.grid}>
          {rewards.map((reward) => {
            const unlocked = isRewardUnlocked(reward.id);
            const isSelected = activeChild.selected_character_id === reward.id;

            return (
              <TouchableOpacity
                key={reward.id}
                style={[
                  styles.characterCard,
                  isSelected && styles.selectedCard,
                  !unlocked && styles.lockedCard,
                ]}
                onPress={() => unlocked && handleCharacterSelect(reward.id)}
                disabled={!unlocked}
              >
                <Image
                  source={{ uri: reward.image_url }}
                  style={styles.characterImage}
                  contentFit="contain"
                  transition={200}
                  placeholder={require('../assets/default-avatar.png')}
                />
                {!unlocked && (
                  <View style={styles.lockOverlay} />
                )}
                <Text style={styles.characterName}>{reward.name}</Text>
                {!unlocked ? (
                  <View style={styles.lockInfo}>
                    <MaterialCommunityIcons name="lock" size={20} color={colors.text} />
                    <Text style={styles.streakRequirement}>
                      {reward.streak_requirement} day streak
                    </Text>
                  </View>
                ) : (
                  <View style={styles.unlockedInfo}>
                    <MaterialCommunityIcons name="check-circle" size={20} color={colors.success} />
                    <Text style={styles.unlockedText}>Unlocked!</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  streakInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  streakText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    paddingHorizontal: 8,
  },
  characterCard: {
    width: '47%',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 0,
    paddingHorizontal: 8,
  },
  selectedCard: {
    borderColor: colors.primary,
  },
  lockedCard: {
    opacity: 0.5,
    backgroundColor: colors.cardBackground,
    position: 'relative',
  },
  characterImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
    backgroundColor: 'transparent',
  },
  characterName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  lockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  streakRequirement: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  unlockedInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  unlockedText: {
    fontSize: 14,
    color: colors.success,
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 12,
  },
}); 