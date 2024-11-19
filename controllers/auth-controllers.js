const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        
        // Check if the user already exists
        const checkExistingUser = await User.findOne({
            $or: [{ username: username }, { email: email }]
        });
        
        if (checkExistingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with the same username or email. Please try with a different username and email.'
            });
        }

        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newlyCreatedUser = new User({
            username,
            email,
            password: hashedPassword,
            role: role || "User"
        });
        
        await newlyCreatedUser.save();

        // Send success response
        res.status(201).json({
            success: true,
            message: "User registered successfully"
        });
        
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occurred! Please try again."
        });
    }
};

const Loginuser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid username"
            });
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Credentials!"
            });
        }

        const accessToken = jwt.sign(
            {
                userId: user._id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET_KEY || "JWT_SECRET_KEY",
            { expiresIn: '15m' } // corrected to 'expiresIn'
        );

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            accessToken
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occurred! Please try again."
        });
    }
};
const changePassword = async (req, res) => {
    try {
        const userId = req.userInfo.userId;
        const { oldPassword, newPassword } = req.body;

        // Find the current logged-in user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        // Compare the old password
        const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is not correct! Please try again.",
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        // Update user password
        user.password = newHashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "An error occurred while changing the password.",
            error: error.message,
        });
    }




};
module.exports = { registerUser, Loginuser,changePassword};
