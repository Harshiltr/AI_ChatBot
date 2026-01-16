import { useState } from "react";

function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const uploadFile = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Uploading...");

    const res = await fetch("http://127.0.0.1:8000/chat/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (res.ok) {
      setStatus("Document uploaded successfully");
    } else {
      setStatus("Upload failed");
    }
  };

  return (
    <div className="p-3 border rounded-lg bg-white shadow mb-4">
      <h3 className="font-semibold mb-2">Upload Document</h3>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={uploadFile}
        className="ml-2 bg-black text-white px-3 py-1 rounded"
      >
        Upload
      </button>

      {status && <p className="text-sm mt-2">{status}</p>}
    </div>
  );
}

export default DocumentUpload;
