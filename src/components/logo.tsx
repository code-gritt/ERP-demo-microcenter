import * as React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    color?: string;
}

export function Logo({ size = 64, color = '#3600FF', className, ...props }: LogoProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <circle cx="50" cy="22" r="12" fill={color} />
            <circle cx="28" cy="70" r="12" fill={color} />
            <circle cx="72" cy="70" r="12" fill={color} />
            <circle cx="50" cy="50" r="6" fill={color} />
        </svg>
    );
}
