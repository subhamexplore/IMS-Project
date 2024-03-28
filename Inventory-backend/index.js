// index.js
const app = require("./app");

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
