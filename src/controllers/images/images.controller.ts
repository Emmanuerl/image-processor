import { deleteLocalFiles, filterImageFromURL } from "../../util/util";
import express, { Request, Response } from "express";

import { isFilterImageDTO } from "./images.validator";

export const router = express.Router();

router.get("/", isFilterImageDTO, async (req: Request, res: Response) => {
  const url = req.query.image_url as string;
  const images = await filterImageFromURL(url);
  console.log(images);
  res.sendFile(images[0], (err) => {
    if (err)
      return res
        .send(500)
        .send(
          "We are currently having system level issues. Kindly bear with us."
        );
    deleteLocalFiles(images);
  });
});
