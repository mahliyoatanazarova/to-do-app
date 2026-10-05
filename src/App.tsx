import { useEffect, useState, useMemo, type FormEvent } from "react";

type Todo = {
  id: number;
  text: string;
  done: boolean;
};

type Filter = "all" | "active" | "done";

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem("todos");

    return raw
      ? (JSON.parse(raw) as Todo[])
      : [
          { id: 1, text: "learn to code", done: false },
          { id: 2, text: "coding", done: false },
        ];
  } catch {
    return [];
  }
}

// {id:1, text:"learn to code",done:false}, {id:2, text:"coding",done:false}

function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const visible = useMemo(() => {
    if (filter === "active") return todos.filter((t) => !t.done);
    if (filter === "done") return todos.filter((t) => t.done);
    return todos;
  }, [todos, filter]);

  const addTodo = (e: FormEvent) => {
    e.preventDefault();

    const value = text.trim();

    if (!value) return;

    setTodos((prev) => [
      {
        id: Date.now(),
        text: value,
        done: false,
      },
      ...prev,
    ]);

    setText("");
  };

  const deleteTodo = (id: number) => {
    setTodos(() => todos.filter((t) => t.id !== id));
  };

  // =========================
  // TODO BAJARILGANINI O'ZGARTIRISH
  // =========================

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, done: !todo.done }
          : todo
      )
    );
  };

  // =========================
  // EDIT BOSHLASH
  // =========================

  const startEdit = (item: Todo) => {
    setEditId(item.id);
    setEditText(item.text);
  };

  // =========================
  // EDIT SAQLASH
  // =========================

  const saveEdit = () => {
    const value = editText.trim();

    if (!value) return;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === editId
          ? { ...todo, text: value }
          : todo
      )
    );

    setEditId(null);
    setEditText("");
  };

  // =========================
  // EDIT BEKOR QILISH
  // =========================

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  // =========================
  // BAJARILGANLARNING HAMMASINI O'CHIRISH
  // =========================

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.done));
  };

  // =========================
  // ENTER / ESCAPE
  // =========================

  const handleEditKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      saveEdit();
    }

    if (e.key === "Escape") {
      cancelEdit();
    }
  };

  return (
  <div className="min-h-screen bg-gray-100 py-10">
    <div className="box mx-auto w-[660px] rounded-xl bg-white p-8 shadow-md">

      <h1 className="mb-5 text-3xl font-medium text-gray-900">
        ToDo App
      </h1>

      {/* FORM */}
      <form
        className="mb-5 flex items-center"
        onSubmit={addTodo}
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Qo'shiladigan vazifa..."
          autoFocus
          className="
            w-52
            rounded-xl
            border border-gray-200
            px-4 py-3
            text-gray-800
            shadow-sm
            outline-none
            transition
            focus:border-indigo-400
            focus:ring-2
            focus:ring-indigo-100
          "
        />

        <button
          type="submit"
          className="
            ml-3
            rounded-xl
            bg-indigo-500
            px-6 py-3
            font-medium
            text-white
            transition
            hover:bg-indigo-600
            active:scale-95
          "
        >
          Qo'shish
        </button>
      </form>

      {/* FILTER */}
      <div className="mb-5 flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`
            rounded-xl px-5 py-2
            transition
            ${
              filter === "all"
                ? "bg-indigo-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }
          `}
        >
          all
        </button>

        <button
          onClick={() => setFilter("active")}
          className={`
            rounded-xl px-5 py-2
            transition
            ${
              filter === "active"
                ? "bg-indigo-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }
          `}
        >
          active
        </button>

        <button
          onClick={() => setFilter("done")}
          className={`
            rounded-xl px-5 py-2
            transition
            ${
              filter === "done"
                ? "bg-indigo-500 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }
          `}
        >
          done
        </button>
      </div>

      {/* TODO LIST */}
      <ul className="space-y-3">

        {visible.length === 0 && (
          <li className="py-5 text-center text-gray-400">
            <p>Hech qanday vazifa yo'q...</p>
          </li>
        )}

        {visible.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between"
          >

            <div className="flex items-center">

              {/* CHECKBOX */}
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => toggleTodo(item.id)}
                className="mr-3 h-4 w-4 cursor-pointer accent-indigo-500"
              />

              {/* EDIT */}
              {editId === item.id ? (
                <input
                  type="text"
                  value={editText}
                  autoFocus
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleEditKeyDown}
                  onBlur={saveEdit}
                  className="
                    rounded-md
                    border border-indigo-400
                    px-2 py-1
                    outline-none
                  "
                />
              ) : (
                <span
                  onDoubleClick={() => {
                    setEditId(item.id);
                    setEditText(item.text);
                  }}
                  className={`
                    cursor-pointer
                    text-lg
                    ${
                      item.done
                        ? "text-gray-400 line-through"
                        : "text-gray-900"
                    }
                  `}
                >
                  {item.text}
                </span>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex items-center">

              <button
                onClick={() => startEdit(item)}
                className="
                  text-xl
                  transition
                  hover:scale-110
                "
                title="Tahrirlash"
              >
                🖋️
              </button>

              <button
                onClick={() => deleteTodo(item.id)}
                className="
                  ml-4
                  text-xl
                  transition
                  hover:scale-110
                "
                title="O'chirish"
              >
                🗑️
              </button>

            </div>
          </li>
        ))}

      </ul>

      {/* BAJARILGANLARNI O'CHIRISH */}
      {todos.some((todo) => todo.done) && (
        <div className="mt-6 border-t border-gray-100 pt-4">
          <button
            onClick={clearCompleted}
            className="
              text-sm
              text-gray-500
              transition
              hover:text-red-500
            "
          >
            🗑️ Bajarilganlarni tozalash
          </button>
        </div>
      )}

    </div>
  </div>
);
}

export default App;