import { useEffect, useState } from "react";
import api from "../../../api/axios";

export default function SellerQuestions() {
  const [questions, setQuestions] = useState([]);
  const [answer, setAnswer] = useState({});

  const fetchQuestions = async () => {
    const res = await api.get("/seller/questions");
    setQuestions(res.data);
  };
console.log("QUESTIONS STATE:", questions);
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
      <h2 className="text-xl font-bold">Preguntas de tus productos</h2>

      {questions.map((q) => (
        <div key={q._id} className="border p-4 rounded-lg">
          <p className="font-medium">❓ {q.question}</p>
          <p className="text-sm text-gray-500">
            Producto: {q.productId.name}
          </p>

          {q.answer ? (
            <p className="mt-2 text-green-700">
              ✅ {q.answer}
            </p>
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
