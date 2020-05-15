

fetch("http://www.omdbapi.com/?apikey=" + config.apiKey + "&s=friends").then(function(response) {
  if(response.ok) {
    return response.json();
  } else {
		return Promise.reject(response);
	}
}).then(function(data) {
  let searchResults = data.Search
  for(let i = 0; i < searchResults.length; i++) {
    let div = document.createElement("div");
    let result = document.createTextNode(searchResults[i].Title);
    div.appendChild(result);
    document.getElementById('app').appendChild(result);
  }
}).catch(function(error) {
  console.warn("Something went wrong", error);
})