import { ImagePool } from '@squoosh/lib';
import fs from 'fs/promises';

export async function doConvert(path, width, height, quality, codec) {
  const imagePool = new ImagePool();
  try {
    // const imagePath = path;
    const image = imagePool.ingestImage(path);

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
    
    let encodeOptions = {};
    encodeOptions[codec] = {};
    encodeOptions['quality'] = quality;
    
    await image.encode(encodeOptions);

    await imagePool.close();

    const newImagePath = './images/image.'; //extension is added automatically

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

