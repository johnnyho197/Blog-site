async function getPosts(req, res, db) {
    try {
      const user_id = req.params.user_id;
      const sql = 'SELECT * FROM blog_posts WHERE user_id = ?';
      
      db.query(sql, [user_id], (err, result) => {
        if (err) throw err;
        res.status(200).json(result);
      });
    } catch (error) {
      console.error('Error getting all posts', error);
      res.status(500).send('Internal server error');
    }
}

module.exports = getPosts;