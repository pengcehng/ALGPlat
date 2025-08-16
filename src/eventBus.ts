import { ref } from 'vue';

type EventCallback = (...args: any[]) => void;

interface EventBus {
  emit: (event: string, ...args: any[]) => void;
  on: (event: string, callback: EventCallback) => void;
}

const callbacks = ref<Record<string, EventCallback[]>>({
  'new-conversation': [],
  'toggle-sidebar': [],
});

export const eventBus: EventBus = {
  emit(event: string, ...args: any[]) {
    if (callbacks.value[event]) {
      callbacks.value[event].forEach(callback => callback(...args));
    }
  },
  on(event: string, callback: EventCallback) {
    if (!callbacks.value[event]) {
      callbacks.value[event] = [];
    }
    callbacks.value[event].push(callback);
  }
};