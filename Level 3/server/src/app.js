import express from "express";

const app = express();

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: `Assalam O Alaikum form Docker ${process.env.SERVER}` });
});

export default app;
