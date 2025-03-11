const express = require('express');
const RentalController = require('../Controller/RentalsController');
const router = express.Router();
const authenticate=require('../Middlewares/Authenitcationverification');
// Define the route for renting an item
router.post('/rent', RentalController.rentItem);
//  Route for fetching a user's rentals
router.get('/myRentals', RentalController.getMyRentals);
router.put('/return/:rentalId',authenticate.authUser,RentalController.returnItem);
// Export the router correctly
module.exports = router;