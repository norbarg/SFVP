<script setup>
defineProps({
    open: {
        type: Boolean,
        default: false,
    },
    title: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['close', 'confirm']);

const closeOnBackdrop = (event) => {
    if (event.target === event.currentTarget) {
        emit('close');
    }
};
</script>

<template>
    <div v-if="open" class="modal-backdrop" @click="closeOnBackdrop">
        <div class="modal-dialog" role="dialog">
            <button type="button" class="modal-close" @click="emit('close')">
                ×
            </button>

            <h3>{{ title }}</h3>

            <div class="modal-content">
                <slot />
            </div>

            <div class="modal-actions">
                <button
                    type="button"
                    class="modal-cancel"
                    @click="emit('close')"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    class="modal-confirm"
                    @click="emit('confirm')"
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>
</template>
