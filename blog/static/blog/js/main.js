
const url = window.location.search;
const urlParams = new URLSearchParams(url);

function getEntry() {
  fetch(`api/v1/entry/published?id=${urlParams.get("id")}`, {
    method: 'GET',
  })
  .then(response => {
    if (response.ok) 
      return response.json();
    return Promise.reject(response); 
  })
  .then(json => {
    document.getElementById("entry-date").innerHTML = new Date(json.data.date_created).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    document.getElementById("entry-thumbnail").src = json.data.thumbnail_url
    document.getElementById("entry-title").innerHTML = json.data.title
    document.getElementById("entry-content").innerHTML = json.data.content;
    document.getElementById("author").innerHTML =  `Written by ${json.data.author}`;
  })
  .catch(error => {
    alert(error.message);
  });

}