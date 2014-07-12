function loadFileJSON( toLocalStorage, fromUrl){
    if (localStorage[toLocalStorage])
            { console.log("Good! Data already loaded locally! Nothing to do!");  }
    else {
        $.getJSON(   fromUrl   , function(data) { 
            localStorage[toLocalStorage] = JSON.stringify(data);
            console.log("Damn! Data not yet loaded locally! Ok: I'am loading it!");
        });
      }
    }
// Function's firing:
loadFileJSON( 'bounds','./data/vic_postcode_sml.json'); 
// should works w/ local folders as well

