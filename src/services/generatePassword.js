function generatePassword() {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";

  for (let i = 0, n = charset.length; i < length; i += 1) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }

  // Vérifier si le mot de passe contient au moins une majuscule, une minuscule et un chiffre
  if (
    !(/[a-z]/.test(password) && /[A-Z]/.test(password) && /\d/.test(password))
  ) {
    return generatePassword();
  }

  return password;
}

module.exports = { generatePassword };
