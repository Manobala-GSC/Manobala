import mongoose from 'mongoose';
 const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://jack:jack@cluster0.xjckq.mongodb.net/GSC", {
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
