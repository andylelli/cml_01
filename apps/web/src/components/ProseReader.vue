<script setup lang="ts">
import { computed, ref } from "vue";

export interface ProseChapter {
  title: string;
  summary?: string;
  paragraphs: string[];
}

export interface ProseData {
  status: string;
  tone?: string;
  chapters: ProseChapter[];
  cast?: string[];
  note?: string;
}

const props = defineProps<{
  prose: ProseData | null;
}>();

const currentChapterIndex = ref(0);

const currentChapter = computed(() => {
  if (!props.prose?.chapters.length) return null;
  return props.prose.chapters[currentChapterIndex.value];
});

const canGoPrev = computed(() => currentChapterIndex.value > 0);

const canGoNext = computed(() => {
  if (!props.prose?.chapters) return false;
  return currentChapterIndex.value < props.prose.chapters.length - 1;
});

const goToPrev = () => {
  if (canGoPrev.value) {
    currentChapterIndex.value--;
  }
};

const goToNext = () => {
  if (canGoNext.value) {
    currentChapterIndex.value++;
  }
};

const goToChapter = (index: number) => {
  currentChapterIndex.value = index;
};
</script>

<template>
  <div v-if="!prose" class="rounded-lg border border-slate-200 bg-white p-6">
    <p class="text-sm text-slate-600">Prose not yet generated. Run the pipeline to create the story.</p>
  </div>
  <div v-else class="flex gap-6">
    <!-- Chapter list sidebar -->
    <aside class="w-48 flex-shrink-0 space-y-2">
      <div class="text-xs font-semibold uppercase text-slate-500">Chapters</div>
      <button
        v-for="(chapter, idx) in prose.chapters"
        :key="idx"
        :class="[
          'w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
          idx === currentChapterIndex
            ? 'bg-slate-900 text-white'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
        ]"
        @click="goToChapter(idx)"
      >
        {{ chapter.title }}
      </button>
    </aside>

    <!-- Chapter content -->
    <div class="flex-1 rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
      <div v-if="currentChapter" class="prose prose-slate max-w-none">
        <h2 class="mb-4 text-2xl font-serif font-bold text-slate-900">
          {{ currentChapter.title }}
        </h2>
        <p v-if="currentChapter.summary" class="mb-6 italic text-slate-600">
          {{ currentChapter.summary }}
        </p>
        <div class="space-y-4 font-serif text-slate-800 leading-relaxed">
          <p v-for="(para, idx) in currentChapter.paragraphs" :key="idx" class="text-base">
            {{ para }}
          </p>
        </div>
      </div>

      <!-- Navigation -->
      <div class="mt-8 flex items-center justify-between border-t border-slate-200 pt-4">
        <button
          :disabled="!canGoPrev"
          :class="[
            'rounded-md px-4 py-2 text-sm font-semibold',
            canGoPrev
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed',
          ]"
          @click="goToPrev"
        >
          ← Previous
        </button>
        <span class="text-sm text-slate-500">
          Chapter {{ currentChapterIndex + 1 }} of {{ prose.chapters.length }}
        </span>
        <button
          :disabled="!canGoNext"
          :class="[
            'rounded-md px-4 py-2 text-sm font-semibold',
            canGoNext
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed',
          ]"
          @click="goToNext"
        >
          Next →
        </button>
      </div>
    </div>
  </div>
</template>
