import createError from "http-errors"
import { getMedias, writeMedias } from "../../lib/fs-tools.js"
import uniqid from "uniqid"
import { findMediaById } from "./media.js"
export const saveNewReview = async (mediaId, newReviewData) => {
  const medias = await getMedias()
  const mediaIndex = medias.findIndex((media) => media.imdbID === mediaId)
  if (mediaIndex === -1) {
    throw createError(404, `Media with id ${mediaId} not found`)
  }
  medias[mediaIndex].reviews.push({
    ...newReviewData,
    _id: uniqid(),
    createdAt: new Date(),
  })
  await writeMedias(medias)
  return medias[mediaIndex]
}

export const findReviewByIdAndDelete = async (mediaId, reviewId) => {
  const medias = await getMedias()
  const mediaIndex = medias.findIndex((media) => media.imdbID === mediaId)
  if (mediaIndex === -1) {
    throw createError(404, `Media with id ${mediaId} not found`)
  }
  const reviewIndex = medias[mediaIndex].reviews.findIndex(
    (review) => review._id === reviewId
  )
  if (reviewIndex === -1) {
    throw createError(404, `Review with id ${reviewId} not found`)
  }
  medias[mediaIndex].reviews.splice(reviewIndex, 1)
  await writeMedias(medias)
  return medias[mediaIndex]
}
// deleteReviewByIdAndUpdate
