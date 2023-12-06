async function deletePost(req, res, db) {
    try {
      const user_id = req.params.user_id;
      const post_id = req.params.post_id;
      const sql = 'DELETE FROM blog_posts WHERE user_id=? AND post_id=?';
      
      db.query(sql, [user_id, post_id], (err, result) => {
        if (err) {
          console.error('Error deleting a post', err);
          res.status(500).send('Internal server error');
        } else {
          if (result.affectedRows > 0) {
            res.status(204).send('Post deleted successfully');
          } else {
            res.status(404).send('Post not found');
          }
        }
      });
    } catch (error) {
      console.error('Error deleting a post', error);
      res.status(500).send('Internal server error');
    }
}

module.exports = deletePost