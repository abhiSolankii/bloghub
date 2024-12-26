import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const { fullname, username, email, password } = req.body;
  if (
    !fullname ||
    !username ||
    !email ||
    !password ||
    fullname === "" ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    const user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (user) {
      if (user.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }

      if (user.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }
    //hash password
    const salt = bcryptjs.genSaltSync(10);
    const hashedPassword = bcryptjs.hashSync(password, salt);

    //create a new user
    const newUser = new User({
      fullname,
      username,
      email,
      password: hashedPassword,
    });

    //save new user
    if (newUser) {
      // console.log(newUser);
      await newUser.save();
      res.status(201).json({ message: "Sign Up successful. Please Login" });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in Sign Up: ", error);
    res.status(500).json({ message: "Failed to Sign Up" });
  }
};

export const signIn = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || username === "" || password === "") {
    return res.status(400).json({ message: "All fields are required!" });
  }
  try {
    const validUser = await User.findOne({ username });
    const isPasswordCorrect = bcryptjs.compareSync(
      password,
      validUser?.password || ""
    );
    if (!validUser || !isPasswordCorrect)
      return res.status(400).send({ message: "Invalid username or password" });

    //generate token
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const { password: pass, ...user } = validUser._doc;

    res
      .status(200)
      .cookie("access_token", token, {
        path: "/",
      })
      .json({ message: "SignIn Successful", user });
  } catch (error) {
    console.error("Error in SignIn controller", error.message);
    res.status(500).json({ error: "Failed to SignIn" });
  }
};

export const signOut = async (req, res) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ message: "Sign out successful" });
  } catch (error) {
    console.error("Error in sign out: ", error.message);
    res.status(500).json({ message: "Error in signing out" });
  }
};

export const google = async (req, res, next) => {
  const { name, email, googlePhotoUrl } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (validUser) {
      //generate token
      const token = jwt.sign(
        { id: validUser._id, isAdmin: validUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password: pass, ...user } = validUser._doc;

      res
        .status(200)
        .cookie("access_token", token, {
          path: "/",
        })
        .json({ message: "SignIn Successful", user });
    } else {
      //if user is not signed in

      //generate random password for user
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      //hash password
      const salt = bcryptjs.genSaltSync(10);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, salt);

      //create user
      const newUser = new User({
        fullname: name,
        username: email.split("@")[0],
        email: email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      try {
        //save the new user

        await newUser.save();

        //generate token
        const token = jwt.sign(
          { id: newUser._id, isAdmin: validUser.isAdmin },
          process.env.JWT_SECRET
        );
        const { password: pass, ...user } = newUser._doc;

        res
          .status(201)
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .json({ message: "SignUp Successful", user });
      } catch (error) {
        console.error("Error in google Sign in: ", error);
        res.status(500).json({ message: "Failed to Sign Up with google" });
      }
    }
  } catch (error) {
    console.error("Error in SignIn controller", error.message);
    res.status(500).json({ error: "Failed to SignIn" });
  }
};
