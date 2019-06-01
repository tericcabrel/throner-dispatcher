import joi from 'joi';

export const SendCommandJSONSchema = {
  type: joi.string().required(),
  action: joi.string().required(),
};
