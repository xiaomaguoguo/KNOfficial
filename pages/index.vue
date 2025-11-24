<script setup lang="ts">
import { ref, computed } from 'vue'

useHead({
  title: 'KNothing - Free Online Developer Tools',
  meta: [
    { name: 'description', content: 'Simple, privacy-focused tools for developers and creators: UUID Generator, YouTube Thumbnail Downloader, JSON Formatter, and Password Generator.' }
  ]
})

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 9

const tools = [
  {
    id: 'uuid',
    name: 'UUID Generator',
    description: 'Generate bulk Version 4 UUIDs/GUIDs instantly.',
    path: '/uuid',
    icon: '🆔'
  },
  {
    id: 'thumb',
    name: 'YouTube Thumb',
    description: 'Download high-res thumbnails from any YouTube video.',
    path: '/thumb',
    icon: '🖼️'
  },
  {
    id: 'json',
    name: 'JSON Formatter',
    description: 'Validate, prettify, and minify JSON data.',
    path: '/json',
    icon: '💻'
  },
  {
    id: 'pwd',
    name: 'Password Gen',
    description: 'Create strong, secure passwords locally.',
    path: '/pwd',
    icon: '🔐'
  },
  {
    id: 'img',
    name: 'Image Converter',
    description: 'Convert images (WebP/PNG to JPG) locally.',
    path: '/img',
    icon: '🖼️'
  },
  {
    id: 'compress',
    name: 'Image Compressor',
    description: 'Compress images locally without quality loss.',
    path: '/compress',
    icon: '📉'
  },
  {
    id: 'text',
    name: 'Word Counter',
    description: 'Count words/chars and convert text case.',
    path: '/text',
    icon: '📝'
  },
  {
    id: 'cron',
    name: 'Cron Generator',
    description: 'Create and schedule cron jobs easily.',
    path: '/cron',
    icon: '⏰'
  },
  {
    id: 'base64',
    name: 'Base64 Converter',
    description: 'Encode and decode text or images to Base64 instantly.',
    path: '/base64',
    icon: '🔢'
  },
  {
    id: 'diff',
    name: 'Text Diff Checker',
    description: 'Compare two text files or code snippets and highlight differences.',
    path: '/diff',
    icon: '↔️'
  },
  {
    id: 'qrcode',
    name: 'QR Code Generator',
    description: 'Create custom QR codes with colors and logos. No signup.',
    path: '/qrcode',
    icon: '📱'
  }
]

// Filter tools based on search
const filteredTools = computed(() => {
  if (!searchQuery.value) return tools
  const query = searchQuery.value.toLowerCase()
  return tools.filter(tool => 
    tool.name.toLowerCase().includes(query) || 
    tool.description.toLowerCase().includes(query)
  )
})

// Paginate filtered tools
const paginatedTools = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTools.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredTools.value.length / itemsPerPage))

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

// Reset page on search
watch(searchQuery, () => {
  currentPage.value = 1
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="relative overflow-hidden border-b border-slate-800 bg-slate-900">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div class="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 text-center">
        <h1 class="text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl mb-6">
          Developer Tools for <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Efficiency</span>
        </h1>
        <p class="max-w-2xl mx-auto text-xl text-slate-400 mb-10">
          Privacy-focused, client-side utilities. No ads, no tracking, just code.
        </p>

        <!-- Search Bar -->
        <div class="max-w-xl mx-auto relative group">
          <div class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              class="block w-full pl-11 pr-4 py-4 bg-slate-800 border-slate-700 text-white placeholder-slate-500 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-xl"
              placeholder="Search tools (e.g., UUID, JSON, QR)..."
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Tools Grid -->
    <div class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div v-if="paginatedTools.length > 0">
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          <NuxtLink
            v-for="tool in paginatedTools"
            :key="tool.id"
            :to="tool.path"
            class="group relative p-6 bg-slate-800/50 border border-slate-700 rounded-2xl hover:border-indigo-500/50 hover:bg-slate-800 transition-all duration-300 hover:-translate-y-1"
          >
            <div class="flex items-center justify-between mb-4">
              <span class="text-4xl filter drop-shadow-lg">{{ tool.icon }}</span>
              <span class="text-slate-600 group-hover:text-indigo-400 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
            <h3 class="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">
              {{ tool.name }}
            </h3>
            <p class="text-sm text-slate-400 leading-relaxed">
              {{ tool.description }}
            </p>
          </NuxtLink>
        </div>

        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="flex justify-center items-center gap-6">
          <button 
            @click="prevPage" 
            :disabled="currentPage === 1"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="currentPage === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-white hover:bg-slate-800'"
          >
            Previous
          </button>
          
          <span class="text-slate-500 text-sm font-mono">
            Page <span class="text-white">{{ currentPage }}</span> of <span class="text-slate-400">{{ totalPages }}</span>
          </span>

          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="currentPage === totalPages ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:text-white hover:bg-slate-800'"
          >
            Next
          </button>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else class="text-center py-20">
        <div class="text-6xl mb-4 opacity-20">🔍</div>
        <p class="text-slate-500 text-lg">No tools found matching "{{ searchQuery }}"</p>
        <button 
          @click="searchQuery = ''"
          class="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
        >
          Clear search
        </button>
      </div>
    </div>
  </div>
</template>
