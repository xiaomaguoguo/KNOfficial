<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import QRCode from 'qrcode'

useSeoMeta({
  title: 'Free QR Code Generator with Logo',
  description: 'Create custom QR codes with colors and logos. No signup.',
  ogTitle: 'Free QR Code Generator with Logo',
  ogDescription: 'Create custom QR codes with colors and logos. No signup.'
})

const text = ref('https://knothing.com')
const colorDark = ref('#000000')
const colorLight = ref('#ffffff')
const size = ref(300)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const error = ref('')

const generateQR = async () => {
  if (!canvasRef.value || !text.value) return
  
  try {
    error.value = ''
    await QRCode.toCanvas(canvasRef.value, text.value, {
      width: size.value,
      margin: 2,
      color: {
        dark: colorDark.value,
        light: colorLight.value
      },
      errorCorrectionLevel: 'H'
    })
  } catch (err) {
    error.value = 'Failed to generate QR code'
    console.error(err)
  }
}

const downloadQR = () => {
  if (!canvasRef.value) return
  const link = document.createElement('a')
  link.download = 'qrcode.png'
  link.href = canvasRef.value.toDataURL()
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

watch([text, colorDark, colorLight, size], () => {
  generateQR()
})

onMounted(() => {
  generateQR()
})
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50 rounded-full blur-3xl opacity-40 -z-10 pointer-events-none"></div>

    <div class="w-full max-w-6xl">
      <div class="mb-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm mb-6 text-3xl border border-gray-100">
          📱
        </div>
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">QR Code Generator</h1>
        <p class="mt-4 text-lg text-gray-500">Create custom QR codes instantly.</p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Controls -->
        <div class="lg:col-span-1 space-y-6">
          <div class="glass rounded-3xl shadow-xl border border-white/50 p-6 backdrop-blur-xl">
            <div class="space-y-6">
              <div>
                <label class="text-sm font-bold text-gray-700 mb-2 uppercase block">Content</label>
                <textarea 
                  v-model="text"
                  class="w-full p-4 bg-white border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm min-h-[100px]"
                  placeholder="Enter URL or text..."
                ></textarea>
              </div>

              <div>
                <label class="text-sm font-bold text-gray-700 mb-2 uppercase block">Colors</label>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <span class="text-xs text-gray-500 block mb-1">Foreground</span>
                    <div class="flex items-center gap-2">
                      <input type="color" v-model="colorDark" class="h-10 w-10 rounded-lg cursor-pointer border-0 p-0" />
                      <span class="text-xs font-mono">{{ colorDark }}</span>
                    </div>
                  </div>
                  <div>
                    <span class="text-xs text-gray-500 block mb-1">Background</span>
                    <div class="flex items-center gap-2">
                      <input type="color" v-model="colorLight" class="h-10 w-10 rounded-lg cursor-pointer border-0 p-0" />
                      <span class="text-xs font-mono">{{ colorLight }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label class="text-sm font-bold text-gray-700 mb-2 uppercase block">Size: {{ size }}px</label>
                <input 
                  type="range" 
                  min="200" 
                  max="1000" 
                  step="50"
                  v-model.number="size"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="lg:col-span-2">
          <div class="glass rounded-3xl shadow-xl border border-white/50 p-8 backdrop-blur-xl flex flex-col items-center justify-center min-h-[500px]">
            <div class="bg-white p-4 rounded-2xl shadow-sm mb-8">
              <canvas ref="canvasRef"></canvas>
            </div>
            
            <button 
              @click="downloadQR"
              class="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
