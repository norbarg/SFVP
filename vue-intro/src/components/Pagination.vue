<script setup>
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
                First
            </button>

            <button type="button" :disabled="page <= 1" @click="goPrev">
                Prev
            </button>

            <span> Page {{ page }} / {{ totalPages }} </span>

            <button
                type="button"
                :disabled="page >= totalPages"
                @click="goNext"
            >
                Next
            </button>

            <button
                type="button"
                :disabled="page >= totalPages"
                @click="goLast"
            >
                Last
            </button>
        </div>

        <label class="per-page">
            <span>Show</span>

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
