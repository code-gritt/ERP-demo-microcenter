import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { LOGIN_MUTATION } from '@/lib/mutation';
import { GET_COMPANIES_QUERY } from '@/lib/queries';
import { useAuthStore } from '@/lib/store';

// -------------------- Types --------------------
interface Company {
    company_id: string;
    company_name: string;
}

interface CompaniesResponse {
    companies: Company[];
}

interface LoginResponse {
    login: {
        token: string;
        user: {
            user_id: string;
            user_name: string;
            designation: string;
            company_name: string;
            email_id: string;
            mobile_no: string;
        };
    };
}

interface LoginVariables {
    userName: string;
    password: string;
    companyId: string;
}

// -------------------- Component --------------------
export function LoginForm2({ className, ...props }: React.ComponentProps<'form'>) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [company, setCompany] = useState('');
    const { login } = useAuthStore(); // ✅ Zustand store method

    // Typed Apollo hooks
    const [loginMutation, { loading, error }] = useMutation<LoginResponse, LoginVariables>(
        LOGIN_MUTATION
    );
    const { data: companiesData, loading: companiesLoading } =
        useQuery<CompaniesResponse>(GET_COMPANIES_QUERY);

    const companies = companiesData?.companies ?? [];

    useEffect(() => {
        if (companies.length > 0 && !company) {
            setCompany(companies[0].company_id);
        }
    }, [companies, company]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!company) {
            console.error('Please select a company');
            return;
        }

        try {
            const { data } = await loginMutation({
                variables: {
                    userName: email,
                    password,
                    companyId: company,
                },
            });

            if (data?.login?.token && data.login.user) {
                login(data.login.token, data.login.user); // ✅ Zustand handles persistence
                window.location.href = '/dashboard';
            }
        } catch (err) {
            console.error('Login error:', err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cn('flex flex-col gap-6', className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Sign In to your account</h1>
            </div>

            <div className="grid gap-6">
                {/* Email */}
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />
                </div>

                {/* Password */}
                <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                    />
                </div>

                {/* Company */}
                <div className="grid gap-3">
                    <Label htmlFor="company">Company</Label>
                    <Select
                        value={company}
                        onValueChange={setCompany}
                        disabled={loading || companiesLoading || companies.length === 0}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue
                                placeholder={
                                    companiesLoading
                                        ? 'Loading companies...'
                                        : 'Select your company'
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {companies.map((comp) => (
                                <SelectItem key={comp.company_id} value={comp.company_id}>
                                    {comp.company_name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-red-500 text-sm">
                        {error.message.includes('Invalid credentials')
                            ? 'Invalid email, password, or company.'
                            : error.message}
                    </p>
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || companiesLoading || !company}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </Button>
            </div>
        </form>
    );
}
