import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Spinner, Row, Col, Card } from "react-bootstrap";

const App = () => {
    const [files, setFiles] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = (event) => {
        setSelectedFiles([...selectedFiles, ...event.target.files]);
    };

    const handleDownload = (fileUrl) => {
        window.open(fileUrl, "_blank");
    };

    const handleUpload = () => {
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
        <div className="container-fluid mt-5">
            <Row>
                <Col md={6}>
                    <Card className="h-100 d-flex flex-column">
                        <Card.Body>
                            <h2 className="mb-3">File List</h2>
                            {loading ? (
                                <div className="d-flex justify-content-center align-items-center">
                                    <Spinner animation="border" role="status" />
                                </div>
                            ) : (
                                <>
                                    <ul className="list-group mb-3">
                                        {files?.length ? (
                                            <>
                                                {files.map((file, index) => (
                                                    <li
                                                        key={index}
                                                        className="list-group-item d-flex justify-content-between align-items-center"
                                                    >
                                                        {file.Key}
                                                        <div>
                                                            <Button
                                                                variant="primary"
                                                                onClick={() =>
                                                                    handleDownload(
                                                                        file.url
                                                                    )
                                                                }
                                                            >
                                                                Download
                                                            </Button>{" "}
                                                            <Button
                                                                variant="danger"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        index
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </>
                                        ) : (
                                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                                No items uploaded.
                                            </li>
                                        )}
                                    </ul>
                                  
                                </>
                            )}
                              <Button
                                        variant="success"
                                        onClick={fetchFiles}
                                        disabled={loading}
                                    >
                                        Refresh
                                    </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="h-100 d-flex flex-column">
                        <Card.Body>
                            <h2 className="mb-3">Upload Files</h2>
                            <input
                                type="file"
                                className="form-control mb-3"
                                multiple
                                onChange={handleFileUpload}
                            />
                            <Button
                                variant="success"
                                onClick={handleUpload}
                                disabled={!selectedFiles.length}
                            >
                                Upload
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default App;
