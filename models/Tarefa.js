import moment from 'moment'
import { ObjectUtil } from "./ObjectUtil"

export class Tarefa {
  constructor(json) {
    this.id = ''
    this.nome = ''
    this.descricao = ''
    this.data = moment().startOf('day').toDate()
    this.done = false

    if (json) {
      this.setJson(json)
    }
  }

  setJson(json) {
    ObjectUtil.copy(this, json)
  }

  getDataFormatada() {
    return moment.utc(this.data).format('ddd, DD/MM/YYYY')
  }
}