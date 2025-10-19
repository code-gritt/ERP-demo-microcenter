'use client';

import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useState } from 'react';

const plans = [
    {
        name: 'Starter',
        description: 'Perfect for small teams getting started with ERP modules',
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: [
            'Access to core ERP modules (Finance, HR, Inventory)',
            'Basic dashboards and reports',
            'Community support',
            'Documentation and guides',
        ],
        cta: 'Get Started',
        popular: false,
    },
    {
        name: 'Professional',
        description: 'For growing businesses needing full ERP functionality',
        monthlyPrice: 49,
        yearlyPrice: 39,
        features: [
            'All Starter features, plus',
            'Advanced reporting and analytics',
            'Project management module',
            'Priority support',
            'Commercial use license',
            'Custom workflows',
        ],
        cta: 'Upgrade Now',
        popular: true,
        includesPrevious: 'All Starter features, plus',
    },
    {
        name: 'Enterprise',
        description: 'Custom solutions for large organizations',
        monthlyPrice: 499,
        yearlyPrice: 499,
        features: [
            'All Professional features, plus',
            'Dedicated account manager',
            'Private ERP instance',
            'Custom integrations',
            'VIP support and training',
            'Unlimited users',
        ],
        cta: 'Contact Sales',
        popular: false,
        includesPrevious: 'All Professional features, plus',
    },
];

export function PricingSection() {
    const [isYearly, setIsYearly] = useState(false);

    return (
        <section id="pricing" className="py-24 sm:py-32 bg-muted/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-2xl text-center mb-12">
                    <Badge variant="outline" className="mb-4">
                        Pricing Plans
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Choose your ERP plan
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Start with the Starter plan or upgrade to Professional or Enterprise for
                        full ERP features and dedicated support.
                    </p>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center mb-2">
                        <ToggleGroup
                            type="single"
                            value={isYearly ? 'yearly' : 'monthly'}
                            onValueChange={(value) => setIsYearly(value === 'yearly')}
                            className="bg-secondary text-secondary-foreground border-none rounded-full p-1 cursor-pointer shadow-none"
                        >
                            <ToggleGroupItem
                                value="monthly"
                                className="data-[state=on]:bg-background data-[state=on]:border-border border-transparent border px-6 !rounded-full data-[state=on]:text-foreground hover:bg-transparent cursor-pointer transition-colors"
                            >
                                Monthly
                            </ToggleGroupItem>
                            <ToggleGroupItem
                                value="yearly"
                                className="data-[state=on]:bg-background data-[state=on]:border-border border-transparent border px-6 !rounded-full data-[state=on]:text-foreground hover:bg-transparent cursor-pointer transition-colors"
                            >
                                Annually
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        <span className="text-primary font-semibold">Save 20%</span> On Annual
                        Billing
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="mx-auto max-w-6xl">
                    <div className="rounded-xl border">
                        <div className="grid lg:grid-cols-3">
                            {plans.map((plan, index) => (
                                <div
                                    key={index}
                                    className={`p-8 grid grid-rows-subgrid row-span-4 gap-6 ${
                                        plan.popular
                                            ? 'my-2 mx-4 rounded-xl bg-card border-transparent shadow-xl ring-1 ring-foreground/10 backdrop-blur'
                                            : ''
                                    }`}
                                >
                                    {/* Plan Header */}
                                    <div>
                                        <div className="text-lg font-medium tracking-tight mb-2">
                                            {plan.name}
                                        </div>
                                        <div className="text-muted-foreground text-sm">
                                            {plan.description}
                                        </div>
                                    </div>

                                    {/* Pricing */}
                                    <div>
                                        <div className="text-4xl font-bold mb-1">
                                            {plan.name === 'Enterprise'
                                                ? `$${plan.monthlyPrice}`
                                                : plan.monthlyPrice === 0
                                                ? '$0'
                                                : `$${
                                                      isYearly
                                                          ? plan.yearlyPrice
                                                          : plan.monthlyPrice
                                                  }`}
                                        </div>
                                        <div className="text-muted-foreground text-sm">
                                            {plan.name === 'Enterprise'
                                                ? 'Custom pricing'
                                                : 'Per month'}
                                        </div>
                                    </div>

                                    {/* CTA Button */}
                                    <div>
                                        <Button
                                            className={`w-full cursor-pointer my-2 ${
                                                plan.popular
                                                    ? 'shadow-md border-[0.5px] border-white/25 shadow-black/20 bg-primary ring-1 ring-primary/15 text-primary-foreground hover:bg-primary/90'
                                                    : 'shadow-sm shadow-black/15 border border-transparent bg-background ring-1 ring-foreground/10 hover:bg-muted/50'
                                            }`}
                                            variant={plan.popular ? 'default' : 'secondary'}
                                        >
                                            {plan.cta}
                                        </Button>
                                    </div>

                                    {/* Features */}
                                    <div>
                                        <ul role="list" className="space-y-3 text-sm">
                                            {plan.includesPrevious && (
                                                <li className="flex items-center gap-3 font-medium">
                                                    {plan.includesPrevious}:
                                                </li>
                                            )}
                                            {plan.features.map((feature, featureIndex) => (
                                                <li
                                                    key={featureIndex}
                                                    className="flex items-center gap-3"
                                                >
                                                    <Check
                                                        className="text-muted-foreground size-4 flex-shrink-0"
                                                        strokeWidth={2.5}
                                                    />
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Enterprise Note */}
                <div className="mt-16 text-center">
                    <p className="text-muted-foreground">
                        Need custom ERP modules or enterprise solutions?{' '}
                        <Button variant="link" className="p-0 h-auto cursor-pointer" asChild>
                            <a href="#contact">Contact our team</a>
                        </Button>
                    </p>
                </div>
            </div>
        </section>
    );
}
