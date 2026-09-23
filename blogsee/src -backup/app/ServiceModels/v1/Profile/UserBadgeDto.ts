export interface UserBadgeDto {
  badgeId: number;
  badgeName: string;
  description: string | null;
  iconUrl: string | null;
  earnedAt: string;
}
