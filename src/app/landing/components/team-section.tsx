'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CardDecorator } from '@/components/ui/card-decorator';
import { Github, Linkedin, Globe } from 'lucide-react';

const team = [
    {
        id: 1,
        name: 'Alice Morgan',
        role: 'Founder & CEO',
        description: 'Visionary leader driving ERP innovation, previously at SAP and Oracle.',
        image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?q=60&w=150&auto=format&fit=crop',
        fallback: 'AM',
        social: { linkedin: '#', github: '#', website: '#' },
    },
    {
        id: 2,
        name: 'Brian Lee',
        role: 'Head of Engineering',
        description: 'Leads development of scalable ERP solutions, ex-Stripe and Salesforce.',
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=60&w=150&auto=format&fit=crop',
        fallback: 'BL',
        social: { linkedin: '#', github: '#', website: '#' },
    },
    {
        id: 3,
        name: 'Carla Sanchez',
        role: 'Product Manager',
        description: 'Guides ERP module design and feature prioritization, previously at Workday.',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=60&w=150&auto=format&fit=crop',
        fallback: 'CS',
        social: { linkedin: '#', github: '#', website: '#' },
    },
    {
        id: 4,
        name: 'Daniel Wu',
        role: 'Frontend Engineer',
        description: 'Builds interactive ERP dashboards with React and TypeScript.',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=60&w=150&auto=format&fit=crop',
        fallback: 'DW',
        social: { linkedin: '#', github: '#', website: '#' },
    },
    {
        id: 5,
        name: 'Eva Thompson',
        role: 'Backend Engineer',
        description: 'Ensures ERP data integrity and scalability, ex-Clearbit backend lead.',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=60&w=150&auto=format&fit=crop',
        fallback: 'ET',
        social: { linkedin: '#', github: '#', website: '#' },
    },
    {
        id: 6,
        name: 'Franklin Kim',
        role: 'UX Designer',
        description: 'Designs intuitive ERP workflows and interfaces, former Figma designer.',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=60&w=150&auto=format&fit=crop',
        fallback: 'FK',
        social: { linkedin: '#', github: '#', website: '#' },
    },
    {
        id: 7,
        name: 'Grace Li',
        role: 'QA Engineer',
        description: 'Maintains quality and reliability across ERP modules.',
        image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?q=60&w=150&auto=format&fit=crop',
        fallback: 'GL',
        social: { linkedin: '#', github: '#', website: '#' },
    },
    {
        id: 8,
        name: 'Henry Patel',
        role: 'Customer Success Manager',
        description: 'Supports ERP clients with onboarding and adoption strategies.',
        image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=60&w=150&auto=format&fit=crop',
        fallback: 'HP',
        social: { linkedin: '#', github: '#', website: '#' },
    },
];

export function TeamSection() {
    return (
        <section id="team" className="py-24 sm:py-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-4xl text-center mb-16">
                    <Badge variant="outline" className="mb-4">
                        Our Team
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
                        Meet our ERP Experts
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        A dedicated team of engineers, designers, and product leaders committed to
                        building a seamless ERP experience for growing businesses.
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
                    {team.map((member) => (
                        <Card key={member.id} className="shadow-xs py-2">
                            <CardContent className="p-4">
                                <div className="text-center">
                                    {/* Avatar */}
                                    <div className="flex justify-center mb-4">
                                        <CardDecorator>
                                            <Avatar className="h-24 w-24 border shadow-lg">
                                                <AvatarImage
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="object-cover"
                                                />
                                                <AvatarFallback className="text-lg font-semibold">
                                                    {member.fallback}
                                                </AvatarFallback>
                                            </Avatar>
                                        </CardDecorator>
                                    </div>

                                    {/* Name and Role */}
                                    <h3 className="text-lg font-semibold text-foreground mb-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-sm font-medium text-primary mb-3">
                                        {member.role}
                                    </p>

                                    {/* Description */}
                                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                                        {member.description}
                                    </p>

                                    {/* Social Links */}
                                    <div className="flex items-center justify-center gap-3">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 cursor-pointer hover:text-primary"
                                            asChild
                                        >
                                            <a
                                                href={member.social.linkedin}
                                                rel="noopener noreferrer"
                                                aria-label={`${member.name} LinkedIn`}
                                            >
                                                <Linkedin className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 cursor-pointer hover:text-primary"
                                            asChild
                                        >
                                            <a
                                                href={member.social.github}
                                                rel="noopener noreferrer"
                                                aria-label={`${member.name} GitHub`}
                                            >
                                                <Github className="h-4 w-4" />
                                            </a>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 cursor-pointer hover:text-primary"
                                            asChild
                                        >
                                            <a
                                                href={member.social.website}
                                                rel="noopener noreferrer"
                                                aria-label={`${member.name} Website`}
                                            >
                                                <Globe className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
