export default function ScoreScreen({ gameSettings, onRestart, onNextRound }) {
  const isGroup = gameSettings.gameMode === 'grupo';

  // Se for grupo, ordena as equipes pela pontuação (do maior para o menor)
  const sortedTeams = isGroup 
    ? [...gameSettings.teams].sort((a, b) => b.pontos - a.pontos)
    : [];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Fim de Rodada!</h1>

      {isGroup ? (
        <div style={styles.scoreboard}>
          <h3 style={{ color: '#aaa', marginBottom: '1rem' }}>Ranking Geral</h3>
          {sortedTeams.map((team, index) => (
            <div 
              key={index} 
              style={{
                ...styles.teamRow,
                borderColor: team.color // A borda ganha a cor do time
              }}
            >
              <div style={styles.teamInfo}>
                <span style={styles.position}>{index + 1}º</span>
                {/* Mostrando o Emoji e o Nome */}
                <span style={styles.teamName}>{team.emoji} {team.nome}</span>
              </div>
              {/* O número de pontos também ganha a cor do time */}
              <span style={{...styles.score, color: team.color}}>{team.pontos} pts</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.scoreboard}>
          <h3 style={{ color: '#aaa', marginBottom: '1rem' }}>Seu Resultado</h3>
          <p style={{ fontSize: '4rem', color: 'var(--success-color)', margin: '1rem 0' }}>
            {gameSettings.individualScore || 0}
          </p>
          <p>acertos na rodada</p>
        </div>
      )}

      <div style={styles.footer}>
        {/* Mostra o botão de Próxima Rodada apenas no Modo em Grupo */}
        {isGroup && (
          <button 
            onClick={onNextRound} 
            style={{ backgroundColor: 'var(--success-color)', color: '#000', marginBottom: '1rem' }}
          >
            Jogar Próxima Rodada
          </button>
        )}
        
        <button 
          onClick={onRestart} 
          style={{ backgroundColor: '#333', color: '#FFF' }}
        >
          {isGroup ? 'Finalizar e Criar Novo Jogo' : 'Jogar Novamente'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', flex: 1, textAlign: 'center' },
  title: { color: 'var(--primary-color)', marginBottom: '2rem' },
  scoreboard: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' },
  teamRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1E1E1E', padding: '1rem', borderRadius: '8px', width: '100%', borderLeft: '6px solid' },
  teamInfo: { display: 'flex', alignItems: 'center', gap: '1rem' },
  position: { fontSize: '1.2rem', fontWeight: 'bold', color: '#888' },
  teamName: { fontSize: '1.2rem', fontWeight: 'bold' },
  score: { fontSize: '1.5rem', fontWeight: 'bold' },
  footer: { marginTop: 'auto', paddingTop: '2rem' }
};