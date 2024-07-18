<script setup>
import AppHeader from './components/AppHeader.vue'
import PizzaPets from './components/PizzaPets.vue'
import ChildrenInscriptions from './components/ChildrenInscriptions.vue'
import InscriptionSummary from './components/InscriptionSummary.vue'
</script>

<template>
  <main class="md:absolute h-full w-full top-0 left-0">
    <div class="max-w-[1170px] mx-auto mt-12 px-4 pb-24">
      <AppHeader />
      <div>
        <h1 class="uppercase text-4xl mt-16 mb-8 text-white ml-4">My pets</h1>
        <div class="w-full flex flex-col overflow-y-auto hide-scrollbar">
          <PizzaPets />
        </div>

        <h2 class="uppercase text-4xl mt-14 mb-8 text-white ml-4">Feed your pets</h2>
        <ChildrenInscriptions class="px-4" />

        <InscriptionSummary class="px-4 mt-24" />
      </div>
    </div>
  </main>
</template>
