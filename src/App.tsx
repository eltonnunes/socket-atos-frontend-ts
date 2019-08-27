import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

export default function App() {
  const [io] = useState(socketIOClient('https://pohs3.sse.codesandbox.io/'));
  const [mensagens, setMensagens] = useState<Array<string>>([]);
  const [novaMensagem, setNovaMensagem] = useState<string>('');
  const [sala, setSala] = useState<Boolean>(false);
  const [idsConectados, setIdsConectados] = useState<Array<string>>([]);
  const [meuId, setMeuId] = useState<string>('');

  function enviarMensagem() {
    setMensagens([...mensagens, novaMensagem]);
    io.emit('novaMensagem', novaMensagem);
    setNovaMensagem('');
  }

  function enviarMensagemSala() {
    io.emit('novaMensagemSala', novaMensagem);
    setNovaMensagem('');
  }

  function enviarMensagemId(id: string) {
    setMensagens([...mensagens, novaMensagem]);
    io.emit('novaMensagemId', id, novaMensagem);
    setNovaMensagem('');
  }

  useEffect(() => {
    io.on('mensagens', (novaMensagem: string) => {
      setMensagens([...mensagens, novaMensagem]);
    });

    io.on('sala', () => {
      setSala(!sala);
    });

    io.on('idsConectados', (idsConectados: [string]) => {
      setIdsConectados(idsConectados);
    });

    io.on('connect', () => {
      setMeuId(io.id);
    });
  }, [io, sala, mensagens]);

  return (
    <>
      <h2>{meuId}</h2> - <pre>IDS: {idsConectados.length}</pre>
      {!sala && (
        <button onClick={() => io.emit('entrarSala', '1107')}>
          Entrar na sala
        </button>
      )}
      {sala && (
        <button onClick={() => io.emit('sairSala', '1107')}>
          Sair da sal
        </button>
      )}
      <ul>
        {mensagens.map((mensagem, index) => (
          <li key={index}>{mensagem}</li>
        ))}
      </ul>
      <input
        autoFocus
        value={novaMensagem}
        onChange={e => setNovaMensagem(e.target.value)}
      />
      <br />
      <br />
      <button onClick={enviarMensagem}>Enviar</button>
      <br />
      <button onClick={enviarMensagemSala}>Enviar para sala</button>
      <br />
      {idsConectados.map((id, index) => (
        <div key={index}>
          <button onClick={() => enviarMensagemId(id)}>Enviar para {id}</button>

          <br />
        </div>
      ))}
    </>
  );
}