const express= require('express');
const mongoose= require('mongoose');
const dotenv= require('dotenv');
const cookieParser=require('cookie-parser');
dotenv.config();
const app= express();
app.use(express.json());
app.use(cookieParser())
const cors= require('cors');
const corsOptions = {
    origin: "http://localhost:5173", // The exact URL of your frontend app
    credentials: true, // Allow credentials (cookies, headers, etc.)
};

app.use(cors(corsOptions));
app.use('/uploads', express.static('uploads'));
const UserRoutes=require('./routes/UserRoutes')
const SellerRoutes=require('./routes/SellerRoutes');
const ItemsRoutes=require('./routes/ItemsRoutes');
const RentalRoutes=require('./routes/RentalsRoutes');
const connect_to_db = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log("Connected to DB");
    } catch (err) {
        console.error("DB Connection Error:", err);
    }
}
connect_to_db();
app.use('/user',UserRoutes);
app.use('/seller',SellerRoutes);
app.use('/rentals',RentalRoutes)
app.use('/items',ItemsRoutes);
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});