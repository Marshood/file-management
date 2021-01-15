

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
let Grid = require('gridfs-stream');
// const methodOverride = require('method-override');
const fs = require("fs");
const mongodb = require('mongodb');
// URL for mongoDB
const mongoURI = "mongodb+srv://Marshood:raMHdQuDOBxwrcss@cluster0.ifcjp.mongodb.net/crud_mongodb";
const app = express();
const db = require('./db/db');
const Joi = require('joi');
const { nextTick } = require('process');
const schema = Joi.object().keys({
  todo: Joi.string().required()
})
const port = process.env.NODE_ENV || 8000;
// load app Middlewares
// parses json data sent to us by the user 
app.use(bodyParser.json());
// app.use(methodOverride('_method'));
// Middleware for handling Error
// Sends Error Response Back to User
app.use((err, req, res, next) => {
  res.status(err.status).json({
    error: {
      message: err.message
    }
  });
})
// app configurations
app.set('port', port);

//asdasdasdasdads
const collection = "fs.files" //"todo";


const FilesTreeRouter = require("./routing/Files");
app.use("/api/Files", FilesTreeRouter);



app.get('/', (req, res) => {
  try {
    db.getDB().collection(collection).insertOne({ todo: "testa" });
    res.json("true")

  } catch (e) {
    console.log(e);
  };
})
app.get('/getTodo', (req, res) => {
  //getdb return us to our db connection  
  // get all Todo documents within our todo collection
  // send back to user as json
  db.getDB().collection(collection).find({}).toArray((err, documents) => {
    if (err) {
      console.log(err);
    }
    else {
      console.log("documents: ", documents)
      res.json(documents)
    }
  })

})
// update
app.put('/:id', (req, res) => {
  // Primary Key of Todo Document we wish to update
  const todoID = req.params.id;
  // Document used to update
  const userInput = req.body;
  // Find Document By ID and Update
  db.getDB().collection(collection).findOneAndUpdate({ _id: db.getPrimaryKey(todoID) }, { $set: { todo: userInput.todo } }, { returnOriginal: false }, (err, result) => {
    if (err)
      console.log(err);
    else {
      res.json(result);
    }
  });
});
app.post('/', (req, res) => {

  // Document used to update
  const userInput = req.body;
  // console.log("userInput",userInput.todo);

  // Find Document By ID and Update
  db.getDB().collection(collection).insertOne({ todo: userInput.todo }, (err, result) => {
    if (err)
      console.log(err);
    else {
      // console.log("result",result);
      res.json({ result: result, document: result.ops[0] });
    }
  });
});

app.post('/joi', (req, res, next) => {

  // Document used to update
  const userInput = req.body;
  const validation = schema.validate(userInput);
  const { error, value } = schema.validate(req.body);

  if (error) {
    const error = new Error("Failed to insert Todo Document");
    error.status = 400;
    next(error);
  }
  else {
    // Find Document By ID and Update
    db.getDB().collection(collection).insertOne({ todo: userInput.todo }, (err, result) => {
      if (err)
        console.log(err);
      else {
        // console.log("result",result);
        res.json({ result: result, document: result.ops[0], msg: "Successfulay inserted todo", error: null });
      }
    });
  }
});
// Connect to DB 
db.connect((err) => {
  if (err) {
    console.log("unable to connect to database");
    process.exit(1);
  }
  else {
    console.log("connected to db..");

    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    })
  }

})

 


