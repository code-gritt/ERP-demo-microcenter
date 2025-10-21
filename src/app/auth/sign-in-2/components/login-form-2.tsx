'use client';

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
import type { CompaniesResponse, LoginResponse, LoginVariables } from '@/lib/types';

export function LoginForm2({ className, ...props }: React.ComponentProps<'form'>) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [company, setCompany] = useState('01');
    const { login } = useAuthStore();

    const [loginMutation, { loading, error: loginError }] = useMutation<
        LoginResponse,
        LoginVariables
    >(LOGIN_MUTATION);
    const {
        data: companiesData,
        loading: companiesLoading,
        error: companiesError,
    } = useQuery<CompaniesResponse>(GET_COMPANIES_QUERY, {
        errorPolicy: 'ignore',
    });

    const companies = companiesData?.companies ?? [];

    useEffect(() => {
        if (companies.length > 0) {
            const defaultCompany = companies.find((c) => c.company_id === '01');
            if (defaultCompany) {
                setCompany('01');
            } else if (!company) {
                setCompany(companies[0]?.company_id || '01');
            }
        }
    }, [companies, company]);

    useEffect(() => {
        if (companiesError) {
            console.error('Companies query error:', companiesError.message);

            if (!company) {
                setCompany('01');
            }
        }
    }, [companiesError, company]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!company) return;

        try {
            const { data } = await loginMutation({
                variables: {
                    userName: email,
                    password,
                    companyId: company,
                },
            });

            if (data?.login?.token && data.login.user) {
                login(data.login.token, data.login.user);
                window.location.href = '/landing';
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
                <div className="grid gap-3">
                    <Label htmlFor="email">Username</Label>
                    <Input
                        id="email"
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        placeholder="Enter username"
                    />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        placeholder="Enter password"
                    />
                </div>

                <div className="grid gap-3">
                    <Label htmlFor="company">Company</Label>
                    <Select
                        value={company}
                        onValueChange={setCompany}
                        disabled={companiesLoading || !!companiesError}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue
                                placeholder={
                                    companiesLoading
                                        ? 'Loading companies...'
                                        : companiesError
                                        ? 'Failed to load companies (using default: 01)'
                                        : companies.find((c) => c.company_id === company)
                                              ?.company_name || 'KEWALRAM AND SONS W.L.L'
                                }
                            />
                        </SelectTrigger>
                        <SelectContent>
                            {companies.map((comp) => (
                                <SelectItem key={comp.company_id} value={comp.company_id}>
                                    {comp.company_name}
                                </SelectItem>
                            ))}
                            {!companies.length && !companiesError && (
                                <SelectItem value="01" disabled>
                                    Default: KEWALRAM AND SONS W.L.L (ID: 01)
                                </SelectItem>
                            )}
                        </SelectContent>
                    </Select>
                    {companiesError && (
                        <p className="text-red-500 text-sm">
                            Error loading companies: {companiesError.message}. Using default ID: 01.
                        </p>
                    )}
                </div>

                {loginError && (
                    <p className="text-red-500 text-sm">Invalid username, password, or company.</p>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={
                        loading ||
                        companiesLoading ||
                        !!companiesError ||
                        !company ||
                        !email ||
                        !password
                    }
                >
                    {loading ? 'Signing in...' : 'Sign In'}
                </Button>
            </div>
        </form>
    );
}
