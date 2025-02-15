export type RewardType = 'character';

export interface Reward {
  id: string;
  name: string;
  type: RewardType;
  streak_requirement: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface ChildReward {
  id: string;
  child_id: string;
  reward_id: string;
  unlocked_at: string;
  reward?: Reward;
}

export interface RewardsContextType {
  rewards: Reward[];
  unlockedRewards: ChildReward[];
  selectedCharacterId: string | null;
  isLoading: boolean;
  error: Error | null;
  selectCharacter: (rewardId: string) => Promise<void>;
  refreshRewards: (childId?: string) => Promise<void>;
  activeChild: { id: string; name: string; streak: number; selected_character_id: string | null } | undefined;
  setActiveChild: (childId: string) => void;
} 