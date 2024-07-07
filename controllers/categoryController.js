const Categories = require('../model/categoryModel');


const createCategory = async (req, res) => {
    console.log(req.body);

    // Destructure category from the request body
    const { category } = req.body;

    // Validate the data
    if (!category) {
        return res.json({
            success: false,
            message: "Please provide a category"
        });
    }

    // Try-catch block for error handling
    try {
        const newCategory = new Categories({
            category: category,
        });
        await newCategory.save();
        res.status(200).json({
            success: true,
            message: "Category created successfully",
            data: newCategory
        });

    } catch (error) {
        console.log(error);
        res.status(500).json("Server Error");
    }
}


// function to get all the products
const getAllCategories = async (req, res) => {
    try {
        const listOfCategories = await Categories.find();
        res.json({
            success: true,
            message: "Categories fetched successfully",
            categories: listOfCategories
        })
    } catch (error) {
        console.log(error)
        res.status(500).json("Server Error")
    }
}

// // function to get single product
// const getSingleProduct = async (req, res) => {
//     const id = req.params.id;
//     if (!id) {
//         return res.json({
//             success: false,
//             message: "Product id is required!"
//         })
//     }
//     try {
//         const singleProduct = await Products.findById(id);
//         res.json({
//             success: true,
//             message: "Products fetched successfully",
//             product: singleProduct
//         })

//     } catch (error) {
//         console.log(error);
//         res.status(500).json("Server Error")

//     }
// }

const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await Categories.findByIdAndDelete(req.params.id);
        if (!deleteCategory) {
            return res.json({
                success: false,
                message: "Category not found!"
            })
        }
        res.json({
            success: true,
            message: "Category deleted successfully"
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
    createCategory,
    getAllCategories,
    // getSingleProduct,
    deleteCategory
};