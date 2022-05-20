import { checkSchema, validationResult } from "express-validator"
import createError from "http-errors"

const mediaSchema = {
  title: {
    in: ["body"],
    isString: true,
    errorMessage: "Title is required",
  },
  year: {
    in: ["body"],
    isString: true,
    errorMessage: "Year is required",
  },
  poster: {
    in: ["body"],
    isURL: true,
    errorMessage: "poster must be a valid URL",
  },
  type: {
    in: ["body"],
    isString: true,
    errorMessage: "type is required",
  },
}

const mediaUpdateSchema = {
  title: {
    in: ["body"],
    optional: true,
    isString: true,
    errorMessage: "Title is required",
  },
  year: {
    in: ["body"],
    optional: true,
    isString: true,
    errorMessage: "Year is required",
  },
  poster: {
    in: ["body"],
    optional: true,
    isURL: true,
    errorMessage: "poster must be a valid URL",
  },
  type: {
    in: ["body"],
    optional: true,
    isString: true,
    errorMessage: "type is required",
  },
}

export const checkMediaSchema = checkSchema(mediaSchema)
export const checkMediaUpdateSchema = checkSchema(mediaUpdateSchema)
export const checkMediaValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    next(createError(400, "validation errors", { errorsList: errors.array() }))
  } else {
    next()
  }
}
