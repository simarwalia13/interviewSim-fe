import { useFormik } from 'formik';
import { useAtom } from 'jotai';
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  Target,
  User,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LoadingSpin from 'public/svg/loadingSpin.svg';
import { useState } from 'react';
import { toast } from 'sonner';

import { useSignUp } from '@/hooks/auth/user/userMutation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { signupEmailAtom } from '@/store';

import { SignUpSchema } from '@/validation';

export default function SignUpPage() {
  const router = useRouter();
  const signUpMutation = useSignUp();
  const isLoading = signUpMutation?.isLoading;
  const [showPassword, setShowPassword] = useState(false);
  const [, setSignupEmail] = useAtom(signupEmailAtom);

  const { handleSubmit, handleChange, errors } = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: SignUpSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values: any) => {
      setSignupEmail(values.email);
      signUpMutation
        .mutateAsync({
          body: { ...values },
        })
        .then((res: any) => {
          if (res?.message === 'user created successfully') {
            toast.success('Account created! Redirecting...');
            router.push('/auth/verify-email');
          } else {
            toast?.error(res.message);
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
          <div className='flex items-center'>
            <span className='text-md text-black'>Already have an account?</span>
            <Link href='/auth/login'>
              <Button variant='link' className='text-md text-black'>
                Log in
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
            <span className='text-accent'>Get Started</span>
          </div>

          <h2 className='text-foreground text-3xl font-bold tracking-tight md:text-4xl'>
            Create an account<span className='text-accent'>.</span>
          </h2>
          <p className='text-muted-foreground mt-3'>
            Join PrepHub to track your exam preparation
          </p>
        </div>

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-4'>
            {/* Name Field */}
            <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <div className='relative'>
                <User className='text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2' />
                <Input
                  id='name'
                  type='text'
                  placeholder='Simar'
                  className={`border-border bg-card/50 pl-10 ${
                    errors.name ? 'border-destructive' : ''
                  }`}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.name && (
                <p className='text-destructive mt-1 text-xs'>
                  {errors.name as any}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <div className='relative'>
                <Mail className='text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2' />
                <Input
                  id='email'
                  type='email'
                  placeholder='you@example.com'
                  className={`border-border bg-card/50 pl-10 ${
                    errors.email ? 'border-destructive' : ''
                  }`}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.email && (
                <p className='text-destructive mt-1 text-xs'>
                  {errors.email as any}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <div className='relative'>
                <Lock className='text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2' />
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='••••••••'
                  className={`border-border bg-card/50 pl-10 ${
                    errors.password ? 'border-destructive' : ''
                  }`}
                  onChange={handleChange}
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
              <p className='text-muted-foreground text-xs'>
                Must be at least 8 characters
              </p>
              {errors.password && (
                <p className='text-destructive mt-1 text-xs'>
                  {errors.password as any}
                </p>
              )}
            </div>

            {/* Terms Agreement */}
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
                Create Account
                <Sparkles className='h-4 w-4 opacity-70' />
              </span>
            )}
          </Button>

          {/* Social Signup */}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <div className='border-border w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs'>
              <span className='bg-background text-muted-foreground px-2'>
                Or sign up with
              </span>
            </div>
          </div>

          <div className='flex  justify-center'>
            <Button
              variant='outline'
              className='border-border hover:bg-accent/5 w-full'
            >
              Google
            </Button>
          </div>
        </form>
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
