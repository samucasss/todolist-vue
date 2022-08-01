<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand href="/">{{ appName }}</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav v-if="isAuthenticated">
          <b-nav-item
            v-for="menu of menuList"
            :key="menu.nome"
            :href="menu.link"
            >{{ menu.nome }}</b-nav-item
          >
        </b-navbar-nav>

        <b-navbar-nav v-if="!isAuthenticated" class="ml-auto">
          <b-nav-item right href="/usuarios/RegistroForm"
            >Registre-se</b-nav-item
          >
          <b-nav-item right href="/login">Login</b-nav-item>
        </b-navbar-nav>

        <!-- Right aligned nav items -->
        <b-navbar-nav v-if="isAuthenticated" class="ml-auto">
          <b-nav-form>
            <b-form-input
              v-model="search"
              size="sm"
              class="mr-sm-2"
              placeholder="Pesquisar"
            ></b-form-input>
            <b-button
              size="sm"
              class="my-2 my-sm-0"
              type="button"
              @click="pesquisar()"
              >OK</b-button
            >
          </b-nav-form>

          <b-nav-item-dropdown right>
            <template #button-content>
              <em>{{ loggedInUser.nome.toUpperCase() }}</em>
            </template>
            <b-dropdown-item href="/usuarios/AlterarForm"
              >Meus dados</b-dropdown-item
            >
            <b-dropdown-item @click="logout()">Sair</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    appName: {
      type: String,
      default: '',
    },
    userName: {
      type: String,
      default: '',
    },
    menuList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      search: '',
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'loggedInUser']),
  },
  methods: {
    async logout() {
      await this.$auth.logout()
    },
    pesquisar() {
      this.$router.push({
        path: '/tarefas/TarefaList',
        query: {
          search: this.search,
        },
      })
    },
  },
}
</script>