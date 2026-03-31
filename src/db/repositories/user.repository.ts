import { mockDb, simulateQueryLatency } from "../mockStore";
import type { User } from "@/types";

export const UserRepository = {
  async findById(id: string): Promise<User | null> {
    await simulateQueryLatency();
    return mockDb.users.get(id) || null;
  },

  async findByEmail(email: string): Promise<User | null> {
    await simulateQueryLatency();
    for (const user of mockDb.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  },

  async findAll(): Promise<User[]> {
    await simulateQueryLatency();
    return Array.from(mockDb.users.values());
  }
};
