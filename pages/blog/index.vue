<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'Blog & Tutorials - KNothing',
  meta: [
    { name: 'description', content: 'Guides and tutorials for developers. Learn how to use our tools effectively.' }
  ]
})

const { data: articles } = await useAsyncData('blog', () => queryContent('/blog').sort({ date: -1 }).find())

const currentPage = ref(1)
const itemsPerPage = 6

const paginatedPosts = computed(() => {
  if (!articles.value) return []
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return articles.value.slice(start, end)
})

const totalPages = computed(() => {
  if (!articles.value) return 0
  return Math.ceil(articles.value.length / itemsPerPage)
})

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-900">
    <!-- Header -->
    <div class="relative overflow-hidden border-b border-slate-800 bg-slate-900">
      <div class="absolute top-0 right-1/2 translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div class="relative max-w-7xl mx-auto px-4 py-20 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-extrabold text-white sm:text-5xl tracking-tight mb-4">
          Blog & Tutorials
        </h1>
        <p class="max-w-2xl mx-auto text-xl text-slate-400">
          Guides to help you develop faster and more securely.
        </p>
      </div>
    </div>

    <!-- Articles Grid -->
    <div class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div v-if="articles && articles.length > 0">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          <NuxtLink 
            v-for="article in paginatedPosts" 
            :key="article._path" 
            :to="article._path"
            class="group flex flex-col bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1"
          >
            <div class="p-8 flex-1 flex flex-col">
              <div class="flex items-center justify-between mb-6">
                <span class="text-4xl filter drop-shadow-lg">{{ article.image || '📝' }}</span>
                <span class="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {{ new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
                </span>
              </div>
              
              <h2 class="text-xl font-bold text-white mb-3 group-hover:text-indigo-400 transition-colors line-clamp-2">
                {{ article.title }}
              </h2>
              
              <p class="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                {{ article.description }}
              </p>

              <div class="flex items-center text-indigo-400 font-medium text-sm group-hover:text-indigo-300 transition-colors">
                Read Article
                <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </NuxtLink>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex justify-center items-center gap-6">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="px-6 py-3 rounded-xl text-sm font-bold transition-all"
            :class="currentPage === 1 ? 'text-slate-600 bg-slate-800/50 cursor-not-allowed' : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 hover:shadow-lg'"
          >
            Previous
          </button>
          
          <span class="text-slate-500 text-sm font-mono">
            Page <span class="text-white">{{ currentPage }}</span> of <span class="text-slate-400">{{ totalPages }}</span>
          </span>

          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="px-6 py-3 rounded-xl text-sm font-bold transition-all"
            :class="currentPage === totalPages ? 'text-slate-600 bg-slate-800/50 cursor-not-allowed' : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 hover:shadow-lg'"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="text-6xl mb-4 opacity-20">📝</div>
        <h3 class="text-xl font-bold text-white mb-2">No articles found</h3>
        <p class="text-slate-500">Check back soon for new tutorials.</p>
      </div>
    </div>
  </div>
</template>
