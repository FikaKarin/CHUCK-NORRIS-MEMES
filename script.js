//funktion för att hämta data från Strapi
async function getDataFromStrapi() {
  //url till Strapi API för att hämta memes
  let url = "http://localhost:1337/api/memes";

  //hämtar JSON från API och konverterar till javascripobjekt
  let stringResponse = await fetch(url);
  let myObjekt = await stringResponse.json();

  //kontrollera i konsollen att myObjekt skrivs ut korrekt
  console.log(myObjekt);

  //tom variabel för att lägga värdet av hämtade memes
  let output = "";

  //variabel för edit-table
  let editOutput = "<table>";

//loopar igenom objekten i meme-databasen
  if (Array.isArray(myObjekt.data)) {
    //Anropa generateRow för att skapa en HEader-rad
    editOutput += generateRow(myObjekt.data[0].attributes, null, true);

    //Skapar en forEach loop för varje element i dataArrayen
    myObjekt.data.forEach((element) => {
      let attr = element.attributes;
      let obj = myObjekt.data.attributes;
      let objId = myObjekt.data.id;

      //for-loop för objekt: skriv ut idnr, name, level, deleteknapp, editknapp.
      for (x in attr) {
        console.log(x + ": " + attr[x]);

            //Skriver Output string
            editOutput += generateRow(obj, element.id, false);


      }
      output += `<div>
      <div>Nr: ${element.id} <br> <div id="editName">Namn: ${attr.meme}</div> 
      <br> 
      <div id="editLevel">Level: ${attr.chucklevel}</div>
      <br>
      <button onclick = "deleteConfirm('http://localhost:1337/api/memes/${element.id}', ${element.id});">DELETE</button>
      <button onclick="editMeme('http://localhost:1337/api/memes/${element.id}', ${element.id});">EDIT</button>
      <div id="editMeme${element.id}" ></div> 
      </div>
      <br><br>`;
    });
  
    //annars skriv skriv ut objektet attribut
  } else {
    let obj = myObjekt.data.attributes;
    for (x in obj) {
      console.log(x + ": " + obj[x]);
    }
    output += `<div>Namn: ${obj.meme} <br> Level: ${obj.chucklevel}</div>`;
    
    //Skapa en Header Rad
    editOutput += generateRow(obj, null, true);

    //Skriver Output string
    editOutput += generateRow(obj, myObjekt.data.id, false);
  
  }
     //Avsluta <table> tag
     output += "</table>";

  document.getElementById("memeFetched").innerHTML = output;
}


async function getToken() {
  //1. göra inloggningsförsök för att få en Token returnerad
  //2. samla data och skapa ett objekt av dessa
  //3. skicka iväg JSON till API

  //variabel med url till användare
  const urlUser = "http://localhost:1337/api/auth/local/";

  //variabler innehållande ifylld användare och lösenord
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  //objekt innehållande attribut med värdet av variabel user och pass
  let userObject = {
    identifier: user,
    password: pass,
  };

  //anropar API med inloggningsdata
  let userResponse = await fetch(urlUser, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",

    },
    body: JSON.stringify(userObject),
  });

  let userJson = await userResponse.json();

  console.log(userJson);

  if (userJson.jwt) return userJson.jwt;

}


//funktion för att lägga till meme i databasen
async function postData() {
  
  let token = await getToken();
  if(!token) return;
  
  //variabel innehållande databasen
  const urlMeme = "http://localhost:1337/api/memes/";

  //hämtar data från fält
  const name = document.getElementById("name").value;
  const level = document.getElementById("level").value;

  //objekt med data innehållande attribut för name och level
  let memeObjekt = {
    data: {
      meme: name,
      chucklevel: level,
    },
  };

  //anropar API med memes med metod POST för att kunna lägga till
  let memeResponse = await fetch(urlMeme, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify(memeObjekt),
  });
  let memeJson = await memeResponse.json();
  console.log(memeJson);

  //skriver ut värdet av name och level i id: addedMemes
  document.getElementById('addedMemes').innerHTML = name + "<br>" + level;
  
  //skriver ut databas igen efter tillägg
  getDataFromStrapi();
}


//Random funktion som skriver ut random memes.
async function randomMemes() {
 

  let url = "http://localhost:1337/api/memes";

  let stringResponse = await fetch(url);
  let myObjekt = await stringResponse.json();

  let memeResult = Math.floor(Math.random() * (myObjekt.data.length - 0) ) +0;
  console.log(memeResult);

  document.getElementById('randomMeme').innerHTML = myObjekt.data[memeResult].attributes.meme + "<br>" + "Level: " + myObjekt.data[memeResult].attributes.chucklevel;
  
}


