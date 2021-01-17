const mongoose = require("mongoose");

const startDBConnection = async () => {
  try {
    //connect to the db
    mongoose.connect(process.env.DB, {
       useUnifiedTopology: true,
       useNewUrlParser: true,
       useFindAndModify: false
    });

    const connection = mongoose.connection;

    connection.once("open", function() {
      console.log("Connection to MongoDB database was started successfully!");
    });

  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = startDBConnection;
