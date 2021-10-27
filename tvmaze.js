/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let allShowsData = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
  allShowsData = allShowsData.data;
  let shows = [];
  for(i=0;i<allShowsData.length;i++) {
    const image = allShowsData[i].show.image ? allShowsData[i].show.image.original : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNrOeDds-UV205mFvsybARdi_eoTSdHHmduw&usqp=CAU'
      shows.push({id:allShowsData[i].show.id,
                  name:allShowsData[i].show.name,
                  summary:allShowsData[i].show.summary,
                  image
                  });
    
    
  };
  return shows;
};



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button id="${show.id}" class="episode-button">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {

  //acceses api to get 
  let allEpisodesData = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  allEpisodesData = allEpisodesData.data;
  let episodes = [];
  for(i=0;i<allEpisodesData.length;i++) {
      episodes.push({id:allEpisodesData[i].id,
                  name:allEpisodesData[i].name,
                  season:allEpisodesData[i].season,
                  number:allEpisodesData[i].number,
                  
                  });
    
    
  };
  return episodes;
}



//event handler for episode button clicking
$("#shows-list").on("click",".episode-button", async function handleClick (e) {
  
  //gets show id from cleverly assigned button id
  let id = e.target.id;

  //defines array used in populate episodes as the value returned by the function communicating with the api
  let episodes = await getEpisodes(id);

  //calls function to put the episode info in the DOM and reveal on page
  populateEpisodes(episodes)


});



function populateEpisodes(episodes) {

  //selects area we are appending
  const $episodesList = $("#episodes-list");
  //makes sure there is nothing there
  $episodesList.empty();

  //builds string to append to dom
  let $item = ""
  for (let episode of episodes) {
    $item = $item + `<li>${episode.name}:S${episode.season}E${episode.number}</li>`
  }

  //appends li's into ul
  $episodesList.append($item);

  //reveals hidden area
  $('#episodes-area').attr('style','display: block')
}