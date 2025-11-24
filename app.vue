<script setup lang="ts">
useSeoMeta({
  titleTemplate: '%s - KNothing Tools',
  ogTitle: 'KNothing - Free Developer Tools',
  description: 'A collection of privacy-first, client-side tools for developers. UUID Generator, YouTube Thumb Downloader, JSON Formatter, and more.',
  ogDescription: 'A collection of privacy-first, client-side tools for developers. UUID Generator, YouTube Thumb Downloader, JSON Formatter, and more.',
  ogImage: 'https://knothing.com/og-card.png',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://knothing.com/og-card.png',
  themeColor: '#0f172a'
})

useHead({
  bodyAttrs: {
    class: 'bg-slate-900 text-slate-400 antialiased'
  }
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
