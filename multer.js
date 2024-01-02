// multer
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".png");
  },
});
exports.upload = multer({ storage: storage });

// app.post("/upload", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No files were uploaded.");
//   }
//   res.send("File uploaded successfully.");
// });

// then in your React component
//  import React, { useState } from 'react';
//  import axios from 'axios';

//  const Upload = () => {
//    const [file, setFile] = useState('');

//    const on FileChange = (e) => {
//      setFile(e.target.files[0]);
//    };

//    const onFileUpload = () => {
//      const formData = new FormData();
//      formData.append('file', file);
//      axios.post('/upload', formData, {
//        headers: {
//          'Content-Type': 'multipart/form-data'
//        }
//      }).then(response => {
//        console.log(response.data);
//      }).catch(error => {
//        console.log(error);
//      });
//    };

//    return (
//      <div>
//        <input type="file" onChange={onFileChange} />
//        <button onClick={onFileUpload}>Upload</button>
//      </div>
//    );
//  };

//  export default Upload;
