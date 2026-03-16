import { Router } from 'express';
import multer from 'multer';
import { createReport, deleteReport, getReports, getLeaderboard } from '../controllers/reportController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/report', upload.single('image'), createReport);
router.get('/reports', getReports);
router.get('/leaderboard', getLeaderboard);
router.delete('/reports/:id', deleteReport);

export default router;
