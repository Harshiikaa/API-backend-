const Users = require("../model/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cloudinary = require('cloudinary')





// CREATE USER 
const registerUser = async (req, res) => {
    console.log(req.body)
    const { firstName, lastName, phoneNumber, email, password } = req.body
    if (!firstName || !lastName || !phoneNumber || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        })
    }
    try {
        const existingUser = await Users.findOne({ email: email })
        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists."
            })
        }
        const generatedSalt = await bcrypt.genSalt(10)
        const encryptedPassword = await bcrypt.hash(password, generatedSalt)
        const newUser = new Users({
            firstName: firstName,
            lastName: lastName,
            phoneNumber: phoneNumber,
            email: email,
            password: encryptedPassword
        })
        await newUser.save()
        res.status(200).json({
            success: true,
            message: "User created successfully."
        })
    } catch (error) {
        res.status(500).json("Server error")
    }
}



// LOGIN USER
const loginUser = async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        })
    }
    try {
        const user = await Users.findOne({ email: email })
        if (!user) {
            return res.json({
                success: false,
                message: "User does not exist"
            })
        }
        const passwordToCompare = user.password;
        const isMatch = await bcrypt.compare(password, passwordToCompare)
        if (!isMatch) {
            return res.json({
                success: false,
                message: "Password did not match"
            })
        }
        const token = await jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_TOKEN_SECRET,
        )
        res.status(200).json({
            success: true,
            token: token,
            userData: user,
            message: "User logged in successfully",

        })
    } catch (error) {
        console.log(error),
            res.json("Server error")
    }
}



//  GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const listOfUsers = await Users.find({ isAdmin: false });;
        res.json({
            success: true,
            message: "Users fetched succesfully",
            users: listOfUsers
        })

    } catch (error) {
        console.log(error)
        res.status(500).json("Server Error")

    }
}


// GET SINGLE USER
const getSingleUser = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.json({
            success: false,
            message: "User id is required!"
        })
    }
    try {
        const singleUser = await Users.findById(id);
        res.json({
            success: true,
            message: "User fetched successfully",
            user: singleUser

        })

    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error")

    }
}

// UPDATE USER

const updateUser = async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    const {
        firstName,
        lastName,
        phoneNumber,
        email,

    } = req.body;


    const { userImage } = req.files;


    const id = req.params.id;
    if (!firstName
        || !lastName
        || !phoneNumber
        || !email
    ) {
        return res.json({
            success: true,
            message: "All fields are required!"
        })
    }
    try {
        if (userImage) {
            const uploadedImage = await cloudinary.v2.uploader.upload(
                userImage.path,
                {
                    folder: "users",
                    crop: "scale"
                }
            )
            const updatedUser = {
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,
                userImage: uploadedImage.secure_url
            }
            await Users.findByIdAndUpdate(id, updatedUser);
            res.json({
                success: true,
                message: "User updated successfully",
                user: updatedUser
            })
        }
        else {
            const updatedUser = {
                firstName: firstName,
                lastName: lastName,
                phoneNumber: phoneNumber,
                email: email,

            }
            await Users.findByIdAndUpdate(id, updatedUser);
            res.json({
                success: true,
                message: "User updated successfully without image",
                user: updatedUser
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Server Error"
        })

    }

}

// DELETE USER
const deleteUser = async (req, res) => {
    try {
        const deletedUser = await Users.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.json({
                success: false,
                message: "User not found!"
            })
        }
        res.json({
            success: true,
            message: "User deleted successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }

}

module.exports = { registerUser, loginUser, getAllUsers, getSingleUser, updateUser, deleteUser };


