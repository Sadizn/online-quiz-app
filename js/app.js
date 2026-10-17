/**
 * ============================================================================
 * CONTROLADOR PRINCIPAL DA APLICAÇÃO (APP.JS)
 * ============================================================================
 * Responsável por gerenciar:
 * 1. Estado da partida (perguntas, pontuação, streak, timer, respostas)
 * 2. Transição entre telas (Boas-vindas -> Quiz -> Resultados)
 * 3. Renderização dinâmica de componentes na DOM utilizando ícones vetoriais (SVG)
 * 4. Interatividade via clique e atalhos de teclado (1-4, Enter, Esc)
 * 5. Sistema de temas (Claro/Escuro) e efeitos sonoros
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. SELETORES DE ELEMENTOS DA DOM
  // ==========================================================================
  const DOM = {
    // Controles superiores
    themeBtn: document.getElementById('btn-toggle-theme'),
    themeIcon: document.getElementById('theme-icon'),
    soundBtn: document.getElementById('btn-toggle-sound'),
    soundIcon: document.getElementById('sound-icon'),
    leaderboardBtn: document.getElementById('btn-open-leaderboard'),

    // Telas
    screens: {
      welcome: document.getElementById('screen-welcome'),
      quiz: document.getElementById('screen-quiz'),
      results: document.getElementById('screen-results')
    },

    // Formulário de Boas-vindas
    setupForm: document.getElementById('quiz-setup-form'),
    playerNameInput: document.getElementById('player-name-input'),
    categorySelect: document.getElementById('category-select'),
    amountSelect: document.getElementById('amount-select'),

    // Elementos da Tela de Quiz
    progressBar: document.getElementById('quiz-progress-bar'),
    badgeCategory: document.getElementById('badge-category'),
    badgeCounter: document.getElementById('badge-counter'),
    badgeStreak: document.getElementById('badge-streak'),
    streakText: document.getElementById('streak-text'),
    timerBox: document.getElementById('timer-box'),
    timerSeconds: document.getElementById('timer-seconds'),
    scoreValue: document.getElementById('quiz-score-val'),
    questionText: document.getElementById('question-text'),
    questionMeta: document.getElementById('question-meta'),
    optionsList: document.getElementById('options-list'),
    explanationBox: document.getElementById('explanation-box'),
    explanationText: document.getElementById('explanation-text'),
    btnNext: document.getElementById('btn-next-question'),

    // Elementos da Tela de Resultados
    resultTrophy: document.getElementById('result-trophy'),
    resultTitle: document.getElementById('result-title'),
    resultMessage: document.getElementById('result-message'),
    scoreCircleProgress: document.getElementById('score-svg-circle'),
    resultPercentage: document.getElementById('result-percentage'),
    statScore: document.getElementById('stat-score'),
    statHits: document.getElementById('stat-hits'),
    statStreak: document.getElementById('stat-streak'),
    statTime: document.getElementById('stat-time'),
    btnRestart: document.getElementById('btn-restart-quiz'),
    btnReview: document.getElementById('btn-review-answers'),
    btnShare: document.getElementById('btn-share-score'),
    btnBackHome: document.getElementById('btn-back-home'),

    // Modais
    modalLeaderboard: document.getElementById('modal-leaderboard'),
    leaderboardContent: document.getElementById('leaderboard-content'),
    btnCloseLeaderboard: document.getElementById('btn-close-leaderboard'),
    btnOkLeaderboard: document.getElementById('btn-ok-leaderboard'),
    btnClearLeaderboard: document.getElementById('btn-clear-leaderboard'),

    modalReview: document.getElementById('modal-review'),
    reviewContent: document.getElementById('review-content'),
    btnCloseReview: document.getElementById('btn-close-review'),
    btnOkReview: document.getElementById('btn-ok-review'),

    // Toast
    toast: document.getElementById('toast'),
    toastIcon: document.getElementById('toast-icon'),
    toastText: document.getElementById('toast-text')
  };

  // ==========================================================================
  // 2. ESTADO GLOBAL DA APLICAÇÃO (STATE)
  // ==========================================================================
  const State = {
    playerName: '',
    category: 'todas',
    difficulty: 'todas',
    amount: 10,
    questions: [],
    currentIndex: 0,
    score: 0,
    correctAnswers: 0,
    streak: 0,
    maxStreak: 0,
    timerInterval: null,
    timePerQuestion: 15,
    currentTimeLeft: 15,
    startTime: 0,
    totalTimeSpentSeconds: 0,
    isAnswered: false,
    history: []
  };

  let toastTimeout = null;

  // ==========================================================================
  // 3. INICIALIZAÇÃO DE PREFERÊNCIAS (TEMA E ÁUDIO)
  // ==========================================================================
  function initPreferences() {
    // 1. Tema
    const savedTheme = StorageManager.getTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // 2. Som
    const isMuted = StorageManager.isSoundMuted();
    soundFX.setMuted(isMuted);
    updateSoundIcon(isMuted);

    // 3. Último Nome do Jogador
    const lastPlayer = StorageManager.getLastPlayerName();
    if (lastPlayer) {
      DOM.playerNameInput.value = lastPlayer;
    }
  }

  function updateThemeIcon(theme) {
    DOM.themeIcon.innerHTML = theme === 'dark' ? Icons.sun : Icons.moon;
  }

  function updateSoundIcon(isMuted) {
    DOM.soundIcon.innerHTML = isMuted ? Icons.volumeX : Icons.volume;
  }

  // ==========================================================================
  // 4. NAVEGAÇÃO ENTRE TELAS
  // ==========================================================================
  function switchScreen(screenName) {
    Object.values(DOM.screens).forEach(screen => {
      screen.classList.remove('active');
    });

    if (DOM.screens[screenName]) {
      DOM.screens[screenName].classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // ==========================================================================
  // 5. TOAST NOTIFICATIONS COM ÍCONES VETORIAIS
  // ==========================================================================
  function showToast(message, iconName = 'info', duration = 3000) {
    if (toastTimeout) clearTimeout(toastTimeout);

    DOM.toastIcon.innerHTML = Icons[iconName] || Icons.info;
    DOM.toastText.textContent = message;
    DOM.toast.classList.add('show');

    toastTimeout = setTimeout(() => {
      DOM.toast.classList.remove('show');
    }, duration);
  }

  // ==========================================================================
  // 6. LÓGICA DO JOGO: PREPARAÇÃO E INÍCIO
  // ==========================================================================
  function handleStartQuiz() {
    const rawName = DOM.playerNameInput.value.trim();
    if (!rawName) {
      DOM.playerNameInput.focus();
      showToast('Por favor, digite seu nome ou apelido para começar!', 'alertTriangle');
      return;
    }

    // Persiste o nome do usuário
    StorageManager.setLastPlayerName(rawName);

    // Obtém opções selecionadas
    const selectedDifficulty = document.querySelector('input[name="difficulty"]:checked')?.value || 'todas';
    const selectedCategory = DOM.categorySelect.value;
    const selectedAmount = parseInt(DOM.amountSelect.value, 10);

    // Filtra e embaralha as perguntas
    let filtered = [...QUIZ_QUESTIONS];

    if (selectedCategory !== 'todas') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    if (selectedDifficulty !== 'todas') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }

    // Caso o filtro resulte em menos perguntas que o solicitado, relaxa o filtro
    if (filtered.length < selectedAmount) {
      if (selectedCategory !== 'todas') {
        filtered = QUIZ_QUESTIONS.filter(q => q.category === selectedCategory);
      } else {
        filtered = [...QUIZ_QUESTIONS];
      }
    }

    // Algoritmo de embaralhamento Fisher-Yates
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }

    const finalQuestions = filtered.slice(0, selectedAmount);

    if (finalQuestions.length === 0) {
      showToast('Nenhuma pergunta encontrada para os critérios selecionados!', 'alertTriangle');
      return;
    }

    // Atualiza estado inicial da partida
    State.playerName = rawName;
    State.category = selectedCategory;
    State.difficulty = selectedDifficulty;
    State.amount = finalQuestions.length;
    State.questions = finalQuestions;
    State.currentIndex = 0;
    State.score = 0;
    State.correctAnswers = 0;
    State.streak = 0;
    State.maxStreak = 0;
    State.startTime = Date.now();
    State.history = [];

    soundFX.playClick();
    switchScreen('quiz');
    loadCurrentQuestion();
  }

  // ==========================================================================
  // 7. RENDERIZAÇÃO DA QUESTÃO ATUAL
  // ==========================================================================
  function loadCurrentQuestion() {
    State.isAnswered = false;
    DOM.btnNext.disabled = true;
    DOM.explanationBox.classList.remove('active');

    const question = State.questions[State.currentIndex];
    const questionNumber = State.currentIndex + 1;
    const total = State.questions.length;

    // Atualiza badges e contadores
    DOM.badgeCategory.textContent = question.categoryLabel;
    DOM.badgeCounter.textContent = `Pergunta ${questionNumber} de ${total}`;
    DOM.questionMeta.textContent = `Nível: ${question.difficultyLabel}`;
    DOM.questionText.textContent = question.question;
    DOM.scoreValue.textContent = State.score;

    // Barra de Progresso
    const progressPercent = ((questionNumber - 1) / total) * 100;
    DOM.progressBar.style.width = `${progressPercent}%`;

    // Atualiza badge de sequência de acertos (Streak)
    if (State.streak >= 2) {
      DOM.streakText.textContent = `x${State.streak} Bônus`;
      DOM.badgeStreak.classList.add('active');
    } else {
      DOM.badgeStreak.classList.remove('active');
    }

    // Limpa e renderiza as alternativas
    DOM.optionsList.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];

    question.options.forEach((optText, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option-btn animate-fade-in';
      btn.dataset.index = index;
      btn.setAttribute('aria-label', `Opção ${letters[index]}: ${optText}`);

      btn.innerHTML = `
        <span class="option-letter">${letters[index]}</span>
        <span class="option-text">${escapeHtml(optText)}</span>
        <span class="option-icon" aria-hidden="true"></span>
      `;

      btn.addEventListener('click', () => handleSelectOption(index));
      DOM.optionsList.appendChild(btn);
    });

    // Inicia o temporizador da questão
    startTimer();
  }

  // ==========================================================================
  // 8. TEMPORIZADOR POR QUESTÃO (TIMER)
  // ==========================================================================
  function startTimer() {
    clearInterval(State.timerInterval);
    State.currentTimeLeft = State.timePerQuestion;
    updateTimerDisplay();

    State.timerInterval = setInterval(() => {
      State.currentTimeLeft--;
      updateTimerDisplay();

      if (State.currentTimeLeft <= 0) {
        clearInterval(State.timerInterval);
        handleTimeout();
      }
    }, 1000);
  }

  function updateTimerDisplay() {
    DOM.timerSeconds.textContent = `${State.currentTimeLeft}s`;

    DOM.timerBox.classList.remove('warning', 'danger');
    if (State.currentTimeLeft <= 3) {
      DOM.timerBox.classList.add('danger');
    } else if (State.currentTimeLeft <= 5) {
      DOM.timerBox.classList.add('warning');
    }
  }

  // ==========================================================================
  // 9. PROCESSAMENTO DA ESCOLHA DA ALTERNATIVA
  // ==========================================================================
  function handleSelectOption(selectedIndex) {
    if (State.isAnswered) return;
    State.isAnswered = true;
    clearInterval(State.timerInterval);

    const question = State.questions[State.currentIndex];
    const isCorrect = (selectedIndex === question.correctAnswer);
    const optionButtons = DOM.optionsList.querySelectorAll('.option-btn');

    // Desabilita botões para prevenir múltiplos cliques
    optionButtons.forEach(btn => btn.disabled = true);

    const chosenBtn = optionButtons[selectedIndex];
    const correctBtn = optionButtons[question.correctAnswer];

    // Calcula tempo gasto na pergunta
    const timeSpentOnQuestion = State.timePerQuestion - State.currentTimeLeft;

    if (isCorrect) {
      chosenBtn.classList.add('correct');
      const icon = chosenBtn.querySelector('.option-icon');
      if (icon) icon.innerHTML = Icons.check;

      State.correctAnswers++;
      State.streak++;
      if (State.streak > State.maxStreak) {
        State.maxStreak = State.streak;
      }

      // Cálculo da Pontuação:
      let basePoints = 100;
      if (question.difficulty === 'medio') basePoints = 150;
      if (question.difficulty === 'dificil') basePoints = 200;

      // Bônus de rapidez
      const speedBonus = Math.round((State.currentTimeLeft / State.timePerQuestion) * 50);

      // Multiplicador por sequência de acertos
      let multiplier = 1;
      if (State.streak >= 5) multiplier = 1.5;
      else if (State.streak >= 3) multiplier = 1.25;

      const gainedScore = Math.round((basePoints + speedBonus) * multiplier);
      State.score += gainedScore;
      DOM.scoreValue.textContent = State.score;

      if (State.streak >= 3) {
        soundFX.playStreak();
      } else {
        soundFX.playCorrect();
      }
    } else {
      // Errou
      if (chosenBtn) {
        chosenBtn.classList.add('wrong', 'animate-shake');
        const icon = chosenBtn.querySelector('.option-icon');
        if (icon) icon.innerHTML = Icons.x;
      }

      // Destaca qual era a alternativa correta
      if (correctBtn) {
        correctBtn.classList.add('correct');
        const icon = correctBtn.querySelector('.option-icon');
        if (icon) icon.innerHTML = Icons.check;
      }

      State.streak = 0;
      soundFX.playWrong();
    }

    // Registra no histórico para o modal de revisão
    State.history.push({
      question: question.question,
      options: question.options,
      correctIndex: question.correctAnswer,
      selectedIndex: selectedIndex,
      isCorrect: isCorrect,
      explanation: question.explanation,
      timeSpent: timeSpentOnQuestion
    });

    // Revela explicação
    DOM.explanationText.textContent = question.explanation;
    DOM.explanationBox.classList.add('active');

    // Habilita botão para próxima pergunta
    DOM.btnNext.disabled = false;
    DOM.btnNext.focus();

    // Se for a última pergunta, ajusta texto e ícone do botão
    if (State.currentIndex === State.questions.length - 1) {
      DOM.btnNext.innerHTML = `<span>Ver Resultados</span> ${Icons.trophy}`;
    } else {
      DOM.btnNext.innerHTML = `<span>Avançar</span> ${Icons.arrowRight}`;
    }
  }

  // ==========================================================================
  // 10. TRATAMENTO DE TEMPO ESGOTADO
  // ==========================================================================
  function handleTimeout() {
    if (State.isAnswered) return;
    State.isAnswered = true;

    soundFX.playTimeout();
    showToast('Tempo esgotado para esta questão!', 'clock');

    const question = State.questions[State.currentIndex];
    const optionButtons = DOM.optionsList.querySelectorAll('.option-btn');

    optionButtons.forEach(btn => (btn.disabled = true));

    // Destaca a resposta correta
    const correctBtn = optionButtons[question.correctAnswer];
    if (correctBtn) {
      correctBtn.classList.add('correct');
      const icon = correctBtn.querySelector('.option-icon');
      if (icon) icon.innerHTML = Icons.check;
    }

    State.streak = 0;

    State.history.push({
      question: question.question,
      options: question.options,
      correctIndex: question.correctAnswer,
      selectedIndex: -1, // -1 indica tempo esgotado sem resposta
      isCorrect: false,
      explanation: question.explanation,
      timeSpent: State.timePerQuestion
    });

    DOM.explanationText.textContent = question.explanation;
    DOM.explanationBox.classList.add('active');

    DOM.btnNext.disabled = false;
    DOM.btnNext.focus();

    if (State.currentIndex === State.questions.length - 1) {
      DOM.btnNext.innerHTML = `<span>Ver Resultados</span> ${Icons.trophy}`;
    }
  }

  // ==========================================================================
  // 11. PRÓXIMA PERGUNTA OU FINALIZAÇÃO
  // ==========================================================================
  function handleNextQuestion() {
    soundFX.playClick();
    State.currentIndex++;

    if (State.currentIndex < State.questions.length) {
      loadCurrentQuestion();
    } else {
      finishQuiz();
    }
  }

  // ==========================================================================
  // 12. TELA FINAL: RESULTADOS E SALVAMENTO
  // ==========================================================================
  function finishQuiz() {
    clearInterval(State.timerInterval);

    // Barra de progresso 100%
    DOM.progressBar.style.width = '100%';

    const total = State.questions.length;
    const accuracy = Math.round((State.correctAnswers / total) * 100);
    const totalTimeSeconds = Math.round((Date.now() - State.startTime) / 1000);
    State.totalTimeSpentSeconds = totalTimeSeconds;

    // Atualiza ilustração e textos baseados no desempenho
    let trophySvg = Icons.trophy;
    let title = 'Mestre Supremo!';
    let message = `Sensacional, ${State.playerName}! Você atingiu um domínio impecável do conteúdo!`;

    if (accuracy >= 90) {
      trophySvg = Icons.trophy;
      title = 'Mestre Supremo!';
      message = `Sensacional, ${State.playerName}! Você atingiu um domínio impecável!`;
    } else if (accuracy >= 70) {
      trophySvg = Icons.medal;
      title = 'Excelente Desempenho!';
      message = `Muito bem, ${State.playerName}! Seu conhecimento é impressionante!`;
    } else if (accuracy >= 50) {
      trophySvg = Icons.medal;
      title = 'Bom Desempenho!';
      message = `Bom jogo, ${State.playerName}! Com um pouco mais de treino você chega ao topo!`;
    } else {
      trophySvg = Icons.target;
      title = 'Continue Praticando!';
      message = `Não desanime, ${State.playerName}! O conhecimento se constrói passo a passo!`;
    }

    DOM.resultTrophy.innerHTML = trophySvg;
    const resultSvg = DOM.resultTrophy.querySelector('svg');
    if (resultSvg) {
      resultSvg.classList.add('app-icon-lg');
    }

    DOM.resultTitle.textContent = title;
    DOM.resultMessage.textContent = message;

    // Estatísticas da grade
    DOM.statScore.textContent = State.score;
    DOM.statHits.textContent = `${State.correctAnswers}/${total}`;
    DOM.statStreak.textContent = `x${State.maxStreak}`;
    DOM.statTime.textContent = formatTime(totalTimeSeconds);

    // Animação do Indicador Radial SVG
    DOM.resultPercentage.textContent = `${accuracy}%`;
    const circumference = 283; // 2 * pi * r (r=45 => ~283)
    const offset = circumference - (circumference * accuracy) / 100;
    
    // Reseta antes de animar
    DOM.scoreCircleProgress.style.strokeDashoffset = circumference;
    setTimeout(() => {
      DOM.scoreCircleProgress.style.strokeDashoffset = offset;
    }, 150);

    // Salva pontuação no Placar LocalStorage
    StorageManager.saveScore({
      playerName: State.playerName,
      score: State.score,
      accuracy: accuracy,
      correctAnswers: State.correctAnswers,
      totalQuestions: total,
      categoryLabel: State.category === 'todas' ? 'Misto' : DOM.categorySelect.options[DOM.categorySelect.selectedIndex].text
    });

    soundFX.playVictory();
    switchScreen('results');
  }

  // ==========================================================================
  // 13. PLACAR DE LÍDERES (LEADERBOARD MODAL)
  // ==========================================================================
  function openLeaderboard() {
    soundFX.playClick();
    renderLeaderboard();
    DOM.modalLeaderboard.classList.add('active');
  }

  function closeLeaderboard() {
    DOM.modalLeaderboard.classList.remove('active');
  }

  function renderLeaderboard() {
    const list = StorageManager.getLeaderboard();
    DOM.leaderboardContent.innerHTML = '';

    if (list.length === 0) {
      DOM.leaderboardContent.innerHTML = `
        <div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-muted);">
          <div style="margin-bottom: 0.75rem; color: var(--text-muted);">${Icons.medal}</div>
          <p style="font-weight: 600;">Nenhuma pontuação registrada ainda.</p>
          <small>Jogue uma partida para inaugurar o placar!</small>
        </div>
      `;
      const svg = DOM.leaderboardContent.querySelector('svg');
      if (svg) svg.classList.add('app-icon-lg');
      return;
    }

    list.forEach((entry, idx) => {
      const item = document.createElement('div');
      item.className = 'leaderboard-item animate-fade-in';

      let rankBadgeHtml = '';
      if (idx === 0) {
        rankBadgeHtml = `<div class="leaderboard-rank rank-1" title="1º Lugar">1º</div>`;
      } else if (idx === 1) {
        rankBadgeHtml = `<div class="leaderboard-rank rank-2" title="2º Lugar">2º</div>`;
      } else if (idx === 2) {
        rankBadgeHtml = `<div class="leaderboard-rank rank-3" title="3º Lugar">3º</div>`;
      } else {
        rankBadgeHtml = `<div class="leaderboard-rank rank-other">#${idx + 1}</div>`;
      }

      item.innerHTML = `
        ${rankBadgeHtml}
        <div class="leaderboard-player">
          <span class="leaderboard-name">${escapeHtml(entry.playerName)}</span>
          <span class="leaderboard-meta">${escapeHtml(entry.categoryLabel)} • ${entry.correctAnswers}/${entry.totalQuestions} acertos (${entry.accuracy}%) • ${entry.date}</span>
        </div>
        <div class="leaderboard-score">${entry.score} pts</div>
      `;

      DOM.leaderboardContent.appendChild(item);
    });
  }

  function handleClearLeaderboard() {
    if (confirm('Tem certeza de que deseja zerar todo o histórico de pontuações?')) {
      StorageManager.clearLeaderboard();
      renderLeaderboard();
      showToast('Placar de líderes reiniciado com sucesso!', 'trash');
    }
  }

  // ==========================================================================
  // 14. MODAL DE REVISÃO DAS RESPOSTAS
  // ==========================================================================
  function openReviewModal() {
    soundFX.playClick();
    renderReview();
    DOM.modalReview.classList.add('active');
  }

  function closeReviewModal() {
    DOM.modalReview.classList.remove('active');
  }

  function renderReview() {
    DOM.reviewContent.innerHTML = '';

    if (State.history.length === 0) {
      DOM.reviewContent.innerHTML = `<p style="color: var(--text-muted); text-align: center;">Nenhuma resposta registrada.</p>`;
      return;
    }

    State.history.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = `review-item ${item.isCorrect ? 'was-correct' : 'was-wrong'} animate-fade-in`;

      const userAnsText = item.selectedIndex >= 0 ? item.options[item.selectedIndex] : 'Tempo esgotado (sem resposta)';
      const correctAnsText = item.options[item.correctIndex];

      const statusIcon = item.isCorrect ? Icons.check : Icons.x;

      div.innerHTML = `
        <div class="review-question-text">
          ${index + 1}. ${escapeHtml(item.question)}
        </div>
        <div class="review-answer-line">
          <strong>Sua resposta:</strong> 
          <span style="display: inline-flex; align-items: center; gap: 0.35rem; color: ${item.isCorrect ? 'var(--success)' : 'var(--danger)'};">
            ${statusIcon} ${escapeHtml(userAnsText)}
          </span>
        </div>
        ${!item.isCorrect ? `
          <div class="review-answer-line">
            <strong>Resposta correta:</strong> 
            <span style="display: inline-flex; align-items: center; gap: 0.35rem; color: var(--success);">
              ${Icons.check} ${escapeHtml(correctAnsText)}
            </span>
          </div>
        ` : ''}
        <div class="review-explanation">
          ${Icons.lightbulb}
          <span>${escapeHtml(item.explanation)}</span>
        </div>
      `;

      DOM.reviewContent.appendChild(div);
    });
  }

  // ==========================================================================
  // 15. COMPARTILHAMENTO DE RESULTADO
  // ==========================================================================
  function handleShareScore() {
    const total = State.questions.length;
    const accuracy = Math.round((State.correctAnswers / total) * 100);
    const textToShare = `QuizMaster | Marquei ${State.score} pontos com ${accuracy}% de precisão (${State.correctAnswers}/${total}) no QuizMaster!\nSerá que você consegue me superar?`;

    if (navigator.share) {
      navigator.share({
        title: 'QuizMaster - Meu Desempenho',
        text: textToShare,
        url: window.location.href
      }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(textToShare).then(() => {
        showToast('Resultado copiado para a área de transferência!', 'fileText');
      }).catch(() => {
        showToast('Não foi possível copiar automaticamente.', 'alertTriangle');
      });
    } else {
      showToast('Compartilhamento não suportado neste navegador.', 'alertTriangle');
    }
  }

  // ==========================================================================
  // 16. EVENT LISTENERS E ATALHOS DE TECLADO
  // ==========================================================================
  function setupEventListeners() {
    // Alternar Tema (Claro / Escuro)
    DOM.themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      StorageManager.setTheme(nextTheme);
      updateThemeIcon(nextTheme);
      soundFX.playClick();
    });

    // Alternar Som (Mudo / Ativado)
    DOM.soundBtn.addEventListener('click', () => {
      const isMutedNow = !soundFX.isMuted;
      soundFX.setMuted(isMutedNow);
      StorageManager.setSoundMuted(isMutedNow);
      updateSoundIcon(isMutedNow);
      if (!isMutedNow) soundFX.playClick();
    });

    // Iniciar Quiz
    DOM.setupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleStartQuiz();
    });

    // Próxima Pergunta
    DOM.btnNext.addEventListener('click', handleNextQuestion);

    // Botões de Resultados
    DOM.btnRestart.addEventListener('click', () => {
      soundFX.playClick();
      handleStartQuiz();
    });

    DOM.btnReview.addEventListener('click', openReviewModal);
    DOM.btnShare.addEventListener('click', handleShareScore);
    DOM.btnBackHome.addEventListener('click', () => {
      soundFX.playClick();
      switchScreen('welcome');
    });

    // Modais: Placar
    DOM.leaderboardBtn.addEventListener('click', openLeaderboard);
    DOM.btnCloseLeaderboard.addEventListener('click', closeLeaderboard);
    DOM.btnOkLeaderboard.addEventListener('click', closeLeaderboard);
    DOM.btnClearLeaderboard.addEventListener('click', handleClearLeaderboard);

    // Modais: Revisão
    DOM.btnCloseReview.addEventListener('click', closeReviewModal);
    DOM.btnOkReview.addEventListener('click', closeReviewModal);

    // Fecha modal clicando no fundo escuro
    [DOM.modalLeaderboard, DOM.modalReview].forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });

    // Atalhos de teclado (Acessibilidade)
    window.addEventListener('keydown', (e) => {
      // Fecha modais com tecla Escape
      if (e.key === 'Escape') {
        closeLeaderboard();
        closeReviewModal();
        return;
      }

      // Atalhos ativos apenas na tela de Quiz
      if (DOM.screens.quiz.classList.contains('active')) {
        // Teclas 1 a 4 ou A a D para selecionar opções
        const keyMap = {
          '1': 0, 'a': 0, 'A': 0,
          '2': 1, 'b': 1, 'B': 1,
          '3': 2, 'c': 2, 'C': 2,
          '4': 3, 'd': 3, 'D': 3
        };

        if (keyMap[e.key] !== undefined && !State.isAnswered) {
          handleSelectOption(keyMap[e.key]);
        }

        // Tecla Enter avança quando a pergunta já foi respondida
        if (e.key === 'Enter' && State.isAnswered && !DOM.btnNext.disabled) {
          e.preventDefault();
          handleNextQuestion();
        }
      }
    });
  }

  // ==========================================================================
  // 17. UTILITÁRIOS
  // ==========================================================================
  function formatTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==========================================================================
  // DISPARO DA INICIALIZAÇÃO
  // ==========================================================================
  initPreferences();
  setupEventListeners();
});
