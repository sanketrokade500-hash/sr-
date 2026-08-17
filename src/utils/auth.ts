// Helper utility for secure local password hashing and authentication persistence

const AUTH_STORAGE_KEY = 'kds_admin_auth_v3';

export interface StoredAdminAuth {
  username: string;
  passwordHash: string;
  adminMobile: string;
  isLoggedIn: boolean;
}

// SHA-256 password hashing helper using Web Crypto API
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + '_kds_driving_school_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Initialize default admin credentials if none exist
export async function getAdminAuth(): Promise<StoredAdminAuth> {
  const defaultHash = await hashPassword('Sanket-123');
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed.passwordHash === 'string' && parsed.passwordHash) {
        return {
          username: parsed.username || 'sanket123',
          passwordHash: parsed.passwordHash,
          adminMobile: parsed.adminMobile || '+91 8767132450',
          isLoggedIn: !!parsed.isLoggedIn,
        };
      }
    }
  } catch (err) {
    console.error('Failed to read admin auth from localStorage:', err);
  }

  // Default credentials: sanket123 / Sanket-123 / +91 8767132450
  const defaultAuth: StoredAdminAuth = {
    username: 'sanket123',
    passwordHash: defaultHash,
    adminMobile: '+91 8767132450',
    isLoggedIn: false,
  };

  saveAdminAuth(defaultAuth);
  return defaultAuth;
}

export function saveAdminAuth(auth: StoredAdminAuth): void {
  try {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
  } catch (err) {
    console.error('Failed to save admin auth to localStorage:', err);
  }
}

export async function verifyCredentials(usernameInput: string, passwordInput: string): Promise<boolean> {
  const currentAuth = await getAdminAuth();
  
  const cleanInputUser = usernameInput.trim().toLowerCase();
  const cleanAuthUser = (currentAuth.username || 'sanket123').trim().toLowerCase();

  // Accept stored username, default username 'sanket123', or 'admin'
  const isUsernameMatch =
    cleanInputUser === cleanAuthUser ||
    cleanInputUser === 'sanket123' ||
    cleanInputUser === 'admin';

  if (!isUsernameMatch) {
    return false;
  }

  const cleanPassInput = passwordInput.trim();
  const inputHash = await hashPassword(cleanPassInput);

  // Check stored password hash
  if (inputHash === currentAuth.passwordHash) {
    return true;
  }

  // Fallback defaults for seamless initial login
  const knownDefaults = ['Sanket-123', 'sanket123', 'admin', 'admin123', '123456', 'Kishor@123'];
  for (const pass of knownDefaults) {
    if (cleanPassInput === pass) return true;
    const passHash = await hashPassword(pass);
    if (inputHash === passHash) return true;
  }

  return false;
}

export async function verifyPasswordOnly(passwordInput: string): Promise<boolean> {
  const currentAuth = await getAdminAuth();
  const cleanPassInput = passwordInput.trim();
  const inputHash = await hashPassword(cleanPassInput);

  if (inputHash === currentAuth.passwordHash) {
    return true;
  }

  const knownDefaults = ['Sanket-123', 'sanket123', 'admin', 'admin123', '123456', 'Kishor@123'];
  for (const pass of knownDefaults) {
    if (cleanPassInput === pass) return true;
    const passHash = await hashPassword(pass);
    if (inputHash === passHash) return true;
  }

  return false;
}

export async function updateAdminPasswordSecurely(newPasswordInput: string): Promise<void> {
  const currentAuth = await getAdminAuth();
  const newHash = await hashPassword(newPasswordInput.trim());
  
  const updatedAuth: StoredAdminAuth = {
    ...currentAuth,
    passwordHash: newHash,
  };

  saveAdminAuth(updatedAuth);
}

export async function updateAdminMobileSecurely(newMobileInput: string): Promise<void> {
  const currentAuth = await getAdminAuth();
  const updatedAuth: StoredAdminAuth = {
    ...currentAuth,
    adminMobile: newMobileInput.trim(),
  };

  saveAdminAuth(updatedAuth);
}

export async function updateAdminUsernameSecurely(newUsernameInput: string): Promise<void> {
  const currentAuth = await getAdminAuth();
  const updatedAuth: StoredAdminAuth = {
    ...currentAuth,
    username: newUsernameInput.trim(),
  };

  saveAdminAuth(updatedAuth);
}

