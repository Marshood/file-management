
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
let Grid = require('gridfs-stream');
// const methodOverride = require('method-override');
const fs = require("fs");
const mongodb = require('mongodb');
// URL for mongoDB
const mongoURI = "mongodb+srv://Marshood:raMHdQuDOBxwrcss@cluster0.ifcjp.mongodb.net/crud_mongodb";
 const db = require('../db/db');



// mongodb id object 
const ObjectID = require('mongodb').ObjectID;
// @route GET /file by ID
router.get('/getFile:FileId', (req, res) => {
    //{ _id: db.getPrimaryKey(todoID) }
    console.log("req.params: ", req.params.FileId)
    var FileId = new ObjectID(req.params.FileId);
    db.getDB().collection('fs.files').find({ _id: db.getPrimaryKey(FileId) }).toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        console.log("Send files", files[0].filename)
        var downStream = db.getbucket().openDownloadStream(FileId)
        // pipe(fs.createWriteStream(files[0].filename.toString())).
        // on('error', function (error) {
        //   assert.ifError(error);
        // }).
        // on('finish', function () {
        //   console.log('done!');
        //   process.exit(0);
        // });
        // req.pathname=req.pathname().replace("marshood",'')
        // console.log("downStreamdownStream ", res)

        downStream.pipe(res);
        // Files exist
        // return res.json(files);
    });


});
// @route GET /file by name
router.get('/NgetFileName:FileName', (req, res) => {
    console.log("get file by name: ")
    var FileId = req.params.FileName;
    db.getbucket().openDownloadStreamByName(FileId).
        pipe(fs.createWriteStream('./output12.pdf')).
        on('error', function (error) {
            assert.ifError(error);
        }).
        on('finish', function () {
            console.log('done!');
            process.exit(0);
        });

});
// @route GET /files get all file stored on db 
// @desc  Display all files in JSON
router.get('/files', (req, res) => {
    db.getDB().collection('fs.files').find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        console.log("Send files")
        // Files exist
        return res.json(files);
    });
});
// @route to update file data 
router.post('/UpdateDataFile', (req, res) => {
    // Document used to update
    console.log("UpdateDataFile");
    const { fileID, label, id, parentId } = req.body;
    var FileIdOb = new ObjectID(fileID);
    // Find Document By ID and Update
    db.getDB().collection('fs.files').findOneAndUpdate({ _id: FileIdOb },
        {
            $set:
                { metadata: { label: label, id: id, parentId: parentId } }
        },
        (err, result) => {
            if (err)
                console.log(err);
            else {
                res.json(result);
            }
        });
});
// @route to delete  file from db 
router.post('/DeleteFile', (req, res) => {
    // Document used to update
    console.log("DeleteFile", req.body.fileID);
    const fileID = req.body.fileID;
    var FileIdOb = new ObjectID(fileID);
    // Find Document By ID and Update
    db.getbucket().delete(FileIdOb, function (error) {
        console.log("error", error)
    });
});




// Create storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    db: db.getDB(),

    file: (req, file) => {
        // console.log("object ", " he ", JSON.stringify(req.headers))
        const headers = JSON.stringify(req.headers);
        const jsonObj = JSON.parse(headers);
        // console.log(jsonObj)

        return new Promise((resolve, reject) => {
            // crypto.randomBytes(16, (err, buf) => {
            //   if (err) {
            //     return reject(err);
            //   }
            //   const filename = buf.toString('hex') + path.extname(file.originalname);
            var parentId1 = jsonObj['parentid-custom-header'];
            var title = jsonObj['title-custom-header'];
            var label = jsonObj['label-custom-header'];
            var description = jsonObj['description-custom-header'];
            var id = jsonObj['id-custom-header'];

            // console.log("parentId ", parentId1, " title ", title, " label ", label, " description ", description)
            const fileInfo = {
                filename: file.originalname,
                bucketName: 'fs',
                metadata: { parentId: parentId1, id: id, title: title, label: label, description: description },

            };
            // console.log("fileInfo ", fileInfo)
            resolve(fileInfo);
        });
        // });
    },


});
// adding file to DB
const upload = multer({ storage });
router.post('/addingFile', upload.single("file"), (req, res) => {
    db.getDB().collection('fs.files').find().toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        const headers = JSON.stringify(req.headers);
        const jsonObj = JSON.parse(headers);
        var parentId1 = jsonObj['parentid-custom-header'];
        // Find Document By ID and Update
        db.getDB().collection('fs.Folder').findOne({ "metadata.id": parentId1, "metadata.items": false }).then(async docs => {
            if (docs) {
                console.log("if 278 ", docs)
                db.getDB().collection('fs.Folder').findOneAndUpdate({ "metadata.id": parentId1 },
                    {
                        $set:
                            { metadata: { items: true, "parentId": docs.metadata.parentId, "title": docs.metadata.title, "label": docs.metadata.label, "description": docs.metadata.description, "id": docs.metadata.id, "file": docs.metadata.file } }
                    },
                    (err, result) => {
                        if (err)
                            console.log(err);
                        else {
                            console.log("else 288 ")

                            return res.json(files);
                        }
                    });

            } else {
                console.log("else 395555 ")

                res.json({ success: false })
            }

        })



    });

});

// delete file / folder from the collection
router.delete('/:id', (req, res) => {
    const todoID = req.params.id;
    db.getDB().collection(collection).findOneAndDelete(
        {
            // "todo": "clean someting else...1"
            _id: db.getPrimaryKey(todoID)
        }, (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                res.json(result);
            }
        })
})
//get random id for folders and files
function uniqueID() {
    const id = Math.floor(Math.random() * Date.now());
    console.log(id)
    return '_' + Math.random().toString(36).substr(2, 9);

}
// adding folders 
router.post('/addingFolder', (req, res, next) => {
    const { NewFolderName, FolderID } = req.body;
    const idRandom = uniqueID();
    console.log(idRandom, "addingFolderaddingFolder", NewFolderName, FolderID);
    try {
        db.getDB().collection("fs.Folder").insertOne({
            length: 0,
            chunkSize: 0,
            uploadDate: null,
            filename: NewFolderName,
            metadata: {
                parentId: FolderID,
                title: NewFolderName,
                label: NewFolderName,
                description: null,
                items: false,
                id: idRandom,
                file: false,
            }

        }, function (error, response) {
            if (error) {
                console.log('Error occurred while inserting');
                // return 
                res.json({ success: false, doc: null })
            } else {
                console.log('inserted record', response.ops[0]);
                // return
                res.json({ success: true, doc: response.ops[0] })
            }
        }
        );

    } catch (e) {
        console.log(e);
    };


});
// @route GET /files get all file stored on db 
// @desc  Display all files in JSON
router.get('/folder', (req, res) => {
    db.getDB().collection('fs.Folder').find().toArray((err, files) => {
        // Check if Folders
        if (!files || files.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }
        console.log("Send Folders")
        // Files exist
        return res.json(files);
    });
});



module.exports = router;
