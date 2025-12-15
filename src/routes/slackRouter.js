import express from 'express';
import {handleSlackCommand} from '../controllers/slackController.js';

const router = express.Router();

router.post('/command', handleSlackCommand);

export default router;
