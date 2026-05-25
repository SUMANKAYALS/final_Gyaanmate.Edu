// import Note from '../models/Note.js';
// import {
//   isCloudinaryConfigured,
//   uploadImage,
//   uploadPdf,
//   getCloudinaryErrorMessage,
// } from '../services/cloudinaryService.js';

// export const getNotes = async (req, res) => {
//   const { category, subject, search, sort = 'newest', limit = 24 } = req.query;
//   const filter = { isApproved: true };

//   if (category) filter.category = category;
//   if (subject) filter.subject = subject;

//   if (search) {
//     const pattern = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
//     filter.$or = [
//       { title: pattern },
//       { description: pattern },
//       { category: pattern },
//       { subject: pattern },
//       { tags: pattern },
//     ];
//   }

//   const sortMap = {
//     newest: { createdAt: -1 },
//     popular: { downloads: -1 },
//     likes: { likes: -1 },
//   };

//   const notes = await Note.find(filter)
//     .sort(sortMap[sort] || sortMap.newest)
//     .limit(Number(limit))
//     .populate('uploadedBy', 'name avatar');

//   res.json({ notes, total: notes.length });
// };

// export const getNoteById = async (req, res) => {
//   try {
//     const note = await Note.findById(req.params.id).populate('uploadedBy', 'name avatar bio');
//     if (!note) return res.status(404).json({ message: 'Note not found' });
//     res.json({ note });
//   } catch (err) {
//     console.error('getNoteById:', err);
//     res.status(400).json({ message: 'Invalid note id' });
//   }
// };

// export const createNote = async (req, res) => {
//   try {
//     if (!isCloudinaryConfigured()) {
//       throw new Error(
//         'Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to server/.env'
//       );
//     }

//     const { title, description, category, department, subject, tags } = req.body;

//     if (!title || !description || !category || !department || !subject) {
//       return res.status(400).json({ message: 'Title, description, category, department, and subject are required' });
//     }

//     const file = req.files?.file?.[0];
//     if (!file) {
//       return res.status(400).json({ message: 'File is required' });
//     }

//     let fileUrl;
//     if (file.mimetype === 'application/pdf') {
//       const uploadedFile = await uploadPdf(file.buffer, file.originalname);
//       fileUrl = uploadedFile.url;
//     } else {
//       fileUrl = await uploadImage(file.buffer);
//     }

//     const thumbnail = req.files?.thumbnail?.[0];
//     let thumbnailUrl = '';
//     if (thumbnail) {
//       thumbnailUrl = await uploadImage(thumbnail.buffer);
//     }

//     const parsedTags = typeof tags === 'string' 
//       ? tags.split(',').map(t => t.trim()).filter(Boolean)
//       : tags || [];

//     const note = await Note.create({
//       title: title.trim(),
//       description: description.trim(),
//       category: category.trim(),
//       department: department.trim(),
//       subject: subject.trim(),
//       tags: parsedTags,
//       file: {
//         name: file.originalname,
//         url: fileUrl,
//         size: file.size,
//         mimeType: file.mimetype,
//       },
//       thumbnail: thumbnailUrl,
//       uploadedBy: req.user._id,
//       uploaderName: req.user.name,
//       uploaderAvatar: req.user.avatar || '',
//     });

//     res.status(201).json({ note });
//   } catch (err) {
//     console.error('Create note error:', err);
//     const message = getCloudinaryErrorMessage(err);
//     res.status(400).json({
//       message: message.includes('Cloudinary') || err.http_code
//         ? `Upload failed: ${message}`
//         : message || 'Failed to create note',
//     });
//   }
// };

// export const updateNote = async (req, res) => {
//   try {
//     const note = await Note.findById(req.params.id);
//     if (!note) return res.status(404).json({ message: 'Note not found' });

//     if (note.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     const { title, description, category, department, subject, tags } = req.body;

//     if (title) note.title = title.trim();
//     if (description) note.description = description.trim();
//     if (category) note.category = category.trim();
//     if (department) note.department = department.trim();
//     if (subject) note.subject = subject.trim();
//     if (tags) {
//       note.tags = typeof tags === 'string' 
//         ? tags.split(',').map(t => t.trim()).filter(Boolean)
//         : tags;
//     }

//     await note.save();
//     res.json({ note });
//   } catch (err) {
//     console.error('Update note error:', err);
//     res.status(400).json({ message: 'Failed to update note' });
//   }
// };

// export const deleteNote = async (req, res) => {
//   try {
//     const note = await Note.findById(req.params.id);
//     if (!note) return res.status(404).json({ message: 'Note not found' });

//     if (note.uploadedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Not authorized' });
//     }

