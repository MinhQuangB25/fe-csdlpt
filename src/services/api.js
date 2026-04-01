// API Service for GoiXe Backend Integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
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
    async login(identifier, location) {
        return this.request('/login', {
            method: 'POST',
            body: JSON.stringify({
                identifier,
                location,
            }),
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
}

export default new ApiService();
