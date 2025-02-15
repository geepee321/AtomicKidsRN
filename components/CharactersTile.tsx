import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRewards } from '../contexts/RewardsContext';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { useChildren } from '../context/children';
import { Image } from 'expo-image';

export const CharactersTile = ({ selectedChildId }: { selectedChildId: string }) => {
  const { rewards, unlockedRewards, selectedCharacterId, refreshRewards } = useRewards();
  const { children } = useChildren();
  
  useEffect(() => {
    if (selectedChildId) {
      refreshRewards(selectedChildId);
    }
  }, [selectedChildId]);

  const selectedChild = children.find(child => child.id === selectedChildId);
  const selectedCharacter = rewards.find(r => r.id === selectedChild?.selected_character_id);
  const childRewards = unlockedRewards.filter(r => r.child_id === selectedChildId);
  const unlockedCount = childRewards.length;
  const totalCount = rewards.length;

  if (!selectedChild) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push({
        pathname: '/(app)/(parent)/rewards',
        params: { 
          childId: selectedChild.id,
          childName: selectedChild.name
        }
      })}
    >
      <View style={styles.header}>
        <Text style={styles.title}>My Characters</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text} />
      </View>

      <View style={styles.content}>
        {selectedCharacter ? (
          <Image
            source={{ uri: selectedCharacter.image_url }}
            style={styles.selectedCharacter}
            contentFit="contain"
            placeholder={require('../assets/default-avatar.png')}
            transition={200}
          />
        ) : (
          <View style={[styles.selectedCharacter, styles.placeholderAvatar]}>
            <MaterialCommunityIcons name="account" size={32} color={colors.textSecondary} />
          </View>
        )}
        
        <View style={styles.info}>
          <Text style={styles.progressText}>
            {unlockedCount} of {totalCount} Characters Unlocked
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(unlockedCount / totalCount) * 100}%` },
              ]}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedCharacter: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  placeholderAvatar: {
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 