const db = require('../db/database');

// 1. Load Main StudyOS Page with Courses and Lectures
exports.getStudyPage = (req, res) => {
  const selectedCourseId = req.query.courseId;

  db.all(`SELECT * FROM courses`, [], (err, courses) => {
    if (err) return res.status(500).send("Database error");

    let activeCourse = null;
    let lectures = [];

    if (courses.length > 0) {
      const activeId = selectedCourseId || courses[0].id;
      activeCourse = courses.find(c => c.id == activeId) || courses[0];

      db.all(`SELECT * FROM lectures WHERE course_id = ? ORDER BY id DESC`, [activeCourse.id], (err, rows) => {
        if (!err) {
          lectures = rows.map(l => ({
            ...l,
            notes: JSON.parse(l.notes || '[]'),
            review: JSON.parse(l.review || '[]')
          }));
        }
        res.render('index', { courses, activeCourse, lectures });
      });
    } else {
      res.render('index', { courses, activeCourse: null, lectures: [] });
    }
  });
};

// 2. Add a New Course
exports.createCourse = (req, res) => {
  const { code, name } = req.body;
  if (!code || !name) return res.redirect('/');

  db.run(`INSERT INTO courses (code, name) VALUES (?, ?)`, [code.toUpperCase(), name], function(err) {
    if (err) console.error(err);
    res.redirect(`/?courseId=${this.lastID}`);
  });
};

// 3. Add a New Lecture to a Course
exports.createLecture = (req, res) => {
  const { courseId } = req.params;
  const { date, topic, covered, notes, review } = req.body;

  const notesArray = notes ? notes.split('\n').filter(Boolean) : [];
  const reviewArray = review ? review.split('\n').filter(Boolean) : [];

  db.run(
    `INSERT INTO lectures (course_id, date, topic, covered, notes, review) VALUES (?, ?, ?, ?, ?, ?)`,
    [courseId, date || 'Today', topic, covered, JSON.stringify(notesArray), JSON.stringify(reviewArray)],
    (err) => {
      if (err) console.error(err);
      res.redirect(`/?courseId=${courseId}`);
    }
  );
};

// 4. Delete a Course and its Lectures
exports.deleteCourse = (req, res) => {
  const { courseId } = req.params;

  // Delete associated lectures first to maintain referential integrity
  db.run(`DELETE FROM lectures WHERE course_id = ?`, [courseId], (err) => {
    if (err) console.error(err);

    // Then delete the course itself
    db.run(`DELETE FROM courses WHERE id = ?`, [courseId], (err) => {
      if (err) console.error(err);
      res.redirect('/');
    });
  });
};

// (Keep your existing getStudyPage, createCourse, createLecture, and deleteCourse functions)

// 5. Update Course Details
exports.updateCourse = (req, res) => {
  const { courseId } = req.params;
  const { code, name } = req.body;
  if (!code || !name) return res.redirect(`/?courseId=${courseId}`);

  db.run(`UPDATE courses SET code = ?, name = ? WHERE id = ?`, [code.toUpperCase(), name, courseId], (err) => {
    if (err) console.error(err);
    res.redirect(`/?courseId=${courseId}`);
  });
};

// 6. Delete a Single Lecture
exports.deleteLecture = (req, res) => {
  const { courseId, lectureId } = req.params;

  db.run(`DELETE FROM lectures WHERE id = ? AND course_id = ?`, [lectureId, courseId], (err) => {
    if (err) console.error(err);
    res.redirect(`/?courseId=${courseId}`);
  });
};

// 7. Update an Existing Lecture
exports.updateLecture = (req, res) => {
  const { courseId, lectureId } = req.params;
  const { date, topic, covered, notes, review } = req.body;

  const notesArray = notes ? notes.split('\n').filter(Boolean) : [];
  const reviewArray = review ? review.split('\n').filter(Boolean) : [];

  db.run(
    `UPDATE lectures SET date = ?, topic = ?, covered = ?, notes = ?, review = ? WHERE id = ? AND course_id = ?`,
    [date, topic, covered, JSON.stringify(notesArray), JSON.stringify(reviewArray), lectureId, courseId],
    (err) => {
      if (err) console.error(err);
      res.redirect(`/?courseId=${courseId}`);
    }
  );
};