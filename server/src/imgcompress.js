import fs from 'fs'
import sharp from 'sharp'
    
async function compressImage(file, local) {
 
    try {
      const metadata = await sharp(file)
      .toFormat('webp')
      .webp({
            quality: 80
        })
      .toFile(local);
       fs.access(file, (err) => {
        if (!err) {
            fs.unlink(file, err_1 => {
                if (err_1)
                    console.log(err_1);
            });
        }
    });
    } catch (error) {
      console.log(`An error occurred during processing: ${error}`);
    }
  }

export { compressImage };
