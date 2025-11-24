<script setup lang="ts">
import { ref, computed } from 'vue'
import * as Diff from 'diff'

useSeoMeta({
  title: 'Online Text Diff Checker',
  description: 'Compare two text files or code snippets and highlight differences.',
  ogTitle: 'Online Text Diff Checker',
  ogDescription: 'Compare two text files or code snippets and highlight differences.'
})

const originalText = ref('')
const changedText = ref('')
const diffResult = ref<Diff.Change[]>([])
const hasCompared = ref(false)

const compareText = () => {
  if (!originalText.value && !changedText.value) return
  
  // Use diffLines for line-by-line comparison
  diffResult.value = Diff.diffLines(originalText.value, changedText.value)
  hasCompared.value = true
}

const clearAll = () => {
  originalText.value = ''
  changedText.value = ''
  diffResult.value = []
  hasCompared.value = false
}
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-green-50 rounded-full blur-3xl opacity-40 -z-10 pointer-events-none"></div>

    <div class="w-full max-w-7xl">
      <div class="mb-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm mb-6 text-3xl border border-gray-100">
          ↔️
        </div>
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">Text Diff Checker</h1>
        <p class="mt-4 text-lg text-gray-500">Compare texts and spot differences instantly.</p>
      </div>

      <div class="glass rounded-3xl shadow-xl border border-white/50 overflow-hidden backdrop-blur-xl p-6 md:p-8">
        <!-- Input Area -->
        <div class="grid md:grid-cols-2 gap-6 mb-8">
          <div class="flex flex-col">
            <label class="text-sm font-bold text-gray-700 mb-2 uppercase flex justify-between">
              Original Text
              <span class="text-xs text-gray-400 font-normal">Paste original version</span>
            </label>
            <textarea 
              v-model="originalText"
              class="flex-1 w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-mono text-sm min-h-[300px]"
              placeholder="Paste original text here..."
            ></textarea>
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-bold text-gray-700 mb-2 uppercase flex justify-between">
              Changed Text
              <span class="text-xs text-gray-400 font-normal">Paste modified version</span>
            </label>
            <textarea 
              v-model="changedText"
              class="flex-1 w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-mono text-sm min-h-[300px]"
              placeholder="Paste changed text here..."
            ></textarea>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-center gap-4 mb-8">
          <button 
            @click="compareText"
            class="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Compare Texts
          </button>
          <button 
            @click="clearAll"
            class="py-3 px-8 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors"
          >
            Clear
          </button>
        </div>

        <!-- Results -->
        <div v-if="hasCompared" class="animate-fade-in">
          <div class="border-t border-gray-100 pt-8">
            <h3 class="text-lg font-bold text-gray-900 mb-4">Comparison Result</h3>
            <div class="bg-gray-900 rounded-xl overflow-hidden shadow-inner">
              <div class="p-4 font-mono text-sm overflow-x-auto">
                <div v-for="(part, index) in diffResult" :key="index" class="whitespace-pre-wrap break-all">
                  <span 
                    v-if="part.added" 
                    class="bg-green-900/50 text-green-200 block -mx-4 px-4 py-0.5 border-l-4 border-green-500"
                  >+ {{ part.value }}</span>
                  <span 
                    v-else-if="part.removed" 
                    class="bg-red-900/50 text-red-200 block -mx-4 px-4 py-0.5 border-l-4 border-red-500"
                  >- {{ part.value }}</span>
                  <span 
                    v-else 
                    class="text-gray-400 block py-0.5"
                  >  {{ part.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
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
