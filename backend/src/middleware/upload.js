const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createStorage = (folder) => multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, `../uploads/${folder}`);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${ext}`);
  },
});

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files allowed'), false);
};

const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5242880;

const uploadPaymentProof = multer({ storage: createStorage('payment-proofs'), fileFilter: imageFilter, limits: { fileSize: maxSize } });
const uploadOrderImage = multer({ storage: createStorage('order-images'), fileFilter: imageFilter, limits: { fileSize: maxSize } });
const uploadBanner = multer({ storage: createStorage('banners'), fileFilter: imageFilter, limits: { fileSize: maxSize } });
const uploadAvatar = multer({ storage: createStorage('avatars'), fileFilter: imageFilter, limits: { fileSize: maxSize } });
const uploadPrescription = multer({ storage: createStorage('order-images'), fileFilter: imageFilter, limits: { fileSize: maxSize } });

module.exports = { uploadPaymentProof, uploadOrderImage, uploadBanner, uploadAvatar, uploadPrescription };
