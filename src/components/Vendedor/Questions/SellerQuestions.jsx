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
      <h2 className="text-xl font-bold">Preguntas de tus productos</h2>

      {/* CONTADORES */}
      <div className="flex flex-wrap gap-3 text-sm">
        <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-medium">
          Total: {questions.length}
        </span>

        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
          Pendientes: {questions.filter((q) => !q.answer).length}
        </span>

        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
          Respondidas: {questions.filter((q) => q.answer).length}
        </span>
      </div>

      {/* LISTADO */}
      {questions.map((q) => (
        <div
          key={q._id}
          className={`border p-4 rounded-lg ${
            q.answer ? "bg-white" : "bg-yellow-50 border-yellow-300"
          }`}
        >
          <p className="font-medium">❓ {q.question}</p>
          <p className="text-sm text-gray-500">
            Producto: {q.productId.name}
          </p>

          {q.answer ? (
            <p className="mt-2 text-green-700">✅ {q.answer}</p>
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
                className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded"
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
