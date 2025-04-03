import { create } from 'zustand'

type EditState = {
  isEditing: boolean
  editedUser: {
    name: string
    email?: string
    phone?: string
  } | null
  showVerifyDialog: boolean
  verifyType: 'email' | 'phone'
  verifyContact: string
  verifyCode: string
  verifyLoading: boolean
  codeSent: boolean
  countdown: number
  password: string
  avatarFile: File | null
  avatarPreview: string | null
  uploadLoading: boolean
}

type ProfileState = EditState & {
  setEditing: (isEditing: boolean) => void
  setEditedUser: (user: EditState['editedUser']) => void
  setShowVerifyDialog: (show: boolean) => void
  setVerifyType: (type: 'email' | 'phone') => void
  setVerifyContact: (contact: string) => void
  setVerifyCode: (code: string) => void
  setVerifyLoading: (loading: boolean) => void
  setCodeSent: (sent: boolean) => void
  setCountdown: (count: number) => void
  setPassword: (password: string) => void
  setAvatarFile: (file: File | null) => void
  setAvatarPreview: (preview: string | null) => void
  setUploadLoading: (loading: boolean) => void
  resetEditState: () => void
}

const initialState: EditState = {
  isEditing: false,
  editedUser: null,
  showVerifyDialog: false,
  verifyType: 'email',
  verifyContact: '',
  verifyCode: '',
  verifyLoading: false,
  codeSent: false,
  countdown: 0,
  password: '',
  avatarFile: null,
  avatarPreview: null,
  uploadLoading: false,
}

export const useProfileStore = create<ProfileState>((set) => ({
  ...initialState,
  setEditing: (isEditing) => set({ isEditing }),
  setEditedUser: (editedUser) => set({ editedUser }),
  setShowVerifyDialog: (showVerifyDialog) => set({ showVerifyDialog }),
  setVerifyType: (verifyType) => set({ verifyType }),
  setVerifyContact: (verifyContact) => set({ verifyContact }),
  setVerifyCode: (verifyCode) => set({ verifyCode }),
  setVerifyLoading: (verifyLoading) => set({ verifyLoading }),
  setCodeSent: (codeSent) => set({ codeSent }),
  setCountdown: (countdown) => set({ countdown }),
  setPassword: (password) => set({ password }),
  setAvatarFile: (avatarFile) => set({ avatarFile }),
  setAvatarPreview: (avatarPreview) => set({ avatarPreview }),
  setUploadLoading: (uploadLoading) => set({ uploadLoading }),
  resetEditState: () => set(initialState),
}))