const bcrypt = require("bcrypt");
const signupModel = require("../model/userMode");
const { log } = require("console");
const saltRounds = 10;

// Autherization Token
const secKey = "Elham123";
const authToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader.split(" ")[1];
  if (!token) return res.send("Access Denied!");
  console.log("Token", token);
  jwt.verify(token, secKey, (err, data) => {
    if (err) return res.send({ error: err });
    req.user = data;
    next();
  });
};

// Sign Up
const signupData = async (req, resp) => {
  try {
    const { fname, email, password } = req.body;

    if (!email) return resp.send("Invalid data");

    // Check for multiple email existence
    const match = await signupModel.findOne({ email: email });
    if (match) {
      return resp.send({
        status: 404,
        message: "Email Already Exists",
      });
    }

    // Check for password length
    if (password.length < 6) {
      return resp.send({
        status: 404,
        message: "Password must be greater than 6 characters",
      });
    }

    // Define the patterns for password requirements
    const lowercasePattern = /[a-z]/;
    const uppercasePattern = /[A-Z]/;
    const numberPattern = /\d/;
    const specialCharPattern = /[\W_]/;

    // Check password for each requirement
    if (!lowercasePattern.test(password)) {
      return resp.send({
        status: 404,
        message: "Password must contain at least one lowercase letter",
      });
    } else if (!uppercasePattern.test(password)) {
      return resp.send({
        status: 404,
        message: "Password must contain at least one uppercase letter",
      });
    } else if (!numberPattern.test(password)) {
      return resp.send({
        status: 404,
        message: "Password must contain at least one number",
      });
    } else if (!specialCharPattern.test(password)) {
      return resp.send({
        status: 404,
        message: "Password must contain at least one special character",
      });
    }

    // If all checks pass, hash the password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);

    // Save the new user data
    const data = new signupModel({
      fname: fname,
      email: email,
      password: hash,
    });

    const result = await data.save();

    resp.send({
      status: 200,
      message: "Data saved successfully",
      data: result,
    });
  } catch (error) {
    resp.send({
      message: "Error",
      err: error,
    });
  }
};

module.exports = signupData;

// Login
const loginData = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userdata = await signupModel.findOne({ email: email });
    if (!userdata) return res.send("User not exist");
    // Poora data lakr deraha hein
    console.log(userdata);
    const match = bcrypt.compare(password, userdata.password);
    if (!match) return res.send({ message: "Password not Match" });
    const userData = { id: user._id, name: user.fname };
jwt.sign(userData,secKey,{expiresIn : '1m'},(err,token)=>{
  if(err) return res.send({err:err})
    res.send({
  status:200,
  message:"Login Success",
  data:userdata,
  token:token
})
  
)} catch (error) {
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

module.exports = { signupData, updateData, deleteData, getData, loginData };
