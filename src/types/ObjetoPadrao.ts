import { Modulo } from '../enums/Modulo'
import { Acao } from '../enums/Acao'

export interface ObjetoPadrao {
  tipo: string,
  token: string,
  cdRede: number,
  cdGrupoEmpresa: number,
  cnpj: string,
  idUsuario: number,
  idConexao: string,
  evento: {
    modulo: Modulo,
    acao: Acao,
  },
  filtro: object,
  dados: {
    mensagem: string,
  },
}