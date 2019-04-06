/**
 *
 * Simulations queries
 *
 */

import { ObjectId } from "mongodb";

export default db => {
  try {
    const Simulations = db.collection("simulations");

    return {
      getSimulationsByLineModelId: async (root, { lineModelId }) => {
        return await Simulations.find({ linemodel_id: lineModelId })/*.sort({ created_at: -1 })*/.toArray();
      },
    };
  } catch (e) {
    console.log(e);
  }
};
