<script setup lang="ts">
useHead({
  title: 'Word Counter & Case Converter - KNothing',
  meta: [
    { name: 'description', content: 'Count words, characters, and paragraphs. Convert text case instantly (Uppercase, Lowercase, Title Case, Sentence Case).' }
  ]
})

const text = ref('')

const stats = computed(() => {
  const t = text.value
  const words = t.trim() ? t.trim().split(/\s+/).length : 0
  const chars = t.length
  const charsNoSpace = t.replace(/\s/g, '').length
  const paragraphs = t.split(/\n+/).filter(p => p.trim()).length
  
  return { words, chars, charsNoSpace, paragraphs }
})

const toUpperCase = () => text.value = text.value.toUpperCase()
const toLowerCase = () => text.value = text.value.toLowerCase()

const toTitleCase = () => {
  text.value = text.value.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )
}

const toSentenceCase = () => {
  text.value = text.value.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase())
}

const copyText = async () => {
  try {
    await navigator.clipboard.writeText(text.value)
    // Could add a toast notification here
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}

const clearText = () => text.value = ''
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Word Counter & Case Converter
        </h1>
        <p class="mt-4 text-lg text-gray-500">
          Analyze text and convert case instantly.
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Stats Bar -->
        <div class="grid grid-cols-2 sm:grid-cols-4 border-b border-gray-200 bg-gray-50 divide-x divide-gray-200">
          <div class="p-4 text-center">
            <div class="text-2xl font-bold text-indigo-600">{{ stats.words }}</div>
            <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Words</div>
          </div>
          <div class="p-4 text-center">
            <div class="text-2xl font-bold text-indigo-600">{{ stats.chars }}</div>
            <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Characters</div>
          </div>
          <div class="p-4 text-center">
            <div class="text-2xl font-bold text-indigo-600">{{ stats.charsNoSpace }}</div>
            <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">No Spaces</div>
          </div>
          <div class="p-4 text-center">
            <div class="text-2xl font-bold text-indigo-600">{{ stats.paragraphs }}</div>
            <div class="text-xs font-medium text-gray-500 uppercase tracking-wide">Paragraphs</div>
          </div>
        </div>

        <!-- Toolbar -->
        <div class="p-4 border-b border-gray-200 bg-white flex flex-wrap gap-2">
          <button @click="toUpperCase" class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">UPPERCASE</button>
          <button @click="toLowerCase" class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">lowercase</button>
          <button @click="toTitleCase" class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">Title Case</button>
          <button @click="toSentenceCase" class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">Sentence case</button>
          <div class="flex-grow"></div>
          <button @click="copyText" class="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors flex items-center">
            <span class="mr-1">📋</span> Copy
          </button>
          <button @click="clearText" class="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors">
            Clear
          </button>
        </div>

        <!-- Text Area -->
        <div class="p-0">
          <textarea
            v-model="text"
            class="w-full h-96 p-6 border-0 focus:ring-0 text-gray-800 text-lg leading-relaxed resize-none"
            placeholder="Type or paste your text here..."
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>
