import React from 'react'

interface ModalProps {
    show: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
}

const Modal = ({ show, onClose, children, title }: ModalProps) => {

    if (!show) {
        return null
    }
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close-modal" onClick={onClose}>X</span>
                <div className="modal-header">
                    <h2>{title}</h2>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    )
}

export default Modal