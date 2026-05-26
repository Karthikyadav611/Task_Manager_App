import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

const defaultFormState = {
  title: "",
  description: "",
  stage: "Todo",
};

const TaskModal = ({ isOpen, onClose, onSubmit, initialTask, isSubmitting }) => {
  const [formData, setFormData] = useState(defaultFormState);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (initialTask) {
      setFormData({
        title: initialTask.title || "",
        description: initialTask.description || "",
        stage: initialTask.stage || "Todo",
      });
    } else {
      setFormData(defaultFormState);
    }
    setError("");
  }, [isOpen, initialTask]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!formData.title.trim()) {
      setError("Task title is required.");
      return;
    }
    setError("");
    await onSubmit({
      title: formData.title.trim(),
      description: formData.description.trim(),
      stage: formData.stage,
    });
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal-card" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initialTask ? "Update Task" : "Create Task"}</h3>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">
            <X size={16} />
          </button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <label>
            Title
            <input
              name="title"
              placeholder="Enter task title"
              value={formData.title}
              onChange={handleChange}
              maxLength={100}
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              placeholder="Add short details"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              maxLength={400}
            />
          </label>

          <label>
            Stage
            <select name="stage" value={formData.stage} onChange={handleChange}>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </label>

          {error ? <p className="inline-error">{error}</p> : null}

          <button type="submit" className="primary-button" disabled={isSubmitting}>
            <Save size={16} />
            {isSubmitting ? "Saving..." : "Save Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
