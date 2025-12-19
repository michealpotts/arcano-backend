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

  async create(walletAddress: string, playerId: string, nickName?: string): Promise<Profile> {
    const profile = this.repository.create({
      walletAddress,
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

  async findByWalletAddress(walletAddress: string): Promise<Profile | null> {
    return await this.repository.findOne({
      where: { walletAddress },
    });
  }

  async findByWalletAddressOrFail(walletAddress: string): Promise<Profile> {
    const profile = await this.findByWalletAddress(walletAddress);
    if (!profile) {
      throw new NotFoundError(`Profile with walletAddress ${walletAddress} not found`);
    }
    return profile;
  }

  async update(profile: Profile): Promise<Profile> {
    return await this.repository.save(profile);
  }

  async updateNickName(walletAddress: string, nickName: string): Promise<Profile> {
    const profile = await this.findByWalletAddressOrFail(walletAddress);
    profile.nickName = nickName;
    return await this.repository.save(profile);
  }

  async updateProfilePicture(
    walletAddress: string,
    profilePicture: string | null
  ): Promise<Profile> {
    const profile = await this.findByWalletAddressOrFail(walletAddress);
    profile.profilePicture = profilePicture;
    return await this.repository.save(profile);
  }

  async updateGalaBalance(
    walletAddress: string,
    galaBalance: number
  ): Promise<Profile> {
    const profile = await this.findByWalletAddressOrFail(walletAddress);
    profile.galaBalance = galaBalance;
    return await this.repository.save(profile);
  }

  async updateInventory(
    walletAddress: string,
    inventory: InventoryItem[]
  ): Promise<Profile> {
    const profile = await this.findByWalletAddressOrFail(walletAddress);
    profile.inventory = inventory;
    profile.inventoryCacheUpdatedAt = new Date();
    return await this.repository.save(profile);
  }

  async updateCooldowns(
    walletAddress: string,
    cooldowns: Cooldowns
  ): Promise<Profile> {
    const profile = await this.findByWalletAddressOrFail(walletAddress);
    profile.cooldowns = cooldowns;
    return await this.repository.save(profile);
  }

  async updateLastLogin(walletAddress: string): Promise<Profile> {
    const profile = await this.findByWalletAddressOrFail(walletAddress);
    profile.lastLogin = new Date();
    return await this.repository.save(profile);
  }

  async updateXP(walletAddress: string, xp: number): Promise<Profile> {
    const profile = await this.findByWalletAddressOrFail(walletAddress);
    profile.xp = xp;
    return await this.repository.save(profile);
  }

  async updateLevel(walletAddress: string, level: number): Promise<Profile> {
    const profile = await this.findByWalletAddressOrFail(walletAddress);
    profile.level = level;
    return await this.repository.save(profile);
  }
}

