import { useState, useEffect } from 'react';
import './index.css';
import SetupScreen from './screens/SetupScreen';
import GameScreen from './screens/GameScreen';
import ReviewScreen from './screens/ReviewScreen';
import ScoreScreen from './screens/ScoreScreen';

// IMPORTANDO O NOVO BANCO DE PALAVRAS
import dicionarioData from './data/palavras.json';

function App() {
  const [currentScreen, setCurrentScreen] = useState('setup');
  const [gameSettings, setGameSettings] = useState(null);
  const [currentRoundHistory, setCurrentRoundHistory] = useState([]);
  const [currentTeamIndex, setCurrentTeamIndex] = useState(0);

  // NOVO: Bloqueio de fechamento acidental ativo em TODAS as telas
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = ''; 
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);
  
  // O dicionário interno antigo foi APAGADO.
  // Atualizamos as labels para bater com as novas categorias do JSON
  const categoryLabels = {
    comidas: '🍔 Comidas',
    animais: '🐶 Animais',
    filmes: '🎬 Filmes & Séries',
    ditos: '💬 Ditos Populares',
    profissoes: '💼 Profissões',
    esportes: '🏀 Esportes',
    personagens: '🦸‍♂️ Personagens',
    lugares_historicos: '🏛️ Lugares & História',
    acoes: '🏃 Ações',
    objetos: '📦 Objetos',
    veiculos: '🚗 Veículos',
    paises_cidades: '🌍 Países & Cidades',
    natureza: '🌿 Natureza',
    emocoes: '😊 Emoções',
    datas_comemorativas: '🎉 Datas Comemorativas',
    celebridades_historicos: '👑 Celebridades & Históricas',
  };

  const generateWordList = (categories) => {
    let wordList = [];
    categories.forEach(cat => {
      // Agora acessamos o JSON importado: dicionarioData
      if (dicionarioData[cat]) {
        const mappedWords = dicionarioData[cat].map(word => ({
          text: word,
          category: categoryLabels[cat]
        }));
        wordList = [...wordList, ...mappedWords];
      }
    });
    return wordList.sort(() => Math.random() - 0.5);
  };

// ... restante do código do App.jsx continua igual

  const handleStartGame = (settings) => {
    setGameSettings({
      ...settings,
      words: generateWordList(settings.selectedCategories),
      roundNumber: 1
    });
    
    // Se for grupo, vai para a tela de aviso de turno. Se for individual, vai direto pro jogo.
    if (settings.gameMode === 'grupo') {
      setCurrentTeamIndex(0);
      setCurrentScreen('turn');
    } else {
      setCurrentScreen('game');
    }
  };

  const handleFinishRound = (history) => {
    setCurrentRoundHistory(history);
    setCurrentScreen('review');
  };

  const handleReviewConfirm = (finalHistory, finalScore) => {
    if (gameSettings.gameMode === 'individual') {
      // Salva os pontos do modo individual e vai pro placar final
      setGameSettings(prev => ({ ...prev, individualScore: finalScore }));
      setCurrentScreen('score');
    } else {
      // Modo em Grupo: Atualiza os pontos da equipe atual
      const updatedTeams = [...gameSettings.teams];
      updatedTeams[currentTeamIndex].pontos += finalScore;
      
      setGameSettings(prev => ({ ...prev, teams: updatedTeams }));

      // Checa se ainda tem times para jogar nesta rodada
      if (currentTeamIndex + 1 < updatedTeams.length) {
        setCurrentTeamIndex(prev => prev + 1); // Passa a vez para o próximo
        setCurrentScreen('turn'); // Mostra a tela de aviso
      } else {
        // Se todos jogaram, vai para o placar final
        // (Aqui você poderia zerar o index e continuar o jogo se quisesse múltiplas rodadas)
        setCurrentScreen('score'); 
      }
    }
  };

// ... (mantenha os imports e o início do App iguais)

  // Função para criar nova rodada com os mesmos times e pontos
  const handleNextRound = () => {
    setGameSettings(prev => ({
      ...prev,
      // Sorteia uma nova lista de palavras baseada nas categorias escolhidas
      words: generateWordList(prev.selectedCategories),
      roundNumber: (prev.roundNumber || 1) + 1 // Incrementa o número da rodada
    }));
    setCurrentTeamIndex(0); // Volta para o primeiro time
    setCurrentScreen('turn'); // Mostra a tela de preparação
  };

  return (
    <div className="app-container">
      {currentScreen === 'setup' && (
        <SetupScreen onStartGame={handleStartGame} />
      )}

      {/* TELA DE TRANSIÇÃO DE TURNO ATUALIZADA (Com emoji e cor) */}
      {currentScreen === 'turn' && gameSettings && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <h2 style={{ color: '#aaa' }}>Preparem-se!</h2>
          
          <h1 style={{ 
            fontSize: '3rem', 
            color: gameSettings.teams[currentTeamIndex].color, // Aplica a cor do time
            margin: '1rem 0' 
          }}>
            {gameSettings.teams[currentTeamIndex].emoji} {gameSettings.teams[currentTeamIndex].nome}
          </h1>
          
          <p>Passem o celular para a pessoa que vai fazer as mímicas desta equipe.</p>
          <button 
            onClick={() => setCurrentScreen('game')} 
            style={{ backgroundColor: 'var(--primary-color)', marginTop: '3rem', color: '#000' }}
          >
            Estou Pronto!
          </button>
        </div>
      )}

      {currentScreen === 'game' && gameSettings && (
        <GameScreen 
          initialWords={gameSettings.words} 
          roundTime={gameSettings.roundTime} 
          onFinishRound={handleFinishRound} 
          currentTeam={gameSettings.gameMode === 'grupo' ? gameSettings.teams[currentTeamIndex] : null} 
        />
      )}

      {currentScreen === 'review' && (
        <ReviewScreen 
          roundHistory={currentRoundHistory} 
          onConfirm={handleReviewConfirm} 
        />
      )}

      {/* PASSANDO A NOVA FUNÇÃO PARA A TELA DE PLACAR */}
      {currentScreen === 'score' && (
        <ScoreScreen 
          gameSettings={gameSettings} 
          onRestart={() => setCurrentScreen('setup')} 
          onNextRound={handleNextRound} 
        />
      )}
    </div>
  );
}

export default App;