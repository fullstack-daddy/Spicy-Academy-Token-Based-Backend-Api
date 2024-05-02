import express from 'express';

const app = express();

app.disable("x-powered-by");

// get method home route with the handler

app.get("/", (req, res) => {
  try {
    res.status(200).json({
        status: "success",
        data: [],
        message: "Welcome to the home route"
    })
  } catch (error) {
    res.status(500).json({
        status: "error",
        message: "Internal Server Error"
    })
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

export default app