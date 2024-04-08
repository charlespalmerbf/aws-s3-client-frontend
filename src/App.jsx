import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; 
import { Button } from "react-bootstrap"; 

const App = () => {
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_AWS_API_BASE}/develop/files`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "x-api-key": import.meta.env.VITE_AWS_API_KEY,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch files");
                }

                const data = await response.json();
                setFiles(data);
            } catch (error) {
                console.error("Error fetching files: ", error);
            }
        };

        fetchData();
    }, []);

    const handleFileUpload = (event) => {
        setSelectedFiles([...selectedFiles, ...event.target.files]);
    };

    const handleDownload = (fileUrl) => {
        // Simulate file download
        window.open(fileUrl, "_blank");
    };

    const handleUpload = () => {
        // Handle file upload to the server
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("files[]", file);
        });

        fetch("https://api.example.com/upload", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to upload files");
                }
                console.log("Files uploaded successfully");
                setSelectedFiles([]);
                // You can update the file list here if needed
            })
            .catch((error) => {
                console.error("Error uploading files: ", error);
            });
    };

    const handleDelete = (index) => {
        const updatedFiles = [...files];
        updatedFiles.splice(index, 1);
        setFiles(updatedFiles);
    };

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col">
                    <h2>File List</h2>
                    <ul className="list-group">
                        {files.map((file, index) => (
                            <li
                                key={index}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                {file.Key}
                                <div>
                                    <Button
                                        variant="primary"
                                        onClick={() => handleDownload(file.url)}
                                    >
                                        Download
                                    </Button>{" "}
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDelete(index)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col">
                    <h2>Upload Files</h2>
                    <input
                        type="file"
                        className="form-control mb-3"
                        multiple
                        onChange={handleFileUpload}
                    />
                    <Button variant="success" onClick={handleUpload}>
                        Upload
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default App;
