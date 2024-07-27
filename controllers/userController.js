const Users = require("../model/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cloudinary = require('cloudinary')
const nodemailer = require("nodemailer")
const randomstring = require("randomstring")
const keysecret = process.env.JWT_TOKEN_SECRET

const PASSWORD_EXPIRY_DAYS = 90;
const MAX_ATTEMPTS = 3;
const LOCK_TIME = 10 * 60 * 1000; // Lock time in milliseconds (e.g., 10 minutes)

// Middleware to check password expiry
function checkPasswordExpiry(req, res, next) {
    const user = req.user; // assuming the user is already authenticated and added to req object
    const now = new Date();
    const lastChanged = new Date(user.passwordChangedAt || user.createdAt);
    const expiryDate = new Date(lastChanged);
    expiryDate.setDate(expiryDate.getDate() + PASSWORD_EXPIRY_DAYS);

    if (now > expiryDate) {
        return res.status(403).json({
            success: false,
            message: "Your password has expired. Please change your password."
        });
    }
    next();
}

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

const lockAccountFor10Minutes = async (userId) => {
    const lockTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    await Users.findByIdAndUpdate(userId, { lockUntil: lockTime });
};

const isAccountLocked = (user) => {
    return user.lockUntil && user.lockUntil > Date.now();
};

const resetLoginAttempts = async (user) => {
    user.loginAttempts = 0;
    user.lockUntil = null;
    await user.save();
};

const handleFailedLoginAttempt = async (user) => {
    user.loginAttempts += 1;
    if (user.loginAttempts >= 3) { // Adjust the number of attempts as needed
        await lockAccountFor10Minutes(user._id);
        user.loginAttempts = 0; // Reset login attempts after locking
    }
    await user.save();
};
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required."
        });
    }

    try {
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No account found with this email address."
            });
        }

        if (isAccountLocked(user)) {
            return res.status(403).json({
                success: false,
                message: "Your account is locked due to multiple failed login attempts. Please try again after 10 minutes."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            await handleFailedLoginAttempt(user);
            return res.status(401).json({
                success: false,
                message: "The email or password you entered is incorrect. Please try again."
            });
        }

        await resetLoginAttempts(user);

        const token = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_TOKEN_SECRET,
            { expiresIn: '1h' } // Adjust token expiration as needed
        );

        res.status(200).json({
            success: true,
            token,
            userData: user,
            message: "User logged in successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred. Please try again."
        });
    }
};


// const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "All fields are required."
//         });
//     }

//     try {
//         const user = await Users.findOne({ email });
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User does not exist"
//             });
//         }

//         if (isAccountLocked(user)) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Account is locked. Try again later."
//             });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             await handleFailedLoginAttempt(user);
//             return res.status(401).json({
//                 success: false,
//                 message: "Password did not match"
//             });
//         }

//         await resetLoginAttempts(user);

//         const token = jwt.sign(
//             {
//                 id: user._id,
//                 isAdmin: user.isAdmin
//             },
//             process.env.JWT_TOKEN_SECRET,
//             { expiresIn: '1h' } // Adjust token expiration as needed
//         );

//         res.status(200).json({
//             success: true,
//             token,
//             userData: user,
//             message: "User logged in successfully"
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// };

// LOGIN USER
// const loginUser = async (req, res) => {
//     console.log(req.body);
//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "All fields are required."
//         })
//     }
//     try {
//         const user = await Users.findOne({ email: email })
//         if (!user) {
//             return res.json({
//                 success: false,
//                 message: "User does not exist"
//             })
//         }

//         if (user.lockUntil && user.lockUntil > Date.now()) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Account is locked. Please try again later."
//             });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             user.loginAttempts += 1;
//             if (user.loginAttempts >= MAX_ATTEMPTS) {
//                 user.lockUntil = Date.now() + LOCK_TIME;
//             }
//             await user.save();
//             return res.json({
//                 success: false,
//                 message: "Invalid email or password."
//             });
//         }

