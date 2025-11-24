<script setup lang="ts">
useHead({
  title: 'Cron Expression Generator - KNothing',
  meta: [
    { name: 'description', content: 'Create and schedule cron jobs easily with a visual interface. Generate cron expressions for Linux/Unix.' }
  ]
})

const minute = ref('*')
const hour = ref('*')
const day = ref('*')
const month = ref('*')
const weekday = ref('*')

const cronExpression = computed(() => {
  return `${minute.value} ${hour.value} ${day.value} ${month.value} ${weekday.value}`
})

const humanReadable = computed(() => {
  const m = minute.value
  const h = hour.value
  const d = day.value
  const mo = month.value
  const w = weekday.value

  let desc = 'Run '

  // Simple heuristic for description
  if (m === '*' && h === '*' && d === '*' && mo === '*' && w === '*') {
    return 'Run every minute'
  }

  if (m !== '*' && m.startsWith('*/')) {
    desc += `every ${m.substring(2)} minutes `
  } else if (m !== '*') {
    desc += `at minute ${m} `
  } else {
    desc += 'every minute '
  }

  if (h !== '*' && h.startsWith('*/')) {
    desc += `past every ${h.substring(2)} hours`
  } else if (h !== '*') {
    desc += `past hour ${h}`
  }

  if (d !== '*') desc += ` on day of month ${d}`
  if (mo !== '*') desc += ` in month ${mo}`
  if (w !== '*') desc += ` on day of week ${w}`

  return desc
})

const copyCron = () => {
  navigator.clipboard.writeText(cronExpression.value)
}

// Helper to generate range arrays
const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i)
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-10">
        <h1 class="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Cron Expression Generator
        </h1>
        <p class="mt-4 text-lg text-gray-500">
          Create and schedule cron jobs easily.
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <!-- Result Display -->
        <div class="mb-10">
          <div class="relative rounded-md shadow-sm">
            <input
              type="text"
              readonly
              :value="cronExpression"
              class="block w-full text-center text-4xl font-mono p-6 border-2 border-indigo-100 rounded-xl bg-indigo-50 text-indigo-700 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              @click="copyCron"
              class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-indigo-400 hover:text-indigo-600 transition-colors"
              title="Copy to clipboard"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
          <p class="mt-4 text-center text-lg text-gray-600 font-medium">
            "{{ humanReadable }}"
          </p>
        </div>

        <!-- Controls -->
        <div class="grid gap-8 md:grid-cols-5">
          <!-- Minute -->
          <div class="space-y-3">
            <label class="block text-sm font-bold text-gray-700 uppercase tracking-wide">Minute</label>
            <select v-model="minute" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="*">Every Minute</option>
              <option value="*/2">Every 2 mins</option>
              <option value="*/5">Every 5 mins</option>
              <option value="*/10">Every 10 mins</option>
              <option value="*/15">Every 15 mins</option>
              <option value="*/30">Every 30 mins</option>
              <option disabled>---</option>
              <option v-for="m in range(0, 59)" :key="m" :value="m.toString()">At :{{ m.toString().padStart(2, '0') }}</option>
            </select>
          </div>

          <!-- Hour -->
          <div class="space-y-3">
            <label class="block text-sm font-bold text-gray-700 uppercase tracking-wide">Hour</label>
            <select v-model="hour" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="*">Every Hour</option>
              <option value="*/2">Every 2 hours</option>
              <option value="*/3">Every 3 hours</option>
              <option value="*/4">Every 4 hours</option>
              <option value="*/6">Every 6 hours</option>
              <option value="*/12">Every 12 hours</option>
              <option disabled>---</option>
              <option v-for="h in range(0, 23)" :key="h" :value="h.toString()">At {{ h.toString().padStart(2, '0') }}:00</option>
            </select>
          </div>

          <!-- Day -->
          <div class="space-y-3">
            <label class="block text-sm font-bold text-gray-700 uppercase tracking-wide">Day</label>
            <select v-model="day" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="*">Every Day</option>
              <option v-for="d in range(1, 31)" :key="d" :value="d.toString()">{{ d }}</option>
            </select>
          </div>

          <!-- Month -->
          <div class="space-y-3">
            <label class="block text-sm font-bold text-gray-700 uppercase tracking-wide">Month</label>
            <select v-model="month" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="*">Every Month</option>
              <option v-for="mo in range(1, 12)" :key="mo" :value="mo.toString()">{{ new Date(0, mo - 1).toLocaleString('default', { month: 'short' }) }}</option>
            </select>
          </div>

          <!-- Weekday -->
          <div class="space-y-3">
            <label class="block text-sm font-bold text-gray-700 uppercase tracking-wide">Weekday</label>
            <select v-model="weekday" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
              <option value="*">Every Day</option>
              <option value="1-5">Mon-Fri</option>
              <option value="0,6">Sat-Sun</option>
              <option disabled>---</option>
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
              <option value="2">Tuesday</option>
              <option value="3">Wednesday</option>
              <option value="4">Thursday</option>
              <option value="5">Friday</option>
              <option value="6">Saturday</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
