
'use client';

import React, { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Кастомный знак (Острый крест / Opium)
function OpiumCross({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <polygon points="45,0 55,0 55,45 100,45 100,55 55,55 55,100 45,100 45,55 0,55 0,45 45,45" />
    </svg>
  );
}

// 3D Монохромный шум
function CartiParticles() {
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions] = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }

    return [pos];
  }, []);

  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015;
      pointsRef.current.rotation.x += delta * 0.008;
    }
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#ffffff"
          transparent
          opacity={0.35}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export default function Home() {
  const [calcLink, setCalcLink] = useState('');
  const [calcPrice, setCalcPrice] = useState<number | ''>(100);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'JPY'>('USD');
  const [region, setRegion] = useState('США');

  const rates = { USD: 92, EUR: 100, JPY: 0.62 };
  const numPrice = Number(calcPrice) || 0;
  const basePriceRub = numPrice * rates[currency];
  const feeRub = basePriceRub * 0.10;
  const estimatedDeliveryRub = numPrice > 0 ? 1500 : 0;
  const totalPriceRub = basePriceRub + feeRub + estimatedDeliveryRub;

  return (
    <div className="min-h-screen bg-[#000000] text-zinc-100 font-mono selection:bg-white selection:text-black relative overflow-hidden tracking-tighter">
      
      {/* ПРЕМИАЛЬНЫЕ ШРИФТЫ SYNE И UNIFRAKTURCOOK */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=UnifrakturCook:wght@700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      <style jsx global>{`
        .opium-font {
          font-family: 'UnifrakturCook', cursive, serif;
        }
        .modern-heading {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          letter-spacing: -0.03em;
        }
        .raw-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.04'/%3E%3C/svg%3E");
        }
      `}</style>

      {/* ЗЕРНИСТАЯ ТЕКСТУРА ПОВЕРХ ВСЕГО */}
      <div className="fixed inset-0 raw-noise pointer-events-none z-50 mix-blend-overlay" />

      {/* 3D ПОЛЕ ПАРТИКЛОВ */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-60">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <CartiParticles />
        </Canvas>
      </div>

      {/* СВЕТОВОЙ АКЦЕНТ */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.02] rounded-full blur-[140px] pointer-events-none z-0" />

      {/* СЕТКА */}
<div className="fixed inset-0 bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* ШАПКА */}
      <header className="border-b border-zinc-900 bg-black/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between text-xs tracking-widest uppercase">
          <div className="flex items-center gap-3">
            <OpiumCross className="w-3.5 h-3.5 text-white animate-pulse" />
            <span className="opium-font text-2xl tracking-normal text-white">
              DROPBRIDGE
            </span>
            <span className="text-[9px] text-zinc-600 font-mono tracking-tighter">версия 2.06</span>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-[10px] text-zinc-400 font-bold">
            <a href="#calculator" className="hover:text-white transition-colors duration-150">[ КАЛЬКУЛЯТОР ]</a>
            <a href="#process" className="hover:text-white transition-colors duration-150">[ ПОРЯДОК РАБОТЫ ]</a>
            <a href="#about" className="hover:text-white transition-colors duration-150">[ О СЕРВИСЕ ]</a>
          </nav>

          <button className="px-4 py-2 text-[10px] uppercase font-bold bg-white text-black hover:bg-zinc-200 transition-colors border border-white">
            ЗАКАЗАТЬ ВЫКУП
          </button>
        </div>
      </header>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-28">
        
        {/* ИНДИКАТОР */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-3 px-3 py-1 bg-black border border-zinc-800 text-[10px] uppercase text-zinc-400 tracking-[0.25em]">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            <span>ПЛАТФОРМА СОПРОВОЖДЕНИЯ ВЫКУПА</span>
          </div>
        </div>

        {/* АКУРАТНЫЙ СТИЛЬНЫЙ ЗАГОЛОВОК */}
        <div className="text-center space-y-3">
          <h1 className="modern-heading text-3xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-tight">
            Зарубежные Байеры
          </h1>
          <div className="flex items-center justify-center gap-4 py-1">
            <div className="h-[1px] w-8 bg-zinc-800" />
            <span className="opium-font text-2xl sm:text-3xl text-zinc-500">и</span>
            <div className="h-[1px] w-8 bg-zinc-800" />
          </div>
          <h2 className="modern-heading text-2xl sm:text-4xl md:text-5xl text-zinc-400 uppercase tracking-tight leading-tight">
            Прозрачный Сервис
          </h2>
        </div>

        {/* БЕЗОПАСНЫЙ ПОДЗАГОЛОВОК */}
        <p className="mt-8 text-xs text-zinc-400 max-w-lg mx-auto text-center font-mono leading-relaxed tracking-normal uppercase border-x border-zinc-900 px-6 py-2">
          Единый информационный центр для координации сделок с зарубежными байерами. Поэтапный контроль, фотофиксация товаров и трекинг доставки.
        </p>

        {/* ТЕХНИЧЕСКАЯ СТРОКА */}
        <div className="mt-10 flex items-center justify-between text-[9px] text-zinc-600 border-y border-zinc-900 py-2 uppercase tracking-widest">
          <div>СТАТУС: АКТИВЕН</div>
          <div className="hidden sm:block">ПРОВЕРКА: ПОЭТАПНАЯ</div>
          <div>ДОСТАВКА: МЕЖДУНАРОДНАЯ</div>
        </div>

        {/* КАЛЬКУЛЯТОР */}
        <div id="calculator" className="mt-8 bg-black border border-zinc-800 p-6 sm:p-10 relative">
          
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-white" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-white" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white" />
<div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-900">
            <h2 className="text-xs uppercase tracking-[0.2em] text-white flex items-center gap-2 font-bold">
              <OpiumCross className="w-3 h-3 text-white" /> [ РАСЧЕТ_РАСХОДОВ // 01 ]
            </h2>
            <span className="text-[10px] text-zinc-600">ОРИЕНТИРОВОЧНЫЙ_КУРС</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-[10px] text-zinc-500 mb-2 uppercase tracking-widest font-bold">
                01. РЕГИОН ОТПРАВКИ
              </label>
              <select 
                value={region} 
                onChange={(e) => {
                  const val = e.target.value;
                  setRegion(val);
                  if (val === 'США') setCurrency('USD');
                  if (val === 'Европа') setCurrency('EUR');
                  if (val === 'Япония') setCurrency('JPY');
                }}
                className="w-full bg-black border border-zinc-800 rounded-none px-4 py-3 text-xs text-white uppercase focus:outline-none focus:border-white transition-colors"
              >
                <option value="США">США (USD)</option>
                <option value="Европа">ЕВРОПА (EUR)</option>
                <option value="Япония">ЯПОНИЯ (JPY)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-zinc-500 mb-2 uppercase tracking-widest font-bold">
                02. СТОИМОСТЬ ({currency})
              </label>
              <input 
                type="number" 
                placeholder="100" 
                value={calcPrice}
                onChange={(e) => setCalcPrice(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-black border border-zinc-800 rounded-none px-4 py-3 text-xs text-white placeholder-zinc-800 uppercase focus:outline-none focus:border-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] text-zinc-500 mb-2 uppercase tracking-widest font-bold">
                03. ССЫЛКА НА ЛОТ
              </label>
              <input 
                type="text" 
                placeholder="HTTPS://..." 
                value={calcLink}
                onChange={(e) => setCalcLink(e.target.value)}
                className="w-full bg-black border border-zinc-800 rounded-none px-4 py-3 text-xs text-white placeholder-zinc-800 uppercase focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          {/* ИТОГОВАЯ СМЕТА */}
          <div className="border border-zinc-900 bg-zinc-950/80 p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs mb-8">
            <div className="border-r border-zinc-900 pr-2">
              <div className="text-zinc-600 mb-1 text-[9px] uppercase tracking-widest">ТОВАР</div>
              <div className="font-bold text-zinc-300">{basePriceRub.toLocaleString('ru-RU')} ₽</div>
            </div>
            <div className="border-r border-zinc-900 pr-2">
              <div className="text-zinc-600 mb-1 text-[9px] uppercase tracking-widest">АГЕНТСКАЯ КОМИССИЯ</div>
              <div className="font-bold text-zinc-300">{feeRub.toLocaleString('ru-RU')} ₽</div>
            </div>
            <div className="border-r border-zinc-900 pr-2">
              <div className="text-zinc-600 mb-1 text-[9px] uppercase tracking-widest">РАСЧЕТНАЯ ДОСТАВКА</div>
              <div className="font-bold text-zinc-300">{estimatedDeliveryRub.toLocaleString('ru-RU')} ₽</div>
            </div>
            <div>
              <div className="text-white mb-1 text-[9px] uppercase tracking-widest font-bold">ОРИЕНТИРОВОЧНЫЙ ИТОГ</div>
              <div className="text-base font-black text-white tracking-tight">
{totalPriceRub.toLocaleString('ru-RU')} ₽
              </div>
            </div>
          </div>

          <button className="w-full py-5 bg-white text-black hover:bg-zinc-200 uppercase font-black tracking-[0.2em] text-sm transition-all rounded-none flex items-center justify-center gap-3">
            <OpiumCross className="w-4 h-4 text-black" />
            <span>Отправить Запрос</span>
            <OpiumCross className="w-4 h-4 text-black" />
          </button>

        </div>

        {/* БЛОК ПОРЯДОК РАБОТЫ */}
        <div id="process" className="mt-16 border-t border-zinc-900 pt-12">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400 mb-8 flex items-center gap-2">
            <OpiumCross className="w-3 h-3 text-white" /> ПОРЯДОК РАБОТЫ // ЭТАПЫ
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            <div className="border border-zinc-900 p-5 bg-zinc-950/40">
              <span className="text-[10px] text-zinc-600 font-mono block mb-2">01 / ЗАЯВКА</span>
              <h4 className="font-bold text-white mb-1 uppercase">Расчет и Согласование</h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Вы отправляете ссылку на позицию. Менеджер проверяет доступность товара у байера и уточняет итоговую стоимость.
              </p>
            </div>

            <div className="border border-zinc-900 p-5 bg-zinc-950/40">
              <span className="text-[10px] text-zinc-600 font-mono block mb-2">02 / ВЫКУП</span>
              <h4 className="font-bold text-white mb-1 uppercase">Приобретение и Фотоотчет</h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Байер выкупает позицию, принимает её на складе и предоставляет детальные фото для подтверждения параметров.
              </p>
            </div>

            <div className="border border-zinc-900 p-5 bg-zinc-950/40">
              <span className="text-[10px] text-zinc-600 font-mono block mb-2">03 / ЛОГИСТИКА</span>
              <h4 className="font-bold text-white mb-1 uppercase">Отправка и Трекинг</h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Товар передается в международную логистическую службу. Вам предоставляется номер для отслеживания посылки.
              </p>
            </div>
          </div>
        </div>

      </main>

      <footer className="border-t border-zinc-900 py-10 text-center text-[10px] text-zinc-600 uppercase tracking-[0.3em] relative z-10 flex flex-col items-center gap-3">
        <OpiumCross className="w-3 h-3 text-zinc-700" />
        <div>DROPBRIDGE // ИНФОРМАЦИОННО-АГЕНТСКИЙ СЕРВИС</div>
      </footer>
    </div>
  );
}