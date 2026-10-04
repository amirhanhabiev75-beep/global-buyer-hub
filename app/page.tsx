'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { supabase } from '@/lib/supabase';
// Иконка Opium Cross
function OpiumCross({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="currentColor">
      <polygon points="45,0 55,0 55,45 100,45 100,55 55,55 55,100 45,100 45,55 0,55 0,45 45,45" />
    </svg>
  );
}

// 3D Фон (Звезды)
function StarParticles() {
  const pointsRef = useRef<THREE.Points>(null!);
  const [positions] = useMemo(() => {
    const count = 3500;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return [pos];
  }, []);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
      pointsRef.current.rotation.x += delta * 0.005;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.025} color="#ffffff" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

// КАТАЛОГ: ПО 15 ТОВАРОВ В КАЖДОМ МАГАЗИНЕ
const SHOPS = {
  datybae: {
    title: '«ДАТЫБАЕ»',
    desc: 'ПОДПОЛЬНЫЙ КИТАЙ // БЫСТРАЯ ДОСТАВКА (5-10 сек)',
    deliverySpeed: 'БЫСТРАЯ (5-10 с)',
    minDelivery: 5,
    maxDelivery: 10,
    items: [
      { id: 'd1', name: 'Travis Scott AJ1 Low (Poizon)', category: 'Обувь', buyPrice: 35, stock: 8, icon: '👟' },
      { id: 'd2', name: 'Yeezy Boost 350 V2 Onyx', category: 'Обувь', buyPrice: 30, stock: 10, icon: '👟' },
      { id: 'd3', name: 'Rick Owens Ramones Fake', category: 'Обувь', buyPrice: 50, stock: 5, icon: '👟' },
      { id: 'd4', name: 'New Balance 1906R Protection', category: 'Обувь', buyPrice: 40, stock: 7, icon: '👟' },
      { id: 'd5', name: 'Adidas Campus 00s Core Black', category: 'Обувь', buyPrice: 25, stock: 12, icon: '👟' },
      { id: 'd6', name: 'Vetements Metal Tee Fake', category: 'Одежда', buyPrice: 20, stock: 15, icon: '👕' },
      { id: 'd7', name: 'Hellstar Capsule Hoodie', category: 'Одежда', buyPrice: 28, stock: 9, icon: '🧥' },
      { id: 'd8', name: 'Denim Tears Cotton Pants', category: 'Одежда', buyPrice: 32, stock: 6, icon: '👖' },
      { id: 'd9', name: 'Stussy World Tour Tee', category: 'Одежда', buyPrice: 15, stock: 14, icon: '👕' },
      { id: 'd10', name: 'Syna World Tracksuit Replica', category: 'Одежда', buyPrice: 45, stock: 5, icon: '🧥' },
      { id: 'd11', name: 'Chrome Hearts Ring (Alloy)', category: 'Аксессуары', buyPrice: 12, stock: 20, icon: '💍' },
      { id: 'd12', name: 'Stussy Stock Logo Beanie', category: 'Аксессуары', buyPrice: 10, stock: 18, icon: '🧢' },
      { id: 'd13', name: 'MCM Stark Backpack Fake', category: 'Аксессуары', buyPrice: 40, stock: 4, icon: '🎒' },
      { id: 'd14', name: 'Oakley Gascan Replica Glasses', category: 'Аксессуары', buyPrice: 14, stock: 10, icon: '🕶️' },
      { id: 'd15', name: 'Trapstar Irongate Bag', category: 'Аксессуары', buyPrice: 18, stock: 11, icon: '👜' },
    ]
  },
  itachi: {
    title: '«ИТАЧИ»',
    desc: 'ТЕНЕВОЙ РЫНОК // СРЕДНЯЯ ДОСТАВКА (15-25 сек)',
    deliverySpeed: 'СРЕДНЯЯ (15-25 с)',
    minDelivery: 15,
    maxDelivery: 25,
    items: [
      { id: 'i1', name: 'Legit Jordan 1 High OG', category: 'Обувь', buyPrice: 180, stock: 5, icon: '👟' },
      { id: 'i2', name: 'Nike Dunk Low Panda Store', category: 'Обувь', buyPrice: 110, stock: 8, icon: '👟' },
      { id: 'i3', name: 'Bape Sta Low Black Camo', category: 'Обувь', buyPrice: 240, stock: 4, icon: '👟' },
      { id: 'i4', name: 'Asics Gel-Kayano 14 Kith', category: 'Обувь', buyPrice: 210, stock: 5, icon: '👟' },
{ id: 'i5', name: 'Travis Scott Jumpman Jack', category: 'Обувь', buyPrice: 310, stock: 3, icon: '👟' },
      { id: 'i6', name: 'Supreme Box Logo Hoodie', category: 'Одежда', buyPrice: 220, stock: 4, icon: '🧥' },
      { id: 'i7', name: 'Sp5der Worldwide Pink Hoodie', category: 'Одежда', buyPrice: 190, stock: 6, icon: '🧥' },
      { id: 'i8', name: 'Corteiz Alcatraz Cargo', category: 'Одежда', buyPrice: 140, stock: 6, icon: '👖' },
      { id: 'i9', name: 'Palace Gore-Tex Jacket', category: 'Одежда', buyPrice: 280, stock: 3, icon: '🧥' },
      { id: 'i10', name: 'Arc\'teryx Beta LT Jacket', category: 'Одежда', buyPrice: 350, stock: 4, icon: '🧥' },
      { id: 'i11', name: 'Supreme Canvas Backpack', category: 'Аксессуары', buyPrice: 130, stock: 5, icon: '🎒' },
      { id: 'i12', name: 'Oakley Radar EV Sunglasses', category: 'Аксессуары', buyPrice: 95, stock: 7, icon: '🕶️' },
      { id: 'i13', name: 'Bape Shark Mask Black', category: 'Аксессуары', buyPrice: 65, stock: 9, icon: '🎭' },
      { id: 'i14', name: 'Kaws Companion Vinyl Figure', category: 'Коллекция', buyPrice: 280, stock: 3, icon: '🗿' },
      { id: 'i15', name: 'Supreme Skateboard Deck', category: 'Коллекция', buyPrice: 120, stock: 5, icon: '🛹' },
    ]
  },
  arigato: {
    title: '«АРИГАТО ГОДЗАИМАС»',
    desc: 'ЭЛИТНЫЙ АРХИВ // ДОЛГАЯ ДОСТАВКА (35-50 сек)',
    deliverySpeed: 'ДОЛГАЯ (35-50 с)',
    minDelivery: 35,
    maxDelivery: 50,
    items: [
      { id: 'a1', name: 'Rick Owens Geobasket OG', category: 'Обувь', buyPrice: 750, stock: 3, icon: '👟' },
      { id: 'a2', name: 'Balenciaga Cargo Sneaker', category: 'Обувь', buyPrice: 920, stock: 3, icon: '👟' },
      { id: 'a3', name: 'Maison Margiela Tabi Boots', category: 'Обувь', buyPrice: 800, stock: 2, icon: '👢' },
      { id: 'a4', name: 'Rick Owens Jumbo Lace Padded', category: 'Обувь', buyPrice: 880, stock: 2, icon: '👟' },
      { id: 'a5', name: 'Balenciaga Defender Tire', category: 'Обувь', buyPrice: 850, stock: 3, icon: '👟' },
      { id: 'a6', name: 'Raf Simons Riot Bomber 2001', category: 'Одежда', buyPrice: 2500, stock: 1, icon: '🧥' },
      { id: 'a7', name: 'Chrome Hearts Custom Leather', category: 'Одежда', buyPrice: 3200, stock: 1, icon: '🧥' },
      { id: 'a8', name: 'Number (N)ine Fender Tee', category: 'Одежда', buyPrice: 450, stock: 3, icon: '👕' },
      { id: 'a9', name: 'Undercover Scab Jeans 2003', category: 'Одежда', buyPrice: 1200, stock: 1, icon: '👖' },
      { id: 'a10', name: 'Helmut Lang Astro Jacket 1999', category: 'Одежда', buyPrice: 1600, stock: 1, icon: '🧥' },
      { id: 'a11', name: 'Chrome Hearts Silver Chain', category: 'Аксессуары', buyPrice: 1100, stock: 2, icon: '📿' },
      { id: 'a12', name: 'Alyx Rollercoaster Belt', category: 'Аксессуары', buyPrice: 280, stock: 4, icon: '🎗️' },
      { id: 'a13', name: 'Chrome Hearts Sunglasses', category: 'Аксессуары', buyPrice: 850, stock: 2, icon: '🕶' },
      { id: 'a14', name: 'Murakami Flower Cushion 1m', category: 'Коллекция', buyPrice: 600, stock: 3, icon: '🌸' },
      { id: 'a15', name: 'Bearbrick 1000% Readymade', category: 'Коллекция', buyPrice: 1800, stock: 1, icon: '🧸' },
    ]
  }
};

