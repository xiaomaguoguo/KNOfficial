<script setup lang="ts">
import { ref, onMounted } from 'vue'

useSeoMeta({
  title: 'Online UUID Generator',
  description: 'Generate 50+ Version 4 UUIDs instantly in your browser.',
  ogTitle: 'Online UUID Generator',
  ogDescription: 'Generate 50+ Version 4 UUIDs instantly in your browser.'
})

const count = ref(5)
const uuids = ref<string[]>([])
const copied = ref(false)

const generateUUIDs = () => {
  const newUUIDs = []
  for (let i = 0; i < count.value; i++) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      newUUIDs.push(crypto.randomUUID())
    } else {
      // Fallback for older browsers
      newUUIDs.push('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      }))
    }
  }
  uuids.value = newUUIDs
  copied.value = false
}

const copyAll = async () => {
  if (uuids.value.length === 0) return
  try {
    await navigator.clipboard.writeText(uuids.value.join('\n'))
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

onMounted(() => {
  generateUUIDs()
})
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-3xl opacity-40 -z-10 pointer-events-none"></div>

    <div class="w-full max-w-3xl">
      <div class="mb-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm mb-6 text-3xl border border-gray-100">
          🆔
        </div>
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">UUID Generator</h1>
        <p class="mt-4 text-lg text-gray-500">Generate cryptographically strong UUIDs (Version 4).</p>
      </div>

      <div class="glass rounded-3xl shadow-xl border border-white/50 overflow-hidden backdrop-blur-xl">
        <!-- Controls -->
        <div class="p-8 bg-white/50 border-b border-gray-100">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div class="w-full sm:w-2/3">
              <div class="flex justify-between items-center mb-2">
                <label for="count" class="text-sm font-bold text-gray-700 uppercase tracking-wide">Quantity</label>
                <span class="text-2xl font-bold text-indigo-600 tabular-nums">{{ count }}</span>
              </div>
              <input 
                id="count" 
                type="range" 
                min="1" 
                max="50" 
                v-model.number="count"
                class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              >
            </div>
            <button 
              @click="generateUUIDs"
              class="w-full sm:w-auto py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
            >
              Generate New
            </button>
          </div>
        </div>

        <!-- Output List -->
        <div class="p-8 bg-white/30 relative">
          <div class="absolute top-4 right-4 z-10">
            <button 
              @click="copyAll"
              class="flex items-center gap-2 py-2 px-4 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
            >
              <span v-if="!copied">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </span>
              <span v-else class="text-green-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </span>
              {{ copied ? 'Copied!' : 'Copy All' }}
            </button>
          </div>

          <div class="max-h-[400px] overflow-y-auto pr-2 space-y-2 font-mono text-gray-600">
            <div 
              v-for="(uuid, index) in uuids" 
              :key="index"
              class="p-3 bg-white/60 rounded-lg border border-transparent hover:border-indigo-100 hover:bg-white transition-colors select-all"
            >
              {{ uuid }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
