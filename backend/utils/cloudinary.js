const cloudinary = require('cloudinary').v2

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload a file buffer to Cloudinary
 * @param {Buffer} fileBuffer - The file buffer from multer
 * @param {string} folder - Cloudinary folder path (e.g., 'wywa/programs')
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
function uploadToCloudinary(fileBuffer, folder = 'wywa') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error)
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        })
      }
    )
    uploadStream.end(fileBuffer)
  })
}

module.exports = { cloudinary, uploadToCloudinary }
