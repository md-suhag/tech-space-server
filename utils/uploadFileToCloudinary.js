const { cloudinary } = require("./../config");

// Upload file to Cloudinary from buffer
const uploadFileToCloudinary = async (file, folder = "techspace_products") => {
  try {
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder, resource_type: "auto" }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        })
        .end(file.buffer);
    });

    return {
      url: result.secure_url,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("File upload failed");
  }
};

module.exports = uploadFileToCloudinary;
