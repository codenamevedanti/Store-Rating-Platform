const validateName = (name) => {
    if (!name || name.length < 20 || name.length > 60) {
      return 'Name must be between 20 and 60 characters.';
    }
    return null;
  };
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return 'Must be a valid email address.';
    }
    return null;
  };
  
  const validatePassword = (password) => {
    if (!password || password.length < 8 || password.length > 16) {
      return 'Password must be 8–16 characters.';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must include at least one uppercase letter.';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return 'Password must include at least one special character.';
    }
    return null;
  };
  
  const validateAddress = (address) => {
    if (address && address.length > 400) {
      return 'Address must be at most 400 characters.';
    }
    return null;
  };
  
  const validateUserInput = ({ name, email, password, address }) => {
    const errors = {};
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const addrErr = validateAddress(address);
  
    if (nameErr) errors.name = nameErr;
    if (emailErr) errors.email = emailErr;
    if (passErr) errors.password = passErr;
    if (addrErr) errors.address = addrErr;
  
    return Object.keys(errors).length ? errors : null;
  };
  
  module.exports = { validateName, validateEmail, validatePassword, validateAddress, validateUserInput };