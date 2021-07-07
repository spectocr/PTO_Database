const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: 'root',
      // Your MySQL password
      password: 'password',
      database: 'Employee_Tracker'
    },
    console.log('Connected to the Employee_Tracker database.')
  );

  module.exports = db;