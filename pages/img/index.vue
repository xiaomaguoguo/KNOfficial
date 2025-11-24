<script setup lang="ts">
useHead({
  title: 'Free Image Converter (WebP/PNG to JPG) - KNothing',
  meta: [
    { name: 'description', content: 'Convert images locally in your browser. No upload required. Support for JPG, PNG, and WebP formats.' }
  ]
})

const file = ref<File | null>(null)
const previewUrl = ref<string | null>(null)
const outputFormat = ref('image/jpeg')
const isDragging = ref(false)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const formats = [
  { value: 'image/jpeg', label: 'JPG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/webp', label: 'WEBP' }
]

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  const droppedFile = e.dataTransfer?.files[0]
  if (droppedFile && droppedFile.type.startsWith('image/')) {
    handleFile(droppedFile)
  }
}

const onFileSelect = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    handleFile(input.files[0])
  }
}

const handleFile = (f: File) => {
  file.value = f
  previewUrl.value = URL.createObjectURL(f)
}

const downloadImage = () => {
  if (!file.value || !canvasRef.value) return

  const img = new Image()
  img.src = previewUrl.value!
  img.onload = () => {
    const canvas = canvasRef.value!
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // White background for JPG/transparent images
      if (outputFormat.value === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      ctx.drawImage(img, 0, 0)
      
      const dataUrl = canvas.toDataURL(outputFormat.value, 0.9)
      const link = document.createElement('a')
      const ext = outputFormat.value.split('/')[1]
      link.download = `converted-image.${ext}`
      link.href = dataUrl
      link.click()
    }
  }
}

const clearFile = () => {
  file.value = null
  previewUrl.value = null
  if (canvasRef.value) {
    const ctx = canvasRef.value.getContext('2d')
    ctx?.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Free Image Converter
        </h1>
        <p class="mt-4 text-lg text-gray-500">
          Convert images locally in your browser. No upload required.
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="p-8">
          <!-- Drop Zone -->
          <div
            v-if="!file"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
            class="relative border-2 border-dashed rounded-xl p-12 text-center transition-colors duration-200 cursor-pointer"
            :class="isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'"
          >
            <input
              type="file"
              accept="image/*"
              class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              @change="onFileSelect"
            />
            <div class="space-y-4">
              <div class="text-6xl">🖼️</div>
              <div class="text-gray-600 font-medium">
                Drop your image here, or <span class="text-indigo-600">browse</span>
              </div>
              <p class="text-sm text-gray-400">Supports JPG, PNG, WEBP</p>
            </div>
          </div>

          <!-- Preview & Controls -->
          <div v-else class="space-y-8">
            <div class="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <img :src="previewUrl!" class="max-h-[400px] mx-auto object-contain" alt="Preview" />
              <button
                @click="clearFile"
                class="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white text-gray-500 hover:text-red-500 transition-colors"
                title="Remove image"
              >
                ✕
              </button>
            </div>

            <div class="grid sm:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Output Format</label>
                <select
                  v-model="outputFormat"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-3"
                >
                  <option v-for="fmt in formats" :key="fmt.value" :value="fmt.value">
                    {{ fmt.label }}
                  </option>
                </select>
              </div>

              <div class="flex items-end">
                <button
                  @click="downloadImage"
                  class="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-xl transition-all"
                >
                  Download Converted Image
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Hidden Canvas for Processing -->
      <canvas ref="canvasRef" class="hidden"></canvas>
    </div>
  </div>
</template>
