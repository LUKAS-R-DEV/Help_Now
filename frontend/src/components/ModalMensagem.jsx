import React, { useEffect } from 'react';

export default function ModalMensagem({ mensagem, tipo, onClose, duracao = 5000 }) {


  useEffect(() => {
    if (mensagem) {
      const timer = setTimeout(onClose, duracao);
      return () => clearTimeout(timer); 
    }
  }, [mensagem, duracao, onClose]);

  if (!mensagem) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          padding: '1.5rem 2rem',
          borderRadius: '10px',
          maxWidth: '350px',
          width: '90%',
          boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            marginBottom: '1.2rem',
            color: tipo === 'erro' ? '#ef4444' : '#16a34a',
            fontWeight: '600',
            fontSize: '1.1rem',
          }}
        >
          {mensagem}
        </p>
        <button
          onClick={onClose}
          style={{
            backgroundColor: tipo === 'erro' ? '#ef4444' : '#16a34a',
            color: 'white',
            border: 'none',
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
