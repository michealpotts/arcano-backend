import { createEggNFTTokenClass } from "./egg";
import { createMockGalaTokenClass } from "./essence";
import { createCreatureVFTTokenClass } from "./creature";


export async function lunchTokenClasee() {
  // await createMockGalaTokenClass();
  // await createEggNFTTokenClass();
  await createCreatureVFTTokenClass();
  
  return true;
}