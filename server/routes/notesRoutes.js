// import { Router } from 'express';
// import {
//   getNotes,
//   getNoteById,
//   createNote,
//   updateNote,
//   deleteNote,
//   incrementDownloads,
//   toggleLike,
//   getUserNotes,
// } from '../controllers/notesController.js';
// import { protect } from '../middleware/auth.js';
// import { notesUpload } from '../middleware/upload.js';

// const router = Router();

// router.get('/', getNotes);
// router.get('/my', protect, getUserNotes);
// router.get('/:id', getNoteById);
// router.post('/', protect, notesUpload, createNote);
// router.put('/:id', protect, updateNote);
// router.delete('/:id', protect, deleteNote);
// router.patch('/:id/downloads', protect, incrementDownloads);
// router.patch('/:id/like', protect, toggleLike);

// export default router;



import { Router } from 'express';

import {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  incrementDownloads,
  toggleLike,
  getUserNotes,
} from '../controllers/notesController.js';

import { protect } from '../middleware/auth.js';
import { NOTES_FILE_LIMIT_MB, notesUpload } from '../middleware/upload.js';

const router = Router();

router.get('/', getNotes);

router.get('/my', protect, getUserNotes);

router.get('/:id', getNoteById);

router.post(
  '/',
  protect,

  (req, res, next) => {
    notesUpload(req, res, (err) => {
      if (err) {
        return res.status(err.code === 'LIMIT_FILE_SIZE' ? 413 : 400).json({
          success: false,
          message:
            err.code === 'LIMIT_FILE_SIZE'
              ? `File must be ${NOTES_FILE_LIMIT_MB}MB or smaller`
              : err.message,
        });
      }

      next();
    });
  },

  createNote
);

router.put('/:id', protect, updateNote);

router.delete('/:id', protect, deleteNote);

router.patch('/:id/downloads', protect, incrementDownloads);

router.patch('/:id/like', protect, toggleLike);

export default router;
