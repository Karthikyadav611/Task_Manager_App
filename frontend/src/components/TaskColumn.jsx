import TaskCard from "./TaskCard";

const TaskColumn = ({ stage, tasks, onEdit, onDelete, onStageChange, busyTaskId }) => {
  return (
    <section className="task-column">
      <header>
        <h3>{stage}</h3>
        <span>{tasks.length}</span>
      </header>

      {tasks.length === 0 ? (
        <p className="empty-column">No tasks in this stage.</p>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStageChange={onStageChange}
              busyTaskId={busyTaskId}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default TaskColumn;
