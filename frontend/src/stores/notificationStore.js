import {create} from 'zustand'

export const useNotificationStore = create((set) => ({
  show: false,
  header: '',
  message: '',
  variant: 'Secondary',
  showNotification: (header, message, variant) => {
    set({show: true, header, message, variant})
  },
  hideNotification: () => set({show: false, header: '', message: '', variant: 'Secondary'})
}))