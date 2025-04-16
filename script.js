const cardsData = [
    { palavra: "Guri", dica: "Criança, menino." },
    { palavra: "Jabuti", dica: "Réptil de casco duro, anda devagar e vive em terra." },
    { palavra: "Sagui", dica: "Macaquinho pequeno, ágil e com pelos nas orelhas." },
    { palavra: "Siri", dica: "Animal que anda de lado, tem casca dura e vive na praia." },
    { palavra: "Arara", dica: "Pássaro colorido de bico curvo e penas vivas." },
    { palavra: "Paçoca", dica: "Doce feito de amendoim, açúcar e farinha." },
  ];
  
  let gameBoard = document.getElementById("gameBoard");
  let flippedCards = [];
  let lockBoard = false;
  
  function shuffle(array) {
    return array.sort(() => 0.5 - Math.random());
  }
  
  function createCards() {
    const allCards = [];
  
    cardsData.forEach(item => {
      allCards.push({ text: item.palavra, id: item.palavra });
      allCards.push({ text: item.dica, id: item.palavra });
    });
  
    return shuffle(allCards);
  }
  
  function renderCards() {
    const cards = createCards();
  
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
    const totalCards = cardsData.length * 2;

    if (allMatched === totalCards) {
      const winMessage = document.getElementById("winMessage");
      if (winMessage) {
        winMessage.classList.add("visible");
      }
    }
  }, 500);
  }
  
  renderCards();
  