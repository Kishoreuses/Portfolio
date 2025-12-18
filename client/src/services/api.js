import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const authHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const api = {
  // Auth
  login: (data) => axios.post(`${API_URL}/auth/login`, data).then((res) => res.data),
  getCurrentAdmin: () => axios.get(`${API_URL}/auth/me`, { headers: authHeaders() }).then((res) => res.data),
  getPasswordInfo: () => axios.get(`${API_URL}/auth/password-info`, { headers: authHeaders() }).then((res) => res.data),
  changePassword: (data) => axios.post(`${API_URL}/auth/change-password`, data, { headers: authHeaders() }).then((res) => res.data),

  // Profile
  getProfile: () => axios.get(`${API_URL}/profile`).then(res => res.data),
  updateProfile: (data) => {
    const isFormData = data instanceof FormData;
    return axios.post(`${API_URL}/profile`, data, {
      headers: {
        ...authHeaders(),
        ...(isFormData ? { 'Content-Type': 'multipart/form-data' } : {})
      }
    }).then(res => res.data);
  },

  // Skills
  getSkills: () => axios.get(`${API_URL}/skills`).then(res => res.data),
  createSkill: (data) => axios.post(`${API_URL}/skills`, data, { headers: authHeaders() }).then(res => res.data),
  updateSkill: (id, data) => axios.put(`${API_URL}/skills/${id}`, data, { headers: authHeaders() }).then(res => res.data),
  deleteSkill: (id) => axios.delete(`${API_URL}/skills/${id}`, { headers: authHeaders() }).then(res => res.data),

  // Projects
  getProjects: () => axios.get(`${API_URL}/projects`).then(res => res.data),
  createProject: (data) => axios.post(`${API_URL}/projects`, data, { headers: authHeaders() }).then(res => res.data),
  updateProject: (id, data) => axios.put(`${API_URL}/projects/${id}`, data, { headers: authHeaders() }).then(res => res.data),
  deleteProject: (id) => axios.delete(`${API_URL}/projects/${id}`, { headers: authHeaders() }).then(res => res.data),

  // Certifications
  getCertifications: () => axios.get(`${API_URL}/certifications`).then(res => res.data),
  createCertification: (formData) => axios.post(`${API_URL}/certifications`, formData, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } }).then(res => res.data),
  updateCertification: (id, formData) => axios.put(`${API_URL}/certifications/${id}`, formData, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } }).then(res => res.data),
  deleteCertification: (id) => axios.delete(`${API_URL}/certifications/${id}`, { headers: authHeaders() }).then(res => res.data),

  // Education
  getEducation: () => axios.get(`${API_URL}/education`).then(res => res.data),
  createEducation: (data) => axios.post(`${API_URL}/education`, data, { headers: authHeaders() }).then(res => res.data),
  updateEducation: (id, data) => axios.put(`${API_URL}/education/${id}`, data, { headers: authHeaders() }).then(res => res.data),
  deleteEducation: (id) => axios.delete(`${API_URL}/education/${id}`, { headers: authHeaders() }).then(res => res.data),

  // Interests
  getInterests: () => axios.get(`${API_URL}/interests`).then(res => res.data),
  createInterest: (formData) => axios.post(`${API_URL}/interests`, formData, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } }).then(res => res.data),
  updateInterest: (id, formData) => axios.put(`${API_URL}/interests/${id}`, formData, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } }).then(res => res.data),
  deleteInterest: (id) => axios.delete(`${API_URL}/interests/${id}`, { headers: authHeaders() }).then(res => res.data),

  // Contact
  submitContact: (formData) => axios.post(`${API_URL}/contact`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }).then(res => res.data),

  // Resume
  getResume: () => axios.get(`${API_URL}/resume`).then(res => res.data),
  uploadResume: (formData) => axios.post(`${API_URL}/resume`, formData, { headers: { ...authHeaders(), 'Content-Type': 'multipart/form-data' } }).then(res => res.data),
  deleteResume: (id) => axios.delete(`${API_URL}/resume/${id}`, { headers: authHeaders() }).then(res => res.data),
};

export default api;

