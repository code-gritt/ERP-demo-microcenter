'use client';

import { ArrowRight, Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DotPattern } from '@/components/dot-pattern';
import { getAppUrl } from '@/lib/utils';

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-background to-background/80 pt-20 sm:pt-32 pb-16">
            {/* Background Pattern */}
            <div className="absolute inset-0">
                <DotPattern className="opacity-100" size="md" fadeStyle="ellipse" />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="mx-auto max-w-4xl text-center">
                    {/* Announcement Badge */}
                    <div className="mb-8 flex justify-center">
                        <Badge variant="outline" className="px-4 py-2 border-foreground">
                            <Star className="w-3 h-3 mr-2 fill-current" />
                            New: ERP Cloud Demo
                            <ArrowRight className="w-3 h-3 ml-2" />
                        </Badge>
                    </div>

                    {/* Main Headline */}
                    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                        Streamline Your
                        <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            {' '}
                            Business Operations{' '}
                        </span>
                        with Our All-in-One ERP Platform
                    </h1>

                    {/* Subheading */}
                    <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                        Simplify finance, HR, inventory, and projects in one place. Experience
                        real-time insights, automation, and collaboration with a modern ERP system
                        built for growing businesses.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Button size="lg" className="text-base cursor-pointer" asChild>
                            <a href={getAppUrl('/auth/sign-up')}>
                                Try ERP Demo
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </a>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-base cursor-pointer"
                            asChild
                        >
                            <a href="#">
                                <Play className="mr-2 h-4 w-4" />
                                Watch Overview
                            </a>
                        </Button>
                    </div>
                </div>

                {/* Hero Image/Visual */}
                <div className="mx-auto mt-20 max-w-6xl">
                    <div className="relative group">
                        <div className="absolute top-2 lg:-top-8 left-1/2 transform -translate-x-1/2 w-[90%] mx-auto h-24 lg:h-80 bg-primary/50 rounded-full blur-3xl"></div>

                        <div className="relative rounded-xl border bg-card shadow-2xl">
                            <video
                                className="w-full rounded-xl object-cover"
                                autoPlay
                                loop
                                muted
                                playsInline
                            >
                                <source src="/erp.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
