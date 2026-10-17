# 🧠 QuizMaster — Interactive Web Quiz App

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/Licen%C3%A7a-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Conclu%C3%ADdo-success?style=for-the-badge)

<p align="center">
  Uma aplicação de Quiz moderna, interativa e totalmente responsiva, construída com <strong>HTML5 semântico, CSS3 moderno e JavaScript puro (Vanilla JS)</strong> — sem bibliotecas, bundlers ou dependências externas!
</p>

[✨ Funcionalidades](#-funcionalidades-principais) •
[📂 Estrutura do Projeto](#-estrutura-do-projeto) •
[🔍 Como Funciona Cada Arquivo](#-explicação-detalhada-dos-arquivos) •
[🚀 Como Executar](#-como-executar-o-projeto) •
[⚙️ Como Customizar](#-como-adicionar-novas-perguntas-e-customizar) •
[📜 Licença](#-licença)

</div>

---

## 📸 Visão Geral

O **QuizMaster** é uma experiência completa de jogo de perguntas e respostas focada em usabilidade, fluidez visual e desempenho. Oferece filtragem por categorias, níveis de dificuldade, cronômetro regressivo por pergunta, feedback auditivo em tempo real via **Web Audio API** e persistência de histórico e ranking através do **LocalStorage**.

---

## ✨ Funcionalidades Principais

- 🎨 **Design Moderno e Responsivo:**
  - Interface construída em Glassmorphism sutil, bordas arredondadas e sombras suaves.
  - Adaptabilidade completa para smartphones, tablets e desktops.
  - Suporte a **Tema Claro (Light Mode) e Escuro (Dark Mode)** com persistência e detecção automática do sistema (`prefers-color-scheme`).

- 🎯 **Configuração Personalizada da Partida:**
  - Escolha o nome/apelido do jogador.
  - Seleção de categorias (*Programação & Tecnologia, Ciência & Espaço, Conhecimentos Gerais, História & Geografia ou Misto*).
  - Filtragem por dificuldade (*Fácil, Médio, Difícil ou Todas*).
  - Seleção da quantidade de perguntas (5, 10 ou 15 questões).

- ⏱️ **Mecânicas de Jogo Dinâmicas:**
  - **Temporizador Regressivo (15s):** Mudança visual de aviso (amarelo) e perigo (vermelho pulsante) nos segundos finais.
  - **Sistema de Pontuação Inteligente:** Pontuação baseada na dificuldade da questão + bônus de velocidade de resposta.
  - **Multiplicador de Sequência (Streak 🔥):** Bônus cumulativo ao acertar várias questões consecutivas.
  - **Embaralhamento Real (Fisher-Yates):** A cada nova partida, as perguntas são sorteadas de forma justa e imprevisível.

- 🔊 **Efeitos Sonoros Nativos (Web Audio API):**
  - Sons gerados programaticamente em tempo real (clique, acerto, erro, tempo esgotado e vitória).
  - **Zero arquivos de áudio externos:** não consome banda, não sofre com atrasos e não gera erros de CORS ao abrir direto do disco!
  - Botão de Mudo/Desmudo com persistência.

- 🏆 **Placar de Líderes Local (Leaderboard):**
  - Armazena as 10 melhores pontuações no navegador com medalhas (🥇, 🥈, 🥉), data, precisão e categoria.
  - Opção para limpar o placar a qualquer momento.

- 📝 **Revisão Pedagógica de Respostas:**
  - Explicação didática ("💡 Você sabia?") logo após responder cada pergunta.
  - Tela de revisão completa no final listando o que o jogador respondeu vs. a resposta correta e sua justificativa.

- ⌨️ **Acessibilidade e Atalhos de Teclado:**
  - Pressione teclas `1`, `2`, `3`, `4` (ou `A`, `B`, `C`, `D`) para escolher a opção rapidamente.
  - Pressione `Enter` para avançar para a próxima pergunta.
  - Pressione `Esc` para fechar modais.
  - Leitura semântica para leitores de tela com atributos ARIA (`aria-live`, `aria-label`, `role="timer"`).

---

## 📂 Estrutura do Projeto

O projeto foi organizado de forma modular para garantir fácil manutenção e boas práticas de engenharia de software:

```text
online-quiz-app/
│
├── index.html            # Estrutura semântica e esqueleto das telas
│
├── css/
│   ├── style.css         # Variáveis de tema (claro/escuro), reset e layout base
│   ├── components.css    # Estilização de botões, cards, opções, placar e modais
│   └── animations.css    # Keyframes de animações (shake, pop-in, fade, bounce)
│
├── js/
│   ├── questions.js      # Banco de dados de perguntas categorizadas com explicações
│   ├── audio.js          # Síntese sonora nativa procedural com Web Audio API
│   ├── storage.js        # Camada de abstração e persistência com LocalStorage
│   └── app.js            # Lógica central do jogo, máquina de estados e eventos
│
└── README.md             # Documentação completa do projeto
```

---

## 🔍 Explicação Detalhada dos Arquivos

### 1. `index.html`
- **O que faz:** É o ponto de entrada da aplicação. Define a árvore de nós semântica da interface.
- **Destaques:**
  - Organizado em 3 telas principais: `#screen-welcome` (Boas-vindas), `#screen-quiz` (Área de Jogo) e `#screen-results` (Desempenho Final).
  - Inclui dois modais (`#modal-leaderboard` e `#modal-review`) e um contêiner de notificações flutuantes (`#toast`).
  - Totalmente acessível com tags como `<main>`, `<header>`, `<section>`, `<dialog>`-like roles e elementos `<kbd>`.

### 2. `css/style.css`
- **O que faz:** Define as regras fundamentais de estilo, variáveis CSS (Design Tokens) e controle de temas.
- **Destaques:**
  - Suporte nativo a Tema Claro e Escuro através do seletor `[data-theme="dark"]`.
  - Configura variáveis de cores primárias, superfícies, bordas e sombras.
  - Inclui efeito de iluminação de fundo (*background glow*) e tratamento de `prefers-reduced-motion`.

### 3. `css/components.css`
- **O que faz:** Contém a estilização isolada de todos os blocos visuais e componentes do quiz.
- **Destaques:**
  - Botões de alternativas com estados `:hover`, `:active`, `.correct` e `.wrong`.
  - Medidor circular SVG de pontuação com animação de preenchimento (`stroke-dashoffset`).
  - Cards de estatísticas e listagens estilizadas para o ranking e revisão de questões.

### 4. `css/animations.css`
- **O que faz:** Centraliza os `@keyframes` de animação da interface.
- **Destaques:**
  - `fadeIn` e `slideUp` para transições suaves de tela.
  - `shake` para fornecer feedback visual imediato ao errar uma questão.
  - `pulse-danger` para criar senso de urgência quando o temporizador atinge os últimos 3 segundos.

### 5. `js/questions.js`
- **O que faz:** Atua como o repositório de dados com as perguntas do jogo.
- **Estrutura de cada pergunta:**
  ```javascript
  {
    id: 1,
    category: "programacao",
    categoryLabel: "💻 Programação",
    difficulty: "facil",
    difficultyLabel: "Fácil",
    question: "O que significa a sigla HTML?",
    options: ["HyperText Markup Language", ...],
    correctAnswer: 0, // Índice da opção correta (0 a 3)
    explanation: "HTML significa HyperText Markup Language..."
  }
  ```

### 6. `js/audio.js`
- **O que faz:** Gera efeitos sonoros em tempo real através da classe nativa `AudioContext` do navegador.
- **Vantagens:**
  - Elimina a necessidade de arquivos pesados de áudio (.mp3 / .wav).
  - Sintetiza frequências sonoras com osciladores e envelopes de volume controlados.
  - Sons incluídos: clique, acerto (acorde alegre), erro (grave), tempo esgotado e fanfarra final.

### 7. `js/storage.js`
- **O que faz:** Encapsula e centraliza todas as chamadas ao `window.localStorage`.
- **Responsabilidades:**
  - Recuperar e salvar preferências de tema (`light`/`dark`).
  - Salvar preferência de áudio mudo.
  - Lembrar o último nome de jogador utilizado.
  - Gerenciar a lista de pontuações do Top 10 com ordenação automática por pontuação e precisão.

### 8. `js/app.js`
- **O que faz:** O "cérebro" da aplicação. Orquestra a lógica de jogo, eventos e o ciclo de vida da partida.
- **Principais responsabilidades:**
  - **Filtro e Embaralhamento:** Aplica o algoritmo de Fisher-Yates para garantir aleatoriedade.
  - **Controle de Tempo:** Cria e limpa `setInterval` do cronômetro regressivo.
  - **Cálculo de Pontuação:** Aplica fórmulas matemáticas que combinam nível da pergunta, velocidade de resposta e multiplicador de streak.
  - **Atalhos de Teclado:** Captura eventos `keydown` para jogar sem precisar do mouse.
  - **Compartilhamento:** Integração com a `Web Share API` e fallback com `navigator.clipboard`.

---

## 🚀 Como Executar o Projeto

Como o projeto é feito com tecnologias web puras, **nenhuma instalação é obrigatória**!

### Opção 1: Execução Direta
1. Baixe ou clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/online-quiz-app.git
   ```
2. Abra a pasta do projeto.
3. Dê um clique duplo no arquivo `index.html` para abri-lo diretamente em qualquer navegador (Chrome, Edge, Firefox, Safari, Brave, Opera).

### Opção 2: Com Servidor Local (Recomendado)
Se você utiliza o **VS Code**:
1. Instale a extensão **Live Server**.
2. Clique com o botão direito no `index.html` e escolha **"Open with Live Server"**.

Ou via terminal com Python:
```bash
python -m http.server 3000
# Acesse http://localhost:3000 no seu navegador
```

Ou com Node.js:
```bash
npx serve .
```

---

## ⚙️ Como Adicionar Novas Perguntas e Customizar

Para adicionar novas perguntas ao jogo, basta abrir o arquivo [js/questions.js](js/questions.js) e inserir novos objetos dentro do vetor `QUIZ_QUESTIONS`:

```javascript
{
  id: 21,
  category: "programacao", // ou "ciencia", "gerais", "historia"
  categoryLabel: "💻 Programação",
  difficulty: "medio",     // "facil", "medio" ou "dificil"
  difficultyLabel: "Médio",
  question: "Qual o seu enunciado aqui?",
  options: [
    "Opção A",
    "Opção B",
    "Opção C",
    "Opção D"
  ],
  correctAnswer: 0, // Índice da opção correta: 0 para A, 1 para B, 2 para C, 3 para D
  explanation: "Explicação didática que será exibida para o jogador após responder."
}
```

---

## 🛠️ Tecnologias e Conceitos Utilizados

- **HTML5:** Tags semânticas (`<main>`, `<header>`, `<section>`, `<kbd>`, `<dialog>`), acessibilidade WAI-ARIA.
- **CSS3 Moderno:** CSS Custom Properties (Variáveis), Flexbox, CSS Grid, Glassmorphism (`backdrop-filter`), `:has()`, `:focus-visible`, animações com `@keyframes`.
- **JavaScript (ES6+):**
  - Manipulação avançada de DOM sem dependências.
  - Classes ES6 e POO limpa.
  - Web Audio API (`AudioContext`, `OscillatorNode`, `GainNode`).
  - Web Storage API (`localStorage`).
  - Clipboard API e Web Share API.
  - Algoritmo de embaralhamento de Fisher-Yates.

---

## 🤝 Contribuições

Contribuições são super bem-vindas! Sinta-se à vontade para abrir uma *Issue* ou enviar um *Pull Request*:

1. Faça um Fork do projeto
2. Crie uma branch para sua funcionalidade (`git checkout -b feature/nova-pergunta`)
3. Faça o commit das suas alterações (`git commit -m 'feat: adiciona perguntas sobre astronomia'`)
4. Envie para o GitHub (`git push origin feature/nova-pergunta`)
5. Abra um Pull Request

---

## 📜 Licença

Distribuído sob a licença **MIT**. Consulte o arquivo `LICENSE` para mais informações.

<div align="center">
  Desenvolvido com 💙 e código limpo.
</div>
