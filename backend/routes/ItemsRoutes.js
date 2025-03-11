const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const ItemController = require('../Controller/ItemsController');
const Authentication = require('../Middlewares/Authenitcationverification');
// const upload = require('../Controller/ItemsController').upload;
// POST request to list a new item (only authenticated sellers can list items)
router.post(
    "/listItem",
    Authentication.authSeller,  // Ensures only authenticated sellers can list items
    ItemController.upload,
    [
        body('title').isLength({ min: 3 }).withMessage("Title should be at least 3 characters long"),
        body('description').isLength({ min: 10 }).withMessage("Description should be at least 10 characters long"),
        body('price').isFloat({ min: 0 }).withMessage("Price should be a valid number greater than 0"),
        body('category').notEmpty().withMessage("Category is required"),
    ],
    ItemController.CreateItem
);

// Get Request to fetch category wise items
router.get("/getCategoryWiseItems", ItemController.getCategoryItems);
// GET request to fetch all items
router.get("/getAllItems", ItemController.getAllItems);

// GET request to fetch items by a specific seller (requires authentication)
router.get("/getSellerItems", Authentication.authSeller, ItemController.getSellerItems);

// GET request to fetch items searched by a user
router.get("/search", ItemController.searchItems);
module.exports = router;