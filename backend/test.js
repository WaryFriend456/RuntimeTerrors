// Test GetArticles function

const GetArticles = require("./GetArticles");
GetArticles("nvidia")
  .then(articles => console.log(articles))
  .catch(error => console.error(error));