var db = require('../config/db');
var collection = require('../config/collection');
var objectId = require('mongodb').ObjectId;

module.exports = {
    getAllContents: () => {
        return new Promise(async (resolve, reject) => {
            let contents = await db.get().collection(collection.CONTENT).find().sort({_id:-1}).toArray();
            resolve(contents)
        })

    },
    addContent: (data) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.CONTENT).insertOne({ ...data, date: new Date }).then((response)=>{
                resolve(response)
            })
        })
    },
    deleteContent: (id) => {
        return new Promise(async (resolve, reject) => {
            await db.get().collection(collection.CONTENT).deleteOne({ _id: objectId(id) }).then((response) => {
                resolve(response)
            })
        })
    },
    getContent: (id) => {
        return new Promise(async (resolve, reject) => {
            let content = await db.get().collection(collection.CONTENT).findOne({ _id: objectId(id)});
            resolve(content)
        })
    },
    updateContent:(data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CONTENT).updateOne({_id:objectId(data.id)},{$set:{
                title:data.title,
                content:data.content,
                color:data.color
            }})
            resolve()
        })
    }
}