import * as joi from 'joi';
import * as _ from 'lodash';

// requests
import { TakePictureJSONSchema } from './take-picture/schema';
import { CheckStatusJSONSchema } from './check-status/schema';

export const schemasBeforeDispatching = {
  // requests
  PM001: joi.object(TakePictureJSONSchema).required(),
  PM003: joi.object(CheckStatusJSONSchema).required(),

  /* PM029: joi.object({
      DesignOptimizationRequest: DesignOptimizationReqJSONSchema,
  }),*/

  // responses
  // PM002: joi.object(PM002JSONSchema).required(),
};

export const schemasAfterDispatching = _.mapValues(schemasBeforeDispatching, (s) => {
  return s.append({
    clientID: joi.string().required(),
    processID: joi.string().required(),
  });
});
