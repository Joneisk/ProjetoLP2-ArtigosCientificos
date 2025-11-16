<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { X, Loader, ExternalLink } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { artigoAPI } from '@/services/api';

interface Summary {
  tituloResumo: string;
  comentarioResumo: string;
  sitesRecomendados: Array<{
    nome: string;
    url: string;
    motivo: string;
  }>;
  insights: string;
  geradoEm?: string;
}

const props = defineProps<{
  open: boolean;
  articleId: string | null;
}>();

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const summary = ref<Summary | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

watch(() => props.open, (isOpen) => {
  if (isOpen && props.articleId) {
    loadSummary();
  } else if (!isOpen) {
    summary.value = null;
    error.value = null;
  }
});

const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && props.open) {
    handleClose();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

const loadSummary = async () => {
  if (!props.articleId) return;
  
  loading.value = true;
  error.value = null;

  try {
    const response = await artigoAPI.getSummary(props.articleId);
    summary.value = response;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erro ao gerar resumo';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

const handleClose = () => {
  emit('update:open', false);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('pt-BR');
};
</script>

<template>
  <Transition name="fade">
    <div v-if="open" class="modal-overlay" @click.self="handleClose">
      <div class="modal-content w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Resumo com IA</h2>
          <button
            @click="handleClose"
            class="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X :size="20" class="text-gray-600" />
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-12">
          <Loader :size="40" class="text-primary animate-spin mb-4" />
          <p class="text-gray-600">Gerando resumo com IA...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p class="text-red-800">{{ error }}</p>
          <button
            @click="loadSummary"
            class="mt-3 text-sm text-red-600 hover:text-red-700 underline"
          >
            Tentar novamente
          </button>
        </div>

        <!-- Summary Content -->
        <div v-else-if="summary" class="space-y-6">
          <!-- Title -->
          <div>
            <h3 class="text-lg font-semibold text-primary mb-2">{{ summary.tituloResumo }}</h3>
            <p class="text-sm text-gray-500" v-if="summary.geradoEm">
              Gerado em {{ formatDate(summary.geradoEm) }}
            </p>
          </div>

          <div class="border-t border-gray-200 pt-4">
            <!-- Summary Text -->
            <div>
              <h4 class="text-sm font-semibold text-gray-700 mb-2">Resumo Executivo</h4>
              <p class="text-gray-700 leading-relaxed">{{ summary.comentarioResumo }}</p>
            </div>

            <hr class="my-6 border-gray-200" />

            <!-- Insights -->
            <div v-if="summary.insights">
              <h4 class="text-sm font-semibold text-gray-700 mb-2">💡 Insights Importantes</h4>
              <p class="text-gray-700 leading-relaxed whitespace-pre-wrap">{{ summary.insights }}</p>
            </div>

            <hr class="my-6 border-gray-200" />

            <!-- Recommended Sites -->
            <div v-if="summary.sitesRecomendados && summary.sitesRecomendados.length > 0">
              <h4 class="text-sm font-semibold text-gray-700 mb-3">🔗 Sites Recomendados</h4>
              <div class="space-y-3">
                <div
                  v-for="(site, idx) in summary.sitesRecomendados"
                  :key="idx"
                  class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1">
                      <p class="font-medium text-gray-900">{{ site.nome }}</p>
                      <p class="text-sm text-gray-600 mt-1">{{ site.motivo }}</p>
                      <p class="text-xs text-gray-500 mt-2 break-all">{{ site.url }}</p>
                    </div>
                    <a
                      v-if="site.url.startsWith('http')"
                      :href="site.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex-shrink-0 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <ExternalLink :size="18" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-6 text-gray-500">
              Nenhum site adicional recomendado para este artigo
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12 text-gray-500">
          Clique em "Gerar Resumo" para começar
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
