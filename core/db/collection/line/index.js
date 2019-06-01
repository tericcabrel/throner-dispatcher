/**
 *
 * Line resolver
 *
 */
import {ObjectId} from "mongodb";

// queries
import Queries from "./queries";

// mutations
import Mutations from "./mutations";

export default db => {
  const Users = db.collection("users");
  const LineModels = db.collection("linemodels");

  return {
    Query: Queries(db),
    Line: {
      user: async ({ user_id }) => {
        if (!user_id) return null;
        return await Users.findOne({ user_id });
      },
      model: async ({ line_id }) => {
        if (!line_id) return null;
        const models = await LineModels.find({ line_id }).sort({ created_at: -1 }).toArray();
        const validModels = models.filter( m => m.last_production_rate !== null);
        return validModels.length > 0 ? validModels[0] : null;
      }
    },
    Mutation: Mutations(db)
  };
};
