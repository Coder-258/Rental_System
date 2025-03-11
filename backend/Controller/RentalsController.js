const Rental = require('../Schemas/Rental');  // Import Rental model
const ItemModel = require('../Schemas/ItemsSchema');  // Import Item model
const jwt = require('jsonwebtoken'); // Import JWT for decoding token

module.exports.rentItem = async (req, res) => {
    try {
        const { itemId, returnDate, price } = req.body;  // Receive item ID, return date, and rental price from frontend
        
        // Extract and verify token
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization token is required' });
        }

        const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token to get user ID
        const userId = decoded._id;

        // Find the item in the database
        const item = await ItemModel.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Check if the item is available
        if (!item.isAvailable) {
            return res.status(400).json({ message: 'Item is not available for rent' });
        }

        // Validate return date
        const parsedReturnDate = new Date(returnDate);
        if (isNaN(parsedReturnDate.getTime())) {
            return res.status(400).json({ message: 'Invalid return date' });
        }

        // Ensure price is valid
        if (!price || isNaN(price) || price <= 0) {
            return res.status(400).json({ message: 'Invalid rental price' });
        }

        // Create a rental record
        const rental = new Rental({
            user: userId,
            item: itemId,
            returnDate: parsedReturnDate,
            price: price,
        });

        // Save the rental
        await rental.save();

        // Update the item to mark it as unavailable
        item.isAvailable = false;
        await item.save();

        // Return success response
       return res.status(200).json({ message: 'Item rented successfully', rental });
    } catch (error) {
        console.error('Error renting item:', error);
        res.status(500).json({ message: 'An error occurred while renting the item' });
    }
};
module.exports.getMyRentals=async (req,res)=>{
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'Authorization token is required' });
        }

        const token = authHeader.split(' ')[1]; // Extract token from "Bearer <token>"
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode token to get user ID
        const userId = decoded._id;

        const rentals=await Rental.find({user:userId}).populate('item');
        return res.status(200).json(rentals);
    }catch(error){
        console.error('Error fetching rentals:', error);
        res.status(500).json({ message: 'An error occurred while fetching rentals' });
    }
}
module.exports.returnItem = async (req, res) => {
    try {
      const { rentalId } = req.params;
  
      // Find the rental record
      const rental = await Rental.findById(rentalId);
      if (!rental) {
        return res.status(404).json({ error: "Rental not found" });
      }
  
      // Update the ListItem's availability to true
      const updatedItem = await ItemModel.findByIdAndUpdate(
        rental.item,
        { isAvailable: true },
        { new: true }
      );
  
      if (!updatedItem) {
        return res.status(404).json({ error: "Item not found" });
      }
  
      // Optionally, you can also re-fetch the rental record and populate the item,
      // so your frontend gets the updated status in the response.
      const updatedRental = await Rental.findById(rentalId).populate('item');
  
      res.status(200).json(updatedRental);
    } catch (error) {
      console.error("Error returning item:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  