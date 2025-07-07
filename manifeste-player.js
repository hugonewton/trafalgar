const audio = document.querySelector("#audioPlayer");
const player = new Plyr('#audioPlayer', {
    controls: ["play",'current-time', 'progress', 'duration',"mute", "volume", "fullscreen"],
    displayDuration: true,
    keyboard: {
        global: true,
    },
    tooltips: {
        controls: false,
        seek: false,
    },
});



var splashScreen = document.querySelector(".apple-lyrics-splashscreen");
var firstplayingbutton = document.querySelector(".firstPlay");
firstplayingbutton.addEventListener("click", function() {
    splashScreen.classList.add("hide");
    player.volume = 1;
   setTimeout(function(){  player.play(); }, 750);
   setTimeout(function(){  document.body.classList.add("playing-first"); }, 1250);
});


audio.addEventListener("playing", function() {
    if(!splashScreen.classList.contains("hide")){
    splashScreen.classList.add("hide");
    }
    if(!document.body.classList.contains("playing-first")){
        setTimeout(function(){  document.body.classList.add("playing-first"); }, 1250);
    }
}  );


audio.addEventListener("seeked", function() {
    player.play();
    if(!splashScreen.classList.contains("hide")){
    splashScreen.classList.add("hide");
    }
    if(!document.body.classList.contains("playing-first")){
        setTimeout(function(){  document.body.classList.add("playing-first"); }, 1250);
    }
});



navigator.mediaSession.metadata = new MediaMetadata({
    title: postTitle,
    artist: "Trafalgar",
    album: '',
    artwork: [
        { src: 'https://trafalgar.fr/wp-content/uploads/2023/11/artwork-96.jpg', sizes: '96x96', type: 'image/jpg' },
        { src: 'https://trafalgar.fr/wp-content/uploads/2023/11/artwork-128.jpg', sizes: '128x128', type: 'image/jpg' },
        { src: 'https://trafalgar.fr/wp-content/uploads/2023/11/artwork-192.jpg', sizes: '192x192', type: 'image/jpg' },
        { src: 'https://trafalgar.fr/wp-content/uploads/2023/11/artwork-256.jpg', sizes: '256x256', type: 'image/jpg' },
        { src: 'https://trafalgar.fr/wp-content/uploads/2023/11/artwork.jpg', sizes: '512x512', type: 'image/jpg'},

    ]
});



function parseTranscription(subtitleBlocks) {
    
        const subtitles = subtitleBlocks.map((block) => {
        // Split the block into its individual lines
        //get start time
        var timeStamp = block.horodatage.split(" --> ");
        var startTime = timeStamp[0].replace("[", "");
        var startTimeInSeconds = startTime.split(":");
        var startTimeInSec = parseFloat(startTimeInSeconds[0]) * 60 + parseFloat(startTimeInSeconds[1]);
        var endTime = timeStamp[1].replace("]", "");
        var endTimeInSeconds = endTime.split(":");
        var endTimeInSec = parseFloat(endTimeInSeconds[0]) * 60 + parseFloat(endTimeInSeconds[1]);
        return {
            start: startTimeInSec,
            end: endTimeInSec,
            text: block.texte_de_la_ligne,
            backdrop: block.image_de_fond
        };
    });
    return subtitles;
}

        


var subtitleScroller = document.querySelector(".apple-lyrics-content");   
var subtitleContainer = document.querySelector(".apple-lyrics-content .lyrics-content");   


var subtitles = parseTranscription(transcriptionDuTexte);


// Create the subtitle elements
for (let i = 0; i < subtitles.length; i++) {
    const subtitle = subtitles[i];
    const subtitleElement = document.createElement("p");
    subtitleElement.classList.add("subtitle");
    subtitleElement.dataset.start = subtitle.start;
    subtitleElement.dataset.end = subtitle.end;
    subtitleElement.innerHTML = subtitle.text;
    subtitleElement.addEventListener("click", function() {
        player.currentTime = subtitle.start;
       player.play();
       player.volume = 1;
    });
    subtitleContainer.appendChild(subtitleElement);

}


