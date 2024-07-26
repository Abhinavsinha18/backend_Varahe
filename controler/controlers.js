// const { default: app } = require("../config/firebase");
const model = require("../model/model");
// const { initializeApp } = require("firebase/app")
// const { getStorage,ref,getDownloadURL,uploadBytesResumable } = require('firebase/storage')

// const multer = require("multer")


// const Storage =getStorage(app);
// const StorageRef=ref(Storage,"Images/"+image.name);
// await uploadBytes(StorageRef,image);
// const downloadURL=await getDownloadURL(StorageRef);
// setImageURL(downloadURL);

// const upload = multer({storage : multer.memoryStorage()})

const GetRecords = async (req, res) => {
  try {
    const records = await model.find();
    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Post Record

const PostRecord = async (req, res) => {
  try {
    const data = new model(req.body);
    await data.save();
    res.status(201).json({ message: "Data Created", Status: true, data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete Record

const DeleteRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await model.findByIdAndRemove(id);
    if (!data) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json({ message: "Record deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update Record

const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await model.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json({ message: "Record Updated", Status: true, data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  GetRecords,
  PostRecord,
  DeleteRecord,
  updateRecord,
};