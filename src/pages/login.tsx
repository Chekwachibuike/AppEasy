import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Logo } from '@/components/Logo';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(4, 'Password must be at least 4 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('loggedIn')) {
      router.replace('/');
    }
  }, [router]);

  const onSubmit = (data: LoginForm) => {
    setLoading(true);
    setTimeout(() => {
      if (data.email && data.password) {
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userEmail', data.email);
        toast({ title: 'Login successful', description: 'Welcome back!' });
        router.replace('/');
      } else {
        toast({ title: 'Login failed', description: 'Invalid credentials', variant: 'destructive' });
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Head>
        <title>Sign In - AppEasy</title>
      </Head>
      <div className="w-full max-w-md p-8 bg-card border border-border rounded-xl shadow-sm">
        <div className="flex justify-center mb-6">
          <Logo size={30} />
        </div>
        <h2 className="text-xl font-semibold mb-6 text-center text-foreground">Sign in to your account</h2>
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
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-foreground font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
} 