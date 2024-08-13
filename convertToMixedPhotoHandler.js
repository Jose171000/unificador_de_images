const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const urlHandler = require("./urlHandler");

async function convertToMixedPhoto() {
  await urlHandler();
  const inputDir = "./imagenes_descargadas_productos_varios";
  const outDir = "./imagenes_con_regalo";
  const giftImage = "gift.png";

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir);
  }

  fs.readdir(inputDir, (err, files) => {
    if (err) {
      console.error("No se pudieron leer las imágenes de la carpeta", err);
      return;
    }

    files.forEach((image) => {
      const imagen_del_producto = path.join(inputDir, image);

      sharp(imagen_del_producto)
        .resize(1000, 1000)
        .composite([{
          input: giftImage,
          tile: false,
          top: 590,
          left: 730,
        }])
        .toFile(path.join(outDir, image), (err, info) => {
          if (err) {
            console.error("Error al procesar la imagen", image, err);
          } else {
            console.log(`Imagen procesada: ${image}`);
          }
        });
    });
  });
}

module.exports = convertToMixedPhoto;
