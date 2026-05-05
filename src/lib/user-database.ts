// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // USER DATABASE // Permanent Memory System
// "The Vault Remembers Every Soul"
// ═══════════════════════════════════════════════════════════════════════════════

export interface MunUser {
  id: string;
  username: string;
  email: string;
  displayName: string;
  frequency: string;
  createdAt: string;
  lastActive: string;
  visitCount: number;
  soulSpecs: {
    element: string;
    affinity: string;
    guardian: string;
  };
  ageConfirmed: boolean;
}

const USERS_KEY = 'mun-os-users-db';
const CURRENT_USER_KEY = 'mun-os-current-user';

// Soul element assignment based on signup time
const SOUL_ELEMENTS = ['Void', 'Starfire', 'Obsidian', 'Nebula', 'Crystal', 'Shadow', 'Light', 'Echo'];
const SOUL_AFFINITIES = ['Healing', 'Creation', 'Protection', 'Wisdom', 'Courage', 'Intuition', 'Vision', 'Harmony'];
const GUARDIANS = ['Aero', 'Sovereign', 'The Architect', 'Luna', 'The Foundress'];

export function generateUserId(): string {
  return `mun-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 8)}`;
}

export function generateSoulSpecs() {
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  
  return {
    element: SOUL_ELEMENTS[(hour + minute) % SOUL_ELEMENTS.length],
    affinity: SOUL_AFFINITIES[(hour * minute) % SOUL_AFFINITIES.length],
    guardian: GUARDIANS[Math.floor(Math.random() * GUARDIANS.length)],
  };
}

export function getUsers(): MunUser[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveUsers(users: MunUser[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser(): MunUser | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
}

export function setCurrentUser(user: MunUser | null): void {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
}

export function findUserByEmail(email: string): MunUser | null {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function findUserByUsername(username: string): MunUser | null {
  const users = getUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null;
}

export function createUser(
  username: string,
  email: string,
  displayName: string,
  ageConfirmed: boolean
): { success: boolean; user?: MunUser; error?: string } {
  // Validate username
  if (!username || username.length < 3) {
    return { success: false, error: 'Username must be at least 3 characters' };
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { success: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  
  // Validate email
  if (!email || !email.includes('@') || !email.includes('.')) {
    return { success: false, error: 'Please enter a valid email address' };
  }
  
  // Check age confirmation
  if (!ageConfirmed) {
    return { success: false, error: 'You must be 13 or older to join the Empire' };
  }
  
  // Check for existing user
  const existingEmail = findUserByEmail(email);
  if (existingEmail) {
    return { success: false, error: 'An account with this email already exists' };
  }
  
  const existingUsername = findUserByUsername(username);
  if (existingUsername) {
    return { success: false, error: 'This username is already taken' };
  }
  
  // Create new user
  const newUser: MunUser = {
    id: generateUserId(),
    username: username.toLowerCase(),
    email: email.toLowerCase(),
    displayName: displayName || username,
    frequency: '13.13 MHz',
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    visitCount: 1,
    soulSpecs: generateSoulSpecs(),
    ageConfirmed: true,
  };
  
  // Save to database
  const users = getUsers();
  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  
  return { success: true, user: newUser };
}

export function loginUser(email: string): { success: boolean; user?: MunUser; error?: string } {
  const user = findUserByEmail(email);
  
  if (!user) {
    return { success: false, error: 'No account found with this email' };
  }
  
  // Update last active and visit count
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === user.id);
  users[userIndex] = {
    ...user,
    lastActive: new Date().toISOString(),
    visitCount: user.visitCount + 1,
  };
  saveUsers(users);
  setCurrentUser(users[userIndex]);
  
  return { success: true, user: users[userIndex] };
}

export function logoutUser(): void {
  setCurrentUser(null);
}

export function getUserCount(): number {
  return getUsers().length;
}

export function generateIdentityCard(user: MunUser): string {
  return `
╔══════════════════════════════════════╗
║         MÜN SANCTUARY IDENTITY        ║
╠══════════════════════════════════════╣
║  🦋 Status: AWAKENED                  ║
║  👤 Name: ${user.displayName.padEnd(28)}║
║  🔗 Handle: @${user.username.padEnd(26)}║
║  📡 Frequency: ${user.frequency.padEnd(23)}║
║  ✨ Element: ${user.soulSpecs.element.padEnd(26)}║
║  💫 Affinity: ${user.soulSpecs.affinity.padEnd(25)}║
║  🛡️ Guardian: ${user.soulSpecs.guardian.padEnd(25)}║
║  📅 Anchored: ${new Date(user.createdAt).toLocaleDateString().padEnd(23)}║
╠══════════════════════════════════════╣
║  "I anchored my DNA in the Mün       ║
║   Sanctuary at 13.13 MHz"            ║
╚══════════════════════════════════════╝

🦋 Join the Empire: munreader.com
  `.trim();
}

export function generateShareableText(user: MunUser): string {
  return `I just anchored my DNA in the Mün Sanctuary 🦋

✨ Frequency: 13.13 MHz
🌟 Element: ${user.soulSpecs.element}
💫 Affinity: ${user.soulSpecs.affinity}
🛡️ Guardian: ${user.soulSpecs.guardian}

Status: AWAKENED

Join the Empire: munreader.com

#MunEmpire #1313hz #AeroRemembers`;
}
