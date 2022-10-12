// API
const CHARACTERS_DURING_SERIES =
  "https://hp-api.herokuapp.com/api/characters/students";
const CHARACTERS_BY_HOUSE = "https://hp-api.herokuapp.com/api/characters/house";

const unavailableImage =
  "https://www.och-lco.ca/wp-content/uploads/2015/07/unavailable-image.jpg";

// MENU
const allStudentsBtn = document.getElementById("all-students");
const gryffindorBtn = document.getElementById("gryffindor");
const slytherinBtn = document.getElementById("slytherin");
const hufflepuffBtn = document.getElementById("hufflepuff");
const ravenclawBtn = document.getElementById("ravenclaw");
const favoritesBtn = document.getElementById("favorites");

// SORT
const sortByNameAZ = document.getElementById("sort-by-name-az");
const sortByNameZA = document.getElementById("sort-by-name-za");

// LIST OF RECORDS
const content = document.getElementById("content");
const listOfRecords = document.getElementById("list-of-records");
const modalWindow = document.getElementById("modal");
const modalContainer = document.getElementById("modal-container");
const modalName = document.getElementById("modal-name");
const modalDateOfBirth = document.getElementById("modal-date-of-birth");
const modalHouse = document.getElementById("modal-house");
const modalWizard = document.getElementById("modal-wizard");
const modalAncestry = document.getElementById("modal-ancestry");
const modalIsStudent = document.getElementById("modal-is-student");
const modalImage = document.getElementById("modal-image");
const modalBtns = document.getElementById("modal-buttons");
const columns = document.getElementById("columns");

const saveBtn = document.createElement("button");
const removeBtn = document.createElement("button");

// FETCH
const loadCharactersDuringSeries = async () => {
  return (await fetch(CHARACTERS_DURING_SERIES)).json();
};
const loadCharactersByHouse = async (name) => {
  return (await fetch(CHARACTERS_BY_HOUSE + "/" + name)).json();
};

// RECORD LOGIC
const reusable = async (characters) => {
  const closeModal = (e) => {
    if (e.target === modalContainer) {
      modalContainer.style.display = "none";
    }
  };

  modalContainer.addEventListener("click", closeModal);

  const openModal = (foundRecord) => {
    modalContainer.classList.add("modal-overlay");
    modalWindow.classList.add("modal-content");

    let foundRecord_serialized = JSON.stringify(foundRecord);

    foundRecord.name
      ? (modalName.innerText = "Name:  " + foundRecord.name)
      : (modalName.innerText = "Name: Unavailable");

    foundRecord.dateOfBirth
      ? (modalDateOfBirth.innerText =
          "Date of Birth: " + foundRecord.dateOfBirth)
      : (modalDateOfBirth.innerText = "Date of Birth: Unavailable");

    foundRecord.house
      ? (modalHouse.innerText = "House:  " + foundRecord.house)
      : (modalHouse.innerText = "House: Unavailable");

    foundRecord.wizard
      ? (modalWizard.innerText = "Wizard:  " + foundRecord.wizard)
      : (modalWizard.innerText = "Wizard: Unavailable");

    foundRecord.ancestry
      ? (modalAncestry.innerText = "Ancestry:  " + foundRecord.ancestry)
      : (modalAncestry.innerText = "Ancestry:  Unavailable");

    foundRecord.hogwartsStudent
      ? (modalIsStudent.innerText =
          "Is Student?: " + foundRecord.hogwartsStudent)
      : (modalIsStudent.innerText = "Is Student?:  Unavailable");

    foundRecord.image
      ? modalImage.setAttribute("src", foundRecord.image)
      : modalImage.setAttribute("src", unavailableImage);

    saveBtn.innerText = "Save to favorites";
    saveBtn.classList.add("generic-button");
    modalBtns.appendChild(saveBtn);

    removeBtn.innerText = "Remove from favorites";
    removeBtn.classList.add("generic-button");
    modalBtns.appendChild(removeBtn);

    saveBtn.onclick = () => {
      localStorage.setItem(foundRecord.name, foundRecord_serialized);
    };

    removeBtn.onclick = () => {
      localStorage.removeItem(foundRecord.name);
    };

    modalContainer.style.display = "block";
  };

  sortByNameAZ.addEventListener("click", () => {
    let descendingNames = characters.sort((a, b) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    });

    reusable(descendingNames);
  });

  sortByNameZA.addEventListener("click", () => {
    let ascendingNames = characters.sort((a, b) => {
      if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
      return 0;
    });
    reusable(ascendingNames);
  });

  listOfRecords.addEventListener("click", (e) => {
    const clickedRecord = e.target;

    const foundRecord = characters.find(
      (character) => character.name === clickedRecord.id
    );
    openModal(foundRecord);
  });

  while (listOfRecords.firstChild) {
    listOfRecords.removeChild(listOfRecords.firstChild);
  }

  characters.forEach((character) => {
    const characterDiv = document.createElement("div");
    characterDiv.classList.add("record-content");
    const nameEl = document.createElement("p");
    const dateOfBirthEl = document.createElement("p");
    const houseEl = document.createElement("p");
    const wizardEl = document.createElement("p");
    const ancestryEl = document.createElement("p");
    const hogswartsStaffEl = document.createElement("p");

    character.name
      ? (nameEl.innerText = character.name)
      : (nameEl.innerText = "error");
    characterDiv.appendChild(nameEl).classList.add("record-item");

    character.dateOfBirth
      ? (dateOfBirthEl.innerText = character.dateOfBirth)
      : (dateOfBirthEl.innerText = "error");
    characterDiv.appendChild(dateOfBirthEl).classList.add("record-item");

    character.house
      ? (houseEl.innerText = character.house)
      : (houseEl.innerText = "error");
    characterDiv.appendChild(houseEl).classList.add("record-item");

    character.wizard
      ? (wizardEl.innerText = character.wizard)
      : (wizardEl.innerText = "error");
    characterDiv.appendChild(wizardEl).classList.add("record-item");

    character.ancestry
      ? (ancestryEl.innerText = character.ancestry)
      : (ancestryEl.innerText = "error");
    characterDiv.appendChild(ancestryEl).classList.add("record-item");

    character.hogswartsStaff === true
      ? (hogswartsStaffEl.innerText = "Is Staff")
      : (hogswartsStaffEl.innerText = "Is Student");
    characterDiv.appendChild(hogswartsStaffEl).classList.add("record-item");

    characterDiv.setAttribute("id", character.name);
    listOfRecords.appendChild(characterDiv);
  });
};

