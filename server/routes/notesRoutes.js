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
import { notesUpload } from '../middleware/upload.js';

const router = Router();

router.get('/', getNotes);

router.get('/my', protect, getUserNotes);

router.get('/:id', getNoteById);

router.post(
  '/',
  protect,

  (req, res, next) => {
    console.log('NOTES ROUTE HIT');

    next();
  },

  (req, res, next) => {
    notesUpload(req, res, (err) => {
      if (err) {
        console.log('MULTER ERROR:', err);

        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      console.log('MULTER SUCCESS');

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