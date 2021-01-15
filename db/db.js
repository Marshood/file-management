const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const dbname = 'crud_mongodb';
const url = "mongodb+srv://Marshood:raMHdQuDOBxwrcss@cluster0.ifcjp.mongodb.net/crud_mongodb";
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const state = { db: null, bucket: null };
 

const connect = (cb => {
    if (state.db) {
        cb();
    }
    else {
        MongoClient.connect(url, mongoOptions, (err, client) => {
            if (err) {
                cb(err);
            }
            else {
                state.db = client.db(dbname);
                state.bucket = new mongodb.GridFSBucket(state.db,
                    {
                        chunkSizeBytes: 1024
                    });
                cb();
            }
        });
    }
})

const getPrimaryKey = (_id) => {
    return ObjectID(_id);
}

const getDB = () => {
    return state.db;
}
const getbucket = () => {
    return state.bucket;
}

const getUrl = () => {
    return url;
}
module.exports = { getDB, getbucket, connect, getPrimaryKey, getUrl };





////////////////////////////////////////////////////////////////
         // console.log(state.bucket)
                // fs.createReadStream('./Marshood_Ayoub_Resume.pdf').
                //     pipe(state.bucket.openUploadStream('Marshood_Ayoub_Resume',{metadata:{speaker: "Bill Gates", duration:"1hr"},contentType: "image/jpeg"})).
                //     on('error', function (error) {
                //         assert.ifError(error);
                //     }).
                //     on('finish', function () {
                //         console.log('done!');
                //         process.exit(0);
                //     });
                // state.bucket.openDownloadStreamByName('Marshood_Ayoub_Resume').
                //     pipe(fs.createWriteStream('./output.pdf')).
                //     on('error', function (error) {
                //         assert.ifError(error);
                //     }).
                //     on('finish', function () {
                //         console.log('done!');
                //         process.exit(0);
                //     });