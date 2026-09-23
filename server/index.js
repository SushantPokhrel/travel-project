require("dotenv").config({ path: ".env.development" });
const http = require("http")
const app = require("./src/app.js");
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
