import express from 'express';
import {handleSlackCommand} from '../controllers/slackController.js';

const router = express.Router();

router.post('/command', async (req, res) => {
  try {
    console.log('Slack payload:', req.body);

    // ⚠️ Respond immediately
    res.status(200).send('⏳ Processing your request...');

    // ⬇️ Everything below happens async
    handleSlackCommand(req.body);

  } catch (err) {
    console.error(err);
  }
});


export default router;
