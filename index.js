const setupTextarea = document.getElementById('setup-textarea');
const setuploading = document.getElementById('loading-container');
const setupInputContainer = document.getElementById('setup-input-container');
const movieBossText = document.getElementById('movie-boss-text');
const OPENAI_API_KEY0 = process.OPENAI_API_KEY1;
const OPENAI_API_KEY1 = process.OPENAI_API_KEY2;
const OPENAI_API_KEY2 = process.OPENAI_API_KEY3;
const OPENAI_API_KEY3 = process.OPENAI_API_KEY4;
const OPENAI_API_KEY4 = process.OPENAI_API_KEY5;

const url = "https://api.openai.com/v1/completions";
const url1 = 'https://api.openai.com/v1/images/generations'

$(window).on('load', function() {
  $("#loading-container").css('display', 'block');
});

document.getElementById("send-btn").addEventListener("click", () => {
  debugger;
  var userInput = $("#setup-textarea").val();
  $("#loading-container").css('display', 'none');
  movieBossText.innerText = "Please stand by while I come up with an idea...";
  fetchBotReply(userInput);
});

async function fetchBotReply(userInput) {
  try {
    const response = await fetchAPI(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_API_KEY0
      },
      body: JSON.stringify({
        'model': 'text-davinci-003',
        'prompt': `Generate a short message to enthusiastically say that an outline sounds interesting and that you need some minutes to think about it.
        
    ###
    outline: Two dogs fall in love and move to Hawaii to learn to surf.
    message: I'll need to think about that. But your idea is amazing! I love the bit about Hawaii!
    ###
    outline: A plane crashes in the jungle and the passengers have to walk 1000km to safety.
    message: I'll spend a few moments considering that. But I love your idea!! A disaster movie in the jungle!
    ###
    outline: A group of corrupt lawyers try to send an innocent woman to jail.
    message: Wow, that is awesome! Corrupt lawyers, huh? Give me a few moments to think!
    ###
    outline: ${userInput}
    message: 
    `,
        'max_tokens': 100, // Replace with your desired value
        'temperature': 0.8 // Replace with your desired value
      })
    });

    const data = await response.json();
    console.log(data.choices[0].text);
    setTimeout(function() {
      $("#loading-container").css('display', 'block');
      movieBossText.innerText = data.choices[0].text;
      fetchSynopsis(userInput);
    }, 1000);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchSynopsis(outline) {
  try {
    const response = await fetchAPI(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_API_KEY1
      },
      body: JSON.stringify({
        'model': 'text-davinci-003',
        'prompt': `Suggest a novel and provide its synopsis based on the description given by the user. The novel should exist in the real world and should satisfy all the requirements specified by the user.
        ###
        outline: Hunt for the buried treasure while facing betrayals and mutinies.
        synopsis: "Treasure Island" is an adventure novel written by Robert Louis Stevenson, first published in 1883. The story follows young Jim Hawkins, who discovers a treasure map in the possession of the enigmatic Billy Bones, a weathered old sailor. The map leads to the legendary Treasure Island, said to hold immense riches buried by the infamous pirate Captain Flint.

        With the map in hand, Jim sets out on a perilous journey to find the hidden treasure. Along the way, he forms a crew that includes the one-legged and charismatic Long John Silver, who soon becomes the ship's cook. However, unbeknownst to Jim and the others, Long John Silver is a cunning and treacherous pirate planning to seize the treasure for himself.
        
        As the voyage progresses, tensions rise on the ship, and Jim becomes suspicious of Long John Silver's true motives. The crew faces numerous challenges, including mutinies, storms, and encounters with other pirates. The adventurous journey finally leads them to Treasure Island, a remote and dangerous location.
        
        Once ashore, Jim and a few loyal companions embark on a hunt for the buried treasure, navigating through booby traps and facing the threats posed by Long John Silver and his mutinous crew. The island becomes a battleground for greed and survival, with alliances shifting and betrayals becoming commonplace.
        
        In the thrilling climax, Jim and his allies engage in a fierce confrontation with the pirates, fighting for their lives and the elusive treasure. The story culminates in a dramatic and action-packed finale, revealing the ultimate fate of the treasure and the characters involved.
        ###
        outline: ${outline}
        synopsis: 
        `
        ,
        max_tokens: 700
      })
    });

    const data = await response.json();
    const synopsis = data.choices[0].text.trim();
    document.getElementById('output-text').innerText = synopsis;
    fetchTitle(synopsis);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchTitle(synopsis) {
  try {
    const response = await fetchAPI(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_API_KEY2
      },
      body: JSON.stringify({
        'model': 'text-davinci-003',
        'prompt': `Provide the title of this novel:\n\n${synopsis}`,
        'max_tokens': 25,
        'temperature': 0.7
      })
    });

    const data = await response.json();
    const title = data.choices[0].text.trim();
    document.getElementById('output-title').innerText = title;
    fetchImagePrompt(title, synopsis);
  } catch (error) {
    console.error("Error:", error);
  }
}


