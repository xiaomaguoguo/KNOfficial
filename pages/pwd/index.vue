<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

useHead({
  title: 'Secure Password Generator - KNothing',
  meta: [
    { name: 'description', content: 'Generate strong, secure passwords instantly with our free online tool.' }
  ]
})

const length = ref(16)
const includeUppercase = ref(true)
const includeLowercase = ref(true)
const includeNumbers = ref(true)
const includeSymbols = ref(true)
const password = ref('')
const copied = ref(false)

const generatePassword = () => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const lowercase = 'abcdefghijklmnopqrstuvwxyz'
  const numbers = '0123456789'
  const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-='
  
  let chars = ''
  if (includeUppercase.value) chars += uppercase
  if (includeLowercase.value) chars += lowercase
  if (includeNumbers.value) chars += numbers
  if (includeSymbols.value) chars += symbols
  
  if (chars === '') {
    password.value = ''
    return
  }
  
  let result = ''
  for (let i = 0; i < length.value; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  password.value = result
  copied.value = false
}

const copyToClipboard = async () => {
  if (!password.value) return
  try {
    await navigator.clipboard.writeText(password.value)
    copied.value = true
    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Generate on mount and when options change
watch([length, includeUppercase, includeLowercase, includeNumbers, includeSymbols], generatePassword)

// Initial generation
onMounted(() => {
  generatePassword()
})

const strength = computed(() => {
  if (!password.value) return 0
  let score = 0
  if (length.value > 8) score++
  if (length.value > 12) score++
  if (includeUppercase.value) score++
  if (includeNumbers.value) score++
  if (includeSymbols.value) score++
  return score
})

const strengthLabel = computed(() => {
  const s = strength.value
  if (s < 2) return 'Weak'
  if (s < 4) return 'Medium'
  return 'Strong'
})

const strengthColor = computed(() => {
  const s = strength.value
  if (s < 2) return 'bg-red-500'
  if (s < 4) return 'bg-yellow-500'
  return 'bg-green-500'
})
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-50 rounded-full blur-3xl opacity-40 -z-10 pointer-events-none"></div>

    <div class="w-full max-w-3xl">
      <div class="mb-12 text-center">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm mb-6 text-3xl border border-gray-100">
          🔒
        </div>
        <h1 class="text-4xl font-extrabold text-gray-900 sm:text-5xl tracking-tight">Password Generator</h1>
        <p class="mt-4 text-lg text-gray-500">Create strong, secure passwords instantly.</p>
      </div>

      <div class="glass rounded-3xl shadow-xl border border-white/50 overflow-hidden backdrop-blur-xl">
        <!-- Display Area -->
        <div class="p-10 md:p-12 bg-white/50 border-b border-gray-100 text-center relative group">
          <div class="relative z-10">
            <div class="text-4xl sm:text-5xl font-mono font-medium text-gray-900 break-all tracking-wider min-h-[4rem] flex items-center justify-center px-12 transition-all duration-300">
              {{ password || '...' }}
            </div>
            
            <!-- Strength Indicator -->
            <div class="mt-8 flex flex-col items-center gap-3">
              <div class="flex items-center gap-2">
                <div class="h-1.5 w-16 rounded-full bg-gray-200 overflow-hidden">
                  <div :class="['h-full transition-all duration-500 ease-out', strengthColor]" :style="{ width: '100%' }"></div>
                </div>
                <div class="h-1.5 w-16 rounded-full bg-gray-200 overflow-hidden">
                  <div :class="['h-full transition-all duration-500 ease-out', strength >= 2 ? strengthColor : 'bg-transparent']" :style="{ width: '100%' }"></div>
                </div>
                <div class="h-1.5 w-16 rounded-full bg-gray-200 overflow-hidden">
                  <div :class="['h-full transition-all duration-500 ease-out', strength >= 4 ? strengthColor : 'bg-transparent']" :style="{ width: '100%' }"></div>
                </div>
              </div>
              <div class="text-xs font-bold tracking-wider uppercase" :class="{
                'text-red-500': strength < 2,
                'text-yellow-500': strength >= 2 && strength < 4,
                'text-green-500': strength >= 4
              }">{{ strengthLabel }} Security</div>
            </div>
          </div>

          <button 
            @click="copyToClipboard"
            class="absolute top-6 right-6 p-3 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300"
            title="Copy to clipboard"
          >
            <span v-if="!copied">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </span>
            <span v-else class="text-green-600 font-bold text-sm flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
              Copied
            </span>
          </button>
        </div>

        <!-- Controls -->
        <div class="p-10 md:p-12 space-y-10 bg-white/30">
          <!-- Length Slider -->
          <div>
            <div class="flex justify-between items-center mb-6">
              <label for="length" class="text-sm font-bold text-gray-700 uppercase tracking-wide">Length</label>
              <span class="text-3xl font-bold text-indigo-600 tabular-nums">{{ length }}</span>
            </div>
            <div class="relative h-2 bg-gray-200 rounded-full">
              <div class="absolute top-0 left-0 h-full bg-indigo-600 rounded-full" :style="{ width: `${((length - 8) / (64 - 8)) * 100}%` }"></div>
              <input 
                id="length" 
                type="range" 
                min="8" 
                max="64" 
                v-model.number="length"
                class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-10"
              >
              <div 
                class="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-indigo-600 rounded-full shadow-md pointer-events-none transition-all duration-75"
                :style="{ left: `calc(${((length - 8) / (64 - 8)) * 100}% - 12px)` }"
              ></div>
            </div>
          </div>

          <!-- Options -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label class="flex items-center p-4 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all duration-300 group">
              <div class="relative flex items-center justify-center w-6 h-6 mr-4">
                <input type="checkbox" v-model="includeUppercase" class="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-lg checked:bg-indigo-600 checked:border-indigo-600 transition-colors">
                <svg class="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="text-gray-700 font-medium group-hover:text-indigo-900 transition-colors">Uppercase (A-Z)</span>
            </label>
            
            <label class="flex items-center p-4 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all duration-300 group">
              <div class="relative flex items-center justify-center w-6 h-6 mr-4">
                <input type="checkbox" v-model="includeLowercase" class="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-lg checked:bg-indigo-600 checked:border-indigo-600 transition-colors">
                <svg class="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="text-gray-700 font-medium group-hover:text-indigo-900 transition-colors">Lowercase (a-z)</span>
            </label>
            
            <label class="flex items-center p-4 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all duration-300 group">
              <div class="relative flex items-center justify-center w-6 h-6 mr-4">
                <input type="checkbox" v-model="includeNumbers" class="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-lg checked:bg-indigo-600 checked:border-indigo-600 transition-colors">
                <svg class="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="text-gray-700 font-medium group-hover:text-indigo-900 transition-colors">Numbers (0-9)</span>
            </label>
            
            <label class="flex items-center p-4 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all duration-300 group">
              <div class="relative flex items-center justify-center w-6 h-6 mr-4">
                <input type="checkbox" v-model="includeSymbols" class="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-lg checked:bg-indigo-600 checked:border-indigo-600 transition-colors">
                <svg class="absolute w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="text-gray-700 font-medium group-hover:text-indigo-900 transition-colors">Symbols (!@#$)</span>
            </label>
          </div>

          <div class="pt-6">
            <button 
              @click="generatePassword"
              class="w-full py-5 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-indigo-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
            >
              Generate New Password
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
