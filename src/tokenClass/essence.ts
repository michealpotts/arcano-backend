import { CreateTokenClassDto, UpdateTokenClassDto } from "@gala-chain/api";

export async function createMockGalaTokenClass() {
  try {
    const dto = new UpdateTokenClassDto();

    dto.tokenClass = {
      collection: "ARCANO",
      category: "Unit",
      type: "MockGALA",
      additionalKey: "FT",
    };
    
    dto.name = "Mock Gala Token";
    dto.symbol = "MOCKGALA";
    dto.description = "MockGALA is a test fungible token used for development and testing on GalaChain.";
    dto.image = "https://gateway.pinata.cloud/ipfs/bafybeid3sfqwu4innxxd7wunnapfvqhylstl6lstwvtffljwwbb5m74ffy";
  
    dto.isNonFungible = false;
    dto.decimals = 8;
    dto.maxSupply = 100;
  
    dto.allowMint = true;
    dto.allowTransfer = true;
    dto.allowBurn = true;
  
    dto.canTransfer = true;
    dto.canBurn = true;
    dto.adminCanBurn = true;
    
    dto.uniqueKey = `create-mockgala-${Date.now()}`;
    dto.sign("a6d0980a7ba6b84aae512f8fb0804f6400a65735fc902abc21ddae3fa685b7e9", false);
    console.log(dto.serialize());
    
    const response = await fetch('https://gateway-testnet.galachain.com/api/testnet04/gc-6ce56fd3c2df7a3a0f8f1710574c513ef361c5ed-GalaChainToken/UpdateTokenClass',{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: dto.serialize()
    })
  console.log(response);
  
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`CreateTokenClass failed: ${error}`);
      }
    
    return response.json();
  } catch (error) {
    console.log("token class deploy error",error);
    return error;    
  }
}