import mongoose from 'mongoose';
 const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/GSC", {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Database Connected");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1); // Exit the process if DB connection fails
    }
};
export default connectDB
