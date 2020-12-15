//here you can require you dependencies or external functions
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const sizeOf = require("image-size");
const imagesFolder = "./images/";
const optimizedFolder = "./optimized";

//find all images in the images folder and export them to the optimized folder
function optimizeImages() {
  let object = {
    pass: "",
    optimized: [],
  };
  return new Promise(function (resolve, reject) {
    fs.readdir(imagesFolder, (err, files) => {
      files.forEach((file, id) => {
        let dimensions = sizeOf(`${imagesFolder}${file}`);
        let percentage = Math.round((500 / dimensions.width) * 100);
        sharp(`${imagesFolder}${file}`)
          .resize(500, null)
          .png()
          .toFile(
            `${optimizedFolder}/${path.parse(file).name}${
              path.parse(file).ext === ".svg" ? ".png" : path.parse(file).ext
            }`
          );

        let opt = {
          filePath: `optimized/${path.parse(file).name}${
            path.parse(file).ext === ".svg" ? ".png" : path.parse(file).ext
          }`,
          procent: percentage,
        };
        object.optimized.push(opt);
        if (id === files.length - 1) {
          return resolve(object);
        }
      });
    });
  });
}

exports.handler = async function (event) {
  //create the object that should be returned

  //create new folder if it doesn't exist already
  if (!fs.existsSync(optimizedFolder)) {
    fs.mkdirSync(optimizedFolder);
  }

  let object = await optimizeImages();

  //decode the base64 string and pass it to object
  let pass = Buffer.from(event.optimoleKey, "base64").toString("utf-8");
  object.pass = pass;
  console.log(object);
  return object;
};
