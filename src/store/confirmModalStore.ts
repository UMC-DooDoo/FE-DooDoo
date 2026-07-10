import { create } from 'zustand'

interface ConfirmOptions {
  title: string
  description?: string
}

interface ConfirmModalStore extends ConfirmOptions {
  isOpen: boolean
  resolve: ((value: boolean) => void) | null
  request: (options: ConfirmOptions) => Promise<boolean>
  respond: (value: boolean) => void
}

export const useConfirmModalStore = create<ConfirmModalStore>((set, get) => ({
  isOpen: false,
  title: '',
  description: undefined,
  resolve: null,
  request: (options) =>
    new Promise<boolean>((resolve) => {
      set({ ...options, isOpen: true, resolve })
    }),
  respond: (value) => {
    get().resolve?.(value)
    set({ isOpen: false, resolve: null })
  },
}))

/**
 * 컴포넌트 밖(axios 인터셉터 등)에서도 부를 수 있는 확인창.
 * '예'를 누르면 true, '아니오'나 배경 클릭이면 false 로 resolve 된다.
 */
export function confirmModal(options: ConfirmOptions) {
  return useConfirmModalStore.getState().request(options)
}
