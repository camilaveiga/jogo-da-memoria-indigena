let gameBoard = document.getElementById("gameBoard");
let flippedCards = [];
let lockBoard = false;
let cardsDataGlobal = []; // 🔁 variável global para referência posterior

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function createCards(cardsData) {
  const allCards = [];

  cardsData.forEach(item => {
    allCards.push({ text: item.palavra, id: item.palavra });
    allCards.push({ text: item.dica, id: item.palavra });
  });

  return shuffle(allCards);
}

function renderCards(cardsData) {
  const cards = createCards(cardsData); // ✅ Corrigido: passando cardsData corretamente

  cards.forEach(cardData => {
    const card = document.createElement("div");
    card.className = "card";
    card.dataset.id = cardData.id;

    const inner = document.createElement("div");
    inner.className = "card-inner";

    const front = document.createElement("div");
    front.className = "card-front";
    front.textContent = "";

    const back = document.createElement("div");
    back.className = "card-back";
    back.textContent = cardData.text;

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);
    gameBoard.appendChild(card);

    card.addEventListener("click", () => flipCard(card));
  });
}

function flipCard(card) {
  if (lockBoard || card.classList.contains("flipped") || card.classList.contains("matched")) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flippedCards;

  const firstId = first.dataset.id;
  const secondId = second.dataset.id;

  if (firstId === secondId && first !== second) {
    first.classList.add("matched");
    second.classList.add("matched");
  } else {
    lockBoard = true;
    setTimeout(() => {
      first.classList.remove("flipped");
      second.classList.remove("flipped");
      lockBoard = false;
    }, 1500);
  }

  flippedCards = [];

  // Verifica se todas as cartas foram combinadas
  setTimeout(() => {
    const allMatched = document.querySelectorAll('.card.matched').length;
    const totalCards = cardsDataGlobal.length * 2; // ✅ Agora usa a variável global

    if (allMatched === totalCards) {
      const winMessage = document.getElementById("winMessage");
      if (winMessage) {
        winMessage.classList.add("visible");
      }
    }
  }, 500);
}


// Carrega os dados do arquivo JSON
async function loadCardsData() {

  try {
    const response = await fetch("./cards.json");
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    const data = await response.json();

    cardsDataGlobal = data; // ✅ Salva globalmente
    renderCards(data);
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }
}

loadCardsData();


