import React, { useState } from "react";
import { Button, CircularProgress, Box, Typography } from "@mui/material";
import axios from "axios";

export const FileUpload: React.FC<{
  onUploadSuccess: (url: string) => void;
}> = ({ onUploadSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE}/v1/file-upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      onUploadSuccess(res.data.url);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Button variant="outlined" component="label" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Choose File"}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </Button>
      {fileName && <Typography mt={1}>Selected: {fileName}</Typography>}
    </Box>
  );
};
