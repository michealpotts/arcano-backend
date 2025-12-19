import dotenv from 'dotenv';
import { InventoryItem } from '../types';
import { RegisterEthUserDto} from "@gala-chain/api";

dotenv.config();

export class GalaChainService {
  private galaUrl: string;

  constructor() {
    const galaGatewayUrl = process.env.GALA_CHAIN_URL || '';
    const channelId = process.env.GALA_CHANNEL || '';
    const contractId = process.env.GALA_CHAINCODE || '';
    this.galaUrl = galaGatewayUrl+'/'+channelId+'/'+contractId+'-';
  }
  async isRegistrated(userAddress:string){
    try {
      const requestBody = JSON.stringify({user:`eth|${userAddress.replace(/^0x/i, "")}`});    
      const res = await fetch(this.galaUrl+'PublicKeyContract/'+'GetPublicKey',{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: requestBody
      })
      const resData = await res.json();   
      if(resData.error){
        throw new Error('request is failed');
      }
      return true;
    } catch (error) {
      console.error(`[GalaChain] Error check registration:`, error);
      return false;
    }
  }
  async registerUser(publicKey:string){
    try {
      const dto = new RegisterEthUserDto();
      dto.publicKey = publicKey;
      dto.uniqueKey = `user-register-${Date.now()}-${Math.floor(Math.random()*1000)}`;
      dto.sign(process.env.GALA_ADMIN_PRIVATE_KEY, false);
      const res = await fetch(this.galaUrl+'PublicKeyContract/'+'RegisterEthUser',{
        method:"POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: dto.serialize()
      })
      const resData = await res.json();
      if(resData.error){
        throw new Error('request is failed');
      }
      return resData.Data;
    } catch (error) {
      console.error(`[GalaChain] Error check registration:`, error);
      return false;
    }
  }
  async getBalance(walletAddress: string): Promise<number> {
    try {
      // TODO: Replace with actual GalaChain SDK call
      // Example implementation:
      // const sdk = new GalaChainSDK({ apiKey: this.apiKey, network: this.network });
      // const balance = await sdk.getBalance(walletAddress);
      // return balance;

      // Mock implementation for development
      console.log(`[GalaChain] Fetching balance for walletAddress: ${walletAddress}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Mock balance - replace with actual SDK call
      const mockBalance = Math.random() * 1000;
      return parseFloat(mockBalance.toFixed(8));
    } catch (error) {
      console.error(`[GalaChain] Error fetching balance:`, error);
      throw new Error(`Failed to fetch GALA balance: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Fetch inventory (NFTs/items) for a wallet from the blockchain
   * @param walletAddress - GalaChain wallet address
   * @returns Array of inventory items
   */
  async getInventory(walletAddress: string): Promise<InventoryItem[]> {
    try {
      // TODO: Replace with actual GalaChain SDK call
      // Example implementation:
      // const sdk = new GalaChainSDK({ apiKey: this.apiKey, network: this.network });
      // const nfts = await sdk.getNFTs(walletAddress);
      // return nfts.map(nft => ({
      //   instanceId: nft.instanceId,
      //   equipped: false
      // }));

      // Mock implementation for development
      console.log(`[GalaChain] Fetching inventory for walletAddress: ${walletAddress}`);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 200));

      // Mock inventory - replace with actual SDK call
      const mockInventory: InventoryItem[] = [
        {
          instanceId: `item_${walletAddress.slice(0, 8)}_001`,
          equipped: false,
        },
        {
          instanceId: `item_${walletAddress.slice(0, 8)}_002`,
          equipped: false,
        },
      ];

      return mockInventory;
    } catch (error) {
      console.error(`[GalaChain] Error fetching inventory:`, error);
      throw new Error(`Failed to fetch inventory: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify wallet signature (for authentication)
   * @param walletAddress - GalaChain wallet address
   * @param signature - Wallet signature
   * @returns True if signature is valid
   */
  async verifyWalletSignature(
    walletAddress: string,
    signature: string
  ): Promise<boolean> {
    try {
      // TODO: Replace with actual GalaChain SDK verification
      // const sdk = new GalaChainSDK({ apiKey: this.apiKey, network: this.network });
      // return await sdk.verifySignature(walletAddress, signature);

      // Mock implementation - always returns true in development
      console.log(`[GalaChain] Verifying signature for walletAddress: ${walletAddress}`);
      return true;
    } catch (error) {
      console.error(`[GalaChain] Error verifying signature:`, error);
      return false;
    }
  }
}
