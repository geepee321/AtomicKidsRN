import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Reward, ChildReward, RewardsContextType } from '../types/rewards';
import { useAuth } from '../context/auth';
import { useChildren } from '../context/children';

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export const RewardsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [unlockedRewards, setUnlockedRewards] = useState<ChildReward[]>([]);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { session } = useAuth();
  const { children: childrenList, refreshChildren } = useChildren();

  const activeChild = childrenList.find(child => child.id === activeChildId);

  const fetchRewards = async (childId?: string) => {
    const targetChildId = childId || activeChildId;
    if (!session || !targetChildId) {
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch all rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('rewards')
        .select('*')
        .order('streak_requirement', { ascending: true });

      if (rewardsError) throw rewardsError;
      setRewards(rewardsData);

      // Fetch unlocked rewards for the target child
      const { data: unlockedData, error: unlockedError } = await supabase
        .from('child_rewards')
        .select('*, reward:rewards(*)')
        .eq('child_id', targetChildId);

      if (unlockedError) throw unlockedError;
      setUnlockedRewards(unlockedData);

      // Get selected character for the target child
      const child = childrenList.find(c => c.id === targetChildId);
      setSelectedCharacterId(child?.selected_character_id || null);

    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch rewards'));
    } finally {
      setIsLoading(false);
    }
  };

  // Set initial active child
  useEffect(() => {
    if (childrenList.length > 0 && !activeChildId) {
      setActiveChildId(childrenList[0].id);
    }
  }, [childrenList]);

  // Fetch rewards when active child changes
  useEffect(() => {
    if (activeChildId) {
      fetchRewards();
    }
  }, [session, activeChildId]);

  const selectCharacter = async (rewardId: string) => {
    if (!activeChildId) return;

    try {
      setIsLoading(true);
      
      // Update the database
      const { error } = await supabase
        .from('children')
        .update({ selected_character_id: rewardId })
        .eq('id', activeChildId);

      if (error) throw error;

      // First refresh children to get the updated child data
      await refreshChildren();
      
      // Then refresh rewards
      await fetchRewards(activeChildId);
      
      // Finally update the local state
      setSelectedCharacterId(rewardId);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to select character'));
    } finally {
      setIsLoading(false);
    }
  };

  const setActiveChild = (childId: string) => {
    setActiveChildId(childId);
  };

  return (
    <RewardsContext.Provider
      value={{
        rewards,
        unlockedRewards,
        selectedCharacterId,
        isLoading,
        error,
        selectCharacter,
        refreshRewards: fetchRewards,
        activeChild,
        setActiveChild,
      }}
    >
      {children}
    </RewardsContext.Provider>
  );
};

export const useRewards = () => {
  const context = useContext(RewardsContext);
  if (context === undefined) {
    throw new Error('useRewards must be used within a RewardsProvider');
  }
  return context;
}; 