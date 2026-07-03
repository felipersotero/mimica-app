import { useState } from 'react';

export default function ReviewScreen({ roundHistory, onConfirm }) {
  // Criamos uma cópia local do histórico para que o usuário possa
  // fazer as alterações antes de enviarmos o resultado final
  const [editableHistory, setEditableHistory] = useState([...roundHistory]);

  // Função que inverte o status quando o usuário clica no card
  const toggleStatus = (indexToToggle) => {
    setEditableHistory(prev => 
      prev.map((item, index) => {
        if (index === indexToToggle) {
          return {
            ...item,
            status: item.status === 'acertou' ? 'pulou' : 'acertou'
          };
        }
        return item;
      })
    );
  };

  // Calcula dinamicamente quantos acertos estão confirmados na tela
  const totalAcertos = editableHistory.filter(item => item.status === 'acertou').length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Revisão da Rodada</h2>
        <p>Acertos confirmados: <strong style={{ fontSize: '1.5rem', color: 'var(--success-color)' }}>{totalAcertos}</strong></p>
        <p style={{ fontSize: '0.9rem', color: '#aaa' }}>Toque em uma palavra para alterar o resultado caso tenha clicado errado.</p>
      </div>

      <div style={styles.listContainer}>
        {editableHistory.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Nenhuma palavra foi jogada.</p>
        ) : (
          editableHistory.map((item, index) => (
            <div 
              key={index} 
              style={{
                ...styles.listItem,
                borderColor: item.status === 'acertou' ? 'var(--success-color)' : 'var(--danger-color)'
              }}
              onClick={() => toggleStatus(index)}
            >
              <span style={styles.wordText}>{item.palavra}</span>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: item.status === 'acertou' ? 'var(--success-color)' : 'var(--danger-color)',
                color: item.status === 'acertou' ? '#000' : '#FFF'
              }}>
                {item.status === 'acertou' ? '✓ Acertou' : '✗ Pulou/Errou'}
              </span>
            </div>
          ))
        )}
      </div>

      <div style={styles.footer}>
        <button 
          onClick={() => onConfirm(editableHistory, totalAcertos)}
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          Confirmar e Avançar
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    flex: 1,
  },
  header: {
    textAlign: 'center',
    paddingBottom: '1rem',
  },
  listContainer: {
    flex: 1,
    overflowY: 'auto', // Permite rolar a lista se houver muitas palavras
    display: 'flex',
    flexDirection: 'column',
    gap: '0.8rem',
    padding: '0.5rem 0',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#1E1E1E',
    borderRadius: '8px',
    borderLeft: '6px solid', // A cor dessa borda muda de acordo com o status
    cursor: 'pointer',
    userSelect: 'none', // Evita selecionar o texto ao clicar rápido
  },
  wordText: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
  },
  statusBadge: {
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  footer: {
    paddingTop: '1rem',
    marginTop: 'auto',
  }
};