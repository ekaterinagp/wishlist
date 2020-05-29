const fetch = require("node-fetch");

fetch(
  "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/spelling/AutoComplete?text=door",
  {
    method: "GET",
    headers: {
      "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
      "x-rapidapi-key": "9a526725bdmshcdf8c99a3fa301bp18eba0jsna12b400558cb",
    },
  }
)
  .then((response) => {
    console.log(response);
  })
  .catch((err) => {
    console.log(err);
  });
