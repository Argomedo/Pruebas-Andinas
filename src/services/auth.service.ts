import { UserRepository } from "@/db/repositories/user.repository";
import { AuthError, ValidationError } from "@/lib/errors";
import { logger } from "@/lib/logger";

export const AuthService = {
  /**
   * Mock authentication service. 
   * In a realistic scenario, it would verify a password/hash via Supabase.
   */
  async login(email: string): Promise<string> {
    if (!email || !email.includes("@")) {
      throw new ValidationError("Invalid email format");
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      logger.warn("Failed login attempt - User not found", { email });
      throw new AuthError("Usuario no encontrado.");
    }

    // Generate a mock JWT token string (Simulating NextAuth / Supabase)
    const mockToken = Buffer.from(JSON.stringify({ sub: user.id, role: user.role })).toString("base64");
    
    logger.info("User logged in successfully", { userId: user.id });
    return mockToken;
  },

  async verifyToken(token: string) {
    try {
      const decoded = JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
      if (!decoded.sub) throw new Error();
      return decoded;
    } catch {
      throw new AuthError("Token de sesión inválido.");
    }
  }
};
