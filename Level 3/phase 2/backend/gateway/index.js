import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res
    .status(200)
    .json({ message: `Hi from Gateway ${process.env.GATEWAY_NAME}` });
});

app.use("/auth", proxy("http://auth-service:8001"));
app.use("/order", proxy("http://order-service:8002"));
app.use("/products", proxy("http://products-service:8003"));

app.listen(port, () => {
  console.log(`Runing on ${port}`);
});
