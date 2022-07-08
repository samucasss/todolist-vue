<template>
  <div>
    <MenuBar
      app-name="ToDoList"
      user-name="SAMUEL"
      :menu-list="[
        { nome: 'Tarefa', link: '/tarefas/TarefaList' },
        { nome: 'Preferências', link: '/preferencias/preferenciasForm' },
      ]"
    />
    <div class="container" style="margin-top: 10px">
      <Nuxt />
    </div>
  </div>
</template>
