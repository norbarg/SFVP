<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    page: number;
    total: number;
    perPage: number;
}>();

const emit = defineEmits<{
    'update:page': [value: number];

    'update:perPage': [value: number];
}>();

const pages = computed(() =>
    Math.max(1, Math.ceil(props.total / props.perPage)),
);

function prev() {
    emit('update:page', Math.max(1, props.page - 1));
}

function next() {
    emit('update:page', Math.min(pages.value, props.page + 1));
}
</script>

<template>
    <div class="pagination">
        <div class="pagination-navigation">
            <button type="button" :disabled="page <= 1" @click="prev">
                ← Prev
            </button>

            <span>
                {{ String(page).padStart(2, '0') }}
                /
                {{ String(pages).padStart(2, '0') }}
            </span>

            <button type="button" :disabled="page >= pages" @click="next">
                Next →
            </button>
        </div>

        <label class="per-page">
            <span> Show </span>

            <select
                :value="perPage"
                @change="
                    emit(
                        'update:perPage',
                        Number(($event.target as HTMLSelectElement).value),
                    )
                "
            >
                <option
                    v-for="number in [5, 10, 20]"
                    :key="number"
                    :value="number"
                >
                    {{ number }}
                </option>
            </select>
        </label>
    </div>
</template>
