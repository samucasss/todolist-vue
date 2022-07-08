import { AbstractManager } from "./AbstractManager";
import { Tarefa } from "./Tarefa";
import { FiltroFactory } from "./filtro/FiltroFactory"

export class TarefaManager extends AbstractManager {

  constructor() {
    super()
    this.tarefaFilterList = []
  }

  createModel(modelJson) {
    return new Tarefa(modelJson)
  }

  filter(tipo, done) {
    const filtro = FiltroFactory.createFiltro(tipo)
    this.tarefaFilterList = filtro.filter(this.modelList, done)
  }

  pesquisar(search) {
    this.tarefaFilterList = this.modelList.filter(obj => obj.nome.toUpperCase()
      .includes(search.toUpperCase()))
  }

}