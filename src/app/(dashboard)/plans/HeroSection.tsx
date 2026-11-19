'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '@iconify/react';

export default function HeroSection() {
    const [mousePercent, setMousePercent] = useState({ x: 0, y: 0 });
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (rafRef.current) return;
            rafRef.current = requestAnimationFrame(() => {
                setMousePercent({
                    x: (e.clientX / window.innerWidth) - 0.5,
                    y: (e.clientY / window.innerHeight) - 0.5,
                });
                rafRef.current = null;
            });
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const transformCard1 = `translate(${mousePercent.x * -35}px, ${mousePercent.y * -35}px)`;
    const transformCard2 = `translate(${mousePercent.x * 30}px, ${mousePercent.y * 30}px)`;

    return (
        <main
            className="group relative overflow-hidden bg-[var(--bg-primary)] min-h-[640px] flex items-center select-none"
            style={{ willChange: 'transform' }}
        >
            <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px',
                }}
            />

            <div
                className="absolute inset-0 opacity-[0.015] pointer-events-none"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #000 1px, transparent 1px),
                        linear-gradient(to bottom, #000 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px'
                }}
            />

            <div
                className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full blur-[90px] pointer-events-none opacity-[0.06]"
                style={{ backgroundImage: 'radial-gradient(circle, var(--brand-primary), transparent 75%)' }}
            />
            <div
                className="absolute -bottom-20 -left-20 w-[450px] h-[450px] rounded-full blur-[90px] pointer-events-none opacity-[0.04]"
                style={{ backgroundImage: 'radial-gradient(circle, var(--brand-primary-light), transparent 75%)' }}
            />

            <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_90%_at_50%_50%,transparent_40%,var(--bg-primary)_100%)] pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[var(--bg-primary)] pointer-events-none" />

            <div
                className="absolute top-[22%] left-[5%] hidden lg:block bg-[var(--bg-card)]/60 border border-[var(--border-color)]/60 backdrop-blur-md rounded-2xl px-5 py-4 transition-transform duration-500 ease-out shadow-[0_12px_40px_-12px_rgba(0,0,0,0.05)] z-20"
                style={{ transform: transformCard1 }}
            >
                <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">Propiedades activas</p>
                <p className="text-[22px] font-black text-[var(--text-primary)] tracking-tight">12,480+</p>
                <p className="text-xs font-bold mt-1 text-emerald-600 flex items-center gap-1">
                    <span>↑ 18%</span> <span className="text-[var(--text-muted)] font-normal">este mes</span>
                </p>
            </div>

            <div
                className="absolute bottom-[24%] right-[5%] hidden lg:block bg-[var(--bg-card)]/60 border border-[var(--border-color)]/60 backdrop-blur-md rounded-2xl px-5 py-4 transition-transform duration-500 ease-out shadow-[0_12px_40px_-12px_rgba(0,0,0,0.05)] z-20"
                style={{ transform: transformCard2 }}
            >
                <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-1">Agentes activos</p>
                <p className="text-[22px] font-black text-[var(--text-primary)] tracking-tight">3,240</p>
                <p className="text-xs font-bold mt-1 text-emerald-600 flex items-center gap-1">
                    <span>↑ 24%</span> <span className="text-[var(--text-muted)] font-normal">este año</span>
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-24 relative z-20 w-full">
                <div className="text-center max-w-4xl mx-auto">

                    <div
                        className="inline-flex items-center gap-2.5 border text-sm font-bold mb-8 px-5 py-2.5 rounded-full backdrop-blur-sm shadow-sm transition-all hover:scale-105 duration-300"
                        style={{
                            backgroundColor: 'var(--brand-primary-light)',
                            borderColor: 'var(--brand-primary)',
                            color: 'var(--brand-primary)'
                        }}
                    >
                        <Icon icon="material-symbols:stars-rounded" className="w-5 h-5" />
                        <span>Planes flexibles para tu negocio</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-[76px] font-black text-[var(--text-primary)] mb-7 leading-[1.05] tracking-tighter">
                        Impulsa tu <br />
                        <span
                            className="bg-clip-text text-transparent bg-gradient-to-r"
                            style={{
                                backgroundImage: 'linear-gradient(to right, var(--brand-primary), var(--brand-primary-light), #10b981)'
                            }}
                        >
                            Negocio Inmobiliario
                        </span>
                    </h1>

                    <p className="text-xl text-[var(--text-secondary)] mb-12 leading-relaxed max-w-2xl mx-auto font-medium">
                        Publica propiedades, alcanza más clientes y haz crecer tu negocio con los planes más flexibles del mercado peruano
                    </p>

                    <div className="flex flex-wrap justify-center items-center gap-4 text-sm">
                        {[
                            { icon: "material-symbols:check-circle-rounded", label: "Cancela cuando quieras" },
                            { icon: "material-symbols:support-agent-rounded", label: "Soporte 24/7" },
                            { icon: "material-symbols:security-rounded", label: "Pagos seguros" },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center gap-2.5 bg-[var(--bg-card)] border border-[var(--border-color)]/80 px-6 py-3 rounded-full text-[var(--text-secondary)] font-bold hover:border-[var(--border-color)] hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all duration-200 cursor-default">
                                <Icon icon={item.icon} className="w-5 h-5" style={{ color: 'var(--brand-primary)' }} />
                                <span>{item.label}</span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </main>
    );
}
