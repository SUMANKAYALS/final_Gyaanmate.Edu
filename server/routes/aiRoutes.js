import { Router } from 'express';
import { aiSearch, aiChat, aiRecommendations, aiStatus, aiSuggestedCourses, botChat, convertToTextPdf, extractText, generateMockTest, sentimentAnalytics } from '../controllers/aiController.js';
import { CONVERTER_FILE_LIMIT_MB, converterUpload } from '../middleware/upload.js';

const router = Router();
function handleConverterUpload(req, res, next) {
  converterUpload(req, res, (err) => {
    if (!err) {
      next();
      return;
    }

    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        message: `File must be ${CONVERTER_FILE_LIMIT_MB}MB or smaller`,
      });
    }

    return res.status(400).json({
      message: err.message || 'Failed to upload file',
    });
  });
}

router.get('/status', aiStatus);
router.post('/search', aiSearch);
router.post('/chat', aiChat);
router.post('/bot', botChat);
router.post('/mock-test', generateMockTest);
router.post('/recommendations', aiRecommendations);
router.post('/suggested-courses', aiSuggestedCourses);
router.post('/sentiment', sentimentAnalytics);
router.post('/extract-text', handleConverterUpload, extractText);
router.post('/convert-text-pdf', handleConverterUpload, convertToTextPdf);
export default router;
