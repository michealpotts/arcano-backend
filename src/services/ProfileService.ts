/**
 * Profile Service - Business logic layer for Profile operations
 * Implements all 14 required functions
 */

import { ProfileRepository } from '../repositories/ProfileRepository';
import { GalaChainService } from './GalaChainService';
import { Profile } from '../models/Profile';
import { InventoryItem, Cooldowns } from '../types';
import { NotFoundError, BadRequestError } from '../utils/errors';

export class ProfileService {
  private profileRepository: ProfileRepository;
  private galaChainService: GalaChainService;

  constructor() {
    this.profileRepository = new ProfileRepository();
    this.galaChainService = new GalaChainService();
  }

  /**
   * 1. Create a new profile for a player
   */
  async createProfile(walletAddress: string, playerId: string): Promise<Profile> {
    // Check if profile already exists
    const existingProfile = await this.profileRepository.findByWalletAddress(walletAddress);
    if (existingProfile) {
      return existingProfile;
    }

    // Create new profile
    return await this.profileRepository.create(walletAddress,playerId);
  }

  /**
   * 2. Get profile by walletAddress
   */
  async getProfile(walletAddress: string): Promise<Profile> {
    return await this.profileRepository.findByWalletAddressOrFail(walletAddress);
  }

  /**
   * 3. Update nickname
   */
  async updateNickName(walletAddress: string, nickName: string): Promise<Profile> {
    if (!nickName || nickName.trim().length === 0) {
      throw new BadRequestError('Nickname cannot be empty');
    }
    if (nickName.length > 100) {
      throw new BadRequestError('Nickname cannot exceed 100 characters');
    }
    return await this.profileRepository.updateNickName(walletAddress, nickName.trim());
  }

  /**
   * 4. Update profile picture
   */
  async updateProfilePicture(
    walletAddress: string,
    filePath: string | null
  ): Promise<Profile> {
    return await this.profileRepository.updateProfilePicture(walletAddress, filePath);
  }

  /**
   * 5. Sync GALA balance from blockchain
   */
  async syncGalaBalance(walletAddress: string): Promise<Profile> {
    const balance = await this.galaChainService.getBalance(walletAddress);
    return await this.profileRepository.updateGalaBalance(walletAddress, balance);
  }

  /**
   * 6. Get inventory from database
   */
  async getInventory(walletAddress: string): Promise<InventoryItem[]> {
    const profile = await this.profileRepository.findByWalletAddressOrFail(walletAddress);
    return profile.inventory || [];
  }

  /**
   * 7. Refresh inventory from blockchain and update database
   */
  async refreshInventoryFromChain(walletAddress: string): Promise<InventoryItem[]> {
    const chainInventory = await this.galaChainService.getInventory(walletAddress);
    await this.profileRepository.updateInventory(walletAddress, chainInventory);
    return chainInventory;
  }

  /**
   * 8. Equip an item
   */
  async equipItem(walletAddress: string, instanceId: string): Promise<Profile> {
    const profile = await this.profileRepository.findByWalletAddressOrFail(walletAddress);
    const inventory = profile.inventory || [];

    // Find the item in inventory
    const itemIndex = inventory.findIndex(
      (item) => item.instanceId === instanceId
    );

    if (itemIndex === -1) {
      throw new NotFoundError(`Item with instanceId ${instanceId} not found in inventory`);
    }

    // Unequip any other items of the same type (optional: can be customized)
    // For now, we'll just equip the requested item
    inventory[itemIndex].equipped = true;

    return await this.profileRepository.updateInventory(walletAddress, inventory);
  }

  /**
   * 9. Unequip an item
   */
  async unequipItem(walletAddress: string, instanceId: string): Promise<Profile> {
    const profile = await this.profileRepository.findByWalletAddressOrFail(walletAddress);
    const inventory = profile.inventory || [];

    // Find the item in inventory
    const itemIndex = inventory.findIndex(
      (item) => item.instanceId === instanceId
    );

    if (itemIndex === -1) {
      throw new NotFoundError(`Item with instanceId ${instanceId} not found in inventory`);
    }

    inventory[itemIndex].equipped = false;

    return await this.profileRepository.updateInventory(walletAddress, inventory);
  }

  /**
   * 10. Set cooldown for a specific type
   */
  async setCooldown(
    walletAddress: string,
    type: 'battle' | 'hatch',
    seconds: number
  ): Promise<Profile> {
    if (seconds < 0) {
      throw new BadRequestError('Cooldown seconds cannot be negative');
    }

    const profile = await this.profileRepository.findByWalletAddressOrFail(walletAddress);
    const cooldowns = { ...profile.cooldowns };

    // Set cooldown to current time + seconds
    const cooldownEndTime = Date.now() + seconds * 1000;
    cooldowns[type] = cooldownEndTime;

    return await this.profileRepository.updateCooldowns(walletAddress, cooldowns);
  }

  /**
   * 11. Check if cooldown is active
   * @returns Remaining seconds if cooldown is active, null if no cooldown
   */
  async checkCooldown(
    walletAddress: string,
    type: 'battle' | 'hatch'
  ): Promise<number | null> {
    const profile = await this.profileRepository.findByWalletAddressOrFail(walletAddress);
    const cooldownEndTime = profile.cooldowns[type];

    if (cooldownEndTime === null) {
      return null;
    }

    const now = Date.now();
    if (cooldownEndTime <= now) {
      // Cooldown expired, clear it
      const cooldowns = { ...profile.cooldowns };
      cooldowns[type] = null;
      await this.profileRepository.updateCooldowns(walletAddress, cooldowns);
      return null;
    }

    // Return remaining seconds
    return Math.ceil((cooldownEndTime - now) / 1000);
  }

  /**
   * 12. Update last login timestamp
   */
  async updateLastLogin(walletAddress: string): Promise<Profile> {
    return await this.profileRepository.updateLastLogin(walletAddress);
  }

  /**
   * 13. Increment XP
   */
  async incrementXP(walletAddress: string, amount: number): Promise<Profile> {
    if (amount < 0) {
      throw new BadRequestError('XP amount cannot be negative');
    }

    const profile = await this.profileRepository.findByWalletAddressOrFail(walletAddress);
    const newXP = profile.xp + amount;

    // Auto level up if XP threshold is reached
    const newLevel = this.calculateLevel(newXP);
    if (newLevel > profile.level) {
      profile.level = newLevel;
    }

    profile.xp = newXP;
    return await this.profileRepository.update(profile);
  }

  /**
   * 14. Level up player
   */
  async levelUp(walletAddress: string): Promise<Profile> {
    const profile = await this.profileRepository.findByWalletAddressOrFail(walletAddress);
    
    // Calculate required XP for next level
    const xpForNextLevel = this.calculateXPForLevel(profile.level + 1);
    
    if (profile.xp < xpForNextLevel) {
      throw new BadRequestError(
        `Insufficient XP. Need ${xpForNextLevel} XP to reach level ${profile.level + 1}`
      );
    }

    profile.level += 1;
    return await this.profileRepository.update(profile);
  }

  /**
   * Helper: Calculate level based on XP
   * Formula: level = floor(sqrt(XP / 100))
   */
  private calculateLevel(xp: number): number {
    return Math.floor(Math.sqrt(xp / 100));
  }

  /**
   * Helper: Calculate required XP for a level
   */
  private calculateXPForLevel(level: number): number {
    return level * level * 100;
  }
}

