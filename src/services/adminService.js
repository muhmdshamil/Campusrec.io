import { api } from '@/lib/axios';

export const getAdminStats = async () => {
  try {
    const { data } = await api.get('/api/admin/stats');
    return data;
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    throw error;
  }
};

export const getRecentUsers = async () => {
  try {
    const { data } = await api.get('/api/admin/users', {
      params: { limit: 5 }
    });
    return data;
  } catch (error) {
    console.error('Error fetching recent users:', error);
    throw error;
  }
};

export const getRecentJobs = async () => {
  try {
    const { data } = await api.get('/api/admin/jobs', {
      params: { limit: 5 }
    });
    return data;
  } catch (error) {
    console.error('Error fetching recent jobs:', error);
    throw error;
  }
};

export const updateUserStatus = async (userId, status) => {
  const { data } = await api.patch(`/admin/users/${userId}`, { status });
  return data;
};

export const updateJobStatus = async (jobId, status) => {
  const { data } = await api.patch(`/admin/jobs/${jobId}`, { status });
  return data;
};
