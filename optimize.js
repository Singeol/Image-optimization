import { ImagePool } from '@squoosh/lib';
import fs from 'fs/promises';
import { readdirSync } from 'node:fs';

function findOriginal(folder, name) {
  var originalImage = '';
  var file;
  readdirSync(folder).forEach(file => {
    let filename = file.substring(0, file.indexOf('.'));
    if (filename == name) {
      originalImage = file;
    }
  });
    return originalImage;
}

export async function doConvert(name, width, codec) {
  const imagePool = new ImagePool();
  try {
    let imagesPath = './images/';
    const image = imagePool.ingestImage(imagesPath + findOriginal(imagesPath, name));

    await image.decoded;
    if (width != 0) {
      const preprocessOptions = {
        //When both width and height are specified, the image resized to specified size.
        resize: {
          enabled: true,
          width: width,
        }
      }
    
      await image.preprocess(preprocessOptions);
    }
    
    let encodeOptions = {};
    encodeOptions[codec] = {};
    encodeOptions['quality'] = 75;
    
    await image.encode(encodeOptions);

    await imagePool.close();

    const newImagePath = imagesPath + name + width + '.'; //extension is added automatically

    for (const encodedImage of Object.values(image.encodedWith)) {
      fs.writeFile(
        newImagePath + (await encodedImage).extension,
        (await encodedImage).binary,
      );
    }
  }
  catch (err) {
    console.log(err);
  }
}

