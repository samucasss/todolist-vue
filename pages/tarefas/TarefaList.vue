<template>
  <div>
    <b-breadcrumb
      v-if="!tarefaManager.edit"
      :items="breadcrumbList"
    ></b-breadcrumb>

    <span
      v-if="$fetchState.pending || showAguarde"
      style="color: red; float: right"
      >Aguarde ...</span
    >

    <b-alert
      :variant="optionsAlert.variant"
      :show="optionsAlert.timer"
      dismissible
      @dismissed="optionsAlert.timer = 0"
    >
      {{ optionsAlert.message }}
    </b-alert>

    <TarefaForm
      v-if="tarefaManager.edit"
      :tarefa-manager="tarefaManager"
      @success="success"
      @error="error"
    />

    <b-row v-if="!tarefaManager.edit && !$route.query.search">
      <b-col cols="4">
        <b-button
          v-if="!tarefaManager.edit"
          v-b-tooltip.hover
          variant="outline-primary"
          style="margin-bottom: 10px"
          title="Nova tarefa"
          size="sm"
          @click="novo()"
        >
          <b-icon icon="plus" aria-hidden="true"></b-icon>Novo
        </b-button>
      </b-col>
      <b-col>
        <b-form-radio-group
          v-model="filtro.tipo"
          :options="filtro.options"
        ></b-form-radio-group>
      </b-col>
      <b-col cols="2">
        <b-form-checkbox v-model="filtro.done">Concluídos</b-form-checkbox>
      </b-col>
    </b-row>

    <b-table
      v-if="!tarefaManager.edit"
      bordered
      striped
      hover
      :fields="tarefaGrid.fields"
      :items="tarefaList"
      :sort-by.sync="tarefaGrid.sortBy"
    >
      <template #cell(data)="data">
        {{ data.item.getDataFormatada() }}
      </template>

      <template #cell(acoes)="row">
        <b-button
          v-if="!row.item.done"
          v-b-tooltip.hover
          variant="outline-primary"
          size="sm"
          title="Concluir tarefa"
          @click="done(row.item)"
        >
          <b-icon icon="check" aria-hidden="true"></b-icon>
        </b-button>
        <b-button
          v-b-tooltip.hover
          variant="outline-primary"
          size="sm"
          title="Editar"
          @click="editar(row.item)"
        >
          <b-icon icon="pencil-fill" aria-hidden="true"></b-icon>
        </b-button>
        <b-button
          v-b-tooltip.hover
          variant="outline-danger"
          size="sm"
          title="Remover"
          @click="remover(row.item)"
        >
          <b-icon icon="trash-fill" aria-hidden="true"></b-icon>
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import moment from 'moment'
import TarefaForm from './TarefaForm'
import { TarefaManager } from '@/models/TarefaManager'
import { Tarefa } from '~/models/Tarefa'

export default {
  components: {
    TarefaForm,
  },
  data() {
    return {
      tarefaManager: new TarefaManager(),
      showAguarde: false,
      breadcrumbList: [
        { text: 'Tarefas', href: '#' },
        { text: 'Listagem', active: true },
      ],
      optionsAlert: {
        message: '',
        variant: 'success',
        timer: 0,
      },
      filtro: {
        options: [
          { text: 'Todas', value: 'T' },
          { text: 'Hoje', value: 'H' },
          { text: 'Amanhã', value: 'A' },
          { text: 'Semana', value: 'S' },
        ],
        tipo: 'T',
        done: false,
      },
      tarefaGrid: {
        sortBy: 'data',
        fields: [
          { key: 'data', sortable: true },
          { key: 'nome', sortable: true },
          { key: 'descricao', label: 'Descrição', sortable: true },
          { key: 'acoes', label: 'Ações' },
        ],
      },
    }
  },
  fetch() {
    this.findPreferencias()
    this.findAllTarefas()
  },
  computed: {
    tarefaList() {
      this.filter()
      return this.tarefaManager.tarefaFilterList
    },
  },
  methods: {
    async findAllTarefas() {
      try {
        // recupera as tarefas dessa semana
        const periodo = this.findPeriodoAllTarefas()
        const result = await this.$axios.get('/api/tarefas', {
          params: periodo,
        })
        this.tarefaManager.modelList = result.data.map(
          (json) => new Tarefa(json)
        )
      } catch (e) {
        this.error('Erro ao recuperar tarefas')
      }
    },
    findPeriodoAllTarefas() {
      const hoje = moment().startOf('day')

      const start = moment(hoje).add(-10, 'days')
      const end = moment(hoje).add(10, 'days')

      return { inicio: start, fim: end }
    },
    async findPreferencias() {
      try {
        const result = await this.$axios.get('/api/preferencia')
        const preferencias = result.data

        if (preferencias) {
          this.filtro.tipo = preferencias.tipoFiltro
          this.filtro.done = preferencias.done
        }
      } catch (e) {
        this.error('Erro ao recuperar preferencias')
      }
    },
    filter() {
      const search = this.$route.query.search
      if (search) {
        this.tarefaManager.pesquisar(search)
      } else {
        this.tarefaManager.filter(this.filtro.tipo, this.filtro.done)
      }
    },
    success() {
      this.optionsAlert = {
        message: 'Operação realizada com sucesso',
        variant: 'success',
        timer: 5,
      }
    },
    error(msg) {
      this.optionsAlert = { message: msg, variant: 'danger', timer: 5 }
    },
    novo() {
      this.tarefaManager.novo()
    },
    editar(tarefa) {
      this.tarefaManager.editar(tarefa)
    },
    async done(tarefa) {
      tarefa.done = !tarefa.done

      try {
        this.showAguarde = true
        await this.$axios.post('/api/tarefas/done/' + tarefa.id, {
          done: tarefa.done,
        })
        this.showAguarde = false

        this.success()
      } catch (e) {
        this.showAguarde = false
        tarefa.done = !tarefa.done
        this.error('Erro ao atualizar tarefa')
      }
    },
    remover(tarefa) {
      this.$bvModal
        .msgBoxConfirm('Tem certeza que deseja excluir o registro?')
        .then((value) => {
          if (value) {
            this.remove(tarefa)
          }
        })
        .catch((err) => {
          window.console.log('Erro na confirmacao: ' + err)
        })
    },
    async remove(tarefa) {
      try {
        this.showAguarde = true
        await this.$axios.delete('/api/tarefas/' + tarefa.id)
        this.showAguarde = false

        this.tarefaManager.remove(tarefa)
        this.success()
      } catch (e) {
        this.showAguarde = false
        this.error('Erro ao remover tarefa')
      }
    },
  },
}
</script>