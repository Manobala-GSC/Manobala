import mongoose from 'mongoose';
import User from '../models/usermodel.js';
import dotenv from 'dotenv';

dotenv.config();

const makeAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb+srv://jack:jack@cluster0.xjckq.mongodb.net/GSC", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to MongoDB");

    // Get email from command line arguments
    const email = process.argv[2];
    
    if (!email) {
      console.error("Please provide an email address");
      process.exit(1);
    }

    // Find user and update role
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error("User not found");
      process.exit(1);
    }

    user.role = 'admin';
    await user.save();
    
    console.log(`Successfully made ${email} an admin`);
    process.exit(0);

  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

makeAdmin(); 