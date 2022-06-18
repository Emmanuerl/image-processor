import { NextFunction, Request, Response } from "express";

import joi from "joi";

export function isFilterImageDTO(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const schema = joi.object().keys({
    image_url: joi.string().uri().required().trim(),
  });

  const { error, value } = schema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const details: { [key: string]: string } = {};
    error.details.forEach((detail) => {
      details[detail.context.label] = detail.message;
    });
    return res
      .status(422)
      .json({ message: "Your request query parameters are invalid", details });
  } else {
    req.query = value;
    return next();
  }
}
