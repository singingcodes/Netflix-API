import fs from "fs-extra"
import { join, dirname } from "path"
import { fileURLToPath } from "url"
const { readJSON, writeJSON, writeFile, unlink, createReadStream } = fs
const mediaJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../data/media.json"
)
console.log(mediaJSONPath)

export const getMedias = () => readJSON(mediaJSONPath)
export const writeMedias = (mediaArray) => writeJSON(mediaJSONPath, mediaArray)
