<script setup lang="ts">
import { ref, watch } from 'vue'

useSeoMeta({
  title: 'Base64 Encoder & Decoder (Text/Image)',
  description: 'Decode and encode text or images to Base64 instantly.',
  ogTitle: 'Base64 Encoder & Decoder (Text/Image)',
  ogDescription: 'Decode and encode text or images to Base64 instantly.'
})

const activeTab = ref<'text' | 'image'>('text')

// Text Mode
const decodedText = ref('')
const encodedText = ref('')

const encodeText = () => {
  try {
    encodedText.value = btoa(decodedText.value)
  } catch (e) {
    // Handle unicode characters
    encodedText.value = btoa(encodeURIComponent(decodedText.value).replace(/%([0-9A-F]{2})/g,
      function toSolidBytes(match, p1) {
        return String.fromCharCode(parseInt(p1, 16))
      }))
  }
}

const decodeText = () => {
  try {
    decodedText.value = atob(encodedText.value)
  } catch (e) {
    try {
      // Handle unicode characters
      decodedText.value = decodeURIComponent(atob(encodedText.value).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      }).join(''))
    } catch (err) {
      // Invalid base64
    }
  }
}

watch(decodedText, () => encodeText())
watch(encodedText, (newValue) => {
  if (newValue !== btoa(decodedText.value)) { // Prevent loop if change came from decode
     decodeText()
  }
})

// Image Mode
const imageBase64 = ref('')
const copyStatus = ref('Copy')

const handleFileUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    imageBase64.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const copyToClipboard = async () => {
  if (!imageBase64.value) return
  try {
    await navigator.clipboard.writeText(imageBase64.value)
    copyStatus.value = 'Copied!'
    setTimeout(() => copyStatus.value = 'Copy', 2000)
  } catch (err) {
    console.error('Failed to copy', err)
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-40 -z-10 pointer-events-none"></div>

    <div class="w-full max-w-5xl">
      <div class="mb-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm mb-6 text-3xl border border-gray-100">
          🔢
        </div>
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">Base64 Converter</h1>
        <p class="mt-4 text-lg text-gray-500">Encode and decode text or images instantly.</p>
      </div>

      <div class="glass rounded-3xl shadow-xl border border-white/50 overflow-hidden backdrop-blur-xl">
        <!-- Tabs -->
        <div class="flex border-b border-gray-100">
          <button 
            @click="activeTab = 'text'"
            class="flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors"
            :class="activeTab === 'text' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'bg-gray-50 text-gray-500 hover:text-gray-700'"
          >
            Text Mode
          </button>
          <button 
            @click="activeTab = 'image'"
            class="flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors"
            :class="activeTab === 'image' ? 'bg-white text-indigo-600 border-b-2 border-indigo-600' : 'bg-gray-50 text-gray-500 hover:text-gray-700'"
          >
            Image Mode
          </button>
        </div>

        <div class="p-8">
          <!-- Text Mode -->
          <div v-if="activeTab === 'text'" class="grid md:grid-cols-2 gap-8">
            <div class="flex flex-col">
              <label class="text-sm font-bold text-gray-700 mb-2 uppercase">Decoded Text</label>
              <textarea 
                v-model="decodedText"
                @input="encodeText"
                class="flex-1 w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-mono text-sm min-h-[300px]"
                placeholder="Type text here..."
              ></textarea>
            </div>
            <div class="flex flex-col">
              <label class="text-sm font-bold text-gray-700 mb-2 uppercase">Encoded Base64</label>
              <textarea 
                v-model="encodedText"
                @input="decodeText"
                class="flex-1 w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-mono text-sm min-h-[300px]"
                placeholder="Base64 output..."
              ></textarea>
            </div>
          </div>

          <!-- Image Mode -->
          <div v-else class="flex flex-col items-center">
            <div class="w-full max-w-xl">
              <label class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div class="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Click to upload</span> or drag and drop</p>
                  <p class="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
                <input type="file" class="hidden" accept="image/*" @change="handleFileUpload" />
              </label>
            </div>

            <div v-if="imageBase64" class="w-full mt-8 animate-fade-in">
              <div class="flex items-center justify-between mb-2">
                <label class="text-sm font-bold text-gray-700 uppercase">Base64 String</label>
                <button 
                  @click="copyToClipboard"
                  class="text-xs font-bold text-indigo-600 hover:text-indigo-800 uppercase tracking-wide"
                >
                  {{ copyStatus }}
                </button>
              </div>
              <textarea 
                readonly
                :value="imageBase64"
                class="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-xs h-40 focus:outline-none"
              ></textarea>
              
              <div class="mt-8">
                <label class="text-sm font-bold text-gray-700 uppercase mb-2 block">Preview</label>
                <div class="p-4 bg-white border border-gray-200 rounded-xl inline-block">
                  <img :src="imageBase64" alt="Preview" class="max-h-64 rounded-lg" />
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
