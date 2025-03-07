
import express from 'express';
import analysisCltr from '../controller/analysisController.js';
import { validateAnalysisInput,validateCityRankingsInput,validateCompareInput } from '../middleware/analysisValidation.js';
const router = express.Router();

// Calculate heat gain and cooling cost
router.post('/calculate', validateAnalysisInput, analysisCltr.analyzeDesign);

// Compare multiple designs
router.get('/compare', validateCompareInput, analysisCltr.compareDesigns);

// Get city-wise rankings
router.get('/cities', validateCityRankingsInput, analysisCltr.getCityRankings);

export default router;
