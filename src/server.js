import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mediaRouter from "./apis/media/index.js"
import filesRouter from "./apis/files/index.js"
import {
  badRequestError,
  notFoundError,
  unauthorizedError,
  genericServerError,
} from "./errorHandlers.js"

const server = express()
const port = process.env.PORT || 3001

//cors config
const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]
const corsOptions = {
  origin: (origin, next) => {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      next(null, true)
    } else {
      next(
        createError(
          400,
          `Cors Error! your origin ${origin} is not in the list!`
        )
      )
    }
  },
}

//middleware
server.use(express.json())
server.use(cors(corsOptions))
//endpoints
server.use("/media", mediaRouter)
server.use("/files", filesRouter)
// error handlers
server.use(badRequestError)
server.use(notFoundError)
server.use(unauthorizedError)
server.use(genericServerError)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is running on port ${port}`)
})
