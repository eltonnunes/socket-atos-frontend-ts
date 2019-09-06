import React, { useState, useEffect } from 'react'
import socketIOClient from 'socket.io-client'

import { Config } from '../enums/Config'
import { Modulo } from '../enums/Modulo'
import { Acao } from '../enums/Acao'
import { ObjetoPadrao } from '../types/ObjetoPadrao'

export default function SocketIO() {
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
}
