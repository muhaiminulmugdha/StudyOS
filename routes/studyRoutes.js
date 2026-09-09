const express = require('express');
const router = express.Router();
const studyController = require('../controllers/studyController');

router.get('/', studyController.getStudyPage);
router.post('/courses', studyController.createCourse);
router.post('/courses/:courseId/update', studyController.updateCourse); // <-- Edit Course
router.post('/courses/:courseId/delete', studyController.deleteCourse); // <-- Delete Course

router.post('/courses/:courseId/lectures', studyController.createLecture);
router.post('/courses/:courseId/lectures/:lectureId/update', studyController.updateLecture); // <-- Edit Lecture
router.post('/courses/:courseId/lectures/:lectureId/delete', studyController.deleteLecture); // <-- Delete Lecture

module.exports = router;