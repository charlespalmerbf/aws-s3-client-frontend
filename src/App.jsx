import React, { useState, useEffect } from "react";

require("dotenv").config(); // Load environment variables from .env file

const App = () => {
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);

    useEffect(() => {
        // Fetch files from API
        fetch(
            "https://m0qs03328c.execute-api.eu-west-2.amazonaws.com/develop/files",
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.AWS_API_KEY, // Use the API key from the environment variable
                },
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch files");
                }
                return response.json();
            })
            .then((data) => {
                setFiles(data);
            })
            .catch((error) => {
                console.error("Error fetching files: ", error);
            });
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

    return (
        <div>
            <h2>File List</h2>
            <ul>
                {files.map((file) => (
                    <li key={file.id}>
                        {file.name}{" "}
                        <button onClick={() => handleDownload(file.url)}>
                            Download
                        </button>
                    </li>
                ))}
            </ul>
            <h2>Upload Files</h2>
            <input type="file" multiple onChange={handleFileUpload} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
};

export default App;
