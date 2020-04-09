const cafeList = document.getElementById("cafe-list");
const cafeForm = document.getElementById("add-cafe-form");

const renderCafe = (doc) => {
  const id = doc.id;
  const { name, city } = doc.data();

  const cafe = document.createElement("li");
  const nameSpan = document.createElement("span");
  const citySpan = document.createElement("span");
  const cross = document.createElement("div");

  cafe.dataset.id = id;
  nameSpan.textContent = name;
  citySpan.textContent = city;

  cross.textContent = "x";
  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    db.collection("cafes").doc(id).delete();

    // getCafes();
  });

  cafe.appendChild(nameSpan);
  cafe.appendChild(citySpan);
  cafe.appendChild(cross);

  cafeList.appendChild(cafe);
};

// Getting Data
// Deprecated (Using snapshot real-time system below)
const getCafes = () => {
  db.collection("cafes")
    .where("name", ">=", " ")
    .orderBy("name")
    .get()
    .then((snapshot) => {
      cafeList.innerHTML = "";
      snapshot.docs.forEach((doc) => renderCafe(doc));
    });
};

// getCafes();

// Saving Data
cafeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  db.collection("cafes").add({
    name: cafeForm.name.value,
    city: cafeForm.city.value,
  });
  cafeForm.name.value = "";
  cafeForm.city.value = "";

  // getCafes();
});

// Real-time Data
db.collection("cafes")
  .orderBy("name")
  .onSnapshot((snapshot) => {
    const changes = snapshot.docChanges();

    changes.map((change) => {
      if (change.type === "added") renderCafe(change.doc);
      if (change.type === "removed") {
        const toRemove = document.querySelector(`[data-id="${change.doc.id}"]`);
        cafeList.removeChild(toRemove);
      }
    });
  });
