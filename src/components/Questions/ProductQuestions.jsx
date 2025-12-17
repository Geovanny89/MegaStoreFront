import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function ProductQuestions({ productId }) {
  const [questions, setQuestions] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchQuestions = async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await api.get(`/products/${productId}/question`);
      setQuestions(res.data);
    } catch (error) {
      console.error("Error cargando preguntas", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    try {
      await api.post(`/products/${productId}/questions`, { question });
      setQuestion("");
      fetchQuestions();
    } catch (error) {
      console.error("Error enviando pregunta", error);
    }
  };

  useEffect(() => {
    if (!productId) return;
    fetchQuestions();
  }, [productId]);

  if (!productId) return null;
  if (loading) return <p>Cargando preguntas...</p>;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold mb-3">Preguntas</h3>

      {questions.length === 0 && (
        <p className="text-gray-500">No hay preguntas todavía.</p>
      )}

      <ul className="space-y-4">
        {questions.map((q) => (
          <li key={q._id} className="border rounded-lg p-3">
            <p className="font-medium">❓ {q.question}</p>

            {q.answer ? (
              <p className="mt-2 text-green-700">
                ✅ <b>Respuesta:</b> {q.answer}
              </p>
            ) : (
              <p className="mt-2 text-gray-400">⏳ Sin responder</p>
            )}
          </li>
        ))}
      </ul>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Escribe tu pregunta..."
          className="w-full border rounded-lg p-2"
        />
        <button
          type="submit"
          className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg"
        >
          Preguntar
        </button>
      </form>
    </div>
  );
}