//         user.loginAttempts = 0;
//         user.lockUntil = undefined;
//         await user.save();

//         const token = await jwt.sign(
//             {
//                 id: user._id,
//                 isAdmin: user.isAdmin
//             },
//             process.env.JWT_TOKEN_SECRET,
//         );
//         res.status(200).json({
//             success: true,
//             token: token,
//             userData: user,
//             message: "User logged in successfully",
//         });
//     } catch (error) {
//         console.log(error),
//             res.status(500).json("Server error");
//     }
// }

// const loginUser = async (req, res) => {
//     console.log(req.body);
//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "All fields are required."
//         });
//     }

//     try {
//         const user = await Users.findOne({ email: email });
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User does not exist."
//             });
//         }

//         // Check if the account is locked
//         if (user.lockUntil && user.lockUntil > Date.now()) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Account is locked. Please try again later."
//             });
//         }

//         // If lock period has expired, reset loginAttempts
//         if (user.lockUntil && user.lockUntil < Date.now()) {
//             user.loginAttempts = 0;
//             user.lockUntil = undefined;
//             await user.save();
//         }

//         // Compare passwords
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             user.loginAttempts += 1;

//             // Lock the account if maximum attempts are reached
//             if (user.loginAttempts >= MAX_ATTEMPTS) {
//                 user.lockUntil = Date.now() + LOCK_TIME;
//             }
//             await user.save();

//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid email or password."
//             });
//         }

//         // Reset login attempts and lock status upon successful login
//         user.loginAttempts = 0;
//         user.lockUntil = undefined;
//         await user.save();

//         // Generate JWT token
//         const token = jwt.sign(
//             {
//                 id: user._id,
//                 isAdmin: user.isAdmin
//             },
//             process.env.JWT_TOKEN_SECRET,
//             { expiresIn: '1h' } // Token expiration (adjust as needed)
//         );

//         res.status(200).json({
//             success: true,
//             token: token,
//             userData: user,
//             message: "User logged in successfully."
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Server error."
//         });
//     }
// };



// const loginUser = async (req, res) => {
//     const { email, password } = req.body;

//     // Validate input
//     if (!email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "All fields are required."
//         });
//     }

//     try {
//         // Find the user by email
//         const user = await Users.findOne({ email: email });
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User does not exist."
//             });
//         }

//         // Check if the account is locked
//         if (user.lockUntil && user.lockUntil > Date.now()) {
//             return res.status(403).json({
//                 success: false,
//                 message: "Account is locked. Please try again later."
//             });
//         }

//         // Compare passwords
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             user.loginAttempts += 1;

//             // Lock the account if maximum attempts are reached
//             if (user.loginAttempts >= MAX_ATTEMPTS) {
//                 user.lockUntil = Date.now() + LOCK_TIME;
//                 user.loginAttempts = 0; // Reset login attempts after locking
//             }
//             await user.save();

//             return res.status(401).json({
//                 success: false,
//                 message: "Invalid email or password."
//             });
//         }

//         // Reset login attempts and lock status upon successful login
//         user.loginAttempts = 0;
//         user.lockUntil = undefined;
//         await user.save();

//         // Generate JWT token
//         const token = await jwt.sign(
//             {
//                 id: user._id,
//                 isAdmin: user.isAdmin
//             },
//             process.env.JWT_TOKEN_SECRET,
//             { expiresIn: '1h' } // Token expiration (adjust as needed)
//         );

//         res.status(200).json({
//             success: true,
//             token: token,
//             userData: user,
//             message: "User logged in successfully."
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Server error."
//         });
//     }
// };

// GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const listOfUsers = await Users.find({ isAdmin: false });
        res.json({
            success: true,
            message: "Users fetched successfully",
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
    if (!firstName || !lastName || !phoneNumber || !email) {
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
        } else {
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

const forgetPassword = async (req, res) => {
    try {
        const userData = await Users.findOne({ email: req.body.email });
        if (userData) {
            const randomString = randomstring.generate();
            const data = await Users.updateOne(
                { email: req.body.email },
                { $set: { token: randomString } }
            );
            sendResetPasswordMail(userData.firstName, userData.email, randomString);
            res.status(200).send({ success: true, message: "Please check your inbox of mail" });
        } else {
            res.status(200).send({ success: true, message: "This email does not exist" });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

const sendResetPasswordMail = async (firstName, email, token) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email, // User's email
            subject: "Reset the Password",
            html: "Hi " + firstName + ', Please copy the link and <a href="http://localhost:3000/resetPassword/' + token + '">click here</a> to reset your password',
        };

        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error); // Log the specific error
            } else {
                console.log("Mail has been sent :- ", info.response);
            }
        });
    } catch (error) {
        res.status(400).send({ success: false, msg: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const token = req.params.token;
        const tokenData = await Users.findOne({ token: token });

        if (!tokenData) {
            res.status(200).send({ success: false, message: "The token is expired" });
        } else {
            const { password } = req.body;
            if (!password || password.trim() === "") {
                return res.status(400).send({ success: false, message: "Invalid password" });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const data = await Users.updateOne(
                { token: token },
                { $set: { password: hashedPassword, token: "" } }
            );

            res.status(200).send({ success: true, message: "Password reset successfully" });
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
    }
};

const changePassword = async (req, res) => {
    const { userId, oldPassword, newPassword } = req.body;
    
    if (!userId || !oldPassword || !newPassword) {
        return res.status(400).json({
            success: false,
            message: "User ID, old password, and new password are required."
        });
    }

    try {
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Check old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect."
            });
        }

        // Check if the new password is in the history
        for (let entry of user.passwordHistory) {
            if (await bcrypt.compare(newPassword, entry.password)) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot reuse a recent password."
                });
            }
        }

        const generatedSalt = await bcrypt.genSalt(10);
        const encryptedNewPassword = await bcrypt.hash(newPassword, generatedSalt);

        user.passwordHistory.push({ password: user.password, changedAt: new Date() });
        if (user.passwordHistory.length > 5) {
            user.passwordHistory.shift(); // Keep only the last 5 passwords
        }

        user.password = encryptedNewPassword;
        user.passwordChangedAt = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully."
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = { registerUser, loginUser, getAllUsers, getSingleUser, updateUser, deleteUser, forgetPassword, sendResetPasswordMail, resetPassword, changePassword, checkPasswordExpiry };


// const Users = require("../model/userModel")
// const bcrypt = require("bcrypt")
// const jwt = require("jsonwebtoken")
// const cloudinary = require('cloudinary')
// const nodemailer = require("nodemailer")
// const randomstring = require("randomstring")
// const keysecret = process.env.JWT_TOKEN_SECRET



// // CREATE USER 
// const registerUser = async (req, res) => {
//     console.log(req.body)
//     const { firstName, lastName, phoneNumber, email, password } = req.body
//     if (!firstName || !lastName || !phoneNumber || !email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "All fields are required."
//         })
//     }
//     try {
//         const existingUser = await Users.findOne({ email: email })
//         if (existingUser) {
//             return res.json({
//                 success: false,
//                 message: "User already exists."
//             })
//         }
//         const generatedSalt = await bcrypt.genSalt(10)
//         const encryptedPassword = await bcrypt.hash(password, generatedSalt)
//         const newUser = new Users({
//             firstName: firstName,
//             lastName: lastName,
//             phoneNumber: phoneNumber,
//             email: email,
//             password: encryptedPassword
//         })
//         await newUser.save()
//         res.status(200).json({
//             success: true,
//             message: "User created successfully."
//         })
//     } catch (error) {
//         res.status(500).json("Server error")
//     }
// }



