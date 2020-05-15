fetch("http://www.omdbapi.com/?apikey=" + config.apiKey + "&s=friends").then(function(response) {
  if(response.ok) {
    return response.json();
  } else {
		return Promise.reject(response);
	}
}).then(function(data) {
  console.log(data)
})