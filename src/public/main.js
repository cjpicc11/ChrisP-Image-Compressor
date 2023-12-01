/*
    Filename: main.js                   
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
const directoryInput = document.getElementById("directory-input")
const compressImagesBtn = document.getElementById("compress-images")

directoryInput.addEventListener("change", e => {
  const files = e.target.files

  compressImagesBtn.addEventListener("click", () => {
    const formData = new FormData()
    for (const file of files) {
      if (file.type.startsWith("image/")) {
        formData.append("images", file)
      }
    }
    fetch("/compress-images", {
      method: "POST",
      body: formData,
    }).then(async response => {
      if (response.ok) {
        const blob = await response.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "compressed_images.zip"
        a.click()
        console.log("Images compressed successfully")
      } else {
        console.error("Error compressing images")
      }
    })
  })
})