async function editMeme(url, x) {
  let test = true;
  let output = "";

  // Hämtar data från fält
  const name = document.getElementById("editName").value;
  // const level = parseInt(document.getElementById("editLevel").value);

  if (test) {
    output += `<div>
    <h1>EDIT MEME </h1>
    <div>
            <h1>Ange användarnamn och lösenord för att kunna lägga till memes: </h1>
            <label for="user">Användarnamn:</label>
            <input type="text" name="user" id="user">
    
            <label for="pass">Lösenord:</label>
            <input type="text" name="pass" id="pass">
        </div><br><br>
    <label for="name" >MEME: </label><br>
    <input type="text" name="name" id="newName" ><br><br>
  
    

    <button onclick="updatePost('${url}');">UPDATE</button>
  </div>`
  }

  document.getElementById('editMeme'+x).innerHTML = output;
  
}

async function updatePost(url) {

  //Hämta Token från GetToken()
  //Om ingen Token returneras, avbryt funktionen
  let token = await getToken();
  if (!token) return;

  // Hämtar data från fält
  const name = document.getElementById("newName").value;
  const level = document.getElementById("level").value;
  console.log(name);
  //Skapa ett objekt med data inkluderat.
  let memeObjekt = {
      data : {}
  };

  //Fyller upp Data med parameter-värden
  if (name) memeObjekt.data["meme"] = name;
  if (level) memeObjekt.data["chucklevel"] = level;

  //Anropar API med pokemonObjekt
  await fetch(url,
  {
      method: 'PUT',
      headers: {
          "Content-Type": "application/json",
          "Authorization" : "Bearer " + token //Inkluderar Token från inloggning tidigare.
      },
      body: JSON.stringify(memeObjekt)
  });

  //Anropa "GetDataFromStrapi" för att skriva ut ny tabell
  await getDataFromStrapi();
}




//DELETE FUNCTION
async function deleteMeme(url) {

  //Hämta Token från GetToken()
  //Om ingen Token returneras, avbryt funktionen
  let token = await getToken();
  if (!token) return;

  //Anropar API med inloggningsdata.
  //Inkluderar Method och Headers
  await fetch(url,
      {
          method: 'DELETE',
          headers: {
              "Content-Type": "application/json",
              "Authorization" : "Bearer " + token //Inkluderar Token från inloggning tidigare.
          }
      });
      getDataFromStrapi();
    }



    async function deleteConfirm(url, x) {
      let test = true;
      let output = "";
    
      if (test) {
        output += `<div>
        <h1>DELETE MEME </h1>
        <div>
                <h1>Ange användarnamn och lösenord för att kunna ta bort memes: </h1>
                <label for="user">Användarnamn:</label>
                <input type="text" name="user" id="user">
        
                <label for="pass">Lösenord:</label>
                <input type="text" name="pass" id="pass">
            </div><br><br>
       
        <button onclick="deleteMeme('${url}');">DELETE</button>
      </div>`
      }
    
      document.getElementById('editMeme'+x).innerHTML = output;
      
    }



    //Genererat tabellrad med det inkludera objektet. Skapar TH rad om header=true
function generateRow(obj, objId, header) {

  let editOutput = "<tr>";
  let forbiddenParameters = ["createdAt", "updatedAt", "publishedAt"];

  //For in loop för att gå igenom alla parametrar i obj
  for (x in obj) {
      /*
      x = parameterns namn
      obj[x] = parameterns värde
      */

      //Kontrollera att x är en tillåten parameter.
      // Keyword Continue går vidare till nästa parameter i loopen
      //Fungerar också i en ForEach loop.
      if (forbiddenParameters.includes(x)) continue;

      if (header) editOutput += `<th>${x}</th>`;
      else        editOutput += `<td>${obj[x]}</td>`;
  }

  //Skapa update och Delete knapp för TD rad
  if (!header) {
      //URL för den specifika posten
      let postURL = `http://localhost:1337/api/memes/${objId}`;

      editOutput += `<td><button onclick="updatePost('${postURL}');">Update Post</button></td>`;
      editOutput += `<td><button onclick="deletePost('${postURL}');">Delete Post</button></td>`;
  }

  //Stänga <tr> taggen
  editOutput += "</tr>";

  return editOutput;
}


  