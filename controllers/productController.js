const Products = require('../model/productModel');
const cloudinary = require('cloudinary');


const createProduct = async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    // destructure data 
    const { productName,
        productRentalPrice,
        productSecurityDeposit,
        productCategory,
        productQuantity,
        productSize,
        productDescription
    } = req.body;
    const { productImage } = req.files;

    // validate the data 
    if (!productName || !productRentalPrice || !productSecurityDeposit || !productCategory || !productQuantity || !productSize || !productDescription || !productImage)
        return res.json({
            success: false,
            message: "Please fill all the fields"
        })

    // try catch block 
    try {
        const uploadedImage = await cloudinary.v2.uploader.upload(
            productImage.path,
            {
                folder: 'products',
                crop: "scale"
            }
        )
        const newProduct = new Products({
            productName: productName,
            productRentalPrice: productRentalPrice,
            productSecurityDeposit: productSecurityDeposit,
            productCategory: productCategory,
            productQuantity: productQuantity,
            productSize: productSize,
            productDescription: productDescription,
            productImageURL: uploadedImage.secure_url,
        })
        await newProduct.save();
        res.status(200).json({
            success: true,
            message: "Product created succesfully",
            data: newProduct
        })

    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error")

    }
}


// function to get all the products
const getAllProducts = async (req, res) => {
    try {
        const listOfProducts = await Products.find();
        res.json({
            success: true,
            message: "Products fetched successfully",
            products: listOfProducts
        })

    } catch (error) {
        console.log(error)
        res.status(500).json("Server Error")

    }

}


// const getProductsByCategory = async (req, res) => {
//     const category = "Antique Jewelry";

//     try {
//         const categoryProducts = await Products.find({ productCategory: category });

//         res.json({
//             message: "Products fetched successfully by Antique Jewelry",
//             success: true,
//             products: categoryProducts,
//         });
//     } catch (error) {
//         res.json({
//             message: "Error fetching products by Antique Jewelry",
//             success: false,
//         });
//     }
// };


// function to get single product
const getSingleProduct = async (req, res) => {
    const id = req.params.id;
    if (!id) {
        return res.json({
            success: false,
            message: "Product id is required!"
        })
    }
    try {
        const singleProduct = await Products.findById(id);
        res.json({
            success: true,
            message: "Products fetched successfully",
            product: singleProduct
        })

    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error")

    }
}

const getUserProductPagination = async (req, res) => {
    const requestPage = req.query.page;
    const resultPerPage = 4;
    try {
        const products = await Products.find({})
            .skip((requestPage - 1) * resultPerPage)
            .limit(resultPerPage);

        const totalProductsCount = await Products.countDocuments();
        if (products.length === 0) {
            return res.json({
                success: false,
                message: "No product found"
            });
        }
        res.json({
            success: true,
            products: products,
            totalPages: Math.ceil(totalProductsCount / resultPerPage),
        });
    } catch (error) {
        console.log(error);
        res.json(500).json({
            success: false,
            message: "Server Error",
        });
    }
}

// function to update the product
const updateProduct = async (req, res) => {
    console.log(req.body);
    console.log(req.files);

    const {
        productName,
        productRentalPrice,
        productSecurityDeposit,
        productCategory,
        productQuantity,
        productSize,
        productDescription

    } = req.body;
    const { productImage } = req.files;


    const id = req.params.id;
    if (!productName
        || !productRentalPrice
        || !productSecurityDeposit
        || !productCategory
        || !productQuantity
        || !productSize
        || !productDescription
    ) {
        res.json({
            success: true,
            message: "All fields are required!"
        })
    }
    try {
        if (productImage) {
            const uploadedImage = await cloudinary.v2.uploader.upload(
                productImage.path,
                {
                    folder: "products",
                    crop: "scale"
                }
            )
            const updatedProduct = {
                productName: productName,
                productRentalPrice: productRentalPrice,
                productSecurityDeposit: productSecurityDeposit,
                productCategory: productCategory,
                productQuantity: productQuantity,
                productSize: productSize,
                productDescription: productDescription,
                productImageURL: uploadedImage.secure_url
            }
            await Products.findByIdAndUpdate(id, updatedProduct);
            res.json({
                success: true,
                message: "Product uploaded successfully",
                product: updatedProduct
            })
        }
        else {
            const updatedProduct = {
                productName: productName,
                productRentalPrice: productRentalPrice,
                productSecurityDeposit: productSecurityDeposit,
                productCategory: productCategory,
                productQuantity: productQuantity,
                productSize: productSize,
                productDescription: productDescription,

            }
            await Products.findByIdAndUpdate(id, updatedProduct);
            res.json({
                success: true,
                message: "Product updated successfully without image",
                product: updatedProduct
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

const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Products.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.json({
                success: false,
                message: "Product not found!"
            })
        }
        res.json({
            success: true,
            message: "Product deleted successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
}

module.exports = {
    createProduct,
    getAllProducts,
    getUserProductPagination,
    getSingleProduct,
    updateProduct,
    deleteProduct
};