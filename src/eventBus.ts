import { ref } from 'vue';

type EventCallback = () => void;

interface EventBus {
  emit: (event: string) => void;
  on: (event: string, callback: EventCallback) => void;
}

const callbacks = ref<Record<string, EventCallback[]>>({
  'new-conversation': [],
});

export const eventBus: EventBus = {
  emit(event: string) {
    if (callbacks.value[event]) {
      callbacks.value[event].forEach(callback => callback());
    }
  },
  on(event: string, callback: EventCallback) {
    if (!callbacks.value[event]) {
      callbacks.value[event] = [];
    }
    callbacks.value[event].push(callback);
  }
};