async function fetchImagePrompt(title, synopsis) {
  try {
    const response = await fetchAPI(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + OPENAI_API_KEY4
      },
      body: JSON.stringify({
        'model': 'text-davinci-003',
        'prompt': `Give a short description of an image that could be used to advertise a movie based on a title and synopsis. The description should be rich in visual detail but contain no names.
        ###
        title: Love's Time Warp
        synopsis: When scientist and time traveler Wendy (Emma Watson) is sent back to the 1920s to assassinate a future dictator, she never expected to fall in love with them. As Wendy infiltrates the dictator's inner circle, she soon finds herself torn between her mission and her growing feelings for the leader (Brie Larson). With the help of a mysterious stranger from the future (Josh Brolin), Wendy must decide whether to carry out her mission or follow her heart. But the choices she makes in the 1920s will have far-reaching consequences that reverberate through the ages.
        image description: A silhouetted figure stands in the shadows of a 1920s speakeasy, her face turned away from the camera. In the background, two people are dancing in the dim light, one wearing a flapper-style dress and the other wearing a dapper suit. A semi-transparent image of war is superimposed over the scene.
        ###
        title: zero Earth
        synopsis: When bodyguard Kob (Daniel Radcliffe) is recruited by the United Nations to save planet Earth from the sinister Simm (John Malkovich), an alien lord with a plan to take over the world, he reluctantly accepts the challenge. With the help of his loyal sidekick, a brave and resourceful hamster named Gizmo (Gaten Matarazzo), Kob embarks on a perilous mission to destroy Simm. Along the way, he discovers a newfound courage and strength as he battles Simm's merciless forces. With the fate of the world in his hands, Kob must find a way to defeat the alien lord and save the planet.
        image description: A tired and bloodied bodyguard and hamster standing atop a tall skyscraper, looking out over a vibrant cityscape, with a rainbow in the sky above them.
        ###
        title: ${title}
        synopsis: ${synopsis}
        image description: 
        `,
        temperature: 0.8,
        max_tokens: 100
      })
    });

    const data = await response.json();
    const imagePrompt = data.choices[0].text.trim();
    fetchImageUrl(imagePrompt);
   //movieBossText.innerText = imagePrompt;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchImageUrl(imagePrompt){
  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY0}`
    },
    body: JSON.stringify({
      prompt:`${imagePrompt}. There should be no text in this image.`,
      n: 1,
      size: '512x512',
      response_format: 'b64_json'
    })
  };
  fetch(url1, requestOptions)
  .then(response => response.json())
  .then(data => {
    //const imageData = data.data[0].b64_json;
    if (data.data && data.data.length > 0) {
      document.getElementById('output-img-container').innerHTML = `<img src="data:image/png;base64,${data.data[0].b64_json}">`;
    }
    setupInputContainer.innerHTML = `<button id="view-pitch-btn" class="view-pitch-btn">View Pitch</button>`
    document.getElementById('view-pitch-btn').addEventListener('click', ()=>{
    document.getElementById('setup-container').style.display = 'none'
    document.getElementById('output-container').style.display = 'flex'
    movieBossText.innerText = `This idea is so good I'm jealous! It's gonna make you rich for sure! Remember, I want 10% 💰`
  })
  })
}

// Helper function to handle fetch and rate limits
async function fetchAPI(url, options) {
  const response = await fetch(url, options);
  if (response.status === 429) {
    // Handle rate limit by waiting and retrying the request after a delay
    const retryAfter = parseInt(response.headers.get('Retry-After')) || 1;
    await sleep(retryAfter * 1000);
    return fetchAPI(url, options); // Retry the request
  }
  return response;
}

// Helper function to introduce delay using setTimeout
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

