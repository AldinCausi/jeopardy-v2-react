

export default function TileForm({
  formData,
  onFormChange,
  onFormReset,
  onSaveForm,
  onCancel
}) {
  return (
    <div className="form">
      <div className="inputs">
        <input
          placeholder="Punkte"
          className="points-input"
          value={formData.points}
          onChange={(e) => onFormChange("points", e.target.value)}
        />
        <input
          placeholder="Frage"
          className="question-input"
          value={formData.question}
          onChange={(e) => onFormChange("question", e.target.value)}
        />
        <input
          placeholder="Antwort"
          className="answer-input"
          value={formData.answer}
          onChange={(e) => onFormChange("answer", e.target.value)}
        />
        <select
          className="type-selector"
          value={formData.type}
          onChange={(e) => onFormChange("type", e.target.value)}
        >
          <option value="text">Textfrage</option>
          <option value="image">Bildfrage</option>
        </select>

        {formData.type === "image" && (
          <input
            placeholder="Bild-URL"
            value={formData.imageUrl}
            onChange={(e) => onFormChange("imageUrl", e.target.value)}
          />
        )}
      </div>
      <div className="buttons">
        <button className="save-form-btn" onClick={onSaveForm}>
          Speichern
        </button>
        <button className="clear-btn" onClick={onFormReset}>
          Eingabe leeren
        </button>
        <button className="cancel-btn" onClick={onCancel}>
          Abbrechen
        </button>
      </div>
    </div>
  );
}
