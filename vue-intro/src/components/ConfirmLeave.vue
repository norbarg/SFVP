<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue';

const props = defineProps({
    enabled: {
        type: Boolean,
        default: false,
    },
});

const handler = (event) => {
    event.preventDefault();
    event.returnValue = '';
};

const addListener = () => {
    window.addEventListener('beforeunload', handler);
};

const removeListener = () => {
    window.removeEventListener('beforeunload', handler);
};

onMounted(() => {
    if (props.enabled) {
        addListener();
    }
});

watch(
    () => props.enabled,
    (enabled) => {
        removeListener();

        if (enabled) {
            addListener();
        }
    },
);

onBeforeUnmount(() => {
    removeListener();
});
</script>

<template>
    <span style="display: none"></span>
</template>
