const Admin = require('./models/admin.model');
const bcrypt = require('bcrypt');

// Seed admin account
async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'tarunkumar140802@gmail.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin account already exists!');
      return;
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash('lalit2023', 10);
    
    const admin = await Admin.create({
      fullname: {
        firstname: 'Tarun',
        lastname: 'Kumar',
      },
      email: 'tarunkumar140802@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin account created successfully!');
    console.log('📧 Email: tarunkumar140802@gmail.com');
    console.log('🔑 Password: lalit2023');
    console.log('👤 Name: Tarun Kumar');
    
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
  }
}

module.exports = seedAdmin;
