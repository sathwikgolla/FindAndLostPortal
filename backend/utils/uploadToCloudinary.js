const streamifier = require("streamifier");
const { cloudinary, initCloudinary } = require("../config/cloudinary");

function looksLikeImage(buffer) {
  if (!buffer || buffer.length < 12) return false;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return true;
  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  )
    return true;
  // WEBP: "RIFF"...."WEBP"
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  )
    return true;
  return false;
}

async function uploadBuffer(buffer, { folder }) {
  initCloudinary();
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

async function uploadImagesToCloudinary(files, { folder }) {
  if (!process.env.CLOUDINARY_CLOUD_NAME) return [];
  const urls = [];
  for (const f of files) {
    if (!looksLikeImage(f.buffer)) {
      const err = new Error("Invalid image file");
      err.statusCode = 400;
      throw err;
    }
    // eslint-disable-next-line no-await-in-loop
    const url = await uploadBuffer(f.buffer, { folder });
    urls.push(url);
  }
  return urls;
}

module.exports = { uploadImagesToCloudinary };
