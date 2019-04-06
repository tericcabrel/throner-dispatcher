import joi from 'joi';

export const TakePictureJSONSchema = {
  action: joi.string().required(),
};
