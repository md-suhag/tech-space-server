const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = {
  cloudinary,
  ssl_commerz: {
    store_id: process.env.SSL_COMMERZ_STORE_ID,
    store_passwd: process.env.SSL_COMMERZ_STORE_PASSWORD,
    api_url: process.env.SSL_COMMERZ_API_URL,
  },
  site_url: {
    server_url: process.env.SERVER_URL,
    client_url: process.env.CLIENT_URL,
  },
};
