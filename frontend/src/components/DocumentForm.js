import React, { useState } from 'react';
import {getDocuments} from "../api/documents";

function DocumentForm({ onSuccess }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'report'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await getDocuments.create(formData);
            alert('Document created successfully!');
            if (onSuccess) onSuccess();
        } catch (error) {
            alert('Error creating document');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name = "title" onChange={handleChange} placeholder='Title'/>
            <textarea name = "description" onChange={handleChange} placeholder='Description'/>
            <select name = "category" onChange={handleChange}>
                <option value='report'>Report</option>
                <option value='notice'>Notice</option>
                <option value='circular'>Circular</option>
            </select>
            <button type='submit'>Create Document</button>
        </form>
    );
}

export default DocumentForm;