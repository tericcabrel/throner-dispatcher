/**
 *
 * Simulation resolver
 *
 */
import { ObjectId } from "mongodb";

// queries
import Queries from "./queries";

// mutations
import Mutations from "./mutations";

export default db => {
  return {
    Query: Queries(db)
  };
};
