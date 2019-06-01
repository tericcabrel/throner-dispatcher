/**
 *
 * Line queries
 *
 */

export default db => {
  try {
    const Lines = db.collection("lines");

    return {
      getLineById: async (root, { lineId }) => {
        return await Lines.findOne({ line_id: lineId });
      },
  
      getLinesByUser: async (root, { user_id }) => {
        return await Lines.find({ user_id: user_id }).sort({ created_at: -1 }).toArray();
      },
  
      getLinesByOrganization: async (root, { organizationId }) => {
        return await Lines.find({ organization_id: organizationId }).sort({ created_at: -1 }).toArray();
      },
  
      getLinesByFactory: async (root, { factoryId }) => {
        return await Lines.find({ factory_id: factoryId }).sort({ created_at: -1 }).toArray();
      },
  
      searchLines: async (root, { organizationId, keyword }) => {
        return await Lines.find({ organization_id: organizationId, name: {'$regex' : `${keyword}`, '$options' : 'i'} }).sort({ created_at: -1 }).toArray();
      },

      getLineModelRunning: async (root) => {
        return await Lines.find({ ml_running: true }).sort({ created_at: -1 }).toArray();
      },
    };
  } catch (e) {
    console.log(e);
  }
};
