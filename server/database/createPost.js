async function createPost(req, res, db) {
    try {
      const { userId, title, content } = req.body;
      let img = null;

      // Check if 'img' field is present in req.files
      if (req.files && req.files['img'] && req.files['img'][0]) {
          img = req.files['img'][0].buffer;
      }
      const sql = 'INSERT INTO blog_posts (user_id, img, title, content) VALUES (?, ?, ?, ?)';
      
      db.query(sql, [userId, img, title, content], (err, result) => {
        if (err) {
          console.error('Error inserting blog post:', err);
          res.status(500).send('Internal Server Error');
        } else {
          console.log('Blog post inserted');
          res.status(200).send('Blog post created successfully');
        }
      });
    } catch (error) {
      console.error('Error creating blog post:', error);
      res.status(500).send('Internal Server Error');
    }
}

module.exports = createPost;