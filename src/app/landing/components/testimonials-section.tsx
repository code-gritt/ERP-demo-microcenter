'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

type Testimonial = {
    name: string;
    role: string;
    image: string;
    quote: string;
};

const testimonials: Testimonial[] = [
    {
        name: 'Elena Martinez',
        role: 'Finance Manager',
        image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-1',
        quote: 'The ERP system has streamlined all our financial processes. Reporting, budgeting, and compliance are now effortless.',
    },
    {
        name: 'Mark Reynolds',
        role: 'Operations Lead',
        image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-1',
        quote: 'Inventory and supply chain management have never been this efficient. Real-time insights help us make better decisions daily.',
    },
    {
        name: 'Priya Desai',
        role: 'HR Director',
        image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-2',
        quote: 'Managing employee records and workflows is seamless. The HR module saves us hours every week and keeps everything organized.',
    },
    {
        name: 'Robert Kim',
        role: 'IT Manager',
        image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-2',
        quote: 'Deployment and integration were smooth. The platform fits perfectly with our existing tech stack and scales easily.',
    },
    {
        name: 'Maria Santos',
        role: 'Project Manager',
        image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-3',
        quote: 'Collaboration across teams has improved tremendously. Everyone has access to the same dashboards and data in real time.',
    },
    {
        name: 'Thomas Anderson',
        role: 'CEO',
        image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-3',
        quote: 'Our business operations are finally unified. This ERP solution has given us clarity, efficiency, and confidence in growth.',
    },
    {
        name: 'Lisa Chang',
        role: 'Customer Success Manager',
        image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-4',
        quote: 'We can track customer requests, manage workflows, and analyze trends with ease. Our response times and satisfaction scores have improved significantly.',
    },
    {
        name: 'Michael Foster',
        role: 'Supply Chain Analyst',
        image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-4',
        quote: 'Data-driven insights have improved our forecasting and inventory planning. This ERP system is a game-changer.',
    },
    {
        name: 'Sophie Laurent',
        role: 'Product Manager',
        image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-5',
        quote: 'We can coordinate product launches seamlessly. Everything from budgeting to resource allocation is fully integrated.',
    },
    {
        name: 'Daniel Wilson',
        role: 'Software Engineer',
        image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-5',
        quote: 'The modular architecture makes customizing workflows simple. Integration with other tools is smooth and well-documented.',
    },
    {
        name: 'Natasha Petrov',
        role: 'Operations Analyst',
        image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-6',
        quote: 'Reporting is automated and easy to visualize. I can create dashboards for any department without manual effort.',
    },
    {
        name: 'Carlos Rivera',
        role: 'Small Business Owner',
        image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-6',
        quote: 'As a non-technical founder, this ERP platform helped me manage operations, finance, and HR all in one place with confidence.',
    },
];

export function TestimonialsSection() {
    return (
        <section id="testimonials" className="py-24 sm:py-32">
            <div className="container mx-auto px-8 sm:px-6">
                {/* Section Header */}
                <div className="mx-auto max-w-2xl text-center mb-16">
                    <Badge variant="outline" className="mb-4">
                        Testimonials
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                        Hear from our ERP users
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Thousands of businesses trust our ERP platform to streamline operations,
                        enhance productivity, and grow with confidence.
                    </p>
                </div>

                {/* Testimonials Masonry Grid */}
                <div className="columns-1 gap-4 md:columns-2 md:gap-6 lg:columns-3 lg:gap-4">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="mb-6 break-inside-avoid shadow-none lg:mb-4">
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <Avatar className="bg-muted size-12 shrink-0">
                                        <AvatarImage
                                            alt={testimonial.name}
                                            src={testimonial.image}
                                            loading="lazy"
                                            width="120"
                                            height="120"
                                        />
                                        <AvatarFallback>
                                            {testimonial.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="min-w-0 flex-1">
                                        <a
                                            href="#"
                                            onClick={(e) => e.preventDefault()}
                                            className="cursor-pointer"
                                        >
                                            <h3 className="font-medium hover:text-primary transition-colors">
                                                {testimonial.name}
                                            </h3>
                                        </a>
                                        <span className="text-muted-foreground block text-sm tracking-wide">
                                            {testimonial.role}
                                        </span>
                                    </div>
                                </div>

                                <blockquote className="mt-4">
                                    <p className="text-sm leading-relaxed text-balance">
                                        {testimonial.quote}
                                    </p>
                                </blockquote>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
