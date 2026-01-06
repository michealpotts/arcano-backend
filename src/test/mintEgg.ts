import { MintTokenWithAllowanceDto } from '@gala-chain/api';

export async function mintEgg(){
    const dto = new MintTokenWithAllowanceDto();

    dto.tokenClass = {
        collection: "ARCANO",
        category: "Unit",
        type: "Egg4",
        additionalKey :"NFT",
        instance:0
      };
      dto.tokenInstance = 0;

      dto.owner='eth|231F5efC4FD011DD0A74b6368DB06A92d4dA3Ffb';
      dto.quantity = 1;
    // Metadata (traits)
    dto.metadata = {id:"egg #1"};
    dto.uniqueKey = `mint-gala-${Date.now()}-${Math.floor(Math.random()*1000)}`;
    dto.sign("a6d0980a7ba6b84aae512f8fb0804f6400a65735fc902abc21ddae3fa685b7e9", false);
    console.log(dto.serialize());
    // const res = await fetch('https://gateway-testnet.galachain.com/api/testnet04/gc-6ce56fd3c2df7a3a0f8f1710574c513ef361c5ed-GalaChainToken/MintTokenWithAllowance',{
    //   method:"POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "Accept": "application/json",
    //   },
    //   body: dto.serialize()
    // })
    // const resData = await res.json();
    // console.log('----------',resData);
    return true
    
  }