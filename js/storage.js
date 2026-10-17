/**
 * ============================================================================
 * GERENCIADOR DE ARMAZENAMENTO LOCAL (LOCALSTORAGE)
 * ============================================================================
 * Centraliza e abstrai todas as operações de persistência de dados no navegador:
 * - Preferência de tema (Claro / Escuro)
 * - Preferência de som (Mudo / Ativado)
 * - Último nome de jogador utilizado
 * - Histórico e Placar de Líderes (Leaderboard)
 */

const STORAGE_KEYS = {
  THEME: 'quiz_app_theme',
  SOUND_MUTED: 'quiz_app_muted',
  LAST_PLAYER: 'quiz_app_player_name',
  LEADERBOARD: 'quiz_app_leaderboard'
};

const StorageManager = {
  /**
   * Obtém o tema salvo ou detecta a preferência do sistema operacional
   * @returns {'light' | 'dark'}
   */
  getTheme() {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved) return saved;
    // Detecção nativa do sistema do usuário
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  },

  /**
   * Salva a preferência de tema
   * @param {'light' | 'dark'} theme 
   */
  setTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (e) {
      console.warn("Não foi possível salvar o tema:", e);
    }
  },

  /**
   * Verifica se o som está mutado
   * @returns {boolean}
   */
  isSoundMuted() {
    const saved = localStorage.getItem(STORAGE_KEYS.SOUND_MUTED);
    return saved === 'true';
  },

  /**
   * Salva o estado do som
   * @param {boolean} isMuted 
   */
  setSoundMuted(isMuted) {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND_MUTED, String(isMuted));
    } catch (e) {
      console.warn("Não foi possível salvar preferência de som:", e);
    }
  },

  /**
   * Obtém o último nome de jogador usado
   * @returns {string}
   */
  getLastPlayerName() {
    return localStorage.getItem(STORAGE_KEYS.LAST_PLAYER) || '';
  },

  /**
   * Salva o último nome de jogador usado
   * @param {string} name 
   */
  setLastPlayerName(name) {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_PLAYER, name.trim());
    } catch (e) {
      console.warn("Não foi possível salvar o nome do jogador:", e);
    }
  },

  /**
   * Obtém os melhores resultados (Leaderboard)
   * @returns {Array<Object>}
   */
  getLeaderboard() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LEADERBOARD);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Erro ao carregar o ranking:", e);
      return [];
    }
  },

  /**
   * Salva uma nova pontuação no ranking (mantém os Top 10)
   * @param {Object} entry 
   * @returns {Array<Object>} Lista atualizada
   */
  saveScore(entry) {
    try {
      const leaderboard = this.getLeaderboard();
      const newEntry = {
        id: Date.now(),
        playerName: entry.playerName || 'Anônimo',
        score: entry.score || 0,
        accuracy: entry.accuracy || 0,
        correctAnswers: entry.correctAnswers || 0,
        totalQuestions: entry.totalQuestions || 0,
        categoryLabel: entry.categoryLabel || 'Geral',
        date: new Date().toLocaleDateString('pt-BR')
      };

      leaderboard.push(newEntry);

      // Ordena por pontuação decrescente, e por precisão em caso de empate
      leaderboard.sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);

      // Mantém apenas os 10 melhores
      const top10 = leaderboard.slice(0, 10);
      localStorage.setItem(STORAGE_KEYS.LEADERBOARD, JSON.stringify(top10));
      return top10;
    } catch (e) {
      console.error("Erro ao salvar pontuação no ranking:", e);
      return [];
    }
  },

  /**
   * Limpa todo o histórico de pontuações
   */
  clearLeaderboard() {
    try {
      localStorage.removeItem(STORAGE_KEYS.LEADERBOARD);
    } catch (e) {
      console.warn("Erro ao limpar ranking:", e);
    }
  }
};
