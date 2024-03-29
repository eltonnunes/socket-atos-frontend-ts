import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'

import { Config } from './enums/Config'
import { Modulo } from './enums/Modulo'
import { Acao } from './enums/Acao'
import { ObjetoPadrao } from './types/ObjetoPadrao'

export default function App() {
  const [io] = useState(socketIOClient(Config.CODESENDBOX))
  const [mensagens, setMensagens] = useState<Array<string>>([])
  const [novaMensagem, setNovaMensagem] = useState<string>('')
  const [sala, setSala] = useState<Boolean>(false)
  const [idsConectados, setIdsConectados] = useState<Array<string>>([])
  const [meuId, setMeuId] = useState<string>('')
  const [info, setInfo] = useState<ObjetoPadrao>({
    tipo: Modulo.CHAT,
    token: '',
    cdRede: 0,
    cdGrupoEmpresa: 0,
    cnpj: '',
    idUsuario: 0,
    idConexao: '',
    evento: {
      modulo: Modulo.CHAT,
      acao: Acao.GET,
    },
    filtro: {},
    dados: {
      mensagem: 'Boa tarde',
    },
  })

  function enviarMensagem() {
    setMensagens([...mensagens, novaMensagem])
    io.emit('novaMensagem', novaMensagem)
    setNovaMensagem('')
  }

  function enviarMensagemSala() {
    io.emit('novaMensagemSala', novaMensagem)
    setNovaMensagem('')
  }

  function enviarMensagemId(id: string) {
    setMensagens([...mensagens, novaMensagem])
    io.emit('novaMensagemId', id, novaMensagem)
    setNovaMensagem('')
  }

  function solicitacaoServidor() {
    setMensagens([...mensagens, info.dados.mensagem])
    
    io.emit('solicitacaoServidor', info)
  }

  useEffect(() => {
    io.on('mensagens', (novaMensagem: string) => {
      setMensagens([...mensagens, novaMensagem])
    })

    io.on('sala', () => {
      setSala(!sala)
    })

    io.on('idsConectados', (idsConectados: [string]) => {
      setIdsConectados(idsConectados)
    })

    io.on('connect', () => {
      setMeuId(io.id)
    })

    io.on('consultarTelaDadosAcessoResp', (info: string) => {
      console.log(info)
    })

    io.on('respSolicitacaoServidor', (info: ObjetoPadrao) => {
      console.log(info)
      if (info.tipo === Modulo.CHAT) {
        setMensagens([...mensagens, info.dados.mensagem])
      } else {
        console.log(info)
      }
    })
  }, [])

  return (
    <>
      <h2>{meuId}</h2> - <pre>IDS: {idsConectados.length}</pre>
      {!sala && (
        <button onClick={() => io.emit('entrarSala', '1107')}>
          Entrar na sala
        </button>
      )}
      {sala && (
        <button onClick={() => io.emit('sairSala', '1107')}>Sair da sal</button>
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
        onKeyUp={e => {
          e.keyCode === 13 && enviarMensagem()
        }}
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
      {/* <button onClick={acessarTelaDadosAcesso}>
        Acessar tela de Dados de Acesso
      </button> */}
      <br />
      <button onClick={solicitacaoServidor}>Solicitação servidor</button>
    </>
  )
}
