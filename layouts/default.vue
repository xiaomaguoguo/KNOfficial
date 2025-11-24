<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <div class="min-h-screen flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink to="/" class="flex-shrink-0 flex items-center gap-2 group">
              <div class="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                K
              </div>
              <span class="font-bold text-xl tracking-tight text-white">
                KNothing
              </span>
            </NuxtLink>
          </div>
          <div class="flex items-center gap-6">
            <NuxtLink 
              to="/blog" 
              class="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              active-class="text-indigo-400"
            >
              Blog
            </NuxtLink>

          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-slate-900 border-t border-slate-800 mt-auto">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="text-slate-500 text-sm">
          &copy; {{ year }} KNothing. Crafted with <span class="text-indigo-500">♥</span> for efficiency.
        </div>
        <div class="flex gap-8 text-sm text-slate-500">
          <NuxtLink to="/privacy" class="hover:text-indigo-400 transition-colors">Privacy</NuxtLink>
          <NuxtLink to="/terms" class="hover:text-indigo-400 transition-colors">Terms</NuxtLink>
          <a href="#" class="hover:text-indigo-400 transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  </div>
</template>
