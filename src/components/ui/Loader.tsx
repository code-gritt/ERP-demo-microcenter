export function LoaderSpinner() {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                backdropFilter: 'blur(6px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <div
                style={{ position: 'relative', width: '3.75em', aspectRatio: '1' }}
                className="loader"
            ></div>

            <style>{`
                .loader {
                    --color1: #3498db;
                    --color2: #e74c3c;
                    position: relative;
                    animation: spin 10000ms infinite linear;
                }

                .loader::before,
                .loader::after {
                    content: "";
                    position: absolute;
                    background: var(--color1);
                    animation: squeeze 3000ms infinite;
                }

                .loader::after {
                    background: var(--color2);
                    animation-delay: -1.25s;
                    border-radius: 50px;
                }

                @keyframes squeeze {
                    0% { inset: 0 2em 2em 0; }
                    12.5% { inset: 0 2em 0 0; }
                    25% { inset: 2em 2em 0 0; }
                    37.5% { inset: 2em 0 0 0; }
                    50% { inset: 2em 0 0 2em; }
                    62.5% { inset: 0 0 0 2em; }
                    75% { inset: 0 0 2em 2em; }
                    87.5% { inset: 0 0 2em 0; }
                    100% { inset: 0 2em 2em 0; }
                }

                @keyframes spin {
                    to { transform: rotate(-360deg); }
                }
            `}</style>
        </div>
    );
}
