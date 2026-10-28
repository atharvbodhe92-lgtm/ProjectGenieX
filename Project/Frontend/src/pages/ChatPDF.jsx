import { useState } from "react";
import axios from "axios";

function ChatPDF() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [summary, setSummary] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleFileChange = (e) => {
    setPdfFiles(Array.from(e.target.files));
  };

  const handleProcessFiles = async () => {
    if (pdfFiles.length === 0) {
      alert("Please upload at least one PDF file!");
      return;
    }

    setProcessing(true);
    const formData = new FormData();
    pdfFiles.forEach((file) => formData.append("pdf_docs", file));

    try {
      const response = await axios.post("/api/v1/upload_pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60000 // 60 seconds for large files
      });
      
      // Show success message with details
      const message = response.data.message || "PDFs processed successfully!";
      alert(message);
      setSessionId(response.data.sessionId || "");
      setSummary(response.data.summary || "");
      
      // Clear previous response if any
      setResponse("");
      setSources([]);
    } catch (error) {
      console.error("Error processing PDFs:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to process PDFs. Try again!";
      alert(errorMessage);
    } finally {
      setProcessing(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      alert("Please enter a question!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/api/v1/ask_question", { question, sessionId });
      
      if (res.data.answer) {
        setResponse(res.data.answer);
        setSources(res.data.sources || []);
      } else {
        setResponse("No answer found.");
        setSources([]);
      }
    } catch (error) {
      console.error("Error fetching answer:", error);
      const errorMessage = error.response?.data?.answer || error.response?.data?.error || "Failed to get answer. Please make sure PDFs are uploaded first.";
      alert(errorMessage);
      setResponse("");
      setSources([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Analyze Research Paper 🧠📄</h2>

      <div className="mb-4">
        <input
          type="file"
          multiple
          accept="application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-[#4845D2] file:text-white
                     hover:file:bg-[#4745d2af]"
        />
      </div>

      <button
        onClick={handleProcessFiles}
        disabled={processing}
        className="bg-[#4845D2] text-white px-6 py-2 rounded-md hover:bg-[#4745d2af] mb-6"
      >
        {processing ? "Processing..." : "Submit & Process"}
      </button>

      {summary && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Paper Summary</h3>
          <p className="text-sm text-gray-700 whitespace-pre-line">{summary}</p>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          placeholder="Ask a question from the PDFs..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        onClick={handleAskQuestion}
        disabled={loading}
        className="bg-[#4845D2] text-white px-6 py-2 rounded-md hover:bg-[#4745d2af] mb-4"
      >
        {loading ? "Searching..." : "Ask"}
      </button>

      {response && (
        <div className="mt-6 p-4 bg-gray-100 border rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Reply:</h3>
          <p>{response}</p>
          {sources.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold text-sm mb-2">Sources used</h4>
              <ul className="list-disc ml-5 text-sm text-gray-600">
                {sources.map((source) => (
                  <li key={`${source.filename}-${source.chunkIndex}`}>
                    {source.label}: {source.filename}, chunk {source.chunkIndex}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatPDF;
