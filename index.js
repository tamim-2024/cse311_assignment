const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.static('public'))
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'assignment'
});
connection.connect(err => {
  if (err) {
    console.log(err);
  } else {
    console.log('success');
  }
});
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/login.html');
});

app.post('/add_user', upload.single('profile_picture'), function (req, res) {
  console.log(req.file)
  console.log(req.body.file)




  const user = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    dob: req.body.dob,
    gender: req.body.gender,
    password: req.body.password,
    profile_picture: req.file ? req.file.filename : null
  };

  const query = `
    INSERT INTO user (fname, lname, email, gender, dob, password, profile_picture) 
    VALUES ('${user.fname}', '${user.lname}', '${user.email}', '${user.gender}', '${user.dob}', '${user.password}', '${user.profile_picture}');
  `;

  connection.query(query, function (err, result) {
    console.log(result)
    if (err) {
      res.json({ error: err });
    } else {
      connection.query(`SELECT * FROM user WHERE email='${user.email}'`, function (err, result) {
        if (err) {
          res.json({ error: err });
        } else {
          if (result.length === 0) {
            res.json({ error: "User not found" });
          } else {
            
              res.json({ message: "Login successful", result: result, user: result[0] });
            } 
          
        }
      });
    }
  });
});

app.post('/user_check', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  connection.query(`SELECT * FROM user WHERE email='${username}'`, function (err, result) {
    if (err) {
      res.json({ error: err });
    } else {
      if (result.length === 0) {
        res.json({ error: "User not found" });
      } else {
        const user = result[0];
        if (user.password === password) {
          res.json({ message: "Login successful", result: result, user: user });
        } else {
          res.json({ error: "Incorrect password" });
        }
      }
    }
  });
});

app.post('/home_page', function (req, res) {
  const email = req.body.email;
  connection.query(`SELECT fname, lname, email, gender, dob, password, profile_picture FROM user WHERE email = '${email}'`, function (err, result) {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'An error occurred while fetching data' });
    } else {
      res.json({ result: result });
    }
  });
});

app.post('/update_user', upload.single('profile_picture'), function (req, res) {
  const updatedData = req.body;

  let profilePicture = '';
  if (req.file) {
    profilePicture = req.file ? req.file.filename : null;
  }

  connection.query(`UPDATE user SET fname = '${updatedData.fname}', lname = '${updatedData.lname}', email = '${updatedData.email}', gender = '${updatedData.gender}', dob = '${updatedData.dob}', password = '${updatedData.password}', profile_picture = '${profilePicture}' WHERE email = '${updatedData.email}'`, function (err, result) {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).json({ error: 'An error occurred while updating data' });
    } else {
      res.json({ success: true });
    }
  });
});

app.delete('/delete_user/:userEmail', function (req, res) {
  const userEmail = req.params.userEmail;

  connection.query(`DELETE FROM user WHERE email = ?`, [userEmail], function (err, result) {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ error: 'An error occurred while deleting user' });
    } else {
      if (result.affectedRows > 0) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    }
  });
});
app.get('/image/:filename', function (req, res) {
  res.sendFile(uploadDir+"\\"+req.params.filename);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

