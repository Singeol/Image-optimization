import { ImagePool } from '@squoosh/lib';
import fs from 'fs/promises';
const imagePool = new ImagePool();

export async function doConvert(path, width, height, quality, codec) {
  try {
    const imagePath = path;
    const image = imagePool.ingestImage(imagePath);

    await image.decoded;
    if (width != 0 && height != 0) {
      const preprocessOptions = {
        //When both width and height are specified, the image resized to specified size.
        resize: {
          enabled: true,
          width: width,
          height: height,
        }
      }
    
      await image.preprocess(preprocessOptions);
    }
    let encodeOptions = {}
    switch(codec) {
      case 'avif': 
        encodeOptions = {
        avif: {},
        quality: quality
      };
      break;
      case 'webp': 
        encodeOptions = {
        webp: {},
        quality: quality
      };
      break;
      case 'jpeg': 
        encodeOptions = {
        mozjpeg: {},
        quality: quality
      };
      break;
    }
    console.log(encodeOptions);
    await image.encode(encodeOptions);

    await imagePool.close();

    const newImagePath = './image.'; //extension is added automatically

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

