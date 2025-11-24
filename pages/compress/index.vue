<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import imageCompression from 'browser-image-compression'

useHead({
  title: 'Smart Image Compressor - KNothing',
  meta: [
    { name: 'description', content: 'Compress images locally without distortion. Privacy-first, client-side optimization.' }
  ]
})

// State
const originalImage = ref<File | null>(null)
const compressedImage = ref<Blob | null>(null)
const previewUrl = ref<string | null>(null)
const compressedUrl = ref<string | null>(null)
const isProcessing = ref(false)
const error = ref<string | null>(null)

// Settings
const targetWidth = ref<number>(0)
const targetHeight = ref<number>(0)
const targetSizeMB = ref<number>(1)
const selectedFormat = ref<string>('image/jpeg')
const originalRatio = ref<number>(0)
const lockAspectRatio = ref(true)

// Computed
const originalSizeMB = computed(() => {
  if (!originalImage.value) return 0
  return (originalImage.value.size / 1024 / 1024).toFixed(2)
})

const compressedSizeMB = computed(() => {
  if (!compressedImage.value) return 0
  return (compressedImage.value.size / 1024 / 1024).toFixed(2)
})

const compressionSavings = computed(() => {
  if (!originalImage.value || !compressedImage.value) return 0
  const savings = (1 - compressedImage.value.size / originalImage.value.size) * 100
  return savings.toFixed(1)
})

// Handle File Upload
const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    processFile(input.files[0])
  }
}

