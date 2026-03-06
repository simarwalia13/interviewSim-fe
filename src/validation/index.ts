import * as Yup from 'yup';

export const SignUpSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .email('This is not a valid email')
    .required('Email is required'),
  name: Yup.string()
    .trim()
    .required('Your Name is required')
    .min(3, 'Name should be min 3 chars')
    .matches(/^[a-zA-Z\s]*$/, 'Name should only contain letters and spaces'),
  password: Yup.string()
    .required('No password provided.')
    .trim()
    .min(8, 'Password should be min 8 chars')
    .matches(/[a-zA-Z]/, 'Password contain letters also'),
});

export const VerifyEmailSchema = Yup.object().shape({
  otp: Yup.string()
    .required('Verification code is required')
    .length(6, 'Code must be exactly 6 digits')
    .matches(/^\d+$/, 'Code must contain only digits'),
});

export const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});
