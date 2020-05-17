let apiKey = config.apiKey
let searchQuery
let pageNumber = 1

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
      div.id = "movieCard"
      //create a p element for the title
      let p = document.createElement('p')
      // create a img tag for the movie poster
      let moviePoster = document.createElement('img')
      // create an a tag for the movie title
      let movieTitle = document.createElement('a')
      // add the link to the src attribute in image tag
      moviePoster.setAttribute('src', searchResults[i].Poster)
      // add the result into a text node and store it in a variable
      let title = document.createTextNode(searchResults[i].Title);
      // add that text node to the div element you created
      movieTitle.appendChild(title)
      // added an id to the title so we can use event listeners later
      movieTitle.id = "movieTitle"
      // using fragment identifier to stick to single page app and for navigation purposes.
      movieTitle.href = "#" + searchResults[i].imdbID
      p.appendChild(movieTitle)
      div.appendChild(p);
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
    let pageNavigationBar = document.createElement('div')
    pageNavigationBar.id = "pageNavBar"
    for(let i = 0; i < numberOfPages; i++) {
      // create the link element
      let pageLink = document.createElement("a");
      // create the page number
      let pageNumber = document.createTextNode(i + 1);
      // append the page number onto the button
      pageLink.appendChild(pageNumber);
      // Set an id to the element for easy styling and to locate the next set of results.
      pageLink.setAttribute("id", "pageNumber")
      // set the value to the button content 
      pageLink.href = "#" + (i + 1) + '+' + searchQuery
      // append the button onto the application.
      pageNavigationBar.appendChild(pageLink);
    }
    app.appendChild(pageNavigationBar)
  }).catch(function(error) {
    console.warn("Something went wrong", error);
  })
}

document.getElementById("searchQueryForm").addEventListener("submit", function(e){
  // stops the page reload
  e.preventDefault();
  pageNumber = 1
  // Stores the API key in a hidden file and gets it out
  // Will eventually store the search query from the user
  searchQuery = document.getElementById("searchQueryBox").value
  // changes the location.hash 
  location.hash = "#" + pageNumber + '+' + searchQuery
  // substitue white spaces with plus signs for the query string
  searchQuery.replace(" ", "+")
  console.log(searchQuery)
  // Fetches the api data from omdb and adds the api key and search query to the query string
  // then will check the response of the data
  fetchData(apiKey, searchQuery, pageNumber)  
})

function loadMoviePage() {
  imdbID = location.hash.substr(1)
  fetch("http://www.omdbapi.com/?apikey=" + apiKey + "&i=" + imdbID).then(function(response) {
    if(response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    }
    // if all goes well, the data will then be used
  }).then(function(data) {
    console.log(data)
    document.getElementById("app").innerHTML = "";
    // create a new div for each result
    let div = document.createElement("div");
    //create a p element for the title
    let p = document.createElement('p')
    // create a img tag for the movie poster
    let moviePoster = document.createElement('img')
    // create an a tag for the movie title
    let movieTitle = document.createElement('h1')
    // add the link to the src attribute in image tag
    moviePoster.setAttribute('src', data.Poster)
    // add the result into a text node and store it in a variable
    let title = document.createTextNode(data.Title);
    // add that text node to the div element you created
    movieTitle.appendChild(title)
    // added an id to the title so we can use event listeners later
    movieTitle.id = "movieTitle"
    // using fragment identifier to stick to single page app and for navigation purposes.
    p.appendChild(movieTitle)
    div.appendChild(p);
    div.appendChild(moviePoster);
    // find the main div with id app and store it in a variable
    let app = document.getElementById('app')
    // append the div with the search result into the main app element
    app.appendChild(div);
  }).catch(function(error) {
    console.warn("Something went wrong", error);
  })
}

function changePage() {
  // location.hash = "#" + this.value
  locationHashInfo = location.hash.substr(1).split("+")
  pageNumber = locationHashInfo[0]
  searchQuery = locationHashInfo[1]
  fetchData(apiKey, searchQuery, pageNumber)
}

window.addEventListener("hashchange", loadContent)

function loadContent() {
  if (location.hash.substr(1)[0] === 't') {
    loadMoviePage()
  } else {
    changePage()
  }
}