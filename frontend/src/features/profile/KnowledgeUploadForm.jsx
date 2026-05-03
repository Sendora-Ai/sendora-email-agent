import { useState } from "react";
import { Upload, X, FileText, CheckCircle2 } from "lucide-react";
import { apiClient } from "../../api/client";

export const KnowledgeUploadForm = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setError(null);
    setSuccess(null);
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      setFile(null);
      setError("Please select a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append("document", file);

    try {
      const response = await apiClient.post("/knowledge/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setSuccess(`Successfully uploaded and indexed ${response.data.chunksAdded} knowledge chunks!`);
      setFile(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload document.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
        Knowledge Base (PDF Upload)
      </h2>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Upload PDF documents (like FAQs or Policies) to teach the AI facts about your business. The AI will use this to write accurate replies.
      </p>

      <div className="mt-6">
        {!file ? (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800">
            <Upload className="mb-2 h-8 w-8 text-slate-400" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Click to select a PDF
            </span>
            <span className="mt-1 text-xs text-slate-500">Maximum file size: 5MB</span>
            <input
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </label>
        ) : (
          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-50">
                  {file.name}
                </p>
                <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={() => setFile(null)}
              className="p-2 text-slate-400 hover:text-red-500"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 flex items-center rounded-md bg-green-50 p-3 text-sm text-green-600 dark:bg-green-900/20 dark:text-green-400">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {success}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Processing & Embedding..." : "Upload & Learn"}
        </button>
      </div>
    </div>
  );
};
