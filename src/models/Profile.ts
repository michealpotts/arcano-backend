/**
 * Profile Entity - TypeORM model for user profiles
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { InventoryItem, Cooldowns } from '../types';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index('IDX_walletAddress', { unique: true })
  walletAddress!: string; // GalaChain wallet address (unique identifier)

  @Column({ type: 'varchar', length: 255, nullable: true })
  playerId!: string; // Player ID (can be same as walletAddress or different)

  @Column({ type: 'varchar', length: 100 })
  nickName!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  profilePicture: string | null = null;

  @Column({ type: 'int', default: 0 })
  xp: number = 0;

  @Column({ type: 'int', default: 0 })
  level: number = 0;

  @Column({ type: 'decimal', precision: 18, scale: 8, default: 0 })
  galaBalance: number = 0; // from GalaChain SDK

  @Column({ type: 'json', nullable: true })
  inventory: InventoryItem[] = [];

  @Column({ type: 'json', nullable: true })
  cooldowns: Cooldowns = {
    battle: null,
    hatch: null,
  };

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date | null = null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  inventoryCacheUpdatedAt: Date | null = null;
}

