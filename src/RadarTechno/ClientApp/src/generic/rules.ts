import { MSG_REQUIRED } from "../constants";

export const rulesRequired = {
  required: {
    message: MSG_REQUIRED
  }
};

export const rulesMinLength = (minLength = 2) => {
  return {
    minLength: {
      minLength,
      message: "This field should have at least {maxLength} characters"
    }
  };
};

export const rulesMaxLength = (maxLength = 256) => {
  return {
    maxLength: {
      maxLength,
      message: "This field should have les than {maxLength} characters"
    }
  };
};

export const rulesMail = {
  email: {
    message: "Please enter a valid email address"
  }
};

export const rulesUrl = {
  url: {
    message: "Please enter a valid url"
  }
};

export const rulesNoSpecialChars = {
  pattern: {
    regex: /^[a-zA-Zà-ïæù-üò-öŐ-œÿ -]*$/,
    message: "This field do not accept specials characters"
  }
};
