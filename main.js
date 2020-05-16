let apiKey = config.apiKey
let searchQuery
let pageNumber = 1

document.getElementById("searchQueryForm").addEventListener("submit", function(e){
  // stops the page reload
  e.preventDefault();
  // Stores the API key in a hidden file and gets it out
  // Will eventually store the search query from the user
  searchQuery = document.getElementById("searchQueryBox").value
  // substitue white spaces with plus signs for the query string
  searchQuery.replace(" ", "+")
  console.log(searchQuery)
  // Fetches the api data from omdb and adds the api key and search query to the query string
  // then will check the response of the data
  fetchData(apiKey, searchQuery, pageNumber)  
})

function changePage() {
  pageNumber = this.value
  fetchData(apiKey, searchQuery, pageNumber)
}

function fetchData(apiKey, searchQuery, pageNumber) {
  fetch("http://www.omdbapi.com/?apikey=" + apiKey + "&s=" + searchQuery + "&page=" + pageNumber ).then(function(response) {
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
      // create a img tag for the movie poster
      let moviePoster = document.createElement('img')
      // add the link to the src attribute in image tag
      moviePoster.setAttribute('src', searchResults[i].Poster)
      // add the result into a text node and store it in a variable
      let title = document.createTextNode(searchResults[i].Title);
      // add that text node to the div element you created
      div.appendChild(title);
      div.appendChild(moviePoster);
      // find the main div with id app and store it in a variable
      let app = document.getElementById('app')
      // append the div with the search result into the main app element
      app.appendChild(div);
    }
    // calculate how many pages of results will be shown, by diving total results by 10 (ten results per page)
    let numberOfPages = Math.floor(parseInt(data.totalResults) / 10)
    // Sanity check on the number
    console.log(numberOfPages);
    // create a button for each page
    for(let i = 0; i < numberOfPages; i++) {
      // create the button element
      let pageButton = document.createElement("button");
      // create the page number
      let pageNumber = document.createTextNode(i + 1);
      // append the page number onto the button
      pageButton.appendChild(pageNumber);
      // Set an id to the element for easy styling and to locate the next set of results.
      pageButton.setAttribute("id", "pageNumber")
      // set the value to the button content 
      pageButton.setAttribute("value", i + 1)
      // added an event listener to the button, calls the function to change the page
      pageButton.addEventListener("click", changePage)
      // get the DOM app
      let app = document.getElementById('app');
      // append the button onto the application.
      app.appendChild(pageButton);
    }
  }).catch(function(error) {
    console.warn("Something went wrong", error);
  })
}