<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <!-- Sans ceci, Nuxt réutilise l'instance entre deux pages de la même
         route dynamique (ex: /blog/a -> /blog/b) et le setup() ne se
         relance pas : les données affichées resteraient celles du slug
         précédent. Le hash est exclu de la clé : sinon chaque clic dans un
         sommaire (#section) remonte toute la page (remount + scroll reset). -->
    <NuxtPage :page-key="(route) => route.path + route.search" />
  </NuxtLayout>
</template>
