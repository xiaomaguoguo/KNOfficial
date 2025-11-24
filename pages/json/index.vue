<script setup lang="ts">
import { ref } from 'vue'

useHead({
  title: 'JSON Formatter & Validator - KNothing',
  meta: [
    { name: 'description', content: 'Beautify, minify, and validate your JSON data online. Free developer tool.' }
  ]
})

const inputJson = ref('')
const outputJson = ref('')
const error = ref('')
const copied = ref(false)

const parseInput = (input: string) => {
  try {
    // Try standard JSON parse first
    return JSON.parse(input)
  } catch (e) {
    // Try parsing as JavaScript Object (Relaxed JSON)
    // WARNING: This uses new Function which is similar to eval. 
    // Since this is a client-side tool for developers, it's generally acceptable but requires caution.
    try {
      // Basic sanitization to prevent obvious exploits if needed, but for a dev tool 
      // where user pastes their own code, direct execution is often the expected behavior for "relaxed" mode.
      const fn = new Function('return ' + input)
      return fn()
    } catch (e2) {
      throw e // Throw original error or the new one
    }
  }
}

const formatJson = () => {
  error.value = ''
  if (!inputJson.value.trim()) {
    outputJson.value = ''
    return
  }
  try {
    const parsed = parseInput(inputJson.value)
    outputJson.value = JSON.stringify(parsed, null, 2)
  } catch (e: any) {
    error.value = 'Invalid JSON or JS Object: ' + e.message
    outputJson.value = ''
  }
}

const minifyJson = () => {
  error.value = ''
  if (!inputJson.value.trim()) {
    outputJson.value = ''
    return
  }
  try {
    const parsed = parseInput(inputJson.value)
    outputJson.value = JSON.stringify(parsed)
  } catch (e: any) {
    error.value = 'Invalid JSON or JS Object: ' + e.message
    outputJson.value = ''
  }
}

const copyOutput = async () => {
  if (!outputJson.value) return
  try {
    await navigator.clipboard.writeText(outputJson.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const clearAll = () => {
  inputJson.value = ''
  outputJson.value = ''
  error.value = ''
}
</script>

<template>
  <div class="min-h-[90vh] flex flex-col px-4 py-8 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <span class="text-3xl">{}</span> JSON Formatter
        </h1>
        <p class="text-sm text-gray-500 mt-1">Validate, beautify, and minify your JSON data.</p>
      </div>
      
      <div class="flex gap-3">
        <button 
          @click="formatJson"
          class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-sm transition-colors text-sm"
        >
          Beautify
        </button>
        <button 
          @click="minifyJson"
          class="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-lg shadow-sm transition-colors text-sm"
        >
          Minify
        </button>
        <button 
          @click="clearAll"
          class="px-4 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors text-sm"
        >
          Clear
        </button>
      </div>
    </div>

    <div class="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      <!-- Input Pane -->
      <div class="flex flex-col h-[600px] lg:h-auto relative group">
        <div class="absolute top-0 left-0 w-full h-8 bg-gray-100 rounded-t-xl border border-gray-200 border-b-0 flex items-center px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          Input
        </div>
        <textarea 
          v-model="inputJson"
          placeholder="Paste your JSON here..."
          class="w-full h-full pt-10 p-4 font-mono text-sm bg-white border border-gray-200 rounded-xl resize-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
          :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-50': error }"
          spellcheck="false"
        ></textarea>
        <div v-if="error" class="absolute bottom-4 left-4 right-4 p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm font-medium animate-shake">
          Error: {{ error }}
        </div>
      </div>

      <!-- Output Pane -->
      <div class="flex flex-col h-[600px] lg:h-auto relative">
        <div class="absolute top-0 left-0 w-full h-8 bg-gray-100 rounded-t-xl border border-gray-200 border-b-0 flex items-center justify-between px-4">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Output</span>
          <button 
            v-if="outputJson"
            @click="copyOutput"
            class="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
          >
            <span v-if="copied">Copied!</span>
            <span v-else>Copy Result</span>
          </button>
        </div>
        <textarea 
          readonly
          v-model="outputJson"
          placeholder="Result will appear here..."
          class="w-full h-full pt-10 p-4 font-mono text-sm bg-gray-50 border border-gray-200 rounded-xl resize-none outline-none text-gray-700"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
  20%, 40%, 60%, 80% { transform: translateX(2px); }
}
.animate-shake {
  animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both;
}
</style>
