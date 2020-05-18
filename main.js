let apiKey = config.apiKey
let searchQuery
let pageNumber = 1
let searchResults

function fetchData(apiKey, searchQuery, pageNumber) {
  fetch("http://www.omdbapi.com/?apikey=" + apiKey + "&s=" + searchQuery + "&page=" + pageNumber ).then(function(response) {
    if(response.ok) {
      return response.json();
    } else {
      return Promise.reject(response);
    } // if all goes well, the data will then be used
  }).then(function(data) {
    if(data.Search === undefined) {
      // shows an error message if we couldnt collect data from the API
      searchResults = [{Title: "Sorry we could'nt complete your request: " + data.Error}]
    } else {
      searchResults = data.Search
    }
    document.getElementById("app").innerHTML = "";
    let resultsDiv = document.createElement('div') // create a div to store all of the results in
    resultsDiv.id = "results"
    for(let i = 0; i < searchResults.length; i++) { // iterate through the results 
      let div = document.createElement("div"); // create a new div for each result
      div.id = "movieCard" 
      let p = document.createElement('p') //create a p element for the title
      let moviePoster = document.createElement('img') // create a img tag for the movie poster
      let movieLink = document.createElement('a') // create an a tag for the movie title
      if(searchResults[i].Poster === "N/A") {
        moviePoster.setAttribute('src', 'https://www.theprintworks.com/wp-content/themes/psBella/assets/img/film-poster-placeholder.png')
      } else {
        moviePoster.setAttribute('src', searchResults[i].Poster) // add the link to the src attribute in image tag
      }
      let title = document.createTextNode(searchResults[i].Title); // add the result into a text node and store it in a variable
      p.appendChild(title) // add that text node to the div element you created
      movieLink.id = "movieLink" // added an id to the title so we can use event listeners later
      movieLink.href = "#" + searchResults[i].imdbID // using fragment identifier to stick to single page app and for navigation purposes.
      movieLink.appendChild(div)
      div.appendChild(moviePoster)
      div.appendChild(p)
      resultsDiv.appendChild(movieLink); // append the div with the search result into the main app element
    }
    app.appendChild(resultsDiv)
    let numberOfPages = Math.floor(parseInt(data.totalResults) / 10)
    let pageNavigationBar = document.createElement('div') 
    pageNavigationBar.id = "pageNavBar"
    for(let i = 0; i < numberOfPages; i++) { // create a button for each page
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
  e.preventDefault(); // stops the page reload
  pageNumber = 1
  searchQuery = document.getElementById("searchQueryBox").value // Will eventually store the search query from the user
  location.hash = "#" + pageNumber + '+' + searchQuery
  searchQuery.replace(" ", "+") // substitue white spaces with plus signs for the query string
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
    } // if all goes well, the data will then be used
  }).then(function(data) {
    document.getElementById("app").innerHTML = ""; // clear the DOM
    let div = document.createElement("div"); // div for result
    div.id = 'moviePageDiv' // set attribute
    let posterInfoDiv = document.createElement("div")
    posterInfoDiv.id = "posterInfoDiv"
    let movieInfo = document.createElement("div"); // all info about the movie will go into this paragraph
    movieInfo.id = 'movieInfoDiv' // give this an id
    let moviePosterContainer = document.createElement('div')
    moviePosterContainer.id = 'moviePosterContainer'
    let moviePoster = document.createElement('img')  // create a img tag for the movie poster
    let movieTitle = document.createElement('h1') // create an a tag for the movie title
    if(data.Poster === "N/A") {
      moviePoster.setAttribute('src', 'https://www.theprintworks.com/wp-content/themes/psBella/assets/img/film-poster-placeholder.png')
    } else {
      moviePoster.setAttribute('src', data.Poster)
    }
    let title = document.createTextNode("Title: " + data.Title);
    let informationArray = []
    informationArray.push(document.createTextNode("Title: " + data.Title));
    informationArray.push(document.createTextNode("Year Released: " + data.Released));
    informationArray.push(document.createTextNode("Awards: " + data.Awards));
    informationArray.push(document.createTextNode("Actors: " + data.Actors));
    informationArray.push(document.createTextNode("Director: " + data.Director));
    informationArray.push(document.createTextNode("Total Runtime: " + data.Runtime));
    informationArray.push(document.createTextNode("Plot: " + data.Plot));
    informationArray.push(document.createTextNode("Rating: " + data.Rated));
    informationArray.push(document.createTextNode("Box Office: " + data.BoxOffice));
    informationArray.push(document.createTextNode("Production: " + data.Production));
    informationArray.push(document.createTextNode("IMDB Rating: " + data.imdbRating));
    informationArray.push(document.createTextNode("Genre: " + data.Genre));
    for(let i = 0; i < informationArray.length; i++) {
      let p = document.createElement('p')
      p.appendChild(informationArray[i])
      movieInfo.appendChild(p)
    }
    // add that text node to the div element you created
    movieTitle.appendChild(title)
    // added an id to the title so we can use event listeners later
    movieTitle.id = "movieTitle"
    moviePoster.id = 'moviePoster'
    // using fragment identifier to stick to single page app and for navigation purposes.
    div.appendChild(movieTitle);
    moviePosterContainer.appendChild(moviePoster)
    posterInfoDiv.appendChild(moviePosterContainer);
    posterInfoDiv.appendChild(movieInfo)
    div.appendChild(posterInfoDiv)
    // find the main div with id app and store it in a variable
    let app = document.getElementById('app')
    // append the div with the search result into the main app element
    app.appendChild(div);
  }).catch(function(error) {
    console.warn("Something went wrong", error);
  })
}

function changePage() {
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

loadContent()