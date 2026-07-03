import { useState, useEffect, useCallback } from 'react';

// Agora recebemos a prop currentTeam
export default function GameScreen({ initialWords, roundTime, onFinishRound, currentTeam }) {
  const [timeLeft, setTimeLeft] = useState(roundTime);
  const [availableWords, setAvailableWords] = useState([...initialWords]);
  
  // currentWord agora inicializa como um objeto com a estrutura que criamos
  const [currentWord, setCurrentWord] = useState({ text: '', category: '' });
  
  const [roundHistory, setRoundHistory] = useState([]);
  const [isSkipDisabled, setIsSkipDisabled] = useState(true);

  const drawNextWord = useCallback(() => {
    if (availableWords.length === 0) {
      onFinishRound(roundHistory);
      return;
    }
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const wordObj = availableWords[randomIndex];
    
    setCurrentWord(wordObj);
    setAvailableWords(prev => prev.filter((_, index) => index !== randomIndex));
  }, [availableWords, roundHistory, onFinishRound]);

  useEffect(() => {
    if (currentWord.text === '') drawNextWord();
  }, [currentWord, drawNextWord]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onFinishRound(roundHistory);
      return;
    }
    const timerInterval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerInterval);
  }, [timeLeft, onFinishRound, roundHistory]);

  useEffect(() => {
    setIsSkipDisabled(true);
    const skipTimer = setTimeout(() => setIsSkipDisabled(false), 5000);
    return () => clearTimeout(skipTimer);
  }, [currentWord]);

  const handleCorrect = () => {
    // Salvamos apenas o texto da palavra para não quebrar a ReviewScreen
    setRoundHistory(prev => [...prev, { palavra: currentWord.text, status: 'acertou' }]);
    drawNextWord();
  };

  const handleSkip = () => {
    setRoundHistory(prev => [...prev, { palavra: currentWord.text, status: 'pulou' }]);
    drawNextWord();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div style={styles.container}>
      
      {/* NOVO: Exibe a equipe se estivermos no modo grupo */}
      {currentTeam && (
        <div style={{...styles.teamHeader, borderColor: currentTeam.color}}>
          <span style={{ fontSize: '1.5rem' }}>{currentTeam.emoji}</span>
          <span style={{ color: currentTeam.color, fontWeight: 'bold' }}>Equipe da vez: {currentTeam.nome}</span>
        </div>
      )}

      <div style={styles.header}>
        <h1 style={{ ...styles.timer, color: timeLeft <= 10 ? 'var(--danger-color)' : 'var(--primary-color)' }}>
          {formatTime(timeLeft)}
        </h1>
      </div>

      <div style={styles.wordContainer}>
        {/* NOVO: Exibe a categoria acima ou abaixo da palavra */}
        <span style={styles.categoryLabel}>{currentWord.category}</span>
        <h2 style={styles.word}>{currentWord.text}</h2>
      </div>

      <div style={styles.controls}>
        <button onClick={handleCorrect} style={{ backgroundColor: 'var(--success-color)', color: '#000' }}>
          Acertou!
        </button>
        
        <button 
          onClick={handleSkip} 
          disabled={isSkipDisabled}
          style={{ 
            position: 'relative', overflow: 'hidden',
            backgroundColor: isSkipDisabled ? '#333' : 'var(--danger-color)',
            color: isSkipDisabled ? '#aaa' : '#FFF'
          }}
        >
          {isSkipDisabled && <div key={currentWord.text} className="skip-progress-bar"></div>}
          <span className="btn-text">{isSkipDisabled ? 'Aguarde...' : 'Pular'}</span>
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between', flex: 1 },
  header: { textAlign: 'center', padding: '1rem' },
  timer: { fontSize: '4rem', margin: 0, transition: 'color 0.3s' },
  wordContainer: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  word: { fontSize: '3rem', textAlign: 'center', margin: 0, wordBreak: 'break-word' },
  controls: { display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  
  // NOVOS ESTILOS
  categoryLabel: { fontSize: '1.2rem', color: '#aaa', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' },
  teamHeader: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: '#1E1E1E', padding: '0.5rem', borderRadius: '8px', borderBottom: '2px solid', marginBottom: '1rem' }
};