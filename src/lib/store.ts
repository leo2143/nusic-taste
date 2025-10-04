import { reactive } from "vue";
import { AuthService } from "@/services/authService";
import type { User } from "@/models";

interface StoreState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResult {
  success: boolean;
  user?: User | null;
  error?: string;
}

export const store = {
  state: reactive<StoreState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  }),
  
  // Métodos para manejar la autenticación
  async initializeAuth(): Promise<void> {
    this.state.isLoading = true;
    try {
      const response = await AuthService.getCurrentSession();
      if (response.success && response.user) {
        this.state.user = response.user;
        this.state.isAuthenticated = true;
      } else {
        this.state.user = null;
        this.state.isAuthenticated = false;
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      this.state.user = null;
      this.state.isAuthenticated = false;
    } finally {
      this.state.isLoading = false;
    }
  },

  async login(credentials: LoginCredentials): Promise<AuthResult> {
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
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    } finally {
      this.state.isLoading = false;
    }
  },

  async logout(): Promise<AuthResult> {
    this.state.isLoading = true;
    try {
      const response = await AuthService.signOut();
      this.state.user = null;
      this.state.isAuthenticated = false;
      return { success: response.success, error: response.error };
    } catch (error) {
      this.state.user = null;
      this.state.isAuthenticated = false;
      return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    } finally {
      this.state.isLoading = false;
    }
  },

  setUser(user: User | null): void {
    this.state.user = user;
    this.state.isAuthenticated = !!user;
  },

  clearUser(): void {
    this.state.user = null;
    this.state.isAuthenticated = false;
  }
};