// // LOGIN USER
// const loginUser = async (req, res) => {
//     console.log(req.body);
//     const { email, password } = req.body;
//     if (!email || !password) {
//         return res.status(400).json({
//             success: false,
//             message: "All fields are required."
//         })
//     }
//     try {
//         const user = await Users.findOne({ email: email })
//         if (!user) {
//             return res.json({
//                 success: false,
//                 message: "User does not exist"
//             })
//         }
//         const passwordToCompare = user.password;
//         const isMatch = await bcrypt.compare(password, passwordToCompare)
//         if (!isMatch) {
//             return res.json({
//                 success: false,
//                 message: "Password did not match"
//             })
//         }
//         const token = await jwt.sign(
//             {
//                 id: user._id,
//                 isAdmin: user.isAdmin
//             },
//             process.env.JWT_TOKEN_SECRET,
//         )
//         res.status(200).json({
//             success: true,
//             token: token,
//             userData: user,
//             message: "User logged in successfully",

//         })
//     } catch (error) {
//         console.log(error),
//             res.json("Server error")
//     }
// }



// //  GET ALL USERS
// const getAllUsers = async (req, res) => {
//     try {
//         const listOfUsers = await Users.find({ isAdmin: false });;
//         res.json({
//             success: true,
//             message: "Users fetched succesfully",
//             users: listOfUsers
//         })

//     } catch (error) {
//         console.log(error)
//         res.status(500).json("Server Error")

//     }
// }


// // GET SINGLE USER
// const getSingleUser = async (req, res) => {
//     const id = req.params.id;
//     if (!id) {
//         return res.json({
//             success: false,
//             message: "User id is required!"
//         })
//     }
//     try {
//         const singleUser = await Users.findById(id);
//         res.json({
//             success: true,
//             message: "User fetched successfully",
//             user: singleUser

//         })

//     } catch (error) {
//         console.log(error);
//         res.status(500).json("Server Error")

//     }
// }

// // UPDATE USER

// const updateUser = async (req, res) => {
//     console.log(req.body);
//     console.log(req.files);

//     const {
//         firstName,
//         lastName,
//         phoneNumber,
//         email,

//     } = req.body;


//     const { userImage } = req.files;


//     const id = req.params.id;
//     if (!firstName
//         || !lastName
//         || !phoneNumber
//         || !email
//     ) {
//         return res.json({
//             success: true,
//             message: "All fields are required!"
//         })
//     }
//     try {
//         if (userImage) {
//             const uploadedImage = await cloudinary.v2.uploader.upload(
//                 userImage.path,
//                 {
//                     folder: "users",
//                     crop: "scale"
//                 }
//             )
//             const updatedUser = {
//                 firstName: firstName,
//                 lastName: lastName,
//                 phoneNumber: phoneNumber,
//                 email: email,
//                 userImage: uploadedImage.secure_url
//             }
//             await Users.findByIdAndUpdate(id, updatedUser);
//             res.json({
//                 success: true,
//                 message: "User updated successfully",
//                 user: updatedUser
//             })
//         }
//         else {
//             const updatedUser = {
//                 firstName: firstName,
//                 lastName: lastName,
//                 phoneNumber: phoneNumber,
//                 email: email,

//             }
//             await Users.findByIdAndUpdate(id, updatedUser);
//             res.json({
//                 success: true,
//                 message: "User updated successfully without image",
//                 user: updatedUser
//             })
//         }
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             success: false,
//             message: "Server Error"
//         })

//     }

// }

// // DELETE USER
// const deleteUser = async (req, res) => {
//     try {
//         const deletedUser = await Users.findByIdAndDelete(req.params.id);
//         if (!deletedUser) {
//             return res.json({
//                 success: false,
//                 message: "User not found!"
//             })
//         }
//         res.json({
//             success: true,
//             message: "User deleted successfully"
//         })

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             success: false,
//             message: "Server Error"
//         })
//     }

// }

// const forgetPassword = async (req, res) => {
//     try {
//         const userData = await Users.findOne({ email: req.body.email });
//         if (userData) {
//             const randomString = randomstring.generate();
//             const data = await Users.updateOne(
//                 { email: req.body.email },
//                 { $set: { token: randomString } }
//             );
//             sendResetPasswordMail(userData.firstName, userData.email, randomString);
//             res
//                 .status(200)
//                 .send({ success: true, message: "Please check your inbox of mail" });
//         } else {
//             res
//                 .status(200)
//                 .send({ success: true, message: "This email does not exits" });
//         }
//     } catch (error) {
//         res.status(400).send({ success: false, message: error.message });
//     }
// };

