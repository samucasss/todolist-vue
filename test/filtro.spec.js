import moment from 'moment'
import { FiltroTodos } from '@/models/filtro/FiltroTodos'
import { FiltroHoje } from '@/models/filtro/FiltroHoje'
import { FiltroAmanha } from '@/models/filtro/FiltroAmanha'
import { FiltroSemana } from '@/models/filtro/FiltroSemana'

describe('Filtro', () => {
  test('deve filtrar todos os registros', () => {
    const hoje = moment().startOf('day')
    
    const tarefaList = [
      {nome: 'tarefa 1', data: hoje, done: true},
      {nome: 'tarefa 2', data: moment('02/04/2022', 'DD/MM/YYYY').toDate(), done: false},
      {nome: 'tarefa 3', data: moment('01/01/2022', 'DD/MM/YYYY').toDate(), done: true},
    ]

    const filtro = new FiltroTodos()
    const tarefaFilterDoneList = filtro.filter(tarefaList, true)
    const tarefaFilterNotDoneList = filtro.filter(tarefaList, false)

    expect(tarefaFilterDoneList.length).toBe(2)
    expect(tarefaFilterNotDoneList.length).toBe(1)

    expect(tarefaFilterDoneList.map(tarefa => tarefa.nome)).toStrictEqual(['tarefa 1', 'tarefa 3'])
    expect(tarefaFilterNotDoneList.map(tarefa => tarefa.nome)).toStrictEqual(['tarefa 2'])
  }),

  test('deve filtrar os registros de hoje', () => {
    const hoje = moment().startOf('day')

    const tarefaList = [
      {nome: 'tarefa 1', data: hoje, done: true},
      {nome: 'tarefa 2', data: moment('02/04/2022', 'DD/MM/YYYY').toDate(), done: false},
      {nome: 'tarefa 3', data: moment('01/01/2022', 'DD/MM/YYYY').toDate(), done: true},
      {nome: 'tarefa 4', data: hoje, done: true},
      {nome: 'tarefa 5', data: hoje, done: false},
    ]

    const filtro = new FiltroHoje()
    const tarefaFilterDoneList = filtro.filter(tarefaList, true)
    const tarefaFilterNotDoneList = filtro.filter(tarefaList, false)

    expect(tarefaFilterDoneList.length).toBe(2)
    expect(tarefaFilterNotDoneList.length).toBe(1)

    expect(tarefaFilterDoneList.map(tarefa => tarefa.nome)).toStrictEqual(['tarefa 1', 'tarefa 4'])
    expect(tarefaFilterNotDoneList.map(tarefa => tarefa.nome)).toStrictEqual(['tarefa 5'])
  }),

  test('deve filtrar os registros de amanha', () => {
    const hoje = moment().startOf('day')
    const amanha = moment(hoje).add(1, 'days')

    const tarefaList = [
      {nome: 'tarefa 1', data: hoje, done: true},
      {nome: 'tarefa 2', data: moment('02/04/2022', 'DD/MM/YYYY').toDate(), done: false},
      {nome: 'tarefa 3', data: amanha, done: true},
      {nome: 'tarefa 4', data: amanha, done: false},
      {nome: 'tarefa 5', data: amanha, done: true},
    ]

    const filtro = new FiltroAmanha()
    const tarefaFilterDoneList = filtro.filter(tarefaList, true)
    const tarefaFilterNotDoneList = filtro.filter(tarefaList, false)

    expect(tarefaFilterDoneList.length).toBe(2)
    expect(tarefaFilterNotDoneList.length).toBe(1)

    expect(tarefaFilterDoneList.map(tarefa => tarefa.nome)).toStrictEqual(['tarefa 3', 'tarefa 5'])
    expect(tarefaFilterNotDoneList.map(tarefa => tarefa.nome)).toStrictEqual(['tarefa 4'])
  }),

  test('deve filtrar os registros da semana', () => {
    const hoje = moment().startOf('day')
    const domingo = moment(hoje).isoWeekday(1)
    const segunda = moment(hoje).isoWeekday(2)
    const sabado = moment(hoje).isoWeekday(6)
    const proximaSemana1 = moment(sabado).add(3, 'days')
    const proximaSemana2 = moment(sabado).add(2, 'days')

    const tarefaList = [
      {nome: 'tarefa 1', data: domingo, done: true},
      {nome: 'tarefa 2', data: segunda, done: false},
      {nome: 'tarefa 3', data: proximaSemana1, done: true},
      {nome: 'tarefa 4', data: proximaSemana2, done: false},
      {nome: 'tarefa 5', data: sabado, done: true},
    ]

    const filtro = new FiltroSemana()
    const tarefaFilterDoneList = filtro.filter(tarefaList, true)
    const tarefaFilterNotDoneList = filtro.filter(tarefaList, false)

    expect(tarefaFilterDoneList.length).toBe(2)
    expect(tarefaFilterNotDoneList.length).toBe(1)

    expect(tarefaFilterDoneList.map(tarefa => tarefa.nome)).toStrictEqual(['tarefa 1', 'tarefa 5'])
    expect(tarefaFilterNotDoneList.map(tarefa => tarefa.nome)).toStrictEqual(['tarefa 2'])
  })

})