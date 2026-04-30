require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const todoRouter = require("./routers/todos");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/todo-backend";
const CORS_ORIGIN = process.env.CORS_ORIGIN;

const allowedOrigins = CORS_ORIGIN
  ? CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : [];

const corsOptions = {
  origin(origin, callback) {
    // origin is undefined for non-browser clients (curl/postman)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Todo backend server is running");
});

app.use("/todos", todoRouter);

async function startServer() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("연결 성공");

    app.listen(PORT, () => {
      console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    });
  } catch (error) {
    console.error("MongoDB 연결 실패:", error.message);
    process.exit(1);
  }
}

startServer();
