import axios from 'axios';

const API_BASE = 'http://localhost:8000/audit/audits';

export const createAudit = (auditData) => axios.post(API_BASE, auditData);
export const fetchAudits = () => axios.get(API_BASE);
export const fetchAuditById = (id) => axios.get(`${API_BASE}${id}`);
