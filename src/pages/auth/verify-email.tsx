import { useFormik } from 'formik';
import { useAtom } from 'jotai';
import { ArrowLeft, CheckCircle, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LoadingSpin from 'public/svg/loadingSpin.svg';
import { useRef } from 'react';
import { toast } from 'sonner';

import { useVerifyEmail } from '@/hooks/auth/user/userMutation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { signupEmailAtom } from '@/store';

import { VerifyEmailSchema } from '@/validation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [SignupEmail] = useAtom(signupEmailAtom);
  const verification = useVerifyEmail();
  const isLoading = verification?.isLoading;

  // Refs to handle focus jumping
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { handleSubmit, setFieldValue, errors, values } = useFormik({
    initialValues: {
      email: SignupEmail,
      otp: '',
    },
    validationSchema: VerifyEmailSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values: any) => {
      verification
        .mutateAsync({
          body: { ...values },
        })
        .then((res) => {
          if (res.message === 'user verified successfully') {
            toast.success('Email verified successfully!');
            router.push('/auth/login');
          } else {
            toast?.error(res.message);
          }
        })
        .catch((err: any) => {
          toast.error('err', err);
        });
    },
  });
  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return; // Only allow numbers

    const otpArray = values.otp.split('');
    // Take only the last character if user types fast
    otpArray[index] = value.slice(-1);
    const newOtp = otpArray.join('');

    setFieldValue('otp', newOtp);

    // Move focus forward
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !values.otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      setFieldValue('otp', pastedData);
      // Focus the last input or the next empty one
      inputRefs.current[pastedData.length - 1]?.focus();
    }
  };

  return (
    <div className='bg-background min-h-screen'>
      {/* Header */}
      <header className='border-border bg-background/95 sticky top-0 z-10 border-b backdrop-blur-md'>
        <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-3'>
          <div className='flex items-center gap-3'>
            <Link
              href='/auth/signup'
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
          <div className='flex items-center gap-2'>
            <span className='text-muted-foreground text-sm'>
              Already verified?
            </span>
            <Link href='/auth/login'>
              <Button variant='link' className='text-accent'>
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
            <span className='text-accent'>Verify Email</span>
          </div>

          <h2 className='text-foreground text-3xl font-bold tracking-tight md:text-4xl'>
            Check your inbox<span className='text-accent'>.</span>
          </h2>
          <p className='text-muted-foreground mt-3'>
            We've sent a 6-digit verification code to
          </p>

          {/* Timer Display */}
        </div>

        {/* OTP Form */}
        <form onSubmit={handleSubmit} className='space-y-8'>
          <div className='space-y-4'>
            <div>Enter Verification Code</div>

            {/* OTP Input Fields */}
            <div className='flex justify-center gap-2' onPaste={handlePaste}>
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type='text'
                  inputMode='numeric'
                  maxLength={1}
                  value={values.otp[index] || ''}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`focus:ring-accent h-14 w-12 text-center text-xl font-bold focus:ring-2 ${
                    errors.otp ? 'border-destructive' : 'border-border'
                  }`}
                />
              ))}
            </div>

            {/* Error Message */}
            {errors.otp && (
              <p className='text-destructive mt-1 text-xs'>
                {errors.otp as any}
              </p>
            )}

            <p className='text-muted-foreground text-center text-xs'>
              Enter the 6-digit code sent to your email
            </p>
          </div>

          {/* Verify Button */}
          <Button
            type='submit'
            disabled={isLoading || values.otp.length < 6}
            className='bg-accent hover:bg-accent/80 text-accent-foreground group relative w-full overflow-hidden'
          >
            <span className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full' />
            {isLoading ? (
              <span className='flex items-center justify-center gap-2'>
                <LoadingSpin className='h-6 w-6 animate-spin rounded-full border-solid' />
              </span>
            ) : (
              <span className='flex items-center justify-center gap-2'>
                Verify Email
                <CheckCircle className='h-4 w-4 opacity-70' />
              </span>
            )}
          </Button>

          {/* Resend Section */}
          <div className='text-center'>
            <button
              type='button'
              className='text-accent hover:text-accent/80 inline-flex items-center gap-1 text-sm font-medium transition-colors'
            >
              Request new OTP
            </button>
          </div>

          {/* Help Section */}
          <div className='border-border bg-card/30 rounded-xl border p-4'>
            <h3 className='text-foreground mb-2 text-sm font-medium'>
              Didn't receive the code?
            </h3>
            <ul className='space-y-2 text-sm'>
              <li className='text-muted-foreground flex items-start gap-2'>
                <span className='bg-accent/20 mt-1.5 h-1 w-1 flex-shrink-0 rounded-full' />
                Check your spam or junk folder
              </li>
              <li className='text-muted-foreground flex items-start gap-2'>
                <span className='bg-accent/20 mt-1.5 h-1 w-1 flex-shrink-0 rounded-full' />
                Make sure you entered the correct email
              </li>
              <li className='text-muted-foreground flex items-start gap-2'>
                <span className='bg-accent/20 mt-1.5 h-1 w-1 flex-shrink-0 rounded-full' />
                The code expires in 15 minutes
              </li>
            </ul>
          </div>

          {/* Back to Sign Up */}
          <div className='text-center'>
            <Link
              href='/auth/signup'
              className='text-muted-foreground hover:text-accent inline-flex items-center gap-1 text-xs transition-colors'
            >
              <ArrowLeft className='h-3 w-3' />
              Back to sign up
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
