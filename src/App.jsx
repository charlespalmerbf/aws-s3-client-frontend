import React, { useState, useEffect } from "react";

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

    return (
        <div>
            <h2>File List</h2>
            <ul>
                {files.map((file) => (
                    <li>
                        {file.Key}{" "}
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
