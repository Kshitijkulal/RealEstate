// These are named exports and can be multiple in a module
import { encrypt, decrypt } from "../utilities/substitutionCypher.js";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { generateOTP } from "../utilities/otpgenerator.js";
import Mailgen from "mailgen";

// register controller
export const register = async (req, res) => {
  try {
    const { username, email, password, otp } = req.body;
    // encrypting the password
    let hashedPassword = await encrypt(password, process.env.HASH_KEY);
    // creating a new user in prisma
    let r_otp = await prisma.otp.findUnique({
      where: {
        email,
      },
    });
    if (otp == r_otp.otp) {
      const newUser = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });
      await prisma.otp.delete({
        where: { email },
      });
      res.status(201).json({ message: `user Created successfully` });
    } else {
      res.status(401).json({ message: `Invalid otp` });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Failed creating a user :(` });
  }
};

export const otpVerification = async (req, res) => {
  try {
    const { email, username } = req.body;
    let otp = await generateOTP(6);
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: "smpt4861@gmail.com",
        pass: "ydqtqbcsxyqzcsix",
      },
    });
    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Mailgen",
        link: "https://mailgen.js/",
      },
    });
    let response = {
      body: {
        name: username,
        intro: `Thank you for registering, ${username}!`,
        action: {
          instructions: 'Please enter the following OTP to complete your registration:',
          button: {
            color: '#22BC66', // Optional action button color
            text: `Your OTP: ${otp}`,
          },
        },
        outro: 'Looking forward to doing more business with you.',
      },
    };

    let mail = MailGenerator.generate(response);
    let message = {
      from: 'KkEstate', // sender address
      to: `${email}`, // list of receivers
      subject: "KK Estate Registration OTP", // Subject line // plain text body
      html: mail, // html body
    };

    transporter.sendMail(message).catch((error) => {
      return res.status(500).json(error);
    });
    const o = await prisma.otp.create({
      data: {
        email: email,
        otp,
      },
    });
    res
      .status(200)
      .json({
        message: `Email sent successfuly to ${email} with otp ${o.otp}`,
      });
  } catch (error) {
    console.log(error);
    // await prisma.otp.delete({
    //   where: { email },
    // });
  }
};

// Login controller
export const login = async (req, res) => {
  // these are our route handler functions
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      res.status(401).json({ message: `Invalid credentials` });
    }
    const isPasswordValid =
      (await decrypt(user.password, process.env.HASH_KEY)) == password;
    if (!isPasswordValid) {
      res.status(401).json({ message: `Invalid Credentials` });
    } else {
      // res.send(`login works`);
      const age = 1000 * 60 * 60 * 24 * 7;

      const token = jwt.sign(
        {
          id: user.id,
          admin: false,
        },
        process.env.JWT_KEY,
        { expiresIn: age } // age of validity of a cookie
      );
      const { password: userpassword, ...userInfo } = user;
      res
        .cookie("token", token, {
          httpOnly: true,
          // secure:true,
          maxAge: age, //max age of the cookie
        })
        .status(200)
        .json(userInfo);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Couldn't log in: ${err}` });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: `Logout Successfull` });
};
