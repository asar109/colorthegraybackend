const app = require("./app");



app.get("/", (req, res) => {
  res.send("API is working properly");
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
