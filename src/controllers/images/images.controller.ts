import { deleteLocalFiles, filterImageFromURL } from "../../util/util";
import express, { Request, Response } from "express";

import { AxiosError } from "axios";
import { isFilterImageDTO } from "./images.validator";

export const router = express.Router();

router.get("/", isFilterImageDTO, async (req: Request, res: Response) => {
  const url = req.query.image_url as string;
  try {
    const output = await filterImageFromURL(url);
    return sendFile(res, output);
  } catch (err) {
    if (err instanceof AxiosError) {
      return res
        .status(err.response.status)
        .send(
          `Image URL server responded with: "${err.response.status}: ${err.response.statusText}"`
        );
    }
    return res
      .send(500)
      .send("We are currently having system level issues. Kindly bear with us");
  }
});

/**
 * sends the first file and cleans up
 * @param res
 * @param files
 */
function sendFile(res: Response, files: string[]) {
  res.sendFile(files[0], (err) => {
    if (err)
      return res
        .send(500)
        .send(
          "We are currently having system level issues. Kindly bear with us."
        );
    deleteLocalFiles(files);
  });
}
