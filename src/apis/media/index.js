import express from "express"
import createError from "http-errors"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import axios from "axios"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import uniqid from "uniqid"
import {
  findMedia,
  findMediaById,
  saveNewMedia,
  findMediaByIdAndDelete,
  findMediaByIdAndUpdate,
} from "../../lib/db/media.js"
import {
  checkMediaSchema,
  checkMediaUpdateSchema,
  checkMediaValidation,
} from "./mediaValidation.js"
import { checkReviewSchema } from "./reviewValidation.js"
import { findReviewByIdAndDelete, saveNewReview } from "../../lib/db/review.js"
const mediaRouter = express.Router()

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "netflix-api/media",
    },
  }),
  fileFilter: (req, file, multerNext) => {
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      multerNext(createError(400, "Only png/jpeg allowed!"))
    } else {
      multerNext(null, true)
    }
  },
  limits: { fileSize: 1024 * 1024 * 5 },
}).single("poster")

//Get all medias /media
// Search media by title (if it's not found in your search in OMDB and sync with your database) Use Axios or node-fetch

mediaRouter.get("/", async (req, res, next) => {
  try {
    const medias = await findMedia()
    console.log(medias)
    if (req.query && req.query.title) {
      const foundMedia = medias.find((media) => media.title === req.query.title)
      if (foundMedia) {
        res.status(200).json(foundMedia)
      } else {
        const { data } = await axios.get(
          `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${req.query.title}`
        )
        const newMedia = {
          title: data.Title,
          year: data.Year,
          type: data.Type,
          poster: data.Poster,
          createdAt: new Date(),
          imdbID: uniqid(),
          reviews: [],
        }
        const medias = await findMedia()
        medias.push(newMedia)
        await saveNewMedia(medias)
        res.status(200).json(newMedia)
      }
    } else {
      res.status(200).json(medias)
    }
  } catch (err) {
    next(err)
  }
})

//Get media by id /media/:id
mediaRouter.get("/:mediaId", async (req, res, next) => {
  try {
    const media = await findMediaById(req.params.mediaId)
    res.send(media)
  } catch (error) {
    next(error)
  }
})

//Post new media /media
mediaRouter.post(
  "/",
  checkMediaSchema,
  checkMediaValidation,
  async (req, res, next) => {
    try {
      const id = await saveNewMedia(req.body)
      res.send({ id })
    } catch (error) {
      next(error)
    }
  }
)

//Put media by id /media/:id
mediaRouter.put(
  "/:mediaId",
  checkMediaUpdateSchema,
  checkMediaValidation,
  async (req, res, next) => {
    try {
      const media = await findMediaByIdAndUpdate(req.params.mediaId, req.body)
      res.send(media)
    } catch (error) {
      next(error)
    }
  }
)

//Delete media by id /media/:id
mediaRouter.delete("/:mediaId", async (req, res, next) => {
  try {
    const media = await findMediaByIdAndDelete(req.params.mediaId)
    res.send()
  } catch (error) {
    next(error)
  }
})

//Upload poster to cloudinary /media/:id/poster
mediaRouter.post(
  "/:mediaId/poster",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      const media = await findMediaByIdAndUpdate(req.params.mediaId, {
        poster: req.file.path,
      })
      res.send(media)
    } catch (error) {
      next(error)
    }
  }
)

//post review to media /media/:id/review
mediaRouter.post(
  "/:mediaId/review",
  checkReviewSchema,
  checkMediaValidation,
  async (req, res, next) => {
    try {
      const media = await saveNewReview(req.params.mediaId, req.body)
      res.send(media)
    } catch (error) {
      next(error)
    }
  }
)

//delete review from media /media/:id/review/:reviewId
mediaRouter.delete("/:mediaId/review/:reviewId", async (req, res, next) => {
  try {
    const review = await findReviewByIdAndDelete(
      req.params.mediaId,
      req.params.reviewId
    )
    res.send()
  } catch (error) {
    next(error)
  }
})
export default mediaRouter
