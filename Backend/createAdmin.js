// Create Admin Account
const axios = require('axios');

async function createAdmin() {
  try {
    const response = await axios.post('http://localhost:3000/admin/register', {
      fullname: {
        firstname: 'Tarun',
        lastname: 'Kumar'
      },
      email: 'tarunkumar140802@gmail.com',
      password: 'lalit2023',
      role: 'admin'
    });

    console.log('Admin created successfully!');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

createAdmin();
