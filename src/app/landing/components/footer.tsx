'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Logo } from '@/components/logo';
import { Github, Twitter, Linkedin, Youtube } from 'lucide-react';

const newsletterSchema = z.object({
    email: z.string().email({ message: 'Please enter a valid email address.' }),
});

const footerLinks = {
    product: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Modules', href: '#modules' },
        { name: 'Documentation', href: '#docs' },
    ],
    company: [
        { name: 'About', href: '#about' },
        { name: 'Blog', href: '#blog' },
        { name: 'Careers', href: '#careers' },
        { name: 'Press', href: '#press' },
    ],
    resources: [
        { name: 'Help Center', href: '#help' },
        { name: 'Community', href: '#community' },
        { name: 'Guides', href: '#guides' },
        { name: 'Webinars', href: '#webinars' },
    ],
    legal: [
        { name: 'Privacy', href: '#privacy' },
        { name: 'Terms', href: '#terms' },
        { name: 'Security', href: '#security' },
        { name: 'Status', href: '#status' },
    ],
};

const socialLinks = [
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'YouTube', href: '#', icon: Youtube },
];

export function LandingFooter() {
    const form = useForm<z.infer<typeof newsletterSchema>>({
        resolver: zodResolver(newsletterSchema),
        defaultValues: { email: '' },
    });

    function onSubmit(values: z.infer<typeof newsletterSchema>) {
        console.log(values);
        form.reset();
    }

    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Newsletter */}
                <div className="mb-16">
                    <div className="mx-auto max-w-2xl text-center">
                        <h3 className="text-2xl font-bold mb-4">Stay updated</h3>
                        <p className="text-muted-foreground mb-6">
                            Get the latest ERP updates, guides, and resources delivered to your
                            inbox.
                        </p>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="flex flex-col gap-2 max-w-md mx-auto sm:flex-row"
                            >
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="Enter your email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="cursor-pointer">
                                    Subscribe
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>

                {/* Main Footer */}
                <div className="grid gap-8 grid-cols-4 lg:grid-cols-6">
                    {/* Brand */}
                    <div className="col-span-4 lg:col-span-2 max-w-2xl">
                        <div className="flex items-center space-x-2 mb-4 max-lg:justify-center">
                            <a href="#" className="flex items-center space-x-2 cursor-pointer">
                                <Logo size={32} />
                                <span className="font-bold text-xl">ERP Demo</span>
                            </a>
                        </div>
                        <p className="text-muted-foreground mb-6 max-lg:text-center max-lg:flex max-lg:justify-center">
                            Streamline business operations with ERP modules, dashboards, and
                            productivity tools built for modern teams.
                        </p>
                        <div className="flex space-x-4 max-lg:justify-center">
                            {socialLinks.map((social) => (
                                <Button key={social.name} variant="ghost" size="icon" asChild>
                                    <a
                                        href={social.href}
                                        aria-label={social.name}
                                        rel="noopener noreferrer"
                                    >
                                        <social.icon className="h-4 w-4" />
                                    </a>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title} className="max-md:col-span-2 lg:col-span-1">
                            <h4 className="font-semibold mb-4 capitalize">{title}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className="my-8" />

                {/* Bottom */}
                <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
                    <div className="flex flex-col sm:flex-row items-center gap-2 text-muted-foreground text-sm">
                        <div className="flex items-center gap-1">
                            <span>Made</span>

                            <span>by</span>
                            <a
                                href="#"
                                className="font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                            >
                                Gokul
                            </a>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span>© {new Date().getFullYear()} All rights reserved</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-4 md:mt-0">
                        <a href="#privacy" className="hover:text-foreground transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#terms" className="hover:text-foreground transition-colors">
                            Terms of Service
                        </a>
                        <a href="#cookies" className="hover:text-foreground transition-colors">
                            Cookie Policy
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
