import React, { useState } from "react";
import axios from "axios";
import "./Plan.css"

const PlanVisualizer = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Veuillez sélectionner un fichier Excel !");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/plan/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setData(response.data);
    } catch (error) {
      console.error("Erreur d'upload :", error);
      alert("Erreur lors de l'upload du fichier.");
    }
  };

  return (
    <div>
      <h1>Visualisation du Plan d'Audit</h1>
      <input type="file" accept=".xlsx" onChange={handleFileChange} />
      <button onClick={handleUpload}>Uploader</button>

      {data && (
        <div>
          <h2>Plan d'Audit</h2>
          <table border="1">
            <thead>
              <tr>
                {data.columns.map((col, index) => <th key={index}>{col}</th>)}
              </tr>
            </thead>
            <tbody>
              {data.data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {data.columns.map((col, colIndex) => (
                    <td key={colIndex}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PlanVisualizer;
