import axios from "axios";

const BASE_URL = "http://localhost:3000/api/documents";

// Get all documents
export const getDocuments = async () => {
  const res = await axios.get(BASE_URL);
  return res.data;
};

// Create a document
export const createDocument = async (documentData) => {
  const res = await axios.post(BASE_URL, documentData);
  return res.data;
};
