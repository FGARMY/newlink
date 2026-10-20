export interface OtpChallenge {
  readonly phone: string;
  readonly codeHash: string;
  readonly expiresAt: Date;
  readonly attemptsRemaining: number;
}

export function generate6DigitOtp(): string {
  // Generates clean 6-digit numeric OTP (100000 - 999999)
  const val = Math.floor(100000 + Math.random() * 900000);
  return String(val);
}

/** Basic cryptographic-grade hash simulation for OTP validation */
export function hashOtp(phone: string, otp: string): string {
  // In production, HMAC-SHA256 with server salt
  let hash = 0;
  const str = `${phone}:${otp}:newlink-salt`;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return String(Math.abs(hash));
}

export function createOtpChallenge(phone: string, code: string, ttlSeconds = 300): OtpChallenge {
  return {
    phone,
    codeHash: hashOtp(phone, code),
    expiresAt: new Date(Date.now() + ttlSeconds * 1000),
    attemptsRemaining: 5,
  };
}

export function verifyOtpChallenge(
  challenge: OtpChallenge,
  enteredCode: string,
  now: Date = new Date(),
): { success: boolean; error?: string } {
  if (now.getTime() > challenge.expiresAt.getTime()) {
    return { success: false, error: 'OTP has expired. Please request a new one.' };
  }

  if (challenge.attemptsRemaining <= 0) {
    return { success: false, error: 'Maximum verification attempts exceeded.' };
  }

  const expectedHash = hashOtp(challenge.phone, enteredCode);
  if (expectedHash !== challenge.codeHash) {
    return { success: false, error: 'Invalid verification code.' };
  }

  return { success: true };
}
