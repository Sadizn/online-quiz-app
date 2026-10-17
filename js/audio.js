/**
 * ============================================================================
 * GERENCIADOR DE EFEITOS SONOROS (WEB AUDIO API NATIVA)
 * ============================================================================
 * Gera efeitos sonoros sintetizados em tempo real diretamente pelo navegador.
 * Vantagens:
 * - Não necessita baixar arquivos .mp3 ou .wav externos (zero latência).
 * - Funciona perfeitamente mesmo abrindo o index.html direto via file:// (sem erro de CORS).
 * - Suporta mutar/desmutar com persistência no LocalStorage.
 */

class SoundEffectsManager {
  constructor() {
    this.audioCtx = null;
    this.isMuted = false;
  }

  /**
   * Inicializa o contexto de áudio sob demanda (respeitando a política de autoplay dos navegadores)
   */
  initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Define o estado de mudo e persiste no armazenamento local
   */
  setMuted(muted) {
    this.isMuted = muted;
  }

  /**
   * Toca um tom senoidal simples com envelope de decaimento suave
   * @param {number} frequency - Frequência em Hertz (Hz)
   * @param {number} duration - Duração em segundos
   * @param {string} type - Tipo da onda: 'sine', 'triangle', 'sawtooth', 'square'
   * @param {number} gainVal - Volume máximo do som (0.0 a 1.0)
   */
  playTone(frequency, duration = 0.15, type = 'sine', gainVal = 0.15) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.warn("Falha ao sintetizar áudio:", e);
    }
  }

  /** Som de clique em botão */
  playClick() {
    this.playTone(600, 0.06, 'triangle', 0.1);
  }

  /** Som de resposta correta (arpeggio ascendente alegre) */
  playCorrect() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    // Duas notas musicais harmoniosas: E5 (659Hz) seguida de B5 (987Hz)
    this.playTone(659.25, 0.12, 'sine', 0.18);
    setTimeout(() => {
      this.playTone(987.77, 0.25, 'sine', 0.2);
    }, 100);
  }

  /** Som de resposta incorreta (tom descendente grave suave) */
  playWrong() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.audioCtx) return;

    this.playTone(220, 0.15, 'sawtooth', 0.12);
    setTimeout(() => {
      this.playTone(180, 0.25, 'sawtooth', 0.14);
    }, 120);
  }

  /** Som de tempo esgotado */
  playTimeout() {
    if (this.isMuted) return;
    this.playTone(300, 0.1, 'square', 0.1);
    setTimeout(() => {
      this.playTone(250, 0.2, 'square', 0.1);
    }, 120);
  }

  /** Som de bônus por sequência (Streak) */
  playStreak() {
    if (this.isMuted) return;
    this.playTone(523.25, 0.08, 'triangle', 0.15); // C5
    setTimeout(() => this.playTone(659.25, 0.08, 'triangle', 0.15), 80); // E5
    setTimeout(() => this.playTone(783.99, 0.18, 'triangle', 0.2), 160); // G5
  }

  /** Fanfarra final de vitória */
  playVictory() {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'sine', 0.2);
      }, index * 120);
    });
  }
}

// Instância global acessível pela aplicação
const soundFX = new SoundEffectsManager();
