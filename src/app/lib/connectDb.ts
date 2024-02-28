import mongoose from "mongoose";

let isConnected = false; // track the connection

const connectDb = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      dbName:
        process.env.NODE_ENV === "production" ? "jwCentrs" : "test-jwCentrs",
    });

    isConnected = true;

    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
