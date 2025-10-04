import { reactive } from "vue";
import { AuthService } from "@/services/authService";

export const store = {
  state: reactive({
    user: {},
    isAuthenticated: false,
    isLoading: false,
  }),
  
  // Métodos para manejar la autenticación
  async initializeAuth() {
    this.state.isLoading = true;
    try {
      const response = await AuthService.getCurrentSession();
      if (response.success && response.user) {
        this.state.user = response.user;
        this.state.isAuthenticated = true;
      } else {
        this.state.user = {};
        this.state.isAuthenticated = false;
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      this.state.user = {};
      this.state.isAuthenticated = false;
    } finally {
      this.state.isLoading = false;
    }
  },

  async login(credentials) {
    this.state.isLoading = true;
    try {
      const response = await AuthService.signIn(credentials);
      if (response.success && response.user) {
        this.state.user = response.user;
        this.state.isAuthenticated = true;
        return { success: true, user: response.user };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      this.state.isLoading = false;
    }
  },

  async logout() {
    this.state.isLoading = true;
    try {
      const response = await AuthService.signOut();
      this.state.user = {};
      this.state.isAuthenticated = false;
      return { success: response.success, error: response.error };
    } catch (error) {
      this.state.user = {};
      this.state.isAuthenticated = false;
      return { success: false, error: error.message };
    } finally {
      this.state.isLoading = false;
    }
  },

  setUser(user) {
    this.state.user = user;
    this.state.isAuthenticated = !!user;
  },

  clearUser() {
    this.state.user = {};
    this.state.isAuthenticated = false;
  }
};