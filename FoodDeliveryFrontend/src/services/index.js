import api from './api';

export const authService = {
    async register(data) {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    async login(data) {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    async refreshToken(refreshToken) {
        const response = await api.post('/auth/refresh-token', { refreshToken });
        return response.data;
    },

    async getCurrentUser() {
        const response = await api.get('/auth/me');
        return response.data;
    },

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },
};

export const restaurantService = {
    async getAll(page = 0, size = 10, sortBy = 'rating', sortDir = 'desc') {
        const response = await api.get(`/restaurants?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`);
        return response.data;
    },

    async search(query, page = 0, size = 10) {
        const response = await api.get(`/restaurants/search?query=${query}&page=${page}&size=${size}`);
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/restaurants/${id}`);
        return response.data;
    },

    async getByCuisine(cuisine, page = 0, size = 10) {
        const response = await api.get(`/restaurants/cuisine/${cuisine}?page=${page}&size=${size}`);
        return response.data;
    },

    async getTopRated(limit = 10) {
        const response = await api.get(`/restaurants/top-rated?limit=${limit}`);
        return response.data;
    },
};

export const menuService = {
    async getByRestaurant(restaurantId) {
        const response = await api.get(`/menu/restaurant/${restaurantId}`);
        return response.data;
    },

    async getVegItems(restaurantId) {
        const response = await api.get(`/menu/restaurant/${restaurantId}/veg`);
        return response.data;
    },

    async getBestsellers(restaurantId) {
        const response = await api.get(`/menu/restaurant/${restaurantId}/bestsellers`);
        return response.data;
    },

    async search(query, page = 0, size = 10) {
        const response = await api.get(`/menu/search?query=${query}&page=${page}&size=${size}`);
        return response.data;
    },
};

export const categoryService = {
    async getAll() {
        const response = await api.get('/categories');
        return response.data;
    },
};

export const orderService = {
    async create(orderData) {
        const response = await api.post('/orders', orderData);
        return response.data;
    },

    async getMyOrders(page = 0, size = 10) {
        const response = await api.get(`/orders?page=${page}&size=${size}`);
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    async cancel(id) {
        const response = await api.post(`/orders/${id}/cancel`);
        return response.data;
    },
};

export const paymentService = {
    async createPaymentOrder(orderId) {
        const response = await api.post(`/payments/create/${orderId}`);
        return response.data;
    },

    async verifyPayment(paymentData) {
        const response = await api.post('/payments/verify', paymentData);
        return response.data;
    },
};

export const addressService = {
    async getAll() {
        const response = await api.get('/users/addresses');
        return response.data;
    },

    async create(addressData) {
        const response = await api.post('/users/addresses', addressData);
        return response.data;
    },

    async update(id, addressData) {
        const response = await api.put(`/users/addresses/${id}`, addressData);
        return response.data;
    },

    async delete(id) {
        const response = await api.delete(`/users/addresses/${id}`);
        return response.data;
    },
};
