const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');

router.get('/', studyController.getStudyPage);
router.post('/courses', studyController.createCourse);
router.post('/courses/:courseId/lectures', studyController.createLecture);

module.exports = router;