interface InventoryItem {
  instanceId: string;
  name: string;
  icon: string;
  buyPrice: number;
  deliveryTimeLeft: number;
  isListed: boolean;
  askingPrice?: number;
  sellTimeLeft?: number;
  tooExpensive?: boolean;
}

export default function GameOnline() {
  const [role, setRole] = useState<'P1' | 'P2' | null>(null);
  const [timeLeft, setTimeLeft] = useState(1200);
  const [gameActive, setGameActive] = useState(false);
  const [activeTab, setActiveTab] = useState<'datybae' | 'itachi' | 'arigato'>('datybae');

  // Модалка выставления цен
  const [selectedItemToSell, setSelectedItemToSell] = useState<InventoryItem | null>(null);
  const [inputPrice, setInputPrice] = useState<number>(0);

  // Игроки
  const [p1, setP1] = useState({ name: 'Игрок 1', money: 150, inv: [] as InventoryItem[] });
const [p2, setP2] = useState({ name: 'Игрок 2', money: 150, inv: [] as InventoryItem[] });
// Функция сохранения состояния в Supabase
  const saveGameState = async (updatedP1 = p1, updatedP2 = p2) => {
    try {
      const { error } = await supabase
        .from('game_state')
        .upsert({
          id: 'default_room',
          data: { p1: updatedP1, p2: updatedP2 },
          updated_at: new Date().toISOString(),
        });

      if (error) console.error('Ошибка сохранения в Supabase:', error.message);
    } catch (err) {
      console.error('Ошибка сети/Supabase:', err);
    }
  };
  useEffect(() => {
    const loadInitialState = async () => {
      const { data } = await supabase
        .from('game_state')
        .select('data')
        .eq('id', 'default_room')
        .single();

      if (data?.data) {
        if (data.data.p1) setP1(data.data.p1);
        if (data.data.p2) setP2(data.data.p2);
      }
    };

    loadInitialState();

    const channel = supabase
      .channel('game_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'game_state' },
        (payload) => {
          if (payload.new && payload.new.data) {
            if (payload.new.data.p1) setP1(payload.new.data.p1);
            if (payload.new.data.p2) setP2(payload.new.data.p2);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  // Остатки в магазине
  const [marketStock, setMarketStock] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    Object.values(SHOPS).forEach(shop => {
      shop.items.forEach(item => {
        initial[item.id] = item.stock;
      });
    });
    return initial;
  });

  // Таймер доставки и продажи
  useEffect(() => {
    if (!gameActive) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));

      const processPlayerInv = (playerState: typeof p1) => {
        let earnedMoney = 0;
        const updatedInv: InventoryItem[] = [];

        playerState.inv.forEach(item => {
          let updatedItem = { ...item };

          // 1. Уменьшаем таймер доставки
          if (updatedItem.deliveryTimeLeft > 0) {
            updatedItem.deliveryTimeLeft = Math.max(0, updatedItem.deliveryTimeLeft - 1);
          }

          // 2. Уменьшаем таймер покупки покупателем
          if (updatedItem.isListed && updatedItem.sellTimeLeft !== undefined && !updatedItem.tooExpensive) {
            if (updatedItem.sellTimeLeft > 1) {
              updatedItem.sellTimeLeft -= 1;
              updatedInv.push(updatedItem);
            } else {
              // Товар успешно куплен!
              earnedMoney += updatedItem.askingPrice || 0;
            }
          } else {
            updatedInv.push(updatedItem);
          }
        });

        return {
          ...playerState,
          money: playerState.money + earnedMoney,
          inv: updatedInv
        };
      };

      setP1(prev => processPlayerInv(prev));
      setP2(prev => processPlayerInv(prev));

    }, 1000);

    return () => clearInterval(timer);
  }, [gameActive]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const buyItem = (playerRole: 'P1' | 'P2', item: any) => {
    const currentStock = marketStock[item.id] || 0;
    if (currentStock <= 0) return;

    const shopConfig = SHOPS[activeTab];
    const deliverySec = Math.floor(
      Math.random() * (shopConfig.maxDelivery - shopConfig.minDelivery + 1)
    ) + shopConfig.minDelivery;

    const newItem: InventoryItem = {
      instanceId: Math.random().toString(),
      name: item.name,
      icon: item.icon,
      buyPrice: item.buyPrice,
      deliveryTimeLeft: deliverySec,
      isListed: false
    };

    if (playerRole === 'P1') {
      if (p1.money >= item.buyPrice) {
        setP1({ ...p1, money: p1.money - item.buyPrice, inv: [...p1.inv, newItem] });
        setMarketStock(prev => ({ ...prev, [item.id]: prev[item.id] - 1 }));
      }
    } else {
      if (p2.money >= item.buyPrice) {
        setP2({ ...p2, money: p2.money - item.buyPrice, inv: [...p2.inv, newItem] });
        setMarketStock(prev => ({ ...prev, [item.id]: prev[item.id] - 1 }));
      }
    }
  };

  const listForSale = () => {
    if (!selectedItemToSell || inputPrice <= 0 || !role) return;
 supabase.channel('resell-game-room').send({
    type: 'broadcast',
    event: 'slot_action',
    payload: { action: 'list', price: inputPrice, item: selectedItemToSell },
  });
  const buyP = selectedItemToSell.buyPrice;
  const markupRatio = (inputPrice - buyP) / buyP; // Наценка
    let sellDuration = 0;
    let isTooExpensive = false;

    if (markupRatio <= 0.20) {
      // 20% наценка -> 10-15 сек
      sellDuration = Math.floor(Math.random() * 6) + 10;
    } else if (markupRatio <= 0.35) {
      // 30% наценка -> 20-25 сек
      sellDuration = Math.floor(Math.random() * 6) + 20;
    } else if (markupRatio <= 0.50) {
      // 40-50% наценка -> 40-60 сек
      sellDuration = Math.floor(Math.random() * 21) + 40;
    } else {
      // Слишком дорого -> Покупатели игнорируют
      isTooExpensive = true;
    }

    const updateInv = (invList: InventoryItem[]) =>
      invList.map(item => {
        if (item.instanceId === selectedItemToSell.instanceId) {
          return {
            ...item,
            isListed: true,
askingPrice: inputPrice,
            sellTimeLeft: sellDuration,
            tooExpensive: isTooExpensive
          };
        }
        return item;
      });

    if (role === 'P1') {
      setP1(prev => ({ ...prev, inv: updateInv(prev.inv) }));
    } else {
      setP2(prev => ({ ...prev, inv: updateInv(prev.inv) }));
    }

    setSelectedItemToSell(null);
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-[#030303] text-white font-mono flex flex-col items-center justify-center p-6">
        <OpiumCross className="w-12 h-12 mb-6 animate-pulse"/>
        <h1 className="text-2xl font-black mb-2 tracking-widest text-center">RESELL_90S // DUAL_ONLINE</h1>
        <p className="text-xs text-zinc-500 mb-8 text-center max-w-md">
          ВЫБЕРИТЕ СВОЙ СЛОТ ДЛЯ ОНЛАЙН СЕССИИ:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">
          <button
            onClick={() => setRole('P1')}
            className="border border-zinc-700 bg-zinc-950 hover:bg-white hover:text-black transition-all p-6 text-left"
          >
            <div className="text-xs text-zinc-500">СЛОТ 01</div>
            <div className="text-xl font-black mt-1">ИГРОК: Игрок 1</div>
          </button>

          <button
            onClick={() => setRole('P2')}
            className="border border-zinc-700 bg-zinc-950 hover:bg-white hover:text-black transition-all p-6 text-left"
          >
            <div className="text-xs text-zinc-500">СЛОТ 02</div>
            <div className="text-xl font-black mt-1">ИГРОК: Игрок 2</div>
          </button>
        </div>
      </div>
    );
  }

  const myPlayer = role === 'P1' ? p1 : p2;

  return (
    <div className="min-h-screen bg-[#030303] text-zinc-100 font-mono relative overflow-hidden tracking-tighter">
      
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
          <StarParticles />
        </Canvas>
      </div>

      <header className="relative z-10 border-b border-zinc-900 bg-black/80 backdrop-blur-md px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <OpiumCross className="w-5 h-5 text-white animate-pulse"/>
          <div>
            <span className="text-lg font-black tracking-widest text-white block">RESELL_90S ONLINE</span>
            <span className="text-[9px] text-emerald-400">АККАУНТ: {role === 'P1' ? 'Игрок 1 (P1)' : 'Игрок 2 (P2)'}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center border-x border-zinc-800 px-6">
            <div className="text-2xl font-black text-white tracking-widest">{formatTime(timeLeft)}</div>
            <div className="text-[9px] text-zinc-500 uppercase">ОСТАЛОСЬ В ИГРЕ</div>
          </div>

          {!gameActive ? (
            <button 
              onClick={() => setGameActive(true)}
              className="px-6 py-2 bg-white text-black text-xs font-black uppercase hover:bg-zinc-200 border border-white"
            >
              [ СТАРТ ТУРНИРА ]
            </button>
          ) : (
            <div className="text-xs text-emerald-400 font-bold border border-emerald-500/30 px-3 py-1 bg-emerald-500/10 uppercase">
              ● МАТЧ ИДЕТ
            </div>
          )}

          <button onClick={() => setRole(null)} className="text-[10px] text-zinc-600 underline">
            Выйти
          </button>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        
        {/* ВЫБОР ДИЛЕРА */}
        <div className="mb-6">
          <div className="grid grid-cols-3 gap-2 border border-zinc-800 p-1.5 bg-zinc-950">
            <button
              onClick={() => setActiveTab('datybae')}
              className={`py-3 px-2 text-xs uppercase font-bold text-center border ${
activeTab === 'datybae' ? 'bg-white text-black border-white' : 'bg-black text-zinc-400 border-zinc-900'
              }`}
            >
              01. «ДАТЫБАЕ» (⚡ 5-10 сек)
            </button>
            <button
              onClick={() => setActiveTab('itachi')}
              className={`py-3 px-2 text-xs uppercase font-bold text-center border ${
                activeTab === 'itachi' ? 'bg-white text-black border-white' : 'bg-black text-zinc-400 border-zinc-900'
              }`}
            >
              02. «ИТАЧИ» (🚚 15-25 сек)
            </button>
            <button
              onClick={() => setActiveTab('arigato')}
              className={`py-3 px-2 text-xs uppercase font-bold text-center border ${
                activeTab === 'arigato' ? 'bg-white text-black border-white' : 'bg-black text-zinc-400 border-zinc-900'
              }`}
            >
              03. «АРИГАТО» (✈️ 35-50 сек)
            </button>
          </div>
        </div>

        {/* СЕТКА ИГРЫ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* КАТАЛОГ (15 позиций) */}
          <div className="lg:col-span-2 border border-zinc-800 bg-black/90 p-5">
            <h2 className="text-xs font-black text-zinc-400 uppercase tracking-widest mb-4">
              [ КАТАЛОГ ({SHOPS[activeTab].items.length} ПОЗИЦИЙ) ]
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[580px] overflow-y-auto pr-1">
              {SHOPS[activeTab].items.map((item) => {
                const stockLeft = marketStock[item.id] ?? 0;
                return (
                  <div key={item.id} className="border border-zinc-900 bg-zinc-950 p-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
                        <span>{item.category}</span>
                        <span className={stockLeft > 0 ? 'text-emerald-400' : 'text-red-500 font-bold'}>
                          {stockLeft > 0 ? `В наличии: ${stockLeft} шт` : 'ВЫКУПЛЕНО'}
                        </span>
                      </div>
                      <div className="font-bold text-white text-xs mb-1 flex items-center gap-1.5">
                        <span>{item.icon}</span> {item.name}
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        Закупка: <span className="text-white font-bold">${item.buyPrice}</span>
                      </div>
                    </div>

                    <button
                      disabled={stockLeft <= 0 || myPlayer.money < item.buyPrice || !gameActive}
                      onClick={() => buyItem(role, item)}
                      className="mt-3 w-full py-1.5 bg-white text-black font-black text-[10px] uppercase hover:bg-zinc-200 disabled:opacity-20 border border-white"
                    >
                      {stockLeft <= 0 ? 'НЕТ В НАЛИЧИИ' : `КУПИТЬ ($${item.buyPrice})`}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ИНВЕНТАРЬ И СТАТУСЫ */}
          <div className="border border-zinc-800 bg-black/90 p-5 flex flex-col justify-between">
            <div>
              <div className="border-b border-zinc-800 pb-3 mb-4">
                <div className="text-[10px] text-zinc-500 uppercase">ВАШ БАЛАНС</div>
                <div className="text-lg font-black text-white">{myPlayer.name}</div>
                <div className="text-3xl font-black text-emerald-400 mt-1">${myPlayer.money}</div>
              </div>

              <h3 className="text-[10px] text-zinc-500 uppercase mb-2 font-bold tracking-widest">
                [ ВАШИ ТОВАРЫ ({myPlayer.inv.length}) ]
              </h3>

              <div className="space-y-2 max-h-[420px] overflow-y-auto">
{myPlayer.inv.length === 0 && (
                  <div className="text-xs text-zinc-700 italic border border-zinc-900 p-3 text-center">
                    Инвентарь пуст. Закажите лоты слева.
                  </div>
                )}
                {myPlayer.inv.map((item) => {
                  const isDelivered = item.deliveryTimeLeft === 0;

                  return (
                    <div key={item.instanceId} className="border border-zinc-800 bg-zinc-900/60 p-3 text-xs">
                      <div className="flex items-center justify-between font-bold text-white mb-1">
                        <span>{item.icon} {item.name}</span>
                        <span className="text-[10px] text-zinc-500">Закуп: ${item.buyPrice}</span>
                      </div>

                      {!isDelivered ? (
                        <div className="text-[10px] text-amber-400 animate-pulse mt-1">
                          🚚 В пути: осталось {item.deliveryTimeLeft} сек
                        </div>
                      ) : !item.isListed ? (
                        <button
                          onClick={() => {
                            setSelectedItemToSell(item);
                            setInputPrice(Math.round(item.buyPrice * 1.2)); // +20% по умолчанию
                          }}
                          className="mt-2 w-full py-1 bg-emerald-500 text-black font-black text-[10px] uppercase hover:bg-emerald-400"
                        >
                          ВЫСТАВИТЬ НА ПРОДАЖУ
                        </button>
                      ) : item.tooExpensive ? (
                        <div className="mt-1 text-[10px] text-red-500 font-bold border border-red-500/20 bg-red-500/10 p-1">
                          ❌ Слишком дорого (${item.askingPrice})! Никто не покупает!
                        </div>
                      ) : (
                        <div className="mt-1 text-[10px] text-sky-400 border border-sky-500/20 bg-sky-500/10 p-1">
                          ⏳ Продается за ${item.askingPrice}... (Осталось: {item.sellTimeLeft}с)
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-900 text-[9px] text-zinc-600 text-center uppercase">
              НАЦЕНКА: 20% (10-15с) | 30% (20-25с) | 50% (40-60с)
            </div>
          </div>

        </div>

      </main>

      {/* ОКНО ВЫБОРА ЦЕНЫ */}
      {selectedItemToSell && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-zinc-700 bg-zinc-950 p-6 max-w-sm w-full font-mono">
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-1">
              ПРОДАЖА ТОВАРА
            </h3>
            <p className="text-xs text-zinc-400 mb-4">{selectedItemToSell.name}</p>

            <div className="text-xs text-zinc-500 mb-2">
              Цена закупки: <span className="text-white font-bold">${selectedItemToSell.buyPrice}</span>
            </div>

            <label className="block text-[10px] text-zinc-400 uppercase mb-1">Ваша цена продажи ($):</label>
            <input
              type="number"
              value={inputPrice}
              onChange={(e) => setInputPrice(Number(e.target.value))}
              className="w-full bg-black border border-zinc-700 p-2 text-white font-black text-lg mb-4 focus:outline-none focus:border-white"
            />

            <div className="text-[10px] space-y-1 mb-6 border-t border-b border-zinc-900 py-2">
              <div className="flex justify-between">
                <span className="text-zinc-500">Прибыль:</span>
                <span className={inputPrice - selectedItemToSell.buyPrice >= 0 ? "text-emerald-400 font-bold" : "text-red-400"}>
${inputPrice - selectedItemToSell.buyPrice}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Наценка:</span>
                <span className="text-white font-bold">
                  {Math.round(((inputPrice - selectedItemToSell.buyPrice) / selectedItemToSell.buyPrice) * 100)}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedItemToSell(null)}
                className="py-2 bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800 text-xs uppercase"
              >
                Отмена
              </button>
              <button
                onClick={listForSale}
                className="py-2 bg-white text-black font-black hover:bg-zinc-200 text-xs uppercase"
              >
                Выставить
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}