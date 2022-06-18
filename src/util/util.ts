import Axios, { AxiosError } from "axios";

import Jimp from "jimp";
import fs from "fs";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const id = Date.now();
      const downloadPath = getPath(id, "downloaded");
      const filteredPath = getPath(id, "filtered");

      const image: any = await downloadImage(inputURL, downloadPath);
      const editor = await Jimp.read(image);

      return new Promise((res, rej) => {
        editor
          .resize(256, 256) // resize
          .quality(60) // set JPEG quality
          .greyscale() // set greyscale
          .write(filteredPath, (image) => {
            resolve([filteredPath, downloadPath]);
          });
      });
    } catch (error) {
      reject(error);
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}

async function downloadImage(url: string, filepath: string) {
  const response = await Axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  return new Promise((resolve, reject) => {
    response.data
      .pipe(fs.createWriteStream(filepath))
      .on("error", reject)
      .once("close", () => resolve(filepath));
  });
}

function getPath(id: number, type: "filtered" | "downloaded"): string {
  return `${__dirname}/tmp/${type}.${id}.jpg`;
}
