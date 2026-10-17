/**
 * ============================================================================
 * BANCO DE DADOS DE PERGUNTAS DO QUIZ (QUESTIONS DATA)
 * ============================================================================
 * Cada pergunta contém:
 * - id: Identificador único da questão
 * - category: Chave da categoria (programacao, ciencia, gerais, historia)
 * - categoryLabel: Nome amigável para exibição
 * - difficulty: Grau de dificuldade (facil, medio, dificil)
 * - difficultyLabel: Nome amigável da dificuldade
 * - question: Texto da pergunta
 * - options: Vetor com 4 alternativas possíveis
 * - correctAnswer: Índice da alternativa correta (0 a 3)
 * - explanation: Explicação educativa exibida após a resposta
 */

const QUIZ_QUESTIONS = [
  // --------------------------------------------------------------------------
  // CATEGORIA: PROGRAMAÇÃO E WEB (Tecnologia)
  // --------------------------------------------------------------------------
  {
    id: 1,
    category: "programacao",
    categoryLabel: "💻 Programação",
    difficulty: "facil",
    difficultyLabel: "Fácil",
    question: "Qual linguagem é executada nativamente em todos os navegadores modernos para criar interatividade?",
    options: ["Python", "JavaScript", "Java", "C++"],
    correctAnswer: 1,
    explanation: "JavaScript é a linguagem padrão dos navegadores web, responsável pela interatividade e dinamismo das páginas."
  },
  {
    id: 2,
    category: "programacao",
    categoryLabel: "💻 Programação",
    difficulty: "facil",
    difficultyLabel: "Fácil",
    question: "O que significa a sigla HTML?",
    options: [
      "HyperText Markup Language",
      "High Tech Modern Language",
      "HyperTransfer Machine Language",
      "Home Tool Management Line"
    ],
    correctAnswer: 0,
    explanation: "HTML significa HyperText Markup Language (Linguagem de Marcação de Hipertexto), e é o alicerce estrutural da web."
  },
  {
    id: 3,
    category: "programacao",
    categoryLabel: "💻 Programação",
    difficulty: "medio",
    difficultyLabel: "Médio",
    question: "No CSS, qual propriedade é utilizada para criar layouts flexíveis e bidirecionais modernos?",
    options: ["float: left", "display: flex", "position: fixed", "clear: both"],
    correctAnswer: 1,
    explanation: "Flexbox (`display: flex`) é o módulo moderno do CSS projetado para alinhar e distribuir espaço entre itens em um contêiner."
  },
  {
    id: 4,
    category: "programacao",
    categoryLabel: "💻 Programação",
    difficulty: "medio",
    difficultyLabel: "Médio",
    question: "Em JavaScript, qual método de array cria um novo array transformando cada elemento do original?",
    options: ["forEach()", "filter()", "map()", "reduce()"],
    correctAnswer: 2,
    explanation: "O método `.map()` itera sobre os elementos de um array e retorna um novo array com os resultados da função de transformação."
  },
  {
    id: 5,
    category: "programacao",
    categoryLabel: "💻 Programação",
    difficulty: "dificil",
    difficultyLabel: "Difícil",
    question: "Qual mecanismo do JavaScript move declarações de funções e variáveis 'var' para o topo do seu escopo durante a compilação?",
    options: ["Closure", "Event Loop", "Hoisting", "Memoization"],
    correctAnswer: 2,
    explanation: "Hoisting (içamento) é o comportamento do interpretador JavaScript de elevar a declaração de funções e variáveis ao topo antes da execução."
  },
  {
    id: 6,
    category: "programacao",
    categoryLabel: "💻 Programação",
    difficulty: "dificil",
    difficultyLabel: "Difícil",
    question: "Qual estrutura armazena pares de chave-valor em JavaScript preservando a ordem de inserção e permitindo qualquer tipo de dado como chave?",
    options: ["Object", "Map", "Set", "WeakSet"],
    correctAnswer: 1,
    explanation: "A classe `Map` do JavaScript aceita chaves de qualquer tipo (incluindo objetos e funções) e mantém a ordem de inserção dos elementos."
  },

  // --------------------------------------------------------------------------
  // CATEGORIA: CIÊNCIA & ESPAÇO
  // --------------------------------------------------------------------------
  {
    id: 7,
    category: "ciencia",
    categoryLabel: "🔬 Ciência & Espaço",
    difficulty: "facil",
    difficultyLabel: "Fácil",
    question: "Qual é o planeta mais próximo do Sol no nosso Sistema Solar?",
    options: ["Vênus", "Marte", "Mercúrio", "Terra"],
    correctAnswer: 2,
    explanation: "Mercúrio é o primeiro e mais próximo planeta do Sol, completando uma órbita em apenas 88 dias terrestres."
  },
  {
    id: 8,
    category: "ciencia",
    categoryLabel: "🔬 Ciência & Espaço",
    difficulty: "facil",
    difficultyLabel: "Fácil",
    question: "Qual é o gás mais abundante na atmosfera terrestre?",
    options: ["Oxigênio", "Nitrogênio", "Dióxido de Carbono", "Hidrogênio"],
    correctAnswer: 1,
    explanation: "O nitrogênio (N₂) compõe aproximadamente 78% da atmosfera terrestre, seguido pelo oxigênio com cerca de 21%."
  },
  {
    id: 9,
    category: "ciencia",
    categoryLabel: "🔬 Ciência & Espaço",
    difficulty: "medio",
    difficultyLabel: "Médio",
    question: "Aproximadamente quantos minutos a luz do Sol leva para chegar até a Terra?",
    options: ["Instantaneamente", "8 minutos e 20 segundos", "24 minutos", "1 hora"],
    correctAnswer: 1,
    explanation: "A uma velocidade aproximada de 300.000 km/s, a luz solar percorre os 150 milhões de km até a Terra em cerca de 8 minutos e 20 segundos."
  },
  {
    id: 10,
    category: "ciencia",
    categoryLabel: "🔬 Ciência & Espaço",
    difficulty: "medio",
    difficultyLabel: "Médio",
    question: "Quem formulou a Teoria da Relatividade Geral em 1915?",
    options: ["Isaac Newton", "Nikola Tesla", "Albert Einstein", "Stephen Hawking"],
    correctAnswer: 2,
    explanation: "Albert Einstein propôs a Teoria da Relatividade Geral, revolucionando nossa compreensão de gravidade e espaço-tempo."
  },
  {
    id: 11,
    category: "ciencia",
    categoryLabel: "🔬 Ciência & Espaço",
    difficulty: "dificil",
    difficultyLabel: "Difícil",
    question: "Qual é a menor partícula elementar constituinte da matéria conhecida na física moderna?",
    options: ["Átomo", "Quark", "Molécula", "Nêutron"],
    correctAnswer: 1,
    explanation: "Quarks são partículas fundamentais sem subestrutura conhecida que se unem para formar prótons e nêutrons."
  },

  // --------------------------------------------------------------------------
  // CATEGORIA: CONHECIMENTOS GERAIS
  // --------------------------------------------------------------------------
  {
    id: 12,
    category: "gerais",
    categoryLabel: "🌍 Conhecimentos Gerais",
    difficulty: "facil",
    difficultyLabel: "Fácil",
    question: "Qual é o maior oceano do planeta Terra?",
    options: ["Oceano Atlântico", "Oceano Índico", "Oceano Pacífico", "Oceano Ártico"],
    correctAnswer: 2,
    explanation: "O Oceano Pacífico é o maior e mais profundo de todos os oceanos, cobrindo mais de 30% da superfície do globo."
  },
  {
    id: 13,
    category: "gerais",
    categoryLabel: "🌍 Conhecimentos Gerais",
    difficulty: "facil",
    difficultyLabel: "Fácil",
    question: "Quantos continentes existem tradicionalmente no modelo geográfico mais adotado?",
    options: ["5", "6", "7", "8"],
    correctAnswer: 2,
    explanation: "O modelo de 7 continentes engloba: África, América do Norte, América do Sul, Antártida, Ásia, Europa e Oceania."
  },
  {
    id: 14,
    category: "gerais",
    categoryLabel: "🌍 Conhecimentos Gerais",
    difficulty: "medio",
    difficultyLabel: "Médio",
    question: "Qual moeda oficial é utilizada no Japão?",
    options: ["Yuan", "Won", "Iene (Yen)", "Baht"],
    correctAnswer: 2,
    explanation: "A moeda oficial do Japão é o Iene (¥), que é uma das moedas de reserva mais negociadas no mundo."
  },
  {
    id: 15,
    category: "gerais",
    categoryLabel: "🌍 Conhecimentos Gerais",
    difficulty: "medio",
    difficultyLabel: "Médio",
    question: "Em que país se originou o jogo de xadrez em suas versões ancestrais conhecidas como Chaturanga?",
    options: ["China", "Índia", "Grécia", "Egito"],
    correctAnswer: 1,
    explanation: "O ancestral mais aceito do xadrez moderno surgiu no noroeste da Índia por volta do século VI d.C., chamado Chaturanga."
  },
  {
    id: 16,
    category: "gerais",
    categoryLabel: "🌍 Conhecimentos Gerais",
    difficulty: "dificil",
    difficultyLabel: "Difícil",
    question: "Qual é a montanha mais alta do mundo medida da sua base submarina até o pico?",
    options: ["Monte Everest", "Mauna Kea", "K2", "Kilimanjaro"],
    correctAnswer: 1,
    explanation: "Embora o Everest tenha a maior altitude em relação ao nível do mar, o Mauna Kea no Havaí mede cerca de 10.210 metros da base no fundo do oceano até o topo."
  },

  // --------------------------------------------------------------------------
  // CATEGORIA: HISTÓRIA E GEOGRAFIA
  // --------------------------------------------------------------------------
  {
    id: 17,
    category: "historia",
    categoryLabel: "🏛️ História & Geografia",
    difficulty: "facil",
    difficultyLabel: "Fácil",
    question: "Em que continente localizam-se as famosas Pirâmides de Gizé?",
    options: ["Ásia", "África", "Europa", "América do Sul"],
    correctAnswer: 1,
    explanation: "As Pirâmides de Gizé situam-se no Egito, país localizado no nordeste do continente africano."
  },
  {
    id: 18,
    category: "historia",
    categoryLabel: "🏛️ História & Geografia",
    difficulty: "medio",
    difficultyLabel: "Médio",
    question: "Qual cidade é a capital da Austrália?",
    options: ["Sydney", "Melbourne", "Camberra", "Brisbane"],
    correctAnswer: 2,
    explanation: "Camberra foi escolhida em 1908 como a capital australiana como um meio-termo de compromisso entre as rivais Sydney e Melbourne."
  },
  {
    id: 19,
    category: "historia",
    categoryLabel: "🏛️ História & Geografia",
    difficulty: "medio",
    difficultyLabel: "Médio",
    question: "Em que ano ocorreu a queda do Muro de Berlim, marcando o fim da Guerra Fria?",
    options: ["1979", "1989", "1991", "1995"],
    correctAnswer: 1,
    explanation: "O Muro de Berlim começou a ser derrubado na noite de 9 de novembro de 1989, simbolizando a unificação alemã."
  },
  {
    id: 20,
    category: "historia",
    categoryLabel: "🏛️ História & Geografia",
    difficulty: "dificil",
    difficultyLabel: "Difícil",
    question: "Qual civilização antiga construiu a cidade histórica de Machu Picchu no Peru?",
    options: ["Maias", "Astecas", "Incas", "Olmecas"],
    correctAnswer: 2,
    explanation: "Machu Picchu foi construída no século XV pela civilização Inca sob o comando do imperador Pachacuti."
  }
];
