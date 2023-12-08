/*
    Filename: app.js                   
    Author: Christopher Piccini <cpiccini11@gmail.com>
    Copyright (C) [2024] Christopher Piccini
    *
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
    *
    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
    GNU General Public License for more details.
    *
    You should have received a copy of the GNU General Public License
    along with this program. If not, see <https://www.gnu.org/licenses/>.

*/
const express = require("express")
const multer = require("multer")
const sharp = require("sharp")
const path = require("path")
const fs = require("fs")
const archiver = require("archiver")
const app = express()
const server = require("http").Server(app)

app.use(express.static("public"))

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html")
})

app.get("/main.js", (req, res) => {
  res.sendFile(__dirname + "/public/main.js")
})

app.get("/assets/styles.css", (req, res) => {
  res.sendFile(__dirname + "/public/assets/styles.css")
})

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

app.post("/compress-images", upload.array("images"), async (req, res) => {
  try {
    const archive = archiver("zip")
    res.setHeader("Content-Type", "application/zip")
    res.setHeader("Content-Disposition", "attachment; filename=compressed_images.zip")
    archive.pipe(res)

    for (const image of req.files) {
      let imgBuffer

      if (image.mimetype === "image/jpeg") {
        imgBuffer = await sharp(image.buffer)
          .jpeg({ quality: 70 }) // Adjust the quality value (0-100) to control compression
          .toBuffer()
      } else if (image.mimetype === "image/png") {
        imgBuffer = await sharp(image.buffer)
          .png({ quality: 70 }) // Adjust the compressionLevel value (0-9) to control compression
          .toBuffer()
      } else {
        imgBuffer = image.buffer // Keep the original buffer for other image types
      }

      archive.append(imgBuffer, { name: "compressed/" + image.originalname })
    }

    archive.finalize()
  } catch (error) {
    console.error("Error compressing images:", error)
    res.sendStatus(500)
  }
})

server.listen(3000, () => {
  console.log("Server started on http://localhost:3000")
})
