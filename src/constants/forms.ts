type TypeProps = {
  id: string;
  type: "email" | "text" | "password" | "number";
  inputType: "select" | "input";
  options?: { value: string; label: string; id: string }[];
  label?: string;
  placeholder: string;
  name: string;
  showPasswordRequirements?: boolean;
};

export const USER_SIGNUP_FORM: TypeProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "Full name",
    name: "fullname",
    type: "text",
  },
  {
    id: "2",
    inputType: "input",
    placeholder: "Email",
    name: "email",
    type: "email",
  },
  {
    id: "3",
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
    showPasswordRequirements: true,
  },
  {
    id: "4",
    inputType: "input",
    placeholder: "Confrim Password",
    name: "confirmPassword",
    type: "password",
  },
];

export const USER_LOGIN_FORM: TypeProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "Enter your email",
    name: "email",
    type: "email",
  },
  {
    id: "2",
    inputType: "input",
    placeholder: "Password",
    name: "password",
    type: "password",
  },
];

export const USER_FORGOT_PASSWORD_FORM: TypeProps[] = [
  {
    id: "1",
    inputType: "input",
    placeholder: "Enter your email",
    name: "email",
    type: "email",
  },
];

export const passwordRequirements = [
  {
    id: "minLength",
    label: "At least 8 characters long",
    test: (password: string) => password?.length >= 8,
  },
  {
    id: "uppercase",
    label: "Contains an uppercase letter",
    test: (password: string) => password && /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "Contains a lowercase letter",
    test: (password: string) => password && /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "Contains a number",
    test: (password: string) => password && /\d/.test(password),
  },
  {
    id: "symbol",
    label: "Contains a special character (e.g., !@#$%)",
    test: (password: string) => password && /[^a-zA-Z0-9]/.test(password),
  },
];
