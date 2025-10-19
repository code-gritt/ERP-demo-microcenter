import { LoginForm2 } from './components/login-form-2';
import { Logo } from '@/components/logo';
import { getAppUrl } from '@/lib/utils'; // Make sure this helper exists
import { Check } from 'lucide-react';

export default function LoginPage() {
    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* Right: ERP Info Section */}
            <div className="bg-muted flex flex-col justify-center items-start p-10 lg:p-16 gap-6 lg:flex-col">
                {/* Logo */}
                <div className="flex items-center space-x-2 mb-6">
                    <a
                        href={getAppUrl('/landing')}
                        className="flex items-center space-x-2 cursor-pointer"
                    >
                        <Logo size={100} />
                        <span className="font-bold text-3xl">ERP Demo</span>
                    </a>
                </div>

                {/* ERP Description */}
                <h2 className="text-3xl lg:text-4xl font-bold">Manage your company with:</h2>
                <ul className="space-y-3 text-base lg:text-lg text-muted-foreground">
                    {[
                        'All-in-one tool',
                        'Run and scale your ERP/CRM Apps',
                        'Easily add and manage your services',
                        'It brings together your invoices, clients, and leads',
                    ].map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <Check className="text-green-500 w-5 h-5 flex-shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Left: Login Form */}
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md">
                        <LoginForm2 />
                    </div>
                </div>
            </div>
        </div>
    );
}
