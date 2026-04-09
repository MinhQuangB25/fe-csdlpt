// API Service for GoiXe Backend Integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        // Lấy token từ localStorage mỗi lần gửi request
        const token = localStorage.getItem('token');
        const defaultHeaders = {
            'Content-Type': 'application/json',
        };
        
        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Login user
    async login(identifier, password, location) {
        return this.request('/login', {
            method: 'POST',
            body: JSON.stringify({
                identifier,
                password,
                location,
            }),
        });
    }

    // Register user
    async register(payload) {
        return this.request('/api/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    // Book a trip
    async bookTrip(payload) {
        return this.request('/book-trip', {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    }

    // Get trip history
    async getTripHistory(userId, location) {
        return this.request('/trip-history', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                location,
            }),
        });
    }

    // Get trip status
    async getTripStatus(region, bookingId) {
        return this.request(`/trip-status?region=${region}&booking_id=${bookingId}`, {
            method: 'GET',
        });
    }

    // Update trip status
    async updateTripStatus(region, bookingId, status) {
        return this.request('/trip-status/update', {
            method: 'POST',
            body: JSON.stringify({
                region,
                booking_id: bookingId,
                status,
            }),
        });
    }

    // Health check
    async health() {
        return this.request('/health', {
            method: 'GET',
        });
    }

    // Demo: Update node state (for failover demo)
    async updateNodeState(region, nodeRole, health) {
        return this.request('/demo/node-state', {
            method: 'POST',
            body: JSON.stringify({
                region,
                node_role: nodeRole,
                health,
            }),
        });
    }

    // Demo: Update mode
    async updateMode(region, mode) {
        return this.request('/demo/mode', {
            method: 'POST',
            body: JSON.stringify({
                region,
                mode,
            }),
        });
    }

    // Health Check: Get current status of all DB nodes
    async getHealthCheckStatus() {
        return this.request('/api/health-check/status', {
            method: 'GET',
        });
    }

    // Health Check: Get failover/recovery event timeline
    async getHealthCheckEvents(limit = 50) {
        return this.request(`/api/health-check/events?limit=${limit}`, {
            method: 'GET',
        });
    }

    // Notifications
    async getNotifications(userId) {
        return this.request(`/api/users/${userId}/notifications`, {
            method: 'GET',
        });
    }
}

export default new ApiService();
