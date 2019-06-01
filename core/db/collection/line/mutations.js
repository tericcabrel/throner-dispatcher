/**
 *
 * Line mutations
 *
 */

import { ObjectId } from "mongodb";
import uuid from 'uuid/v4';
import moment from 'moment'

export default db => {
  try {
    const Lines = db.collection("lines");
    const Modules = db.collection("modules");
    const Buffers = db.collection("buffers");
    const Machines = db.collection("machines");

    return {
      createLine: async (root, { name, organization_id, factory_id, product_id, user_id }) => {
        if (!name) {
          return { success: false, msg: 'Line name is required!', line: undefined }
        }
  
        if (!organization_id) {
          return { success: false, msg: 'Organization is required !', line: undefined }
        }
  
        if (!factory_id) {
          return { success: false, msg: 'Factory is required !', line: undefined }
        }
  
        if (!product_id) {
          return { success: false, msg: 'Product is required !', line: undefined }
        }
        
        if (!user_id) {
          return { success: false, msg: 'Invalid User!', line: undefined }
        }
    
        const res = await Lines.insertOne({
          line_id: uuid(),
          name,
          user_id,
          organization_id,
          factory_id,
          product_id,
          evaluated: false,
          ml_running: false,
          created_at: moment().toDate(),
          updated_at: moment().toDate(),
        });
    
        if (res) {
          const line = await Lines.findOne({ _id: res.insertedId });
          return { success: true, msg: 'Line added successfully!', line }
        } else {
          return { success: false, msg: 'Unable to process your request at this time.', line: undefined }
        }
    
      },
      updateLine: async (root, { line_id, name, organization_id, factory_id, product_id, user_id, evaluated, ml_running }) => {
        if (!line_id) {
          return {
            success: false,
            msg: 'Line ID is required!',
            line: undefined
          }
        }
        let line = await Lines.findOne({ line_id });

        await Lines.updateOne({ line_id }, {
          $set: {
            name,
            organization_id,
            user_id,
            factory_id,
            product_id,
            evaluated,
            ml_running: ml_running !== undefined ? ml_running : line.ml_running,
            updated_at: moment().toDate(),
          }
        });
    
        line = await Lines.findOne({ line_id });
    
        return {
          success: true,
          msg: 'Line updated successfully!',
          line,
        }
      },
      removeLine: async (root, { line_id }) => {
        const line = await Lines.findOne({ line_id });
    
        if (!line_id || !line) return { success: false };
        
        // Get modules and buffers of the line
        const modules = await Modules.find({ line_id }).sort({ created_at: -1 }).toArray();
        const buffers = await Buffers.find({ line_id }).sort({ created_at: -1 }).toArray();
        const moduleIds = [], bufferIds = [];
        
        // Remove the link between machine and each module which will be deleted
        modules.forEach(async (module) => {
          moduleIds.push(module.module_id);
          await Machines.update({ _id: { $in: module.machines} }, {
            $set: {
              module_id: null
          }});
        });
        
        // Collect buffer's id into an array
        buffers.forEach(buffer => bufferIds.push(buffer.buffer_id));
        
        // Delete modules and buffers linked to the line
        await Modules.deleteMany({ module_id: { $in: moduleIds }});
        await Buffers.deleteMany({ buffer_id: { $in: bufferIds }});
        
        await Lines.deleteOne({ line_id });
    
        return { success: true }
      }
    };
  } catch (e) {
    console.log(e);
  }
};
