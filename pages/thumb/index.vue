<script setup lang="ts">
import { ref, computed } from 'vue'

useSeoMeta({
  title: 'YouTube Thumbnail Downloader',
  description: 'Download 4K YouTube Thumbnails with one click.',
  ogTitle: 'YouTube Thumbnail Downloader',
  ogDescription: 'Download 4K YouTube Thumbnails with one click.'
})

const videoUrl = ref('')
const videoId = ref('')
const error = ref('')

const extractVideoId = (url: string) => {
  if (!url) return null
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length == 11) ? match[7] : null
}

const handleInput = () => {
  error.value = ''
  const id = extractVideoId(videoUrl.value)
  if (id) {
    videoId.value = id
  } else if (videoUrl.value.length > 0) {
    videoId.value = ''
    error.value = 'Invalid YouTube URL'
  } else {
    videoId.value = ''
  }
}

const thumbnails = computed(() => {
  if (!videoId.value) return []
  return [
    {
      label: 'Max Resolution (HD/4K)',
      url: `https://img.youtube.com/vi/${videoId.value}/maxresdefault.jpg`,
      size: '1280x720'
    },
    {
      label: 'Standard Quality',
      url: `https://img.youtube.com/vi/${videoId.value}/sddefault.jpg`,
      size: '640x480'
    },
    {
      label: 'High Quality',
      url: `https://img.youtube.com/vi/${videoId.value}/hqdefault.jpg`,
      size: '480x360'
    }
  ]
})

const downloadImage = async (url: string, label: string) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = `youtube-thumbnail-${label.replace(/\s+/g, '-').toLowerCase()}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(blobUrl)
  } catch (e) {
    // Fallback for CORS issues: open in new tab
    window.open(url, '_blank')
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-red-50 rounded-full blur-3xl opacity-40 -z-10 pointer-events-none"></div>

    <div class="w-full max-w-4xl">
      <div class="mb-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm mb-6 text-3xl border border-gray-100">
          🖼️
        </div>
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">YouTube Thumbnail Downloader</h1>
        <p class="mt-4 text-lg text-gray-500">Get high-quality thumbnails from any YouTube video.</p>
      </div>

      <div class="glass rounded-3xl shadow-xl border border-white/50 overflow-hidden backdrop-blur-xl mb-12">
        <div class="p-8 md:p-10">
          <div class="relative">
            <input 
              type="text" 
              v-model="videoUrl"
              @input="handleInput"
              placeholder="Paste YouTube URL here (e.g., https://www.youtube.com/watch?v=...)"
              class="w-full px-6 py-4 text-lg bg-white border-2 border-gray-200 rounded-xl focus:border-red-500 focus:ring-4 focus:ring-red-100 outline-none transition-all placeholder-gray-400"
              :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-100': error }"
            >
            <div v-if="error" class="absolute -bottom-6 left-0 text-sm text-red-500 font-medium ml-2">
              {{ error }}
            </div>
          </div>
        </div>
      </div>

      <!-- Results Grid -->
      <div v-if="videoId" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-fade-in">
        <div 
          v-for="(thumb, index) in thumbnails" 
          :key="index"
          class="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div class="aspect-video bg-gray-100 relative overflow-hidden">
            <img 
              :src="thumb.url" 
              :alt="thumb.label" 
              class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            >
            <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
          </div>
          <div class="p-6">
            <h3 class="font-bold text-gray-900 mb-1">{{ thumb.label }}</h3>
            <p class="text-sm text-gray-500 mb-4">{{ thumb.size }}</p>
            <div class="flex gap-3">
              <button 
                @click="downloadImage(thumb.url, thumb.label)"
                class="flex-1 py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
              <a 
                :href="thumb.url" 
                target="_blank"
                class="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg transition-colors"
              >
                Open
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Placeholder State -->
      <div v-else-if="!error" class="text-center py-12 opacity-50">
        <div class="text-6xl mb-4 grayscale">📺</div>
        <p class="text-gray-400">Paste a URL above to see the magic.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
