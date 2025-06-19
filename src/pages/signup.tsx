import { useState } from 'react';
import { useRouter } from 'next/router';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const signupSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data: SignupForm) => {
    setLoading(true);
    setTimeout(() => {
      if (data.email && data.password) {
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userPassword', data.password);
        localStorage.setItem('loggedIn', 'true');
        toast({ title: 'Sign up successful', description: 'Welcome!' });
        router.replace('/');
      } else {
        toast({ title: 'Sign up failed', description: 'Invalid details', variant: 'destructive' });
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Sign up for AppEasy</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing up...' : 'Sign Up'}
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline dark:text-blue-400">Sign in</Link>
        </p>
      </div>
    </div>
  );
} 