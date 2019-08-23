import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'

export default function App() {
  const [io, setIO] = useState(socketIOClient('http://192.168.0.25:3333'))
  const [mensagens, setMensagens] = useState([])
  const [novaMensagem, setNovaMensagem] = useState('')
  const [sala, setSala] = useState(false)
  const [idsConectados, setIdsConectados] = useState([])
  const [meuId, setMeuId] = useState('')

  function enviarMensagem() {
    // setMensagens([...mensagens, novaMensagem])
    setMensagens(mensagens.push(novaMensagem))

    io.emit('novaMensagem', novaMensagem)

    setNovaMensagem('')
  }

  function enviarMensagemSala() {
    io.emit('novaMensagemSala', novaMensagem)

    setMensagem('')
  }

  function enviarMensagemId(id: number) {
    // setMensagens([...mensagens, novaMensagem])
    setMensagens(mensagens.concat[novaMensagem])

    io.emit('novaMensagemId', id, novaMensagem)

    setMensagem('')
  }

  function ouvirMensagens() {
    io.on('mensagens', novaMensagem => {
      setMensagens([...mensagens, novaMensagem])
    })

    io.on('sala', () => {
      setSala(!state.sala)
    })

    io.on('idsConectados', idsConectados => {
      setIdsConectados(idsConectados)
    })

    io.on('connect', () => {
      setMeuId(io.id)
    })
  }

  useEffect(() => {
    ouvirMensagens()
  }, [])

  return (
    <>
      <h2>{meuId}</h2>

      {!sala && (
        <button onClick={() => io.emit('entrarSala', '1107')}>
          Entrar na sala
        </button>
      )}

      {sala && (
        <button onClick={() => io.emit('sairSala', '1107')}>
          Sair da sala
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

      <br /><br />

      <button onClick={enviarMensagem}>
        Enviar
      </button>

      <br />

      <button onClick={enviarMensagemSala}>
        Enviar para sala
      </button>

      <br />

      {idsConectados.map((id, index) => (
        <div key={index}>
          <button onClick={() => enviarMensagemId(id)}>
            Enviar para {id}
          </button>

          <br />
        </div>
      ))}
      
    </>
  )
}