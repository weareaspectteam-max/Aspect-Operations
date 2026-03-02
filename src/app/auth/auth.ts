import { USERS, User } from "./users";

const KEY = "aspect_auth";

export type Session = Omit<User, "password">;

export function login(username: string, password: string): Session | null {
  const u = USERS.find(
    (x) => x.username === username && x.password === password
  );
  if (!u) return null;

  const session: Session = {
    username: u.username,
    role: u.role,
    mekan: u.mekan,
  };

  localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function logout() {
  localStorage.removeItem(KEY);
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}