document.getElementById("searchQueryForm").addEventListener("submit", function(e){
  // stops the page reload
  e.preventDefault();
  // Stores the API key in a hidden file and gets it out
  let apiKey = config.apiKey
  // Will eventually store the search query from the user
  let searchQuery = document.getElementById("searchQueryBox").value
  console.log(searchQuery)
  // Fetches the api data from omdb and adds the api key and search query to the query string
  // then will check the response of the data
  fetch("http://www.omdbapi.com/?apikey=" + apiKey + "&s=" + searchQuery).then(function(response) {
    if(response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
    // if all goes well, the data will then be used
  }).then(function(data) {
    // Store the specific search data in a variable called searchResults
    let searchResults
    if(data.Search === undefined) {
      // shows an error message if we couldnt collect data from the API
      searchResults = [{Title: "Sorry we could'nt complete your request: " + data.Error}]
    } else {
      searchResults = data.Search
    }
    document.getElementById("app").innerHTML = "";
    // iterate through the results 
    for(let i = 0; i < searchResults.length; i++) {
      // create a new div for each result
      let div = document.createElement("div");
      // add the result into a text node and store it in a variable
      let result = document.createTextNode(searchResults[i].Title);
      // add that text node to the div element you created
      div.appendChild(result);
      // find the main div with id app and store it in a variable
      let app = document.getElementById('app')
      // append the div with the search result into the main app element
      app.appendChild(div);
    }
  }).catch(function(error) {
    console.warn("Something went wrong", error);
  })

})