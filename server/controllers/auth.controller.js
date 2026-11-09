import User from "../models/user.model.js"
import  crypto from "crypto";
import  {nanoid}   from "nanoid";
import { transporter } from "../server.js";

const register = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "Email Already Exists",
      });
    }
    
    const userCreated = await User.create({
      username,
      email,
      password,
      role: role || "attendee",
    });

    const token = userCreated.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Register SuccessFully",
      data: userCreated,
      role: userCreated.role,
      userId: userCreated._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (!userExists) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const isPasswordValid=await userExists.comparePassword(password)

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid Credentials",
      });
    }

    const token = userExists.generateToken();

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login Successfully",
      role: userExists.role,
      userId: userExists._id.toString(),
      data:userExists
    });
  } catch (error) {
    next(error);
  }
};
const logout=async(req,res,next)=>{
  try {
    res.clearCookie("token")
    return res.status(200).json({message:"Logout Successfully"})
  } catch (error) {
    next(error)
  }
}
const forgotPassword=async(req,res,next)=>{
  try {

        const email = req.body.email

        if(!email) {
                return res.status(400).json({ message : "Please enter your email" });
        }
        
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(404).json({ message : "email not found" });
        }

    if(user) {
        const resetToken = nanoid(32);

        user.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

        user.passwordResetExpires = Date.now() + 2 * 60 * 1000;

        await user.save({validateBeforeSave: false});

        const resetUrl =`http://localhost:5173/reset-password/${resetToken}`;

        try { 
          await transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: user.email,
  subject: "Reset Your EventSphere Password",

  html: `
    <div>
      <h2>Reset Your Password</h2>

      <p>
        You requested to reset your EventSphere password.
      </p>

      <p>
        Click the button below to reset your password:
      </p>

      <a
        href="${resetUrl}"
        style="
          display: inline-block;
          padding: 12px 20px;
          background: #000;
          color: #fff;
          text-decoration: none;
          border-radius: 6px;
        "
      >
        Reset Password
      </a>

      <p>
        This link will expire in 2 minutes.
      </p>

      <p>
        If you didn't request a password reset, you can ignore this email.
      </p>
    </div>
  `,
});
        } catch (error) {
            user.passwordResetExpires = undefined;
            user.passwordResetToken = undefined;
            await user.save({validateBeforeSave: false});

            console.error("Email sending failed:", error.message);
        }
    }

    return res.status(200).json({ message : "If an account exist with this email, a reset link will be sent" });

    } catch (error) {
        next(error);
    }
}
const resetPassword=async(req,res,next)=>{
   try {
        const { password, confirmPassword } = req.body

        if(!password || password.length < 8) {
            return res.status(400).json({ message : "Password must be at least 8 characters." });
        }
        
        if(password !== confirmPassword) {
            return res.status(400).json({ message : "password doesn't match" });
        }

        const hashToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

        const user = await User.findOne({
            passwordResetToken: hashToken,
            passwordResetExpires: {$gt: Date.now()}
        });

        if(!user) {
            return res.status(400).json({ message : "Reset link is invalid or expired"});
        }

        user.password = password;

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        return res.status(200).json({message: "Password Reset Successfully, Login again" });

    } catch (error) {
        next(error);
    }
}
const getUserData=async(req,res,next)=>{
  try {
  const userData=req.user
  return res.status(200).json({data:userData})
  } catch (error) {
    next(error)
  }
}
const authController={
    register,
    login,
    logout,
    forgotPassword,
    resetPassword,
    getUserData
}

export default authController
