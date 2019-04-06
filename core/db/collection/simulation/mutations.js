/**
 *
 * Simulation mutations
 *
 */

import { ObjectId } from "mongodb";


export default db => {
  try {
    const Simulations = db.collection("simulations");

    return {
      
    };
  } catch (e) {
    console.log(e);
  }
};
