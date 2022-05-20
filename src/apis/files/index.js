import express from "express"
import { getPDFReadableStream } from "../../lib/pdf-tools.js"
import { pipeline } from "stream"
import { findMediaById } from "../../lib/db/media.js"

const filesRouter = express.Router()

filesRouter.get("/:mediaId/pdf", async (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=media.pdf")
    const media = await findMediaById(req.params.mediaId)
    const source = await getPDFReadableStream(media)
    const destination = res
    pipeline(source, destination, (error) => {
      if (error) console.log(error)
    })
  } catch (error) {
    next(error)
  }
})

// Export single media as PDF with reviews

export default filesRouter
