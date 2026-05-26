import { Clock3, Pencil, Trash2 } from "lucide-react";

const formatDate = (dateValue) =>
  new Date(dateValue).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

const TaskCard = ({ task, onEdit, onDelete, onStageChange, busyTaskId }) => {
  const isBusy = busyTaskId === task._id;

  return (
    <article className="task-card">
      <div className="task-card-top">
        <h4>{task.title}</h4>
        <span className={`badge badge-${task.stage.replace(" ", "-").toLowerCase()}`}>
          {task.stage}
        </span>
      </div>

      <p className="task-description">{task.description || "No description provided."}</p>

      <div className="task-meta">
        <span>
          <Clock3 size={14} />
          Created: {formatDate(task.createdAt)}
        </span>
        <span>Updated: {formatDate(task.updatedAt)}</span>
      </div>

      <div className="task-actions">
        <label className="stage-label">
          Stage
          <select
            value={task.stage}
            onChange={(event) => onStageChange(task, event.target.value)}
            disabled={isBusy}
          >
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </label>

        <div className="task-tools">
          <button type="button" className="icon-text-button" onClick={() => onEdit(task)} disabled={isBusy}>
            <Pencil size={14} />
            Edit
          </button>
          <button
            type="button"
            className="icon-text-button danger"
            onClick={() => onDelete(task)}
            disabled={isBusy}
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;
