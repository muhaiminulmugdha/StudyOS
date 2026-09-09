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