// get the size of bottom nav 
var bottomNav = document.querySelector(".bottom-nav");
var bottomNavHeight = bottomNav.offsetHeight;
document.addEventListener("DOMContentLoaded", function() {
    document.documentElement.style.setProperty('--bottom-nav-height', bottomNavHeight+"px");
});
// check the size on the resize event and put it in a css variable
window.addEventListener("resize", function(){
    // check if the bottom nav height has changed
    var newBottomNavHeight = bottomNav.offsetHeight;
    if(newBottomNavHeight != bottomNavHeight){
        bottomNavHeight = newBottomNavHeight;
        document.documentElement.style.setProperty('--bottom-nav-height', bottomNavHeight+"px");
    }
}
);





function getCurrentSubtitleIndex(subtitles, time) {
    // Find the index of the subtitle that contains the specified time
    
     const indexFound = subtitles.findIndex((subtitle) => subtitle.start <= time && subtitle.end > time);

     if (indexFound === -1) {
        return -1;
     } else {
        return indexFound;
     }
}


var lastIndex=1;
let currentSubtitleIndex = -1;


const backdrop = document.querySelector(".backdrop");
audio.addEventListener("timeupdate", function(e) {
    
    // Get the current subtitle index
    const newSubtitleIndex = getCurrentSubtitleIndex(subtitles, player.currentTime);

    if (newSubtitleIndex !== currentSubtitleIndex) {
        // Remove the "active" class from the previous subtitle element
        if (currentSubtitleIndex >= 0) {
            subtitleContainer.children[currentSubtitleIndex].classList.remove("active");
        }

        if(newSubtitleIndex != -1){

        
        currentSubtitleIndex = newSubtitleIndex;
        
        const currentSubtitle = subtitles[currentSubtitleIndex];
        

        // backdrop image if subtitle has any
        if(currentSubtitle.backdrop != ""){
            //remove the previous backdrop image with a timeout if it exists
            if(backdrop.children.length > 0){
                var backdropFirst = backdrop.firstChild;
                
                //remove the backdrop image after 1 second
                setTimeout(function(){ backdrop.removeChild(backdropFirst); }, 1500);
            }

            // create a img element with src of the backdrop
            const backdropImage = document.createElement("img");
            backdropImage.classList.add("backdrop-image");
            backdropImage.src = currentSubtitle.backdrop["url"];
            backdrop.insertAdjacentElement("afterbegin",backdropImage);
        }

        // Apply the "active" class to the current subtitle element and remove it from the others
        subtitleContainer.children[newSubtitleIndex].classList.add("active");
        var numberOfPixelOfTheChildren = (subtitleContainer.children[newSubtitleIndex].clientHeight)*0.5;
        
        // var calculatedScrollTop = subtitleContainer.children[newSubtitleIndex].offsetTop - subtitleContainer.offsetTop + numberOfPixelOfTheChildren;
        const target = subtitleContainer.children[newSubtitleIndex];
const targetTop = target.getBoundingClientRect().top + window.scrollY;
const centerOffset = (window.innerHeight / 2) - (target.clientHeight / 2);
const calculatedScrollTop = targetTop - centerOffset;

        // subtitleScroller.scrollTo({
        //     top: calculatedScrollTop,
        //     behavior: "smooth"
        //   });
        lenis.scrollTo(calculatedScrollTop, {
            offset: 0,
            immediate: false,
            duration: 1.2,            
          });
          
        }
}
  
});
const endsection = document.querySelector(".endSection");

//scroll to the end of the text at the end of the audio
audio.addEventListener("ended", function() {
    splashScreen.classList.remove("hide");
});

document.querySelector(".rewind").addEventListener("click", rewindToTheStart);

function rewindToTheStart(){
    splashScreen.classList.add("hide");
    setTimeout(function(){  
        player.seek = 0;
        player.play(); }, 750);
   
}

   
// const darkModeButton = document.querySelector(".lune");
// darkModeButton.addEventListener("click", () => {
//     document.body.classList.toggle("dark-mode");
// });


const plyControls = document.querySelector(".plyr__controls");
// const actionButtonSections = document.querySelector(".actionButton");
// plyControls.insertAdjacentElement("beforeend",actionButtonSections);