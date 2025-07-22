export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Payload:', payload); // Debugging line to check the payload
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}
