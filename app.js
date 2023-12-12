const express = require('express');
const Tesseract = require('tesseract.js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static('public'));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('image'), (req, res) => {
  const imageBuffer = req.file.buffer;

  Tesseract.recognize(
    imageBuffer,
    'eng',
    { logger: info => console.log(info) }
  ).then(({ data: { text } }) => {
    res.send(text);
  }).catch(error => {
    res.status(500).send('Error: ' + (error.message || error));
  });
});
app.use(fileUpload());
app.post("/extract-text", (req, res) => { 
    if (!req.files && !req.files.pdfFile) 
    { res.status(400); 
      res.end();
}
pdfParse(req.files.pdfFile).then(result => {
     res.send(result.text);

});
});

app.listen(3005);
