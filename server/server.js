import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB  from './configs/db.js';
import userRouter from './routes/userRoutes.js';
import ownerRouter from './routes/ownerRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';

const PORT = process.env.PORT || 3000;

const app = express();

// connect to database
await connectDB();

//middleware
app.use(express.json())
app.use(cors());

app.get('/', (req, res) => {
    res.send("server is running")
})

app.use('/api/user', userRouter)
app.use('/api/owner', ownerRouter)
app.use('/api/bookings', bookingRouter)


app.listen(PORT, () =>{
    console.log(`Server is Running on Port ${PORT}`);
});
