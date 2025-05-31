require('dotenv').config();
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const upload = multer({ dest: 'uploads/' });

const PORT = process.env.PORT || 3000;

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const REPO = 'Abhijith808/product-gallery';
const BRANCH = 'main';
const IMAGE_PATH = 'images/';

app.use(express.static('public'));

app.post('/upload', upload.single('image'), async (req, res) => {
  const file = req.file;
  const fileName = file.originalname;
  const filePath = path.join(__dirname, file.path);
  const content = fs.readFileSync(filePath, { encoding: 'base64' });

  try {
    await axios.put(
      `https://api.github.com/repos/${REPO}/contents/${IMAGE_PATH}${fileName}`,
      {
        message: `Add ${fileName}`,
        content,
        branch: BRANCH
      },
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json'
        }
      }
    );

    fs.unlinkSync(filePath);
    res.redirect('/');
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.send('Upload failed!');
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
