const BASE_URL = 'http://localhost:3000';

const api = {
  register: async (username, email, password) => {
    try {
      const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) throw new Error(`Failed to register: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  },

  login: async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error(`Failed to login: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  },

  createPost: async (content) => {
    const token = localStorage.getItem('auth_token');
    try {
      const response = await fetch(`${BASE_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });
      if (!response.ok) throw new Error(`Failed to create post: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, message: error.message };
    }
  },
};
