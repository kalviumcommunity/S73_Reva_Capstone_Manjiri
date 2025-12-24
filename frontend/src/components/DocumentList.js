import React, { useState, useEffect } from "react";
import { getDocuments } from "../api/documents";

function DocumentList() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            const response = await getDocuments();
            setDocs(response);
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading documents...</p>;

    return (
        <div className="document-list">
            <h2>Documents</h2>
            {docs.map(doc => (
                <div key={doc.id} className="document-card">
                    <h3>{doc.title}</h3>
                    <p>{doc.description}</p>
                    <span className="category">{doc.category}</span>
                </div>
            ))}
        </div>
    );
}

export default DocumentList;