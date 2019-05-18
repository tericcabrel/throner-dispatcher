import joi from 'joi';

export const CheckStatusJSONSchema = {
  action: joi.string().required(),
};