const handleDrop = (event: DragEvent) => {
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

const processFile = (file: File) => {
  if (!file.type.startsWith('image/')) {
    error.value = 'Please upload an image file.'
    return
  }
  
  error.value = null
  originalImage.value = file
  previewUrl.value = URL.createObjectURL(file)
  compressedImage.value = null
  compressedUrl.value = null
  
  // Get dimensions
  const img = new Image()
  img.src = previewUrl.value
  img.onload = () => {
    targetWidth.value = img.width
    targetHeight.value = img.height
    originalRatio.value = img.width / img.height
  }
}

// Aspect Ratio Logic
watch(targetWidth, (newWidth) => {
  if (lockAspectRatio.value && originalRatio.value > 0 && newWidth > 0) {
    // Only update height if it deviates significantly to avoid infinite loops with rounding
    const expectedHeight = Math.round(newWidth / originalRatio.value)
    if (Math.abs(targetHeight.value - expectedHeight) > 1) {
      targetHeight.value = expectedHeight
    }
  }
})

watch(targetHeight, (newHeight) => {
  if (lockAspectRatio.value && originalRatio.value > 0 && newHeight > 0) {
    const expectedWidth = Math.round(newHeight * originalRatio.value)
    if (Math.abs(targetWidth.value - expectedWidth) > 1) {
      targetWidth.value = expectedWidth
    }
  }
})

// Compression Logic
const compressImage = async () => {
  if (!originalImage.value) return

  isProcessing.value = true
  error.value = null

  try {
    // CRITICAL: Use maxWidthOrHeight to preserve aspect ratio
    // browser-image-compression handles the scaling proportionally
    const maxWidthOrHeight = Math.max(targetWidth.value, targetHeight.value)

    const options = {
      maxSizeMB: targetSizeMB.value,
      maxWidthOrHeight: maxWidthOrHeight,
      useWebWorker: true,
      fileType: selectedFormat.value,
      initialQuality: 0.8
    }

    const compressedFile = await imageCompression(originalImage.value, options)
    compressedImage.value = compressedFile
    compressedUrl.value = URL.createObjectURL(compressedFile)
  } catch (err) {
    console.error(err)
    error.value = 'Compression failed. Please try a different image or settings.'
  } finally {
    isProcessing.value = false
  }
}

const downloadImage = () => {
  if (!compressedUrl.value) return
  const link = document.createElement('a')
  link.href = compressedUrl.value
  const ext = selectedFormat.value.split('/')[1]
  link.download = `compressed-image.${ext}`
  link.click()
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-slate-300 p-4 sm:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white mb-2">Smart Image Compressor</h1>
          <p class="text-slate-400">Compress images locally without distortion.</p>
        </div>
        <NuxtLink to="/" class="text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </NuxtLink>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left Column: Upload & Preview -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Upload Area -->
          <div 
            v-if="!originalImage"
            @dragover.prevent
            @drop.prevent="handleDrop"
            class="border-2 border-dashed border-slate-700 rounded-2xl p-12 text-center hover:border-indigo-500 hover:bg-slate-800/50 transition-all cursor-pointer group"
            @click="$refs.fileInput.click()"
          >
            <input 
              ref="fileInput"
              type="file" 
              accept="image/*" 
              class="hidden" 
              @change="handleFileUpload"
            >
            <div class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
              <span class="text-4xl">🖼️</span>
            </div>
            <h3 class="text-xl font-bold text-white mb-2">Drop your image here</h3>
            <p class="text-slate-500">or click to browse (JPG, PNG, WebP)</p>
          </div>

          <!-- Preview Area -->
          <div v-else class="bg-slate-800 rounded-2xl p-4 border border-slate-700 relative">
            <button 
              @click="originalImage = null" 
              class="absolute top-4 right-4 bg-slate-900/80 text-white p-2 rounded-full hover:bg-red-500/80 transition-colors z-10"
              title="Remove Image"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div class="grid md:grid-cols-2 gap-4">
              <!-- Original -->
              <div class="space-y-2">
                <div class="text-sm font-medium text-slate-400 flex justify-between">
                  <span>Original</span>
                  <span class="text-white">{{ originalSizeMB }} MB</span>
                </div>
                <div class="aspect-video bg-slate-900/50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-700/50">
                  <img :src="previewUrl" class="max-w-full max-h-full object-contain" alt="Original Preview">
                </div>
              </div>

              <!-- Compressed -->
              <div class="space-y-2">
                <div class="text-sm font-medium text-slate-400 flex justify-between">
                  <span>Compressed</span>
                  <span v-if="compressedImage" class="text-green-400 font-bold">
                    {{ compressedSizeMB }} MB (-{{ compressionSavings }}%)
                  </span>
                  <span v-else class="text-slate-600">--</span>
                </div>
                <div class="aspect-video bg-slate-900/50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-700/50 relative">
                  <div v-if="isProcessing" class="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                  </div>
                  <img v-if="compressedUrl" :src="compressedUrl" class="max-w-full max-h-full object-contain" alt="Compressed Preview">
                  <div v-else class="text-slate-600 text-sm">Waiting for export...</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Settings -->
        <div class="lg:col-span-1">
          <div class="bg-slate-800 rounded-2xl border border-slate-700 p-6 sticky top-24">
            <h2 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <span class="text-indigo-400">⚙️</span> Compression Settings
            </h2>

            <div class="space-y-6" :class="{ 'opacity-50 pointer-events-none': !originalImage }">
              <!-- Dimensions -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="text-sm font-medium text-slate-300">Dimensions (px)</label>
                  <button 
                    @click="lockAspectRatio = !lockAspectRatio"
                    class="text-xs flex items-center gap-1 px-2 py-1 rounded transition-colors"
                    :class="lockAspectRatio ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700 text-slate-400'"
                    title="Lock Aspect Ratio"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path v-if="lockAspectRatio" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                    {{ lockAspectRatio ? 'Locked' : 'Unlocked' }}
                  </button>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="text-xs text-slate-500 mb-1 block">Width</label>
                    <input 
                      v-model.number="targetWidth"
                      type="number" 
                      class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                  </div>
                  <div>
                    <label class="text-xs text-slate-500 mb-1 block">Height</label>
                    <input 
                      v-model.number="targetHeight"
                      type="number" 
                      class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    >
                  </div>
                </div>
              </div>

              <!-- Max Size -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-300">Max File Size (MB)</label>
                <div class="flex items-center gap-3">
                  <input 
                    v-model.number="targetSizeMB"
                    type="range" 
                    min="0.1" 
                    max="10" 
                    step="0.1"
                    class="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  >
                  <span class="text-sm font-mono text-indigo-400 w-12 text-right">{{ targetSizeMB }}</span>
                </div>
              </div>

              <!-- Format -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-300">Output Format</label>
                <select 
                  v-model="selectedFormat"
                  class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="image/jpeg">JPEG (Best Compression)</option>
                  <option value="image/png">PNG (Lossless-ish)</option>
                  <option value="image/webp">WebP (Modern)</option>
                </select>
              </div>

              <!-- Actions -->
              <div class="pt-4 space-y-3">
                <button 
                  @click="compressImage"
                  :disabled="isProcessing"
                  class="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <span v-if="isProcessing" class="animate-spin">⏳</span>
                  {{ isProcessing ? 'Compressing...' : 'Export & Compress' }}
                </button>

                <button 
                  v-if="compressedUrl"
                  @click="downloadImage"
                  class="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2 animate-bounce-short"
                >
                  <span>⬇️</span> Download Image
                </button>
              </div>
            </div>

            <!-- Error Message -->
            <div v-if="error" class="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-bounce-short {
  animation: bounce-short 1s infinite;
}

@keyframes bounce-short {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5%); }
}
</style>
