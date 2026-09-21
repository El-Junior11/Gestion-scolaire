import Modal from "./Modal";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, danger }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <p className="text-sm text-ink/80">{message}</p>
      <div className="mt-5 flex justify-end gap-3">
        <button className="btn-secondary" onClick={onCancel}>
          Annuler
        </button>
        <button
          className={danger ? "btn-primary bg-brick hover:bg-brick-light" : "btn-primary"}
          onClick={onConfirm}
        >
          Confirmer
        </button>
      </div>
    </Modal>
  );
}
