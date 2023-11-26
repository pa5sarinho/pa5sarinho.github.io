const SKY = 492;
const RT = 386;

function saveAsCaught(game, number) {
	let key = game + "_" + number; // (e.g. "0_112")
	localStorage.setItem(key, true); // saves pokemon as caught in local storage
}

function cancelCaught(game, number) {
	let key = game + "_" + number;
	localStorage.removeItem(key);
}

function isCaught(game, number) {
	let key = game + "_" + number;
	return localStorage.getItem(key) !== null;
}

// loading the pokemon data json
fetch('http://localhost:8000/PMD_data.json')
  .then(response => response.json())
  .then(data => {
    let pokemon = data;

    const pokeWrapper = document.getElementById('poke-wrapper');
    let mode = 0; // 0: rescue team   1: explorers of sky

    // anything that's in the wrapper is deleted first, then it loads the portraits
    function showImgs(indexLimit){
    	while (pokeWrapper.firstChild) pokeWrapper.firstChild.remove();
    	const photoDiv = document.createElement('div');
    	photoDiv.classList.add('portrait');
		mode = (indexLimit == SKY) ? 1 : 0;

    	for (let i = 0; i < indexLimit; i++)
    	{
    		const pic = document.createElement('img');
    		pic.src = 'pics/'+(i+1)+'.png';
    		pic.id = (i+1).toString();
    		
    		// floating box
    		pic.addEventListener("mouseover", (event) => {
    			const infoBox = document.createElement('div');
    			infoBox.className = "infobox";
    			
    			const name = document.createElement('h3');
    			name.textContent = pokemon[pic.id].name;
    			infoBox.appendChild(name);
    
    			const location = document.createElement('p');
    			const rate = document.createElement('p');
    			
    			if (mode == 0) { // if rescue team
    				location.textContent = "Location: "+pokemon[pic.id].rt_location;
    				rate.textContent = "Recruit rate: "+pokemon[pic.id].rt_rate;
    				
    				const friendArea = document.createElement('p');
    				friendArea.textContent = "Friend Area: "+pokemon[pic.id].friend_area;
    				infoBox.appendChild(friendArea);
    			}
    			else {
    				rate.textContent = "Recruit Rate: "+pokemon[pic.id].sky_rate;
    				location.textContent = "Location: "+pokemon[pic.id].sky_location;
    			}
    			
    			infoBox.appendChild(location);
    			infoBox.appendChild(rate);
    			
    			// making it so it works properly even if I scroll down the page
    			let imgRect = pic.getBoundingClientRect();
    			let scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    			let scrollY = window.pageYOffset || document.documentElement.scrollTop;
    			let posX = imgRect.left + scrollX + imgRect.width + 10;
    			let posY = imgRect.top + scrollY + 10;
    
    			infoBox.style.left = posX + "px";
    			infoBox.style.top = posY + "px";
    
    			document.body.appendChild(infoBox);
    		})
    		
    		// removes the floating box
    		pic.addEventListener("mouseout", (event) => {
    			const infoBox = document.querySelector(".infobox");
    			if (infoBox) {
    				infoBox.remove();
    			}
    		})
    		
			// marks pokemon as recruited
			pic.addEventListener("click", (event) => {
				if (isCaught(mode, pic.id)) {
					cancelCaught(mode, pic.id);
					pic.style.opacity = 0.4;
				}
				else {
					saveAsCaught(mode, pic.id);
					pic.style.opacity = 1;
				}
			});

			pic.style.opacity = isCaught(mode, pic.id) ? 1 : 0.4;
    		photoDiv.appendChild(pic);
    	}

    	pokeWrapper.appendChild(photoDiv);
    }
    
    document.getElementById('explorers-button').addEventListener('click', function(){
    	showImgs(SKY);
    });
    document.getElementById('rescue-team-button').addEventListener('click', function(){
    	showImgs(RT);
    });
  })
  .catch(error => {
    console.error(error);
  });

const images = document.querySelectorAll("#poke-wrapper img");