//     await note.deleteOne();
//     res.json({ message: 'Note deleted' });
//   } catch (err) {
//     console.error('Delete note error:', err);
//     res.status(400).json({ message: 'Failed to delete note' });
//   }
// };

// export const incrementDownloads = async (req, res) => {
//   try {
//     const note = await Note.findById(req.params.id);
//     if (!note) return res.status(404).json({ message: 'Note not found' });

//     note.downloads += 1;
//     await note.save();

//     res.json({ downloads: note.downloads });
//   } catch (err) {
//     console.error('Increment downloads error:', err);
//     res.status(400).json({ message: 'Failed to increment downloads' });
//   }
// };

// export const toggleLike = async (req, res) => {
//   try {
//     const note = await Note.findById(req.params.id);
//     if (!note) return res.status(404).json({ message: 'Note not found' });

//     const userId = req.user._id;
//     const likedIndex = note.likedBy.indexOf(userId);

//     if (likedIndex === -1) {
//       note.likedBy.push(userId);
//       note.likes += 1;
//     } else {
//       note.likedBy.splice(likedIndex, 1);
//       note.likes -= 1;
//     }

//     await note.save();
//     res.json({ liked: likedIndex === -1, likes: note.likes });
//   } catch (err) {
//     console.error('Toggle like error:', err);
//     res.status(400).json({ message: 'Failed to toggle like' });
//   }
// };

// export const getUserNotes = async (req, res) => {
//   try {
//     const notes = await Note.find({ uploadedBy: req.user._id })
//       .sort({ createdAt: -1 });
//     res.json({ notes });
//   } catch (err) {
//     console.error('Get user notes error:', err);
//     res.status(400).json({ message: 'Failed to get user notes' });
//   }
// };


import Note from '../models/Note.js';
import {
  isCloudinaryConfigured,
  uploadImage,
  uploadPdf,
  getCloudinaryErrorMessage,
} from '../services/cloudinaryService.js';

export const getNotes = async (req, res) => {
  try {
    const { category, subject, search, sort = 'newest', limit = 24 } = req.query;

    const filter = { isApproved: true };

    if (category) filter.category = category;
    if (subject) filter.subject = subject;

    if (search) {
      const pattern = new RegExp(
        search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i'
      );

      filter.$or = [
        { title: pattern },
        { description: pattern },
        { category: pattern },
        { subject: pattern },
        { tags: pattern },
      ];
    }

    const sortMap = {
      newest: { createdAt: -1 },
      popular: { downloads: -1 },
      likes: { likes: -1 },
    };

    const notes = await Note.find(filter)
      .sort(sortMap[sort] || sortMap.newest)
      .limit(Number(limit))
      .populate('uploadedBy', 'name avatar');

    res.json({
      notes,
      total: notes.length,
    });
  } catch (err) {
    console.error('Get notes error:', err);

    res.status(500).json({
      message: 'Failed to fetch notes',
    });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate(
      'uploadedBy',
      'name avatar bio'
    );

    if (!note) {
      return res.status(404).json({
        message: 'Note not found',
      });
    }

    res.json({ note });
  } catch (err) {
    console.error('Get note by id error:', err);

    res.status(400).json({
      message: 'Invalid note id',
    });
  }
};

// =========================
// CREATE NOTE WITH FULL DEBUG
// =========================

