const bcrypt = require("bcrypt");
const signupModel = require("../model/userMode");
const { log } = require("console");
const saltRounds = 10;
// Sign Up
const signupData = (req, resp) => {
  try {
    const { fname, email, password } = req.body;

    if (!email) return resp.send("invalid data");
    else {
      const salt = bcrypt.genSaltSync(saltRounds);
      console.log(salt);

      const hash = bcrypt.hashSync(password, salt);
      const data = new signupModel({
        fname: fname,
        email: email,
        password: hash,
      });
      data.save();

      resp.send({
        status: 200,
        message: "data save sucessfully",
        data: data,
      });
    }
  } catch (error) {
    resp.send({
      message: "error",
      err: error,
    });
  }
};
// Login
const loginData = async(req, res) => {
  try {
    const {email,password} = req.body;
    const userdata = await signupModel.findOne({email:email})
    console.log(userdata);

    if(!userdata)return res.send("User not exist")
    
  } catch (error) {
    res.send({
      message: "error",
      err: error,
    });
  }
};
// Update
const updateData = async (req, resp) => {
  try {
    const { fname, email } = req.body;
    const data = await signupModel.findByIdAndUpdate(
      { _id: req.params.id },
      { fname, email },
      { new: true }
    );

    console.log(data);

    if (!data) return resp.send({ message: "data not found" });
    resp.send({
      status: 200,
      message: "data updated!",
      data: data,
    });
  } catch (error) {
    resp.send({
      message: "error",
      err: error,
    });
  }
};
// Delete 
const deleteData = async (req, resp) => {
  try {
    const data = await signupModel.findByIdAndDelete({ _id: req.params.id });
    if (!data) return resp.send({ message: "data not found" });
    resp.send({
      status: 200,
      message: "data delete!",
    });
  } catch (error) {
    resp.send({
      message: "error",
      err: error,
    });
  }
};
// Get
const getData = async (req, resp) => {
  try {
    const data = await signupModel.find();
    if (!data) return resp.send("data not found!");
    resp.send({
      status: 200,
      message: "data get sucessfully",
      data: data,
    });
  } catch (error) {
    resp.send({
      message: "error",
      err: error,
    });
  }
};

module.exports = { signupData, updateData, deleteData, getData,loginData };
