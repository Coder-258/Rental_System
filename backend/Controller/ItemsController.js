const multer = require('multer');
const path = require('path');
const ItemModel = require('../Schemas/ItemsSchema');  // Assuming you have an Item schema
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Set up multer storage engine (you can change the destination and filename as per your requirements)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Directory to store uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Unique filename based on timestamp
    }
});

// Set up file filter to allow only image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image file.'), false);
    }
};

// Multer configuration (max file size 5MB)
module.exports.upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }  // Max file size: 5MB
}).array('images', 5);  // Limit to a maximum of 5 files

module.exports.CreateItem = async (req, res) => {
    // Validate request data
    const errors = validationResult(req);
    console.log("Validation Errors:", errors.array()); 
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Destructure the form data from the request body
        const { title, description, price, category, availableFrom, availableTo } = req.body;
        const images = req.files.map(file => file.path);  // Get the paths of the uploaded images

        // Ensure the seller is authenticated and available in the request (via middleware)
        const sellerId = req.seller._id;

        // Create a new item document with the provided data
        const newItem = new ItemModel({
            title,
            description,
            price,
            category,
            availableFrom,
            availableTo,
            images,
            seller: sellerId  // Associate this item with the authenticated seller
        });

        // Save the new item to the database
        await newItem.save();

        // Respond with the created item
        return res.status(201).json({
            message: "Item listed successfully!",
            item: newItem
        });
    } catch (error) {
        console.error("Error creating item:", error);
        return res.status(500).json({ message: "An error occurred while listing the item" });
    }
};

// Method to get category-wise items
module.exports.getCategoryItems=async (req,res)=>{
    try{
        const category=req.query.category;
        const items=await ItemModel.find({category:category});
        return res.status(200).json(items);
    }catch(error){
        console.error("Error fetching category items:", error);
        return res.status(500).json({ message: "An error occurred while fetching category items" });
    }
}

// Method to fetch all the available items
module.exports.getAllItems=async (req,res)=>{
    try{
        const items=await ItemModel.find({});
        return res.status(200).json(items);
    }catch(error){
        console.error("Error fetching all items:", error);
        return res.status(500).json({ message: "An error occurred while fetching all items" });
    }

}
module.exports.getSellerItems=async (req,res)=>{
    try{
        const authHeader = req.headers.authorization;
        // const token = authHeader.split(' ')[1]; 
        const token = authHeader;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization token is required' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_SELLER); // Decode token to get user ID
        const sellerId = decoded._id;

        // const items = await ItemModel.find({ seller: sellerId });
        // const sellerId = req.seller._id;

        const rentals = await ItemModel.find({ seller: sellerId }) // Populate seller details if needed

        return res.status(200).json(rentals);
    }catch(error){
        console.error('Error fetching rentals:', error);
        res.status(500).json({ message: 'An error occurred while fetching rentals' });
    }
}
module.exports.searchItems=async (req,res)=>{
    try{
        const {search}=req.query;
        const products = await ItemModel.find({
            $or: [
              { title: { $regex: search, $options: "i" } },
              { category: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
          });
      
         return res.status(200).json(products);
    }catch(error){
        console.error('Error fetching rentals:', error);
        res.status(500).json({ message: 'An error occurred while fetching rentals' });
    }
}