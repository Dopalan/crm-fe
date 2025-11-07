import React, { useState } from "react";
import type { Note } from '../../types/note';
import "../../styles/CustomerNoteForm.css";

interface NoteInput {
  id: string;
  content: string;
}

interface CustomerNoteFormProps {
  customerId: number;
  customerName: string;
  onSubmit: (notes: Omit<Note, "id" | "createdAt">[]) => void;
  onCancel: () => void;
}

const CustomerNoteForm: React.FC<CustomerNoteFormProps> = ({
  customerId,
  customerName,
  onSubmit,
  onCancel,
}) => {
  const [notes, setNotes] = useState<NoteInput[]>([
    { id: Date.now().toString(), content: "" },
  ]);

  const handleAddNote = () => {
    setNotes([...notes, { id: Date.now().toString(), content: "" }]);
  };

  const handleRemoveNote = (id: string) => {
    if (notes.length > 1) {
      setNotes(notes.filter((note) => note.id !== id));
    }
  };

  const handleNoteChange = (id: string, content: string) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, content } : note))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Lọc ra các notes có content
    const validNotes = notes
      .filter((note) => note.content.trim())
      .map((note) => ({
        content: note.content,
        authorName: "Current User",
        customerId: customerId,
        updatedAt: new Date().toISOString(), 
      }));

    if (validNotes.length === 0) {
      alert("Vui lòng nhập ít nhất một ghi chú");
      return;
    }

    onSubmit(validNotes);
  };

  return (
    <div className="note-form-overlay">
      <div className="note-form-modal">
        <div className="note-form-header">
          <h2>Thêm ghi chú cho {customerName}</h2>
          <button className="note-close-button" onClick={onCancel}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="note-form">
          <div className="note-form-fields">
            {notes.map((note, index) => (
              <div key={note.id} className="note-form-group">
                <div className="note-header-row">
                  <label htmlFor={`note-${note.id}`}>
                    Ghi chú {index + 1}
                  </label>
                  {notes.length > 1 && (
                    <button
                      type="button"
                      className="note-remove-button"
                      onClick={() => handleRemoveNote(note.id)}
                      title="Xóa ghi chú này"
                    >
                      ×
                    </button>
                  )}
                </div>
                <textarea
                  id={`note-${note.id}`}
                  value={note.content}
                  onChange={(e) => handleNoteChange(note.id, e.target.value)}
                  placeholder="Nhập nội dung ghi chú..."
                  rows={4}
                  className="note-textarea"
                />
              </div>
            ))}

            <button
              type="button"
              className="note-add-button"
              onClick={handleAddNote}
            >
              <span className="note-add-icon">+</span>
              Thêm ghi chú mới
            </button>
          </div>

          <div className="note-form-actions">
            <button
              type="button"
              onClick={onCancel}
              className="note-cancel-button"
            >
              Hủy
            </button>
            <button type="submit" className="note-submit-button">
              Lưu ghi chú
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerNoteForm;
