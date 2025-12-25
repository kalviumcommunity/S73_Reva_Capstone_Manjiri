import React, { useState, useEffect } from "react";
import { getDocuments, updateDocument, deleteDocument } from "../api/documents";
import "./DocumentList.css";

function DocumentList() {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        updatedBy: ""
    });

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

    const handleEditClick = (doc) => {
        setEditingId(doc._id);
        setFormData({
            title: doc.title,
            description: doc.description,
            updatedBy: ""
        });
    };

    const handleUpdate = async (id) => {
        try {
            await updateDocument(id, formData);
            alert("Document updated successfully!");
            setEditingId(null);
            fetchDocuments();
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this document?"
        );
        if (!confirmDelete) return;

        try {
            await deleteDocument(id);
            alert("Document deleted");
            fetchDocuments();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    if (loading) return <p>Loading documents...</p>;

    return (
        <div className="document-list">
            <h2>Documents</h2>

            {docs.map((doc) => (
                <div key={doc._id} className="document-card">
                    {editingId === doc._id ? (
                        <>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                placeholder="Title"
                            />
                            <textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder="Description"
                            />
                            <input
                                type="text"
                                placeholder="Your username"
                                value={formData.updatedBy}
                                onChange={(e) =>
                                    setFormData({ ...formData, updatedBy: e.target.value })
                                }
                            />

                            <div className="btn-group">
                                <button onClick={() => handleUpdate(doc._id)}>Save</button>
                                <button
                                    className="cancel"
                                    onClick={() => setEditingId(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <h3>{doc.title}</h3>
                            <p>{doc.description}</p>
                            <span className="category">{doc.category}</span>

                            <div className="btn-group">
                                <button onClick={() => handleEditClick(doc)}>Edit</button>
                                <button
                                    className="delete"
                                    onClick={() => handleDelete(doc._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

export default DocumentList;
