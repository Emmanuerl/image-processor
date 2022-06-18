import { deleteLocalFiles, filterImageFromURL } from "../../../util/util";
import express, { Request, Response } from "express";

import { isFilterImageDTO } from "./images.validator";

export const router = express.Router();

router.get("/", isFilterImageDTO, async (req: Request, res: Response) => {
  const { image_url } = req.query;
  const filteredImage = await filterImageFromURL(image_url);

  res.sendFile(filteredImage, (err) => {
    if (err)
      return res
        .send(500)
        .send(
          "We are currently having system level issues. Kindly bear with us."
        );
    deleteLocalFiles([filteredImage]);
  });
});