// const sendResetPasswordMail = async (firstName, email, token) => {
//     try {
//         const transporter = nodemailer.createTransport({
//             // Configure SMTP settings
//             service: "gmail",
//             host: "smtp.gmail.com",

//             auth: {
//                 user: process.env.SMTP_MAIL,
//                 pass: process.env.SMTP_PASSWORD,
//             },

//         });

//         const mailOptions = {
//             from: process.env.SMTP_MAIL,
//             to: email, // User's email
//             subject: "Reset the Password",
//             html:
//                 "Hi " +
//                 firstName +
//                 ', Please copy the link and <a href="http://localhost:3000/resetPassword/' +
//                 token +
//                 '">click here</a> to reset your password',
//         };

//         transporter.sendMail(mailOptions, async (error, info) => {
//             if (error) {
//                 console.log(error); // Log the specific error
//             } else {
//                 console.log("Mail has been sent :- ", info.response);
//             }
//         });
//     } catch (error) {
//         res.status(400).send({ success: false, msg: error.message });
//     }
// };

// const resetPassword = async (req, res) => {
//     try {
//         const token = req.params.token;
//         const tokenData = await Users.findOne({ token: token });

//         if (!tokenData) {
//             res.status(200).send({ success: false, message: "The token is expired" });
//         } else {
//             // Ensure that the password is defined and not an empty string
//             const { password } = req.body;
//             if (!password || password.trim() === "") {
//                 return res
//                     .status(400)
//                     .send({ success: false, message: "Invalid password" });
//             }

//             // Hash the new password before updating
//             const hashedPassword = await bcrypt.hash(password, 10);

//             // Update the user's password and clear the token
//             const data = await Users.updateOne(
//                 { token: token },
//                 { $set: { password: hashedPassword, token: "" } }
//             );

//             res
//                 .status(200)
//                 .send({ success: true, message: "Password reset successfully" });
//         }
//     } catch (error) {
//         res.status(400).send({ success: false, message: error.message });
//     }
// };


// const changePassword = async (req, res) => {
//     const { userId, oldPassword, newPassword } = req.body;
    
//     if (!userId || !oldPassword || !newPassword) {
//         return res.status(400).json({
//             success: false,
//             message: "User ID, old password, and new password are required."
//         });
//     }

//     try {
//         const user = await Users.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found."
//             });
//         }

//         // Check old password
//         const isMatch = await bcrypt.compare(oldPassword, user.password);
//         if (!isMatch) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Old password is incorrect."
//             });
//         }

//         // Check if the new password is in the history
//         for (let entry of user.passwordHistory) {
//             if (await bcrypt.compare(newPassword, entry.password)) {
//                 return res.status(400).json({
//                     success: false,
//                     message: "Cannot reuse a recent password."
//                 });
//             }
//         }

//         // Hash the new password
//         const generatedSalt = await bcrypt.genSalt(10);
//         const encryptedNewPassword = await bcrypt.hash(newPassword, generatedSalt);

//         // Update password history
//         user.passwordHistory.push({ password: user.password, changedAt: new Date() });
//         if (user.passwordHistory.length > 5) {
//             user.passwordHistory.shift(); // Keep only the last 5 passwords
//         }

//         // Update the user's password and save changes
//         user.password = encryptedNewPassword;
//         user.passwordChangedAt = new Date();
//         await user.save();

//         res.status(200).json({
//             success: true,
//             message: "Password changed successfully."
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({
//             success: false,
//             message: "Server error"
//         });
//     }
// };


// module.exports = { registerUser, loginUser, getAllUsers, getSingleUser, updateUser, deleteUser, forgetPassword, sendResetPasswordMail, resetPassword , changePassword};


