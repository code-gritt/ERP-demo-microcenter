'use client';

import {
    BarChart3,
    Zap,
    Users,
    ArrowRight,
    Database,
    Package,
    Crown,
    Layout,
    Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Image3D } from '@/components/image-3d';

const mainFeatures = [
    {
        icon: Package,
        title: 'All-in-One ERP Modules',
        description:
            'Finance, HR, inventory, and project management in a single integrated platform.',
    },
    {
        icon: Crown,
        title: 'Flexible Plans',
        description:
            'Start with a free trial, scale up with premium features as your business grows.',
    },
    {
        icon: Layout,
        title: 'Ready-to-Use Workflows',
        description: 'Pre-configured processes that help teams get up and running quickly.',
    },
    {
        icon: Zap,
        title: 'Continuous Updates',
        description:
            'Regular improvements and new features to keep your ERP system modern and efficient.',
    },
];

const secondaryFeatures = [
    {
        icon: BarChart3,
        title: 'Real-Time Analytics',
        description:
            'Visualize your business data with dashboards and reports for faster decision-making.',
    },
    {
        icon: Palette,
        title: 'Intuitive Interface',
        description: 'Clean, modern UI designed for ease of use and efficient workflows.',
    },
    {
        icon: Users,
        title: 'Team Collaboration',
        description: 'Centralized platform for communication, approvals, and shared workflows.',
    },
    {
        icon: Database,
        title: 'Secure & Scalable',
        description: 'Built to protect your data and grow with your organization’s needs.',
    },
];

export function FeaturesSection() {
    return (
        <section id="features" className="py-24 sm:py-32 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <Badge variant="outline" className="mb-4">
                        ERP Demo Features
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Streamline your business operations
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Our ERP platform integrates finance, HR, inventory, and project management,
                        helping businesses collaborate efficiently and make data-driven decisions.
                    </p>
                </div>

                {/* First Feature Section */}
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16 mb-24">
                    {/* Left Image */}
                    <Image3D
                        lightSrc="feature-1-light.png"
                        darkSrc="feature-1-dark.png"
                        alt="ERP modules overview"
                        direction="left"
                    />
                    {/* Right Content */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                                ERP modules designed for growing businesses
                            </h3>
                            <p className="text-muted-foreground text-base">
                                Manage core business functions efficiently with pre-integrated
                                modules, workflows, and real-time insights.
                            </p>
                        </div>

                        <ul className="grid gap-4 sm:grid-cols-2">
                            {mainFeatures.map((feature, index) => (
                                <li
                                    key={index}
                                    className="group hover:bg-accent/5 flex items-start gap-3 p-2 rounded-lg transition-colors"
                                >
                                    <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                        <feature.icon
                                            className="size-5 text-primary"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-foreground font-medium">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground mt-1 text-sm">
                                            {feature.description}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4 pe-4 pt-2">
                            <Button size="lg" className="cursor-pointer">
                                <a href="/auth/sign-up" className="flex items-center">
                                    Try ERP Demo
                                    <ArrowRight className="ms-2 size-4" aria-hidden="true" />
                                </a>
                            </Button>
                            <Button size="lg" variant="outline" className="cursor-pointer">
                                <a href="#features">Explore Modules</a>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Second Feature Section - Flipped Layout */}
                <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8 xl:gap-16">
                    {/* Left Content */}
                    <div className="space-y-6 order-2 lg:order-1">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                                Built for efficient workflows and collaboration
                            </h3>
                            <p className="text-muted-foreground text-base">
                                Secure, scalable, and intuitive ERP system that empowers teams to
                                work together, track performance, and make smarter decisions.
                            </p>
                        </div>

                        <ul className="grid gap-4 sm:grid-cols-2">
                            {secondaryFeatures.map((feature, index) => (
                                <li
                                    key={index}
                                    className="group hover:bg-accent/5 flex items-start gap-3 p-2 rounded-lg transition-colors"
                                >
                                    <div className="mt-0.5 flex shrink-0 items-center justify-center">
                                        <feature.icon
                                            className="size-5 text-primary"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-foreground font-medium">
                                            {feature.title}
                                        </h3>
                                        <p className="text-muted-foreground mt-1 text-sm">
                                            {feature.description}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4 pe-4 pt-2">
                            <Button size="lg" className="cursor-pointer">
                                <a href="#contact" className="flex items-center">
                                    Request a Demo
                                    <ArrowRight className="ms-2 size-4" aria-hidden="true" />
                                </a>
                            </Button>
                            <Button size="lg" variant="outline" className="cursor-pointer">
                                <a href="/docs">View Documentation</a>
                            </Button>
                        </div>
                    </div>

                    {/* Right Image */}
                    <Image3D
                        lightSrc="feature-2-light.png"
                        darkSrc="feature-2-dark.png"
                        alt="ERP performance dashboard"
                        direction="right"
                        className="order-1 lg:order-2"
                    />
                </div>
            </div>
        </section>
    );
}
