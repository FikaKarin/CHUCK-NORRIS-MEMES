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

    //Skapar en forEach loop för varje element i dataArrayen
    myObjekt.data.forEach((element) => {
      let attr = element.attributes;
      //kontroll av utskrift
      for (x in attr) {
        console.log(x + ": " + attr[x]);

      }
      //skriver ut varje element i databas tillsammans med delete och edit-funktion
      output += `<div>
      <div><div id="editName">Meme: ${attr.meme}</div> 
      <br> 
      <div id="editLevel">Level: ${attr.chucklevel}</div>
      <br>
      <button onclick = "deleteConfirm('http://localhost:1337/api/memes/${element.id}', ${element.id});">Delete</button>
      <button onclick="editMeme('http://localhost:1337/api/memes/${element.id}', ${element.id});">Edit</button>
      <div id="editMeme${element.id}" ></div> 
      </div>
      <br><br>`;
    });

  document.getElementById("memeFetched").innerHTML = output;
}

//funktion för att hämta token för validering
async function getToken() {

  //variabel med url till användare
  const urlUser = "http://localhost:1337/api/auth/local/";

  //hämtar data från fält
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  //objekt innehållande attribut med värdet av variabel user och pass
  let userObject = {
    identifier: user,
    password: pass
  };

  //anropar API med inloggningsdata
  let userResponse = await fetch(urlUser, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userObject),
  });

  //variabel skapas/inväntar userResponse som json-objekt
  let userJson = await userResponse.json();

  console.log(userJson);

  //om userResponse får token, returnera token
  if (userJson.jwt) return userJson.jwt;
}


//funktion för att lägga till meme i databasen
async function postData() {
  //variabel innehåller returvärdet getToken()
  let token = await getToken();
  //returnera ur funktionen om getToken() ej körs
  if (!token) return;

  //variabel innehållande databasen
  const urlMeme = "http://localhost:1337/api/memes/";

  //hämtar data från fält
  const name = document.getElementById("name").value;
  const level = document.getElementById("level").value;

  //objekt med data innehållande attributvärde för meme och chucklevel
  let memeObjekt = {
    data: {
      meme: name,
      chucklevel: level,
    },
  };

  //anropar API med memes med metod POST för att kunna lägga till i databasen
  let memeResponse = await fetch(urlMeme, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(memeObjekt),
  });
  //variabel skapas/inväntar memeResponse som json-objekt
  let memeJson = await memeResponse.json();
  console.log(memeJson);

  //skriver ut värdet av name och level i div med id "addedMemes"
  document.getElementById("addedMemes").innerHTML = name + "<br>" + level;

  //skriver ut databas igen efter tillägg
  getDataFromStrapi();
}

//Random funktion som skriver ut random memes.
async function randomMemes() {
  let url = "http://localhost:1337/api/memes";

  //variabel innehållande hämtad url
  let stringResponse = await fetch(url);
  //gör stringResponse till json-objekt
  let myObjekt = await stringResponse.json();
  //variabel innehållande random index-värde från databas
  let memeResult = Math.floor(Math.random() * (myObjekt.data.length - 0)) + 0;
  console.log(memeResult);
  //skriver ut random meme och dess level
  document.getElementById("randomMeme").innerHTML =
    myObjekt.data[memeResult].attributes.meme +
    "<br>" +
    "Level: " +
    myObjekt.data[memeResult].attributes.chucklevel;
}

//funktion för editering
async function editMeme(url, x) {
  let output = "";

  // Hämtar data från edit-fält
  const name = document.getElementById("editName").value;

    output += `<div>
    <h1>EDIT MEME </h1>
    <div>
            <h1>Enter username and password to edit meme: </h1>
            <label for="user">Username:</label>
            <input type="text" name="user" id="user">
    
            <label for="pass">Password:</label>
            <input type="text" name="pass" id="pass">
        </div><br><br>
    <label for="name" >MEME: </label><br>
    <input type="text" name="name" id="newName" ><br><br>
  
    

    <button onclick="updatePost('${url}');">UPDATE</button>
  </div>`;
  

  document.getElementById("editMeme" + x).innerHTML = output;
}

async function updatePost(url) {
  //Hämta Token från GetToken()
  //Om ingen Token returneras, avbryt funktionen
  let token = await getToken();
  if (!token) return;

  // Hämtar data från fält
  const name = document.getElementById("newName").value;
  console.log(name);

  //Skapa ett objekt innehållande data 
  let memeObjekt = {
    data: {},
  };

  //Fyller upp data med värden från inmatning
  if (name) memeObjekt.data["meme"] = name;

  //Anropar API med memeObjekt. Inkluderar Token från inloggning 
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token, 
    },
    body: JSON.stringify(memeObjekt),
  });

  //skriver ut databasen med tillhörande utskrift igen
  await getDataFromStrapi();
}

//deletefunktion
async function deleteMeme(url) {
  //Hämta Token från getToken()
  //Om ingen Token returneras, avbryt funktionen
  let token = await getToken();
  if (!token) return;

  //Anropar API med inloggningsdata.
  await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token, 
    },
  });
  //skriver ut databasen med tillhörande utskrift
  getDataFromStrapi();
}

//funktion med inputfält för validering för delete-funktionen
async function deleteConfirm(url, x) {
  let output = "";

  //skriver ut fält för inlogg, då validering behövs för delete-funktion
    output += `<div>
        <h1>DELETE MEME </h1>
        <div>
                <h1>Enter username and password to remove meme: </h1>
                <label for="user">Username:</label>
                <input type="text" name="user" id="user">
        
                <label for="pass">Password:</label>
                <input type="text" name="pass" id="pass">
            </div><br><br>
       
        <button onclick="deleteMeme('${url}');">DELETE</button>
      </div>`;
  
  document.getElementById("editMeme" + x).innerHTML = output;
}


