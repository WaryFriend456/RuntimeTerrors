// Test GetArticles function

const GetArticles = require("./GetArticles");
GetArticles("technology")
  .then(articles => console.log(articles))
  .catch(error => console.error(error));