import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path"

import userRoute from "./routes/user.route.js";
import gigRoute from "./routes/gig.route.js";
import orderRoute from "./routes/order.route.js";
import conversationRoute from "./routes/conversation.route.js";
import messageRoute from "./routes/message.route.js";
import reviewRoute from "./routes/review.route.js";
import authRoute from "./routes/auth.route.js";

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

app.use(express.static(path.join(__dirname, "./client/dist")));
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "./client/dist/index.html"));
});

const PORT = 8080 || process.env.PORT;

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Mongo connected successfully")
    } catch (error) {
        console.log(error)
    }
}
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/gigs", gigRoute);
app.use("/api/orders", orderRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/reviews", reviewRoute);
app.use("/api/messages", messageRoute);
app.use("/api/auth", authRoute)

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";

    return res.status(errorStatus).send(errorMessage);
});

app.listen(PORT, () => {
    connect();
    console.log("backend server is working ")
})