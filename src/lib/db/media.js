import createError from "http-errors"
import { getMedias, writeMedias } from "../../lib/fs-tools.js"
import uniqid from "uniqid"

export const saveNewMedia = async (newMediaData) => {
  const newMedia = {
    ...newMediaData,
    createdAt: new Date(),
    imdbID: uniqid(),
    reviews: [],
  }
  const medias = await getMedias()
  medias.push(newMedia)
  await writeMedias(medias)
  return newMedia.imdbID
}

export const findMedia = () => getMedias()

export const findMediaById = async (mediaId) => {
  const medias = await getMedias()
  const foundMedia = medias.find((media) => media.imdbID === mediaId)
  if (findMedia) return foundMedia
  else throw createError(404, `media with id ${mediaId} not found`)
}

export const findMediaByIdAndUpdate = async (mediaId, updatedMediaData) => {
  const medias = await getMedias()
  const foundMediaIndex = medias.findIndex((media) => media.imdbID === mediaId)
  if (foundMediaIndex === -1) {
    throw createError(404, `Media with id ${mediaId} not found`)
  }
  const updatedMedia = {
    ...medias[foundMediaIndex],
    ...updatedMediaData,
    updatedAt: new Date(),
  }
  medias[foundMediaIndex] = updatedMedia
  await writeMedias(medias)
  return updatedMedia
}

export const findMediaByIdAndDelete = async (mediaId) => {
  const medias = await getMedias()
  const remainingMedias = medias.filter((media) => media.imdbID !== mediaId)
  if (medias.length === remainingMedias.length) {
    throw createError(404, `Media with id ${mediaId} not found`)
  }
  await writeMedias(remainingMedias)
  return {
    status: "success",
    message: "Media deleted successfully",
  }
}
