"use client";

import { createContext, useCallback, useContext, useReducer } from "react";

const initialModalState: ModalState = {
  isOpen: false,
  content: null,
  title: "",
  footerButtons: null,
  onCloseCallback: undefined,
};

export interface ModalDispatch {
  openModal: (payload: Omit<ModalState, 'isOpen'>) => void;
  closeModal: () => void;
}

export const ModalConext = createContext<ModalState>(initialModalState);
export const ModalDispatchConext = createContext<ModalDispatch | undefined>(undefined);

export function ModalProvider({children}: Readonly<{children: React.ReactNode}>) {
  const [modalState, dispatch] = useReducer(modalReducer, initialModalState)

  const openModal = useCallback((payload: Omit<ModalState, 'isOpen'>) => {
    dispatch({type: 'OPEN_MODAL', payload})
  }, [])

  const closeModal = useCallback(() => {
    if (modalState.onCloseCallback) {
      modalState.onCloseCallback();
  }
    dispatch({type: 'CLOSE_MODAL'})
  }, [modalState.onCloseCallback])

  const modalDispatch = {
    openModal,
    closeModal
  }

  return (
    <ModalConext.Provider value={modalState}>
      <ModalDispatchConext.Provider value={modalDispatch}>
        {children}
      </ModalDispatchConext.Provider>
    </ModalConext.Provider>
  )
}

// reducer
export type ModalAction =
  | { type: "OPEN_MODAL"; payload: Omit<ModalState, "isOpen"> }
  | { type: "CLOSE_MODAL" };

interface ModalState {
  isOpen: boolean;
  content: React.ReactNode | null;
  title: string;
  footerButtons: React.ReactNode | null;
  onCloseCallback?: () => void;
}

export const modalReducer = (state: ModalState, action: ModalAction) => {
  switch (action.type) {
    case "OPEN_MODAL":
      return {
        ...state,
        isOpen: true,
        content: action.payload.content,
        title: action.payload.title,
        footerButtons: action.payload.footerButtons,
        onCloseCallback: action.payload.onCloseCallback,
      };
    case "CLOSE_MODAL":
      return {
        ...state,
        isOpen: false,
        content: null,
        title: '',
        footerButtons: null,
        onCloseCallback: undefined,
      };
    default:
      return state;
  }
};


// hook
export const useModal = () => useContext(ModalConext)

export const useModalDispatch = () => {
  const ctx = useContext(ModalDispatchConext)
  if (ctx === undefined) {
    throw new Error('useModalDispatch must be used within a ModalProvider')
  }
  return ctx
}
