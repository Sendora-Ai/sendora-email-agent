import { useState } from "react";
import { Upload, X, FileText, CheckCircle2, Library } from "lucide-react";
import { apiClient } from "../../api/client";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";

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
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-violet-600 dark:bg-violet-400/15 dark:text-violet-200">
          <Library className="h-4 w-4" />
        </div>
        
        <div className="flex-1">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Knowledge Base
          </h2>
          <p className="mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 dark:text-slate-400">
            Upload PDF documents (like FAQs or Policies) to teach the AI facts about your business. The AI will use this to write accurate replies.
          </p>

          <div className="mt-6">
            {!file ? (
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50/50 px-6 py-10 transition-colors hover:bg-slate-100/50 dark:border-slate-700 dark:bg-slate-800/30 dark:hover:bg-slate-800/50">
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
              <div className="flex items-center justify-between rounded-lg border border-sky-100 bg-sky-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
                <div className="flex items-center space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
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
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
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
            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="min-w-[120px]"
            >
              {loading ? "Processing..." : "Upload & Learn"}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
