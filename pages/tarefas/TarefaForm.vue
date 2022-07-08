<template>
    <div>
      <b-breadcrumb :items="breadcrumbList"></b-breadcrumb>

      <b-form>
        <b-form-group label="Nome:" label-for="nome">
          <b-form-input 
            id="nome" v-model="tarefaEdit.nome" type="text" required placeholder="Informe o nome da tarefa">
          </b-form-input>
        </b-form-group>

        <b-form-group label="Descrição:" label-for="descricao">
          <b-form-textarea
            id="descricao" v-model="tarefaEdit.descricao" placeholder="Informe a descrição da tarefa" rows="3" max-rows="6">
          </b-form-textarea>
        </b-form-group>

        <b-form-group label="Data:" label-for="data">
          <b-form-datepicker id="data" v-model="tarefaEdit.data" class="mb-2"></b-form-datepicker>
        </b-form-group>

        <b-form-group>
          <b-form-checkbox v-model="tarefaEdit.done"> Concluída</b-form-checkbox>
        </b-form-group>

        <b-form-group>
          <b-button type="button" :variant="buttonOk.variant" @click="save()">{{ buttonOk.label }}</b-button>
          <b-button type="button" variant="secondary" @click="cancelar()">Cancelar</b-button>
        </b-form-group>

      </b-form>
    </div>
</template>

<script>
import { Tarefa } from '@/models/Tarefa'
import { TarefaManager } from '@/models/TarefaManager'

export default {
  name: 'TarefaForm',
  props: {
    tarefaManager: TarefaManager
  },
  data() {
    return {
      tarefaEdit: new Tarefa(),
      breadcrumbList: [
        {text: 'Tarefas', href: '#'},
        {text: 'Novo', active: true},
      ],
      buttonOk: {
        label: 'OK',
        variant: 'primary'
      },
    }
  },
  beforeMount() {
    Object.assign(this.tarefaEdit, this.tarefaManager.modelAtual)
  },
  methods: {
    success() {
      this.$emit('success')
    },
    error(msg) {
      this.$emit('error', msg)
    },
    validate() {
      if (!this.tarefaEdit.nome) {
        this.error("Favor informar o campo Nome");
        return false;
      }

      if (!this.tarefaEdit.data) {
        this.error("Favor informar o campo Data");
        return false;
      }

      return true;
    },
    async save() {
      if (!this.validate()) {
        return;
      }

      this.buttonOk = {label: 'Aguarde ...', variant: 'warning'}

      try {
        const result = await this.$axios.post('/api/tarefas', this.tarefaEdit)

        if (this.tarefaEdit.id) {
          this.tarefaManager.update(result.data)

        } else {
          this.tarefaManager.add(result.data)
        }

        this.$emit('success')
        
      } catch(e) {
        this.$emit('error', 'Erro ao salvar tarefa')
      }

      this.buttonOk = {label: 'OK', variant: 'primary'}

      this.cancelar()
    },
    cancelar() {
      this.tarefaManager.reset();
    }
  },
}
</script>