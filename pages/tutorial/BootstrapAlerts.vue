<template>
  <div>
    <b-alert 
      :variant="optionsAlert.variant" :show="optionsAlert.timer" 
      dismissible @dismissed="optionsAlert.timer=0">Mensagem de alerta</b-alert>

    <button @click="showMessageSuccess()">Sucesso</button>
    <button @click="showMessageError()">Erro</button>
    <button @click="showMessageInfo()">Info</button>
    <button @click="showMessageConfirm()">Confirm</button>
    <span>Retorno da confirmação: {{ retornoConfirm }}</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      optionsAlert: {
        variant: 'success',
        timer: 0
      },
      retornoConfirm: ''
    }
  },
  methods: {
    showMessageSuccess() {
      this.optionsAlert = {variant: 'success', timer: 5}
    },
    showMessageError() {
      this.optionsAlert = {variant: 'danger', timer: 5}
    },
    showMessageInfo() {
      this.optionsAlert = {variant: 'info', timer: 5}
    },
    showMessageConfirm() {
      this.$bvModal.msgBoxConfirm('Tem certeza que deseja excluir o registro?')
        .then(value => {
          this.retornoConfirm = value
        })
        .catch(err => {
          window.console.log('Erro na confirmacao: ' + err)
        })    
      }
  }
}
</script>
