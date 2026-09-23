<script setup>
import { computed } from 'vue';

import { storeToRefs } from 'pinia';

import { useSettingsStore } from '../stores/settings';

const props = defineProps({
    page: {
        type: Number,
        required: true,
    },

    totalPages: {
        type: Number,
        required: true,
    },

    perPage: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(['page', 'perPage']);

const settings = useSettingsStore();

const { language } = storeToRefs(settings);

const text = computed(() => {
    if (language.value === 'ua') {
        return {
            first: 'Перша',
            prev: 'Назад',
            page: 'Сторінка',
            next: 'Далі',
            last: 'Остання',
            show: 'Показувати',
        };
    }

    return {
        first: 'First',
        prev: 'Prev',
        page: 'Page',
        next: 'Next',
        last: 'Last',
        show: 'Show',
    };
});

const goFirst = () => {
    emit('page', 1);
};

const goPrev = () => {
    emit('page', Math.max(1, props.page - 1));
};

const goNext = () => {
    emit('page', Math.min(props.totalPages, props.page + 1));
};

const goLast = () => {
    emit('page', props.totalPages);
};

const changePerPage = (event) => {
    emit('perPage', Number(event.target.value));
};
</script>

<template>
    <div class="pagination">
        <div class="pagination-navigation">
            <button type="button" :disabled="page <= 1" @click="goFirst">
                {{ text.first }}
            </button>

            <button type="button" :disabled="page <= 1" @click="goPrev">
                {{ text.prev }}
            </button>

            <span>
                {{ text.page }}
                {{ page }}
                /
                {{ totalPages }}
            </span>

            <button
                type="button"
                :disabled="page >= totalPages"
                @click="goNext"
            >
                {{ text.next }}
            </button>

            <button
                type="button"
                :disabled="page >= totalPages"
                @click="goLast"
            >
                {{ text.last }}
            </button>
        </div>

        <label class="per-page">
            <span>
                {{ text.show }}
            </span>

            <select :value="perPage" @change="changePerPage">
                <option
                    v-for="number in [5, 10, 20, 50, 100]"
                    :key="number"
                    :value="number"
                >
                    {{ number }}
                </option>
            </select>
        </label>
    </div>
</template>
