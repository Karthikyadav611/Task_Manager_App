import { useCallback, useEffect, useMemo, useState } from "react";
import { CirclePlus, LogOut, CheckCheck, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TaskColumn from "../components/TaskColumn";
import TaskModal from "../components/TaskModal";
import { useAuth } from "../context/AuthContext";
import { getApiErrorMessage, taskApi } from "../services/api";

const TASK_STAGES = ["Todo", "In Progress", "Done"];

/* ─── Stage accent config ─────────────────────────────────────── */
const STAGE_META = {
  Todo:        { accent: "#c97b3a", label: "To Do"      },
  "In Progress": { accent: "#7a6af5", label: "In Progress" },
  Done:        { accent: "#3a9e72", label: "Done"        },
};

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isToastError, setIsToastError] = useState(false);
  const [busyTaskId, setBusyTaskId]     = useState("");
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingTask, setEditingTask]   = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const groupedTasks = useMemo(
    () =>
      TASK_STAGES.reduce((acc, stage) => {
        acc[stage] = tasks.filter((t) => t.stage === stage);
        return acc;
      }, {}),
    [tasks]
  );

  /* ─── Toast auto-dismiss ──────────────────────────────────────── */
  useEffect(() => {
    if (!toastMessage) return undefined;
    const id = setTimeout(() => setToastMessage(""), 2800);
    return () => clearTimeout(id);
  }, [toastMessage]);

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setIsToastError(type === "error");
  };

  /* ─── Data fetching ───────────────────────────────────────────── */
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await taskApi.getAll();
      setTasks(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Unable to load tasks."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  /* ─── Task mutations ──────────────────────────────────────────── */
  const upsertTask = (updated) =>
    setTasks((prev) => {
      const i = prev.findIndex((t) => t._id === updated._id);
      if (i === -1) return [updated, ...prev];
      const next = [...prev];
      next[i] = updated;
      return next;
    });

  const removeTask = (id) => setTasks((prev) => prev.filter((t) => t._id !== id));

  /* ─── Modal helpers ───────────────────────────────────────────── */
  const openCreateModal = () => { setEditingTask(null);  setIsModalOpen(true); };
  const openEditModal   = (t) => { setEditingTask(t);    setIsModalOpen(true); };
  const closeModal      = ()  => {
    if (isSubmitting) return;
    setIsModalOpen(false);
    setEditingTask(null);
  };

  /* ─── CRUD handlers ───────────────────────────────────────────── */
  const handleSaveTask = async (payload) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        const { data } = await taskApi.update(editingTask._id, payload);
        upsertTask(data);
        showToast("Task updated.");
      } else {
        const { data } = await taskApi.create(payload);
        upsertTask(data);
        showToast("Task created.");
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (err) {
      showToast(getApiErrorMessage(err, "Unable to save task."), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    setBusyTaskId(task._id);
    try {
      await taskApi.remove(task._id);
      removeTask(task._id);
      showToast("Task deleted.");
    } catch (err) {
      showToast(getApiErrorMessage(err, "Unable to delete task."), "error");
    } finally {
      setBusyTaskId("");
    }
  };

  const handleStageChange = async (task, nextStage) => {
    if (task.stage === nextStage) return;
    setBusyTaskId(task._id);
    try {
      const { data } = await taskApi.update(task._id, { stage: nextStage });
      upsertTask(data);
      showToast(`Moved to ${nextStage}.`);
    } catch (err) {
      showToast(getApiErrorMessage(err, "Unable to update stage."), "error");
    } finally {
      setBusyTaskId("");
    }
  };

  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };

  /* ─── Derived stats ───────────────────────────────────────────── */
  const totalTasks = tasks.length;
  const doneTasks  = groupedTasks["Done"]?.length ?? 0;
  const pct        = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  /* ─────────────────────────────────────────────────────────────── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        /* ── Base ── */
        .db-root {
          min-height: 100vh;
          background: #faf8f4;
          color: #1a1916;
          font-family: 'DM Sans', sans-serif;
          font-weight: 400;
          position: relative;
          overflow-x: hidden;
        }

        /* ── Subtle ruled paper lines ── */
        .db-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: repeating-linear-gradient(
            transparent,
            transparent 31px,
            rgba(0,0,0,0.035) 31px,
            rgba(0,0,0,0.035) 32px
          );
          background-size: 100% 32px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Header ── */
        .db-header {
          position: relative;
          z-index: 10;
          background: #1a1916;
          color: #faf8f4;
          padding: 1.5rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .db-header-left { display: flex; flex-direction: column; gap: 0.25rem; }
        .db-header-wordmark {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }
        .db-wordmark-text {
          font-family: 'Lora', serif;
          font-size: 1.35rem;
          font-weight: 600;
          letter-spacing: -0.02em;
          color: #faf8f4;
        }
        .db-wordmark-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #c97b3a;
          margin-bottom: 3px;
        }
        .db-greeting {
          font-size: 0.8rem;
          font-weight: 300;
          color: rgba(250,248,244,0.45);
          letter-spacing: 0.01em;
        }
        .db-header-right {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        /* ── Buttons ── */
        .db-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: #c97b3a;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.825rem;
          font-weight: 500;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          letter-spacing: -0.01em;
          transition: background 0.18s, transform 0.12s;
        }
        .db-btn-primary:hover { background: #b56c2e; transform: translateY(-1px); }
        .db-btn-primary:active { transform: translateY(0); }

        .db-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          background: transparent;
          color: rgba(250,248,244,0.55);
          font-family: 'DM Sans', sans-serif;
          font-size: 0.825rem;
          font-weight: 400;
          padding: 0.6rem 1rem;
          border-radius: 8px;
          border: 1px solid rgba(250,248,244,0.12);
          cursor: pointer;
          letter-spacing: -0.01em;
          transition: border-color 0.18s, color 0.18s;
        }
        .db-btn-ghost:hover {
          border-color: rgba(250,248,244,0.3);
          color: #faf8f4;
        }

        /* ── Progress bar strip ── */
        .db-progress-strip {
          position: relative;
          z-index: 5;
          background: #242220;
          padding: 0.7rem 2.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        .db-progress-label {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: rgba(250,248,244,0.3);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .db-progress-track {
          flex: 1;
          height: 3px;
          background: rgba(250,248,244,0.08);
          border-radius: 100px;
          overflow: hidden;
        }
        .db-progress-fill {
          height: 100%;
          background: #c97b3a;
          border-radius: 100px;
          transition: width 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .db-progress-pct {
          font-size: 0.72rem;
          font-weight: 500;
          color: rgba(250,248,244,0.35);
          white-space: nowrap;
          flex-shrink: 0;
          font-variant-numeric: tabular-nums;
        }

        /* ── Main content ── */
        .db-content {
          position: relative;
          z-index: 1;
          padding: 2rem 2.5rem 3rem;
        }

        /* ── Board section label ── */
        .db-board-label {
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(26,25,22,0.3);
          margin-bottom: 1.25rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .db-board-label::after {
          content: '';
          flex: 1;
          height: 1px;
          background: rgba(26,25,22,0.08);
        }

        /* ── Board grid ── */
        .db-board {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.25rem;
          align-items: start;
        }
        @media (max-width: 820px) {
          .db-board { grid-template-columns: 1fr; }
          .db-header { padding: 1.25rem 1.5rem; }
          .db-progress-strip { padding: 0.7rem 1.5rem; }
          .db-content { padding: 1.5rem 1.5rem 3rem; }
        }

        /* ── Column wrapper (wraps TaskColumn with accent) ── */
        .db-col-wrap {
          display: flex;
          flex-direction: column;
          gap: 0;
          animation: db-slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .db-col-wrap:nth-child(1) { animation-delay: 0.05s; }
        .db-col-wrap:nth-child(2) { animation-delay: 0.12s; }
        .db-col-wrap:nth-child(3) { animation-delay: 0.19s; }

        .db-col-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.7rem 1rem 0.65rem;
          border-radius: 10px 10px 0 0;
          border: 1px solid rgba(26,25,22,0.08);
          border-bottom: none;
          background: #fff;
        }
        .db-col-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .db-col-accent-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .db-col-title {
          font-family: 'Lora', serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: #1a1916;
        }
        .db-col-count {
          font-size: 0.7rem;
          font-weight: 500;
          padding: 0.15rem 0.5rem;
          border-radius: 100px;
          background: rgba(26,25,22,0.06);
          color: rgba(26,25,22,0.45);
          font-variant-numeric: tabular-nums;
        }
        /* The TaskColumn component renders inside .db-col-body */
        .db-col-body {
          border: 1px solid rgba(26,25,22,0.08);
          border-top: none;
          border-radius: 0 0 10px 10px;
          background: rgba(26,25,22,0.02);
          overflow: hidden;
        }

        /* ── Loading state ── */
        .db-loader {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 4rem 2rem;
          font-size: 0.875rem;
          color: rgba(26,25,22,0.4);
          font-weight: 300;
        }
        .db-loader svg { animation: db-spin 1s linear infinite; }

        /* ── Empty state ── */
        .db-empty {
          grid-column: 1 / -1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          padding: 5rem 2rem;
          text-align: center;
          animation: db-slide-up 0.5s cubic-bezier(0.16,1,0.3,1) both;
        }
        .db-empty-icon {
          width: 52px; height: 52px;
          border-radius: 14px;
          background: rgba(201,123,58,0.1);
          border: 1px solid rgba(201,123,58,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #c97b3a;
        }
        .db-empty-title {
          font-family: 'Lora', serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: #1a1916;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .db-empty-sub {
          font-size: 0.875rem;
          color: rgba(26,25,22,0.45);
          font-weight: 300;
          max-width: 320px;
          line-height: 1.6;
          margin: 0;
        }

        /* ── Error banner ── */
        .db-error {
          margin: 0 2.5rem 1rem;
          padding: 0.75rem 1rem;
          background: #fef2f2;
          border: 1px solid rgba(220,38,38,0.18);
          border-left: 3px solid #dc2626;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #991b1b;
        }

        /* ── Toast ── */
        .db-toast {
          position: fixed;
          bottom: 2rem;
          left: 50%;
          transform: translateX(-50%) translateY(0);
          z-index: 999;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #1a1916;
          color: #faf8f4;
          font-size: 0.825rem;
          font-weight: 400;
          padding: 0.7rem 1.25rem;
          border-radius: 100px;
          border: 1px solid rgba(250,248,244,0.1);
          box-shadow: 0 8px 32px rgba(0,0,0,0.28);
          white-space: nowrap;
          animation: db-toast-in 0.3s cubic-bezier(0.16,1,0.3,1) both;
        }
        .db-toast.error {
          background: #7f1d1d;
          border-color: rgba(255,255,255,0.1);
        }
        .db-toast-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #3a9e72;
          flex-shrink: 0;
        }
        .db-toast.error .db-toast-dot { background: #f87171; }

        /* ── Animations ── */
        @keyframes db-slide-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes db-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes db-toast-in {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <div className="db-root">

        {/* ── HEADER ─────────────────────────────────────────────── */}
        <header className="db-header">
          <div className="db-header-left">
            <div className="db-header-wordmark">
              <span className="db-wordmark-text">TaskBoard</span>
              <div className="db-wordmark-dot" aria-hidden="true" />
            </div>
            <span className="db-greeting">
              {user?.name ? `Welcome back, ${user.name}` : "Welcome back"}
            </span>
          </div>

          <div className="db-header-right">
            <button type="button" className="db-btn-primary" onClick={openCreateModal}>
              <CirclePlus size={15} strokeWidth={2} />
              New Task
            </button>
            <button type="button" className="db-btn-ghost" onClick={handleLogout}>
              <LogOut size={14} strokeWidth={1.75} />
              Sign out
            </button>
          </div>
        </header>

        {/* ── PROGRESS STRIP ─────────────────────────────────────── */}
        <div className="db-progress-strip">
          <span className="db-progress-label">Progress</span>
          <div className="db-progress-track">
            <div className="db-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="db-progress-pct">{doneTasks}/{totalTasks} done</span>
        </div>

        {/* ── ERROR BANNER ───────────────────────────────────────── */}
        {error && <p className="db-error">{error}</p>}

        {/* ── BOARD ──────────────────────────────────────────────── */}
        <div className="db-content">
          {loading ? (
            <div className="db-loader">
              <Loader2 size={16} />
              Loading your tasks…
            </div>
          ) : tasks.length === 0 ? (
            <div className="db-board">
              <div className="db-empty">
                <div className="db-empty-icon" aria-hidden="true">
                  <CheckCheck size={22} strokeWidth={1.75} />
                </div>
                <h2 className="db-empty-title">No tasks yet</h2>
                <p className="db-empty-sub">
                  Create your first task and start moving work across the board.
                </p>
                <button type="button" className="db-btn-primary" onClick={openCreateModal}>
                  <CirclePlus size={15} strokeWidth={2} />
                  Create First Task
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="db-board-label">Board</p>
              <div className="db-board">
                {TASK_STAGES.map((stage) => {
                  const meta = STAGE_META[stage];
                  return (
                    <div key={stage} className="db-col-wrap">
                      <div className="db-col-header">
                        <div className="db-col-title-row">
                          <div
                            className="db-col-accent-dot"
                            style={{ background: meta.accent }}
                            aria-hidden="true"
                          />
                          <span className="db-col-title">{meta.label}</span>
                        </div>
                        <span className="db-col-count">
                          {groupedTasks[stage]?.length ?? 0}
                        </span>
                      </div>
                      <div className="db-col-body">
                        <TaskColumn
                          stage={stage}
                          tasks={groupedTasks[stage] || []}
                          onEdit={openEditModal}
                          onDelete={handleDeleteTask}
                          onStageChange={handleStageChange}
                          busyTaskId={busyTaskId}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ── TOAST ──────────────────────────────────────────────── */}
        {toastMessage && (
          <div className={`db-toast${isToastError ? " error" : ""}`} role="status" aria-live="polite">
            <div className="db-toast-dot" aria-hidden="true" />
            {toastMessage}
          </div>
        )}

        {/* ── MODAL ──────────────────────────────────────────────── */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSubmit={handleSaveTask}
          initialTask={editingTask}
          isSubmitting={isSubmitting}
        />
      </div>
    </>
  );
};

export default DashboardPage;