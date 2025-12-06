/**
 * Profile Repository - Database access layer for Profile entity
 */

import { AppDataSource } from '../config/database';
import { Profile } from '../models/Profile';
import { Repository } from 'typeorm';
import { NotFoundError } from '../utils/errors';
import { InventoryItem, Cooldowns } from '../types';

export class ProfileRepository {
  private repository: Repository<Profile>;

  constructor() {
    this.repository = AppDataSource.getRepository(Profile);
  }

  /**
   * Create a new profile
   */
  async create(playerId: string, nickName?: string): Promise<Profile> {
    const profile = this.repository.create({
      playerId,
      nickName: nickName || playerId,
      profilePicture: '',
      xp: 0,
      level: 0,
      galaBalance: 0,
      inventory: [],
      cooldowns: {
        battle: null,
        hatch: null,
      },
      lastLogin: new Date(),
    });

    return await this.repository.save(profile);
  }

  /**
   * Find profile by playerId
   */
  async findByPlayerId(playerId: string): Promise<Profile | null> {
    return await this.repository.findOne({
      where: { playerId },
    });
  }

  /**
   * Find profile by playerId or throw error
   */
  async findByPlayerIdOrFail(playerId: string): Promise<Profile> {
    const profile = await this.findByPlayerId(playerId);
    if (!profile) {
      throw new NotFoundError(`Profile with playerId ${playerId} not found`);
    }
    return profile;
  }

  /**
   * Update profile
   */
  async update(profile: Profile): Promise<Profile> {
    return await this.repository.save(profile);
  }

  /**
   * Update nickname
   */
  async updateNickName(playerId: string, nickName: string): Promise<Profile> {
    const profile = await this.findByPlayerIdOrFail(playerId);
    profile.nickName = nickName;
    return await this.repository.save(profile);
  }

  /**
   * Update profile picture
   */
  async updateProfilePicture(
    playerId: string,
    profilePicture: string | null
  ): Promise<Profile> {
    const profile = await this.findByPlayerIdOrFail(playerId);
    profile.profilePicture = profilePicture;
    return await this.repository.save(profile);
  }

  /**
   * Update Gala balance
   */
  async updateGalaBalance(
    playerId: string,
    galaBalance: number
  ): Promise<Profile> {
    const profile = await this.findByPlayerIdOrFail(playerId);
    profile.galaBalance = galaBalance;
    return await this.repository.save(profile);
  }

  /**
   * Update inventory
   */
  async updateInventory(
    playerId: string,
    inventory: InventoryItem[]
  ): Promise<Profile> {
    const profile = await this.findByPlayerIdOrFail(playerId);
    profile.inventory = inventory;
    profile.inventoryCacheUpdatedAt = new Date();
    return await this.repository.save(profile);
  }

  /**
   * Update cooldowns
   */
  async updateCooldowns(
    playerId: string,
    cooldowns: Cooldowns
  ): Promise<Profile> {
    const profile = await this.findByPlayerIdOrFail(playerId);
    profile.cooldowns = cooldowns;
    return await this.repository.save(profile);
  }

  /**
   * Update last login
   */
  async updateLastLogin(playerId: string): Promise<Profile> {
    const profile = await this.findByPlayerIdOrFail(playerId);
    profile.lastLogin = new Date();
    return await this.repository.save(profile);
  }

  /**
   * Update XP
   */
  async updateXP(playerId: string, xp: number): Promise<Profile> {
    const profile = await this.findByPlayerIdOrFail(playerId);
    profile.xp = xp;
    return await this.repository.save(profile);
  }

  /**
   * Update level
   */
  async updateLevel(playerId: string, level: number): Promise<Profile> {
    const profile = await this.findByPlayerIdOrFail(playerId);
    profile.level = level;
    return await this.repository.save(profile);
  }
}

