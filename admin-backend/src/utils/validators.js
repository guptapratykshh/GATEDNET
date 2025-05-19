// Email validation
exports.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
exports.validatePassword = (password) => {
  // Password must be at least 8 characters long
  // and contain at least one uppercase letter, one lowercase letter,
  // one number, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation
exports.validatePhone = (phone) => {
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  return phoneRegex.test(phone);
};

// Name validation
exports.validateName = (name) => {
  // Name should be at least 2 characters long and contain only letters and spaces
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  return nameRegex.test(name);
};

// Society ID validation
exports.validateSocietyId = (societyId) => {
  // Society ID should be alphanumeric and at least 3 characters long
  const societyIdRegex = /^[a-zA-Z0-9]{3,}$/;
  return societyIdRegex.test(societyId);
}; 