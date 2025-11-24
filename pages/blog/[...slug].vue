<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="p-8 sm:p-12">
        <div class="mb-8">
          <NuxtLink to="/blog" class="text-indigo-600 hover:text-indigo-800 font-medium text-sm flex items-center">
            ← Back to Blog
          </NuxtLink>
        </div>

        <ContentDoc>
          <template #default="{ doc }">
            <article class="prose prose-indigo prose-lg max-w-none">
              <div class="mb-10 not-prose">
                <h1 class="text-4xl font-extrabold text-gray-900 mb-4">{{ doc.title }}</h1>
                <div class="flex items-center text-gray-500 text-sm">
                  <span v-if="doc.date">{{ new Date(doc.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
                  <span class="mx-2">•</span>
                  <span>{{ doc.readingTime?.text || '5 min read' }}</span>
                </div>
              </div>
              
              <ContentRenderer :value="doc" />
            </article>
          </template>

          <template #not-found>
            <div class="text-center py-12">
              <h1 class="text-2xl font-bold text-gray-900 mb-4">Article not found</h1>
              <p class="text-gray-500 mb-8">The article you are looking for does not exist.</p>
              <NuxtLink to="/blog" class="text-indigo-600 hover:text-indigo-800 font-medium">
                Go back to Blog
              </NuxtLink>
            </div>
          </template>
        </ContentDoc>
      </div>
    </div>
  </div>
</template>
