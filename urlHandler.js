const axios = require("axios");
const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

///Función que descargará imagen por imagen
const downloadImage = async (url, rutaArchivo) => {
  const writer = fs.createWriteStream(rutaArchivo);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
};

///Función principal para descargar todas las imágenes
const downloadAllImages = async () => {
  ///Extrayendo datos de un archivo xlsx
  const excelSKUAndImg = xlsx.readFile("datosProductosImg.xlsx");
  const nombreDePagina = excelSKUAndImg.SheetNames[0];
  const paginaDeTrabajo = excelSKUAndImg.Sheets[nombreDePagina];
  const todoLosDatos = xlsx.utils.sheet_to_json(paginaDeTrabajo);

  /// Carpeta donde se guardarán las imágenes creadas
  const downloadedImages = "./imagenes_descargadas_productos_varios";
  ///Creará la carpeta si es que no existe
  if (!fs.existsSync(downloadedImages)) {
    fs.mkdirSync(downloadedImages);
  }

  ///Bucle ejecutador
  for (const singleImg of todoLosDatos) {
    if (singleImg.img) {
      const url = singleImg.img;
      const fileName = path.basename(url);
      const filePath = path.join(
        downloadedImages,
        `${singleImg.SKU}_${fileName}`
      );
      try {
        await downloadImage(url, filePath);
        console.log(`Imagen descargada: ${fileName}`);
      } catch (error) {
        console.log(`Error al descargar la imagen ${fileName}`, error);
      }
    } else {
      console.log("No existe la imagen de " + singleImg.SKU);
    }
  }
};

module.exports = downloadAllImages;
