/**
 * Type definitions for the GalaChain game backend
 */

export interface InventoryItem {
  instanceId: string;
  equipped: boolean;
}

export interface Cooldowns {
  battle: number | null;
  hatch: number | null;
}

export interface CreateProfileDto {
  playerId: string;
}

export interface UpdateNickNameDto {
  nickName: string;
}

export interface EquipItemDto {
  instanceId: string;
}

export interface SetCooldownDto {
  type: 'battle' | 'hatch';
  seconds: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

