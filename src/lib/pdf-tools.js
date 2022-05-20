import PdfPrinter from "pdfmake"
import striptags from "striptags"
import axios from "axios"
import { parse } from "dotenv"

const fonts = {
  Roboto: {
    normal: "Helvetica",
    bold: "Helvetica-Bold",
    italics: "Helvetica-Oblique",
    bolditalics: "Helvetica-BoldOblique",
  },
}
const printer = new PdfPrinter(fonts)
export const getPDFReadableStream = async (media) => {
  let imagePart = {}
  if (media.poster) {
    const response = await axios.get(media.poster, {
      responseType: "arraybuffer",
    })
    console.log(response)
    const mediaPosterURLParts = media.poster.split("/")
    const fileName = mediaPosterURLParts[mediaPosterURLParts.length - 1]
    const [id, extension] = fileName.split(".")
    const base64 = response.data.toString("base64")
    const base64Image = `data:image/${extension};base64,${base64}`
    imagePart = { image: base64Image, width: 400, margin: [0, 0, 0, 40] }
  }

  const docDefinition = {
    content: [
      imagePart,
      { text: media.title, style: "header" },
      { text: striptags(media.type), lineHeight: 1.5 },
      {
        text: media.reviews
          .map((review) => `${review.comment}: ${review.rate}`)
          .join("\n"),
        lineHeight: 1.5,
      },
    ],

    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 20],
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      small: {
        fontSize: 8,
      },
      defaultStyle: {
        font: "Helvetica",
      },
    },
  }

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})

  pdfReadableStream.end()

  return pdfReadableStream
}
