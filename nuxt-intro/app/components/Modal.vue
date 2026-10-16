<script setup lang="ts">
defineProps<{
    open: boolean;
    title: string;
    confirmText?: string;
    cancelText?: string;
}>();

const emit = defineEmits<{
    close: [];
    confirm: [];
}>();
</script>

<template>
    <div v-if="open" class="modal-overlay" @click="emit('close')">
        <div class="modal" @click.stop>
            <div class="modal-mark">ATLAS / NOTE</div>

            <h3>
                {{ title }}
            </h3>

            <div class="modal-content">
                <slot />
            </div>

            <div class="modal-actions">
                <button
                    type="button"
                    class="modal-cancel"
                    @click="emit('close')"
                >
                    {{ cancelText ?? 'Cancel' }}
                </button>

                <button
                    type="button"
                    class="modal-confirm"
                    @click="emit('confirm')"
                >
                    {{ confirmText ?? 'Confirm' }}
                </button>
            </div>
        </div>
    </div>
</template>
