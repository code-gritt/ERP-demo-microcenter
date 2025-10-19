'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CardDecorator } from '@/components/ui/card-decorator';
import { Code, Palette, Layout, Crown } from 'lucide-react';

const values = [
    {
        icon: Code,
        title: 'Comprehensive Modules',
        description:
            'Manage finance, HR, inventory, and projects seamlessly with our integrated ERP modules.',
    },
    {
        icon: Palette,
        title: 'Intuitive Design',
        description:
            'Modern interface designed for efficiency, clarity, and easy adoption across teams.',
    },
    {
        icon: Layout,
        title: 'Enterprise Ready',
        description:
            'Scalable and secure platform built to handle growing business needs reliably.',
    },
    {
        icon: Crown,
        title: 'Trusted Quality',
        description:
            'Proven performance and high user satisfaction with robust features and support.',
    },
];

export function AboutSection() {
    return (
        <section id="about" className="py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-4xl text-center mb-16">
                    <Badge variant="outline" className="mb-4">
                        About ERP Demo
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                        Streamline Your Business Operations
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Our all-in-one ERP platform simplifies finance, HR, inventory, and project
                        management, helping businesses collaborate efficiently and make data-driven
                        decisions in real time.
                    </p>
                </div>

                {/* Modern Values Grid */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4 mb-12">
                    {values.map((value, index) => (
                        <Card key={index} className="group shadow-xs py-2">
                            <CardContent className="p-8">
                                <div className="flex flex-col items-center text-center">
                                    <CardDecorator>
                                        <value.icon className="h-6 w-6" aria-hidden />
                                    </CardDecorator>
                                    <h3 className="mt-6 font-medium text-foreground">
                                        {value.title}
                                    </h3>
                                    <p className="text-muted-foreground mt-3 text-sm">
                                        {value.description}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Call to Action */}
                <div className="mt-16 text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <span className="text-muted-foreground">
                            🚀 Built to help growing businesses succeed
                        </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="cursor-pointer" asChild>
                            <a href="/auth/sign-up">Try ERP Demo</a>
                        </Button>
                        <Button size="lg" variant="outline" className="cursor-pointer" asChild>
                            <a href="#contact">Request a Demo</a>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
