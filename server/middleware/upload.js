import multer from 'multer';

const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/x-matroska'];
const PDF_TYPES = ['application/pdf'];
export const NOTES_FILE_LIMIT_MB = 100;
export const CONVERTER_FILE_LIMIT_MB = 100;

export const courseUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'thumbnail') {
      if (!IMAGE_TYPES.includes(file.mimetype)) {
        return cb(new Error('Thumbnail must be JPG, PNG, or WEBP'));
      }
      return cb(null, true);
    }
    if (file.fieldname === 'introVideo' || file.fieldname === 'lessonVideos') {
      if (!VIDEO_TYPES.includes(file.mimetype)) {
        return cb(new Error('Video files must be MP4, MOV, or MKV'));
      }
      return cb(null, true);
    }
    if (file.fieldname === 'pdfs') {
      if (!PDF_TYPES.includes(file.mimetype)) {
        return cb(new Error('Resources must be PDF files only'));
      }
      return cb(null, true);
    }
    cb(new Error('Unexpected upload field'));
  },
}).fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'introVideo', maxCount: 1 },
  { name: 'lessonVideos', maxCount: 20 },
  { name: 'pdfs', maxCount: 20 },
]);

export const notesUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: NOTES_FILE_LIMIT_MB * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'file') {
      if (!IMAGE_TYPES.includes(file.mimetype) && !PDF_TYPES.includes(file.mimetype)) {
        return cb(new Error('File must be an image (JPG, PNG, WEBP) or PDF'));
      }
      return cb(null, true);
    }
    if (file.fieldname === 'thumbnail') {
      if (!IMAGE_TYPES.includes(file.mimetype)) {
        return cb(new Error('Thumbnail must be JPG, PNG, or WEBP'));
      }
      return cb(null, true);
    }
    cb(new Error('Unexpected upload field'));
  },
}).fields([
  { name: 'file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]); 

export const converterUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: CONVERTER_FILE_LIMIT_MB * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname !== 'file') {
      return cb(new Error('Unexpected upload field'));
    }
    if (!IMAGE_TYPES.includes(file.mimetype) && !PDF_TYPES.includes(file.mimetype)) {
      return cb(new Error('File must be a PDF, JPG, PNG, or WEBP'));
    }
    cb(null, true);
  },
}).single('file');

export function validateUploadSizes(req, res, next) {
  const thumb = req.files?.thumbnail?.[0];
  if (thumb && thumb.size > 5 * 1024 * 1024) {
    return res.status(400).json({ message: 'Thumbnail must be 5MB or smaller' });
  }
  const video = req.files?.introVideo?.[0];
  if (video && video.size > 500 * 1024 * 1024) {
    return res.status(400).json({ message: 'Intro video must be 500MB or smaller' });
  }
  const lessonVideos = req.files?.lessonVideos || [];
  const oversizeLesson = lessonVideos.find((file) => file.size > 500 * 1024 * 1024);
  if (oversizeLesson) {
    return res.status(400).json({ message: `Lesson video "${oversizeLesson.originalname}" must be 500MB or smaller` });
  }
  next();
}
