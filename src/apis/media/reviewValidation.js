import { checkSchema } from "express-validator"

const reviewSchema = {
  comment: {
    in: ["body"],
    isString: true,
    errorMessage: "Comment is required",
  },
  rate: {
    in: ["body"],
    isInt: true,
    errorMessage: "Rate is required",
  },
  mediaId: {
    in: ["params"],
    isString: true,
    errorMessage: "MediaId is required",
  },
}

const reviewUpdateSchema = {
  comment: {
    in: ["body"],
    optional: true,
    isString: true,
    errorMessage: "Comment is required",
  },
  rate: {
    in: ["body"],
    optional: true,
    isInt: true,
    errorMessage: "Rate is required",
  },
  mediaId: {
    in: ["params"],
    optional: true,
    isInt: true,
    errorMessage: "MediaId is required",
  },
}

export const checkReviewSchema = checkSchema(reviewSchema)
export const checkReviewUpdateSchema = checkSchema(reviewUpdateSchema)
