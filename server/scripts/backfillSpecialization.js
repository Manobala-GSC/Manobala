import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/usermodel.js';
import ExpertApplication from '../models/expertApplicationModel.js';

dotenv.config();

async function backfillSpecialization() {
  try {
    console.log('Connecting to database...');
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10
    });
    
    console.log('✅ Database connected successfully!');
    console.log('Backfilling specialization for existing experts...\n');

    // Find all approved expert applications
    const approvedApplications = await ExpertApplication.find({ status: 'approved' });
    console.log(`Found ${approvedApplications.length} approved expert application(s)\n`);

    let updated = 0;
    let skipped = 0;

    for (const app of approvedApplications) {
      const user = await User.findById(app.userId);
      
      if (!user) {
        console.log(`⚠️  User not found for application: ${app.fullName} (${app.email})`);
        skipped++;
        continue;
      }

      if (user.specialization && user.specialization.trim() !== '') {
        console.log(`⏭️  ${user.name} already has specialization: "${user.specialization}"`);
        skipped++;
        continue;
      }

      user.specialization = app.specialization;
      await user.save();
      console.log(`✅ Updated ${user.name}: specialization = "${app.specialization}"`);
      updated++;
    }

    // Also check for experts without an application (manual experts)
    const expertsWithoutSpecialization = await User.find({ 
      isExpert: true, 
      $or: [
        { specialization: { $exists: false } },
        { specialization: '' },
        { specialization: null }
      ]
    });

    if (expertsWithoutSpecialization.length > 0) {
      console.log(`\n⚠️  ${expertsWithoutSpecialization.length} expert(s) still have no specialization (no approved application found):`);
      for (const expert of expertsWithoutSpecialization) {
        console.log(`   - ${expert.name} (${expert.email})`);
      }
      console.log('\nThese experts may need their specialization set manually.');
    }

    console.log(`\n📊 Summary: ${updated} updated, ${skipped} skipped`);
    console.log('✅ Backfill complete!');
    
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error during backfill:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

backfillSpecialization();
