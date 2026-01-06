import { CreateTokenClassDto } from "@gala-chain/api";

export async function createCreatureVFTTokenClass() {
  try {
    const dto = new CreateTokenClassDto();

    dto.tokenClass = {
      collection: "ARCANO",
      category: "Unit",
      type: "Creature",
      additionalKey: "NFT",
      instance: "0",
    };
    dto.name = "Arcano Creature Token";
    dto.symbol = "Creature";
    dto.description = "Creature is a test fungible token used for development and testing on GalaChain.";
    dto.image = "https://gateway.pinata.cloud/ipfs/bafybeid3sfqwu4innxxd7wunnapfvqhylstl6lstwvtffljwwbb5m74ffy";
  
    dto.maxSupply = 0; 
    dto.isNonFungible = true;
  
    dto.allowMint = true;
    dto.allowBurn = true;
    dto.allowTransfer = true;
  
    dto.canTransfer = true;
    dto.canBurn = true;
    dto.adminCanBurn = true;
    
    dto.uniqueKey = `create-arcano-creature-${Date.now()}`;
    dto.sign("a6d0980a7ba6b84aae512f8fb0804f6400a65735fc902abc21ddae3fa685b7e9", false);
    console.log(dto.serialize());
    
    
    const response = await fetch('https://gateway-testnet.galachain.com/api/testnet04/gc-6ce56fd3c2df7a3a0f8f1710574c513ef361c5ed-GalaChainToken/CreateTokenClass',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: dto.serialize()
    })
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`CreateTokenClass failed: ${error}`);
      }
    
    return response.json();
  } catch (error) {
    console.log("creature NFT token class deploy error",error);
    return error;   
  }
}