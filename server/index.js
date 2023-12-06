const express = require("express");
const cors = require("cors");
const multer = require('multer');
const mysql = require('mysql');

const createPost = require("./database/createPost");
const getPosts = require("./database/getPosts");
const deletePost = require("./database/deletePost");

const PORT = 3000;

const app = express();

//Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const upload = multer({ 
  storage: multer.memoryStorage(),
});

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blog_site',
});

db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL');
});

app.post('/create-post', upload.fields([{ name: 'img', maxCount: 1 }]), (req, res) => createPost(req, res, db));

app.get('/get-post/:user_id', (req, res) => getPosts(req, res, db));

app.delete('/delete-post/:user_id/:post_id', (req, res) => deletePost(req, res, db));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});