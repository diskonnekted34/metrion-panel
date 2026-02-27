/**
 * Mock auth provider — no backend, localStorage-based session.
 */

const SESSION_KEY = "mock_session";

export interface MockUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  plan?: string;
}

export interface MockSession {
  user: MockUser;
  token: string;
  expiresAt: number;
}

// Simulated user store
const MOCK_USERS: MockUser[] = [
  { id: "u1", email: "demo@metrion.io", fullName: "Demo User" },
];

function generateToken(): string {
  return "mock_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function persist(session: MockSession) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): MockSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: MockSession = JSON.parse(raw);
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export async function login(email: string, _password: string): Promise<MockSession> {
  await delay(800);
  if (!email.includes("@")) throw new Error("Invalid email format");

  const existing = MOCK_USERS.find((u) => u.email === email);
  const user: MockUser = existing ?? {
    id: "u_" + Math.random().toString(36).slice(2, 8),
    email,
    fullName: email.split("@")[0],
  };

  const session: MockSession = {
    user,
    token: generateToken(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };
  persist(session);
  return session;
}

export async function register(
  email: string,
  _password: string,
  fullName: string
): Promise<MockSession> {
  await delay(800);
  if (!email.includes("@")) throw new Error("Invalid email format");
  if (fullName.trim().length < 2) throw new Error("Name too short");

  const user: MockUser = {
    id: "u_" + Math.random().toString(36).slice(2, 8),
    email,
    fullName,
    plan: localStorage.getItem("selected_plan") ?? undefined,
  };
  MOCK_USERS.push(user);

  const session: MockSession = {
    user,
    token: generateToken(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };
  persist(session);
  return session;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}

export async function requestReset(email: string): Promise<void> {
  await delay(600);
  if (!email.includes("@")) throw new Error("Invalid email format");
  // Mock — always "succeeds"
}

export async function verifyEmail(_token: string): Promise<void> {
  await delay(500);
  // Mock — always "succeeds"
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
