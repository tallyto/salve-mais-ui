export interface JwtPayload {
  sub: string; // email do usuário
  tenantId?: string;
  iat: number;
  exp: number;
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeToken(token);
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function decodeToken(token: string): JwtPayload {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload as JwtPayload;
}

export function getTenantIdFromToken(token: string): string | null {
  try {
    const payload = decodeToken(token);
    return payload.tenantId || null;
  } catch {
    return null;
  }
}

export function getEmailFromToken(token: string): string | null {
  try {
    const payload = decodeToken(token);
    return payload.sub || null;
  } catch {
    return null;
  }
}
