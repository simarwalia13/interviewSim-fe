import { useFormik } from 'formik';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  Target,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LoadingSpin from 'public/svg/loadingSpin.svg';
import { useState } from 'react';
import { toast } from 'sonner';

import { useLogin } from '@/hooks/auth/user/userMutation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { LoginSchema } from '@/validation';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const loginMutation = useLogin();
  const isLoading = loginMutation?.isLoading;

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      const loginData = {
        email: values.email,
        password: values.password,
      };
      loginMutation
        .mutateAsync({
          body: loginData,
        })
        .then((res) => {
          if (res?.message === 'Login successful') {
            toast.success('Welcome back!');
            router.push('/');
          } else {
            toast.error(res?.message || 'Login failed');
          }
        })
        .catch((error) => {
          toast.error('error', error);
        });
    },
  });

  return (
    <div className='bg-background min-h-screen'>
      {/* Header */}
      <header className='border-border bg-background/95 sticky top-0 z-10 border-b backdrop-blur-md'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-3'>
          <div className='flex items-center gap-3'>
            <Link
              href='/'
              className='hover:bg-accent/10 rounded-lg p-1 transition-colors'
            >
              <ArrowLeft className='text-foreground h-5 w-5' />
            </Link>
            <div className='bg-accent/10 flex h-9 w-9 items-center justify-center rounded-lg'>
              <Target className='text-accent h-5 w-5' />
            </div>
            <div>
              <h1 className='text-foreground text-xl tracking-tight md:text-2xl'>
                PrepHub<span className='text-accent'>.</span>
              </h1>
            </div>
          </div>
          <div className='flex items-center '>
            <span className='text-muted-foreground text-md'>New here?</span>
            <Link href='/auth/signup'>
              <Button variant='link' className='text-md text-black'>
                Create account
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-md px-4 py-12 md:py-16'>
        {/* Hero Section */}
        <div className='relative mb-8 text-center'>
          <div className='absolute inset-0 -z-10'>
            <div className='bg-accent/20 absolute left-1/2 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl' />
          </div>

          <div className='bg-accent/10 mb-6 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm'>
            <Zap className='text-accent h-4 w-4' />
            <span className='text-accent'>Welcome back</span>
          </div>

          <h2 className='text-foreground text-3xl font-bold tracking-tight md:text-4xl'>
            Log in to PrepHub<span className='text-accent'>.</span>
          </h2>
          <p className='text-muted-foreground mt-3'>
            Continue your exam preparation journey
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={formik.handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            {/* Email Field */}
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <div className='relative'>
                <Mail className='text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2' />
                <Input
                  id='email'
                  name='email'
                  type='email'
                  placeholder='you@example.com'
                  className={`border-border bg-card/50 pl-10 ${
                    formik.errors.email && formik.touched.email
                      ? 'border-destructive'
                      : ''
                  }`}
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
              </div>
              {/* Error message */}
              {formik.errors.email && formik.touched.email && (
                <p className='text-destructive mt-1 text-xs'>
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>Password</Label>
                <Link
                  href='/auth/forgot-password'
                  className='text-accent text-xs hover:underline'
                >
                  Forgot password?
                </Link>
              </div>
              <div className='relative'>
                <Lock className='text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2' />
                <Input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  className={`border-border bg-card/50 pl-10 pr-10 ${
                    formik.errors.password && formik.touched.password
                      ? 'border-destructive'
                      : ''
                  }`}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2'
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </button>
              </div>
              {/* Error message */}
              {formik.errors.password && formik.touched.password && (
                <p className='text-destructive mt-1 text-xs'>
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Remember Me */}
          </div>

          {/* Submit Button */}
          <Button
            type='submit'
            className='bg-accent hover:bg-accent/80 text-accent-foreground group relative w-full overflow-hidden'
            disabled={isLoading}
          >
            <span className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full' />
            {isLoading ? (
              <span className='flex items-center justify-center gap-2'>
                <LoadingSpin className='h-6 w-6 animate-spin rounded-full border-solid' />
              </span>
            ) : (
              <span className='flex items-center justify-center gap-2'>
                Log In
                <Sparkles className='h-4 w-4 opacity-70' />
              </span>
            )}
          </Button>

          {/* Social Login */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='border-border w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs'>
              <span className='bg-background text-muted-foreground px-2'>
                Or continue with
              </span>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-3'>
            <Button
              type='button'
              variant='outline'
              className='border-border hover:bg-accent/5'
              onClick={() => toast.info('Google login coming soon!')}
            >
              Google
            </Button>
            <Button
              type='button'
              variant='outline'
              className='border-border hover:bg-accent/5'
              onClick={() => toast.info('GitHub login coming soon!')}
            >
              GitHub
            </Button>
          </div>
        </form>

        {/* Footer */}
        <p className='text-muted-foreground mt-8 text-center text-xs'>
          By logging in, you agree to our{' '}
          <Link href='/terms' className='text-black hover:underline'>
            Terms
          </Link>{' '}
          and{' '}
          <Link href='/privacy' className='text-black hover:underline'>
            Privacy Policy
          </Link>
        </p>
      </main>
    </div>
  );
}

// Label component
const Label = ({
  htmlFor,
  children,
  className = '',
}: {
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <label
    htmlFor={htmlFor}
    className={`text-foreground block text-sm font-medium ${className}`}
  >
    {children}
  </label>
);
