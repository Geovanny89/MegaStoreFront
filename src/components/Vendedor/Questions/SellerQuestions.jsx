import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function SellerQuestions() {
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState({});

  const fetchQuestions = async () => {
    const res = await api.get("/seller/questions");
    setQuestions(res.data);
  };

  const handleAnswer = async (questionId) => {
    if (!answer[questionId]?.trim()) return;

    await api.put(`/questions/${questionId}/answer`, {
      answer: answer[questionId]
    });

    setAnswer({ ...answer, [questionId]: "" });
    fetchQuestions();
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div className="space-y-4">
      {/* TÍTULO */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Preguntas de tus productos</h2>

      {/* CONTADORES */}
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-700 dark:text-gray-200 font-medium">
          Total: {questions.length}
        </span>

        <span className="px-3 py-1 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 font-medium">
          Pendientes: {questions.filter((q) => !q.answer).length}
        </span>

        <span className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-medium">
          Respondidas: {questions.filter((q) => q.answer).length}
        </span>
      </div>

      {/* LISTADO */}
      {questions.map((q) => (
        <div
          key={q._id}
           className={`border rounded-lg p-4 ${
        q.answer
          ? "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600"
          : "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700"
      }`}
        >
          <p className="font-medium text-gray-900 dark:text-gray-100">❓ {q.question}</p>
      <p className="text-sm text-gray-500 dark:text-gray-300">
            Producto: {q.productId.name}
          </p>

          {q.answer ? (
            <p className="mt-2 text-green-700 dark:text-green-300">✅ {q.answer}</p>
          ) : (
            <>
              <textarea
                className="w-full border rounded p-2 mt-2"
                placeholder="Responder..."
                value={answer[q._id] || ""}
                onChange={(e) =>
                  setAnswer({ ...answer, [q._id]: e.target.value })
                }
              />
              <button
                onClick={() => handleAnswer(q._id)}
                className="mt-2 bg-indigo-600 dark:bg-indigo-700 hover:bg-indigo-700 dark:hover:bg-indigo-800 text-white px-3 py-1 rounded transition-all"
              >
                Responder
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
