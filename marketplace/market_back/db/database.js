// const mongoose = require('mongoose')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const URI = process.env.MONGO_URI

const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const connect = async () => {
  try {
    await client.connect();
    console.log("base de datos conectada");
  } catch (error) {
    console.log("base de datos no conectada");
  }
};

connect();
module.exports = client;

// const connect = async () => {
//   try {
//     await mongoose.connect(URI);
//     console.log("base de datos conectada");
//   } catch (error) {
//     console.log("base de datos no conectada");
//   }
// };
// module.exports = connect;


// mongoose.connect(URI).then(() => {
//       console.log('base de datos conectada');
//     }).catch (error => {
//       console.error('base de datos no conectada');
//     });