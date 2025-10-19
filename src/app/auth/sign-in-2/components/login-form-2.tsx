'use client';

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

export function LoginForm2({ className, ...props }: React.ComponentProps<'form'>) {
    return (
        <form className={cn('flex flex-col gap-6', className)} {...props} action="/dashboard">
            {/* Header */}
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Sign In to your account</h1>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6">
                {/* Email */}
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="test@example.com"
                        defaultValue="test@example.com"
                        required
                    />
                </div>

                {/* Password */}
                <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" defaultValue="password" required />
                </div>

                {/* Company Dropdown */}
                <div className="grid gap-3">
                    <Label htmlFor="company">Company</Label>
                    <Select defaultValue="company-1">
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select your company" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="company-1">Company 1</SelectItem>
                            <SelectItem value="company-2">Company 2</SelectItem>
                            <SelectItem value="company-3">Company 3</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full cursor-pointer">
                    Login
                </Button>
            </div>
        </form>
    );
}
