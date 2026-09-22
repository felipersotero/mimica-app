import { useState } from 'react';

export default function SetupScreen({ onStartGame }) {
  const [gameMode, setGameMode] = useState('individual');
  const [roundTime, setRoundTime] = useState(60);
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  const [teamInput, setTeamInput] = useState('');
  const [teams, setTeams] = useState([]);
  
  // Novas opções de customização para times
  const teamColors = ['#08D9D6', '#FF2E63', '#FFD700', '#9D00FF', '#00FF00', '#FF8C00', '#0743b2', '#FF00FF', '#9d90a8', '#00FA9A'];
  const teamEmojis = ['🦁', '🦅', '🦈', '🐍', '🦍', '🦄', '🐺', '🐉', '🐻', '🦊', '🦉', '🐙'];
  const [selectedColor, setSelectedColor] = useState(teamColors[0]);
  const [selectedEmoji, setSelectedEmoji] = useState(teamEmojis[0]);

const availableCategories = [
    { id: 'comidas', label: '🍔 Comidas' },
    { id: 'animais', label: '🐶 Animais' },
    { id: 'filmes', label: '🎬 Filmes' },
    { id: 'ditos', label: '💬 Ditos Populares' },
    { id: 'profissoes', label: '💼 Profissões' },
    { id: 'esportes', label: '🏀 Esportes' },
    { id: 'personagens', label: '🦸‍♂️ Personagens' },
    { id: 'lugares_historicos', label: '🏛️ Lugares & História' },
    { id: 'acoes', label: '🏃 Ações' },
    { id: 'objetos', label: '📦 Objetos' },
    { id: 'veiculos', label: '🚗 Veículos' },
    { id: 'paises_cidades', label: '🌍 Países & Cidades' },
    { id: 'natureza', label: '🌿 Natureza' },
    { id: 'emocoes', label: '😊 Emoções' },
    { id: 'datas_comemorativas', label: '🎉 Datas Comemorativas' },
    { id: 'celebridades_historicos', label: '👑 Celebridades & Históricas' }
];

  const toggleCategory = (id) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // Lógica do botão Selecionar Todas
  const isAllSelected = selectedCategories.length === availableCategories.length;
  const handleToggleAllCategories = () => {
    if (isAllSelected) {
      setSelectedCategories([]); // Limpa todas
    } else {
      setSelectedCategories(availableCategories.map(cat => cat.id)); // Seleciona todas
    }
  };

  const handleAddTeam = () => {
    const nome = teamInput.trim();
    // Verifica se o nome não está vazio e se já não existe um time com esse nome
    if (nome !== '' && !teams.some(t => t.nome === nome)) {
      setTeams([...teams, { nome, color: selectedColor, emoji: selectedEmoji }]);
      setTeamInput('');
    }
  };

  const handleRemoveTeam = (indexToRemove) => {
    setTeams(teams.filter((_, index) => index !== indexToRemove));
  };

  const canStart = selectedCategories.length > 0 && 
                   (gameMode === 'individual' || (gameMode === 'grupo' && teams.length >= 2));

  const handleStart = () => {
    onStartGame({
      gameMode,
      roundTime,
      selectedCategories,
      // Agora mandamos o objeto do time completo, adicionando os pontos = 0
      teams: gameMode === 'grupo' ? teams.map(t => ({ ...t, pontos: 0 })) : []
    });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Mímica App</h1>
      <div style={{ display: 'flex', justifyContent: 'center'}}>
        <p>v2.0</p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.subtitle}>Modo de Jogo</h3>
        <div style={styles.row}>
          <button style={gameMode === 'individual' ? styles.btnActive : styles.btnInactive} onClick={() => setGameMode('individual')}>👤 Individual</button>
          <button style={gameMode === 'grupo' ? styles.btnActive : styles.btnInactive} onClick={() => setGameMode('grupo')}>👥 Em Grupo</button>
        </div>
      </div>

      {gameMode === 'grupo' && (
        <div style={styles.section}>
          <h3 style={styles.subtitle}>Equipes</h3>
          
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input 
              style={styles.input} 
              value={teamInput}
              onChange={(e) => setTeamInput(e.target.value)}
              placeholder="Nome da equipe..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddTeam()}
            />
            <button style={styles.addBtn} onClick={handleAddTeam}>+</button>
          </div>

        {/* Seletores de Emoji e Cor */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            
            {/* Trocamos styles.row por um estilo flexível que permite quebra de linha */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {teamEmojis.map(emoji => (
                <span 
                  key={emoji} 
                  onClick={() => setSelectedEmoji(emoji)}
                  style={{ ...styles.pickerItem, backgroundColor: selectedEmoji === emoji ? '#444' : 'transparent' }}
                >
                  {emoji}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {teamColors.map(color => (
                <div 
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{ ...styles.colorDot, backgroundColor: color, border: selectedColor === color ? '2px solid #FFF' : 'none' }}
                />
              ))}
            </div>
            
          </div>
          
          <div style={styles.teamsList}>
            {teams.map((team, index) => (
              <div key={index} style={{ ...styles.teamBadge, borderColor: team.color }}>
                <span>{team.emoji} {team.nome}</span>
                <button style={styles.removeBtn} onClick={() => handleRemoveTeam(index)}>X</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.section}>
        <h3 style={styles.subtitle}>Tempo por rodada</h3>
        <div style={styles.row}>
          {[30, 60, 90].map(time => (
            <button key={time} style={roundTime === time ? styles.btnActive : styles.btnInactive} onClick={() => setRoundTime(time)}>{time}s</button>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
          <h3 style={{...styles.subtitle, marginBottom: 0}}>Categorias</h3>
          <button style={styles.linkBtn} onClick={handleToggleAllCategories}>
            {isAllSelected ? 'Desmarcar Todas' : 'Selecionar Todas'}
          </button>
        </div>
        
        <div style={styles.categoriesGrid}>
          {availableCategories.map(cat => (
            <button 
              key={cat.id}
              style={selectedCategories.includes(cat.id) ? styles.catActive : styles.catInactive}
              onClick={() => toggleCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.footer}>
        <button disabled={!canStart} onClick={handleStart} style={{ backgroundColor: canStart ? 'var(--primary-color)' : '#333' }}>
          Começar Jogo
        </button>
      </div>
    </div>
  );
}

const styles = {
  // ... (mantenha os estilos anteriores que já estavam no arquivo e adicione os novos abaixo)
  container: { display: 'flex', flexDirection: 'column', height: '100%', flex: 1, overflowY: 'auto', paddingBottom: '2rem' },
  title: { textAlign: 'center', color: 'var(--primary-color)', marginBottom: '2rem' },
  section: { marginBottom: '2rem' },
  subtitle: { fontSize: '1rem', color: '#aaa', marginBottom: '0.8rem' },
  row: { display: 'flex', gap: '0.5rem' },
  btnActive: { backgroundColor: 'var(--primary-color)', color: '#000', flex: 1 },
  btnInactive: { backgroundColor: '#333', color: '#FFF', flex: 1 },
  input: { flex: 1, padding: '0.8rem', borderRadius: '8px', border: 'none', backgroundColor: '#333', color: '#FFF', fontSize: '1rem' },
  addBtn: { width: '50px', backgroundColor: 'var(--success-color)', color: '#000', marginBottom: 0 },
  teamsList: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  teamBadge: { backgroundColor: '#1E1E1E', border: '1px solid #444', padding: '0.5rem 0.8rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.5rem' },
  removeBtn: { backgroundColor: 'transparent', color: 'var(--danger-color)', width: 'auto', padding: 0, margin: 0, fontSize: '1rem' },
  categoriesGrid: { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' },
  catActive: { backgroundColor: '#FFF', color: '#000', width: 'auto', padding: '0.6rem 1rem', borderRadius: '20px', marginBottom: 0 },
  catInactive: { backgroundColor: 'transparent', border: '1px solid #555', color: '#FFF', width: 'auto', padding: '0.6rem 1rem', borderRadius: '20px', marginBottom: 0 },
  footer: { marginTop: 'auto', paddingTop: '1rem' },
  
  // NOVOS ESTILOS
  pickerItem: { fontSize: '1.5rem', cursor: 'pointer', padding: '0.2rem', borderRadius: '8px', userSelect: 'none' },
  colorDot: { width: '25px', height: '25px', borderRadius: '50%', cursor: 'pointer' },
  linkBtn: { backgroundColor: 'transparent', color: 'var(--primary-color)', fontSize: '0.85rem', width: 'auto', padding: 0, margin: 0, border: 'none' }
};