<template>
  <div>
    <b-breadcrumb :items="breadcrumbList"></b-breadcrumb>

    <span v-if="$fetchState.pending" style="color: red; float: right"
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

    <b-col cols="6">
      <b-form>
        <b-form-group label="Tipo filtro:" label-for="tipoFiltro">
          <b-form-select
            v-model="preferencias.tipoFiltro"
            :options="optionsFiltro"
            required
          ></b-form-select>
        </b-form-group>

        <b-form-group>
          <b-form-checkbox v-model="preferencias.done">
            Concluídas?</b-form-checkbox
          >
        </b-form-group>

        <b-button type="button" :variant="buttonOk.variant" @click="save()">{{
          buttonOk.label
        }}</b-button>
        <b-button
          v-if="preferencias.id"
          type="button"
          :variant="buttonExcluir.variant"
          @click="remover(preferencias)"
          >{{ buttonExcluir.label }}</b-button
        >
      </b-form>
    </b-col>
  </div>
</template>

<script>
import { Preferencias } from '@/models/Preferencias'

export default {
  data() {
    return {
      preferencias: new Preferencias(),
      breadcrumbList: [{ text: 'Preferências', active: true }],
      optionsAlert: {
        message: '',
        variant: 'success',
        timer: 0,
      },
      optionsFiltro: [
        { value: null, text: 'Selecione um filtro' },
        { value: 'T', text: 'Todos' },
        { value: 'H', text: 'Hoje' },
        { value: 'A', text: 'Amanhã' },
        { value: 'S', text: 'Semana' },
      ],
      buttonOk: {
        label: 'OK',
        variant: 'primary',
      },
      buttonExcluir: {
        label: 'Excluir',
        variant: 'primary',
      },
    }
  },
  async fetch() {
    try {
      const result = await this.$axios.get('/api/preferencia')
      const preferencias = result.data

      if (preferencias) {
        this.preferencias = new Preferencias(preferencias)
      }
    } catch (e) {
      this.error('Erro ao recuperar preferencias')
    }
  },
  methods: {
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
    async save() {
      this.buttonOk = { label: 'Aguarde ...', variant: 'warning' }

      try {
        const result = await this.$axios.post(
          '/api/preferencias',
          this.preferencias
        )
        this.preferencias.setJson(result.data)

        this.success()
        this.$router.push("/tarefas/TarefaList");

      } catch (e) {
        this.error('Erro ao salvar preferencias')
      }

      this.buttonOk = { label: 'OK', variant: 'primary' }
    },
    remover(preferencias) {
      this.$bvModal
        .msgBoxConfirm('Tem certeza que deseja excluir o registro?')
        .then((value) => {
          if (value) {
            this.remove(preferencias)
          }
        })
        .catch((err) => {
          window.console.log('Erro na confirmacao: ' + err)
        })
    },
    async remove(preferencias) {
      this.buttonExcluir = { label: 'Aguarde ...', variant: 'warning' }
      try {
        await this.$axios.delete('/api/preferencia')
        this.preferencias = new Preferencias()
        this.success()
        this.$router.push("/tarefas/TarefaList");

        this.buttonExcluir = { label: 'OK', variant: 'primary' }
      } catch (e) {
        this.error('Erro ao remover preferencias')
      }
    },
  },
}
</script>