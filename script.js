let gameBoard = document.getElementById("gameBoard");
let flippedCards = [];
let lockBoard = false;
let cardsDataGlobal = [];

// Embaralha o array
function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

// Cria pares de cartas (palavra e dica)
function createCards(cardsData) {
  const allCards = [];

  cardsData.forEach(item => {
    allCards.push({ text: item.palavra, id: item.palavra });
    allCards.push({ text: item.dica, id: item.palavra });
  });

  return shuffle(allCards);
}

// Renderiza as cartas no tabuleiro
function renderCards(cardsData) {
  gameBoard.style.display = "grid"; // garante que o tabuleiro esteja visível
  gameBoard.innerHTML = "";          // limpa antes de renderizar

  const cards = createCards(cardsData);

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

// Lógica de virar carta
function flipCard(card) {
  if (lockBoard || card.classList.contains("flipped") || card.classList.contains("matched")) return;

  card.classList.add("flipped");
  flippedCards.push(card);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

// Verifica se as duas cartas formam par
function checkMatch() {
  const [first, second] = flippedCards;

  const firstId = first.dataset.id;
  const secondId = second.dataset.id;

  if (firstId === secondId && first !== second) {
    first.classList.add("matched");
    second.classList.add("matched");
    resetBoard();
    checkWin();
  } else {
    lockBoard = true;
    setTimeout(() => {
      first.classList.remove("flipped");
      second.classList.remove("flipped");
      resetBoard();
    }, 1500);
  }
}

function resetBoard() {
  flippedCards = [];
  lockBoard = false;
}

// Verifica se todas as cartas foram combinadas
function checkWin() {
  const allMatched = document.querySelectorAll('.card.matched').length;
  const totalCards = cardsDataGlobal.length * 2;

  if (allMatched === totalCards) {
    const winMessage = document.getElementById("winMessage");
    if (winMessage) {
      winMessage.classList.remove("hidden");
      winMessage.classList.add("visible");
    }
  }
}

// Carrega os dados das cartas do arquivo JSON e inicia o jogo
async function loadCardsData() {
  try {
    const response = await fetch("./cards.json");
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
    const data = await response.json();
    cardsDataGlobal = data;
    renderCards(data);
  } catch (error) {
    console.error("Erro ao carregar os dados:", error);
  }
}

// Função para voltar à tela inicial
function voltarParaHome() {
  const winMessage = document.getElementById("winMessage");
  if (winMessage) {
    winMessage.classList.remove("visible");
    winMessage.classList.add("hidden");
  }

  gameBoard.innerHTML = "";
  gameBoard.style.display = "none";

  const homeScreen = document.getElementById("homeScreen");
  homeScreen.style.display = "flex";
  homeScreen.style.opacity = "1"; // se usar animação de opacidade
}

// Eventos após o carregamento do DOM
document.addEventListener("DOMContentLoaded", () => {
  // Botão PLAY da tela inicial
  document.getElementById("playButton").addEventListener("click", () => {
    const home = document.getElementById("homeScreen");
    home.style.opacity = "0";

    setTimeout(() => {
      home.style.display = "none";
      loadCardsData(); // inicia o jogo
    }, 500);
  });

  // Botão REPLAY na mensagem de vitória
  document.getElementById("replayButton").addEventListener("click", () => {
    const winMessage = document.getElementById("winMessage");
    if (winMessage) {
      winMessage.classList.remove("visible");
      winMessage.classList.add("hidden");
    }
    flippedCards = [];
    lockBoard = false;
    loadCardsData();
  });

  // Botão SAIR na mensagem de vitória
  document.getElementById("exitButton").addEventListener("click", voltarParaHome);

  // Botões de informação
  const infoButton = document.getElementById("infoButton");
  const howToPlay = document.getElementById("howToPlay");
  const closeInfo = document.getElementById("closeInfo");

  infoButton.addEventListener("click", () => {
    howToPlay.style.display = "flex";
  });

  closeInfo.addEventListener("click", () => {
    howToPlay.style.display = "none";
  });
});
