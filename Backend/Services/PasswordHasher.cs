using System;
using System.Security.Cryptography;
using System.Text;

namespace Backend.Services
{
    // Simple PBKDF2 password hasher. Stored format: {iterations}.{saltBase64}.{hashBase64}
    public static class PasswordHasher
    {
        private const int SaltSize = 16; // 128 bit
        private const int HashSize = 32; // 256 bit
        private const int Iterations = 100_000;

        public static string Hash(string password)
        {
            using var rng = RandomNumberGenerator.Create();
            var salt = new byte[SaltSize];
            rng.GetBytes(salt);

            using var pbkdf2 = new Rfc2898DeriveBytes(password, salt, Iterations, HashAlgorithmName.SHA256);
            var hash = pbkdf2.GetBytes(HashSize);

            return $"{Iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
        }

        // Verifies the provided password against stored. If stored is plain text, returns true only on exact match
        // and provides an upgraded hashed value via out parameter so callers can persist the hash.
        public static bool VerifyAndUpgrade(string stored, string provided, out string? upgradedHash)
        {
            upgradedHash = null;

            if (string.IsNullOrEmpty(stored)) return false;

            // If stored looks like our hashed format: iterations.salt.hash
            var parts = stored.Split('.');
            if (parts.Length == 3 && int.TryParse(parts[0], out var iters))
            {
                try
                {
                    var salt = Convert.FromBase64String(parts[1]);
                    var storedHash = Convert.FromBase64String(parts[2]);

                    using var pbkdf2 = new Rfc2898DeriveBytes(provided, salt, iters, HashAlgorithmName.SHA256);
                    var computed = pbkdf2.GetBytes(storedHash.Length);

                    // Constant-time comparison
                    if (FixedTimeEquals(storedHash, computed))
                        return true;
                    return false;
                }
                catch
                {
                    return false;
                }
            }

            // Fallback: stored value is not hashed (legacy). Compare plain text; if matches, produce upgraded hash.
            if (stored == provided)
            {
                upgradedHash = Hash(provided);
                return true;
            }

            return false;
        }

        private static bool FixedTimeEquals(byte[] a, byte[] b)
        {
            if (a.Length != b.Length) return false;
            var diff = 0;
            for (int i = 0; i < a.Length; i++) diff |= a[i] ^ b[i];
            return diff == 0;
        }
    }
}
