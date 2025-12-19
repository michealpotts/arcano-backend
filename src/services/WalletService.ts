import { ethers } from 'ethers';

export class WalletService {
    constructor() {}
    getPublickey(message:string, signature:string):string|null{
        try {
            const messageHash = ethers.hashMessage(message);
            const publicKey = ethers.SigningKey.recoverPublicKey(messageHash, signature).replace(/^0x/, "");
            return publicKey.replace(/^0x/i, "");
        } catch (error) {
            return null;
        }
    }
    verifySignature(message: string, signature: string): string | null {
        try {
          const recoveredAddress = ethers.verifyMessage(message, signature);
          return recoveredAddress;
        } catch (error) {
          return null;
        }
    }

}