export const createNote = async (req, res) => {
  try {
    console.log('==============================');
    console.log('CREATE NOTE REQUEST STARTED');
    console.log('==============================');

    // =========================
    // Check Cloudinary
    // =========================

    if (!isCloudinaryConfigured()) {
      throw new Error(
        'Cloudinary is not configured'
      );
    }

    // =========================
    // Request Body
    // =========================

    console.log('REQ BODY:', req.body);

    const {
      title,
      description,
      category,
      department,
      subject,
      tags,
    } = req.body;

    // =========================
    // Validation
    // =========================

    if (
      !title ||
      !description ||
      !category ||
      !department ||
      !subject
    ) {
      console.log('VALIDATION FAILED');

      return res.status(400).json({
        success: false,
        message:
          'Title, description, category, department, and subject are required',
      });
    }

    // =========================
    // Uploaded Files
    // =========================

    console.log('REQ FILES:', req.files);

    const file = req.files?.file?.[0];

    if (!file) {
      console.log('NO FILE FOUND');

      return res.status(400).json({
        success: false,
        message: 'File is required',
      });
    }

    console.log('MAIN FILE:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    });

    let uploadedFileData = {};

    // =========================
    // PDF Upload
    // =========================

    if (file.mimetype === 'application/pdf') {
      console.log('PDF DETECTED');

      const pdfData = await uploadPdf(
        file.buffer,
        file.originalname
      );

      console.log('PDF DATA:', pdfData);

      uploadedFileData = {
        url: pdfData.url,
        name: pdfData.name,
        size: pdfData.size,
        mimeType: pdfData.mimeType,
      };
    }

    // =========================
    // IMAGE Upload
    // =========================

    else {
      console.log('IMAGE DETECTED');

      const imageUrl = await uploadImage(
        file.buffer
      );

      console.log('IMAGE URL:', imageUrl);

      uploadedFileData = {
        url: imageUrl,
        name: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
      };
    }

    // =========================
    // Uploaded File Debug
    // =========================

    console.log('UPLOADED FILE DATA:', uploadedFileData);

    console.log(
      'TYPE OF URL:',
      typeof uploadedFileData.url
    );

    // =========================
    // Thumbnail Upload
    // =========================

    const thumbnail = req.files?.thumbnail?.[0];

    let thumbnailUrl = '';

    if (thumbnail) {
      console.log('THUMBNAIL DETECTED');

      thumbnailUrl = await uploadImage(
        thumbnail.buffer
      );

      console.log(
        'THUMBNAIL URL:',
        thumbnailUrl
      );
    }

    // =========================
    // Parse Tags
    // =========================

    const parsedTags =
      typeof tags === 'string'
        ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
        : tags || [];

    console.log('PARSED TAGS:', parsedTags);

    // =========================
    // Final Note Data
    // =========================

    const finalNoteData = {
      title: title.trim(),
      description: description.trim(),
      category: category.trim(),
      department: department.trim(),
      subject: subject.trim(),

      tags: parsedTags,

      file: {
        name: uploadedFileData.name,

        url: uploadedFileData.url,

        size: uploadedFileData.size,

        mimeType:
          uploadedFileData.mimeType,
      },

      thumbnail: thumbnailUrl,

      uploadedBy: req.user._id,

      uploaderName: req.user.name,

      uploaderAvatar:
        req.user.avatar || '',
    };

    console.log(
      'FINAL NOTE DATA:',
      finalNoteData
    );

    console.log(
      'FINAL URL TYPE:',
      typeof finalNoteData.file.url
    );

    // =========================
    // Create Note
    // =========================

    const note = await Note.create(
      finalNoteData
    );

    console.log('NOTE CREATED:', note);

    // =========================
    // Success Response
    // =========================

    return res.status(201).json({
      success: true,
      note,
    });
  } catch (err) {
    console.error(
      'CREATE NOTE ERROR:',
      err
    );

    return res.status(400).json({
      success: false,
      message:
        err.message ||
        'Failed to create note',
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: 'Note not found',
      });
    }

    if (
      note.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Not authorized',
      });
    }

    const {
      title,
      description,
      category,
      department,
      subject,
      tags,
    } = req.body;

    if (title) note.title = title.trim();
    if (description) note.description = description.trim();
    if (category) note.category = category.trim();
    if (department) note.department = department.trim();
    if (subject) note.subject = subject.trim();

    if (tags) {
      note.tags =
        typeof tags === 'string'
          ? tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean)
          : tags;
    }

    await note.save();

    res.json({
      success: true,
      note,
    });
  } catch (err) {
    console.error('Update note error:', err);

    res.status(400).json({
      success: false,
      message: 'Failed to update note',
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: 'Note not found',
      });
    }

    if (
      note.uploadedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        message: 'Not authorized',
      });
    }

    await note.deleteOne();

    res.json({
      success: true,
      message: 'Note deleted',
    });
  } catch (err) {
    console.error('Delete note error:', err);

    res.status(400).json({
      success: false,
      message: 'Failed to delete note',
    });
  }
};

export const incrementDownloads = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: 'Note not found',
      });
    }

    note.downloads += 1;

    await note.save();

    res.json({
      downloads: note.downloads,
    });
  } catch (err) {
    console.error('Increment downloads error:', err);

    res.status(400).json({
      message: 'Failed to increment downloads',
    });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({
        message: 'Note not found',
      });
    }

    const userId = req.user._id;

    const likedIndex = note.likedBy.indexOf(userId);

    if (likedIndex === -1) {
      note.likedBy.push(userId);
      note.likes += 1;
    } else {
      note.likedBy.splice(likedIndex, 1);
      note.likes -= 1;
    }

    await note.save();

    res.json({
      liked: likedIndex === -1,
      likes: note.likes,
    });
  } catch (err) {
    console.error('Toggle like error:', err);

    res.status(400).json({
      message: 'Failed to toggle like',
    });
  }
};

export const getUserNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      uploadedBy: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json({
      notes,
    });
  } catch (err) {
    console.error('Get user notes error:', err);

    res.status(400).json({
      message: 'Failed to get user notes',
    });
  }
};