// FAVORITES LOGIC

const favorites = () => {
  while (listOfRecords.firstChild) {
    listOfRecords.removeChild(listOfRecords.firstChild);
  }

  Object.keys(localStorage).forEach((key) => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("favorite-card");
    const cardName = document.createElement("div");
    const cardImage = document.createElement("img");
    const cardRemove = document.createElement("button");
    cardRemove.classList.add("generic-button");

    let objects = JSON.parse(localStorage.getItem(key));

    cardName.innerText = objects.name;
    cardDiv.appendChild(cardName);

    objects.image
      ? cardImage.setAttribute("src", objects.image)
      : cardImage.setAttribute("src", unavailableImage);

    cardDiv.appendChild(cardImage);

    cardRemove.innerText = "Remove from favorites";
    cardDiv.appendChild(cardRemove);

    cardRemove.onclick = () => {
      localStorage.removeItem(objects.name);
      listOfRecords.appendChild(cardDiv);
      favorites();
    };

    listOfRecords.appendChild(cardDiv);
  });
};

// PAGES
allStudentsBtn.addEventListener("click", async () => {
  let characters = [];
  try {
    characters = await loadCharactersDuringSeries();
  } catch (e) {
    console.log("ERROR!");
  }

  reusable(characters);
});

gryffindorBtn.addEventListener("click", async () => {
  let characters = [];
  try {
    characters = await loadCharactersByHouse("gryffindor");
  } catch (e) {
    console.log("ERROR!");
  }

  reusable(characters);
});

slytherinBtn.addEventListener("click", async () => {
  let characters = [];
  try {
    characters = await loadCharactersByHouse("slytherin");
  } catch (e) {
    console.log("ERROR!");
  }

  reusable(characters);
});

hufflepuffBtn.addEventListener("click", async () => {
  let characters = [];
  try {
    characters = await loadCharactersByHouse("hufflepuff");
  } catch (e) {
    console.log("ERROR!");
  }

  reusable(characters);
});

ravenclawBtn.addEventListener("click", async () => {
  let characters = [];
  try {
    characters = await loadCharactersByHouse("ravenclaw");
  } catch (e) {
    console.log("ERROR!");
  }
  characters = characters;

  reusable(characters);
});

favoritesBtn.addEventListener("click", () => {
  favorites();
});
