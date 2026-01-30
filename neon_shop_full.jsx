import React, { useState, useEffect } from 'react';
import { ShoppingCart, X, Zap, Check, Globe, QrCode, ToggleLeft, ToggleRight, Briefcase, User, Printer, Copy, ArrowRight, Upload, Clock, AlertTriangle, Loader, Coffee, BookOpen, Star } from 'lucide-react';

// --- CẤU HÌNH (SỬA THÔNG TIN CỦA BẠN Ở ĐÂY) ---
const CONFIG = {
  GOOGLE_SHEET_CSV: "", // Để trống nếu chưa dùng Sheet
  
  BANK: {
    BANK_ID: "MB", 
    ACCOUNT_NO: "0333666999", 
    ACCOUNT_NAME: "NGUYEN VAN A", 
    TEMPLATE: "compact2" 
  },
  
  LINKS: {
    gumroad: "https://gumroad.com/",
    kofi: "https://ko-fi.com/",
    support: "https://zalo.me/0999999999"
  }
};

// --- DANH SÁCH SẢN PHẨM ĐÃ CẬP NHẬT TỪ 8 HÌNH ẢNH CỦA BẠN ---
const DEFAULT_PRODUCTS = [
  // --- NHÓM 1: KHÓA HỌC (COURSES) - HOT ---
  {
    id: 101,
    name: "AI Automation Training: Master N8N",
    category: "Courses",
    price: 199000, priceUSD: 9.99,
    commercialPrice: 990000, // Giá bán quyền Resell
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&auto=format&fit=crop", // <-- Dán link ảnh "Nick Saraev" của bạn vào đây
    color: "from-emerald-500 to-green-900",
    isBestSeller: true
  },
  {
    id: 102,
    name: "Build & Launch Mobile Apps (No-Code)",
    category: "Courses",
    price: 149000, priceUSD: 6.99,
    commercialPrice: 890000,
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1000&auto=format&fit=crop", // <-- Dán link ảnh "Awa Penn"
    color: "from-orange-400 to-red-600",
    isBestSeller: false
  },
  {
    id: 103,
    name: "Influencer Marketing Agency (Full Guide)",
    category: "Courses",
    price: 0, priceUSD: 0, // Miễn phí để kéo khách
    commercialPrice: 0,
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=1000&auto=format&fit=crop", // <-- Dán link ảnh "Suhit Amin"
    color: "from-pink-500 to-rose-900",
    isBestSeller: false
  },
  {
    id: 104,
    name: "ChatGPT Masterclass 2026: Beginner to Expert",
    category: "Courses",
    price: 299000, priceUSD: 14.99,
    commercialPrice: 1500000,
    image: "https://images.unsplash.com/photo-1684469274290-55928e67a079?q=80&w=1000&auto=format&fit=crop", // <-- Dán link ảnh "Daragh Walsh"
    color: "from-teal-400 to-cyan-800",
    isBestSeller: true
  },
  {
    id: 105,
    name: "The Ultimate 4-Hour Sales Blueprint",
    category: "Courses",
    price: 399000, priceUSD: 19.99,
    commercialPrice: 2000000,
    image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop", // <-- Dán link ảnh "Alex Hormozi"
    color: "from-red-600 to-red-900",
    isBestSeller: true
  },
  {
    id: 106,
    name: "Boost Your Communication Skills",
    category: "Courses",
    price: 149000, priceUSD: 6.99,
    commercialPrice: 500000,
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1000&auto=format&fit=crop", // <-- Dán link ảnh "John Maxwell"
    color: "from-yellow-500 to-amber-700",
    isBestSeller: false
  },
  {
    id: 107,
    name: "Copywriting Course: $0 to $10K/Month",
    category: "Courses",
    price: 249000, priceUSD: 12.99,
    commercialPrice: 1200000,
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1000&auto=format&fit=crop", // <-- Dán link ảnh "Tyson 4D"
    color: "from-purple-500 to-indigo-900",
    isBestSeller: false
  },
  {
    id: 108,
    name: "No-Code AI Agents Guide (Full Guide)",
    category: "Courses",
    price: 299000, priceUSD: 14.99,
    commercialPrice: 1500000,
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1000&auto=format&fit=crop", // <-- Dán link ảnh "Liam Ottley"
    color: "from-blue-600 to-slate-900",
    isBestSeller: true
  },

  // --- NHÓM 2: TRANH NEON (Giữ lại để bán kèm) ---
  {
    id: 1,
    name: "Thần Hổ (Tiger) Neon 4K",
    category: "Neon Art",
    price: 19000, priceUSD: 0.99,
    commercialPrice: 490000,
    image: "https://images.unsplash.com/photo-1629812456605-4a044aa1ea63?q=80&w=1000&auto=format&fit=crop", // <-- Dán link ảnh Hổ 8K của bạn
    color: "from-blue-500 to-purple-600",
    isBestSeller: false
  },
  {
    id: 2,
    name: "Rồng Thần (Dragon) Neon",
    category: "Neon Art",
    price: 19000, priceUSD: 0.99,
    commercialPrice: 490000,
    image: "https://images.unsplash.com/photo-1599691651586-778811800171?q=80&w=1000&auto=format&fit=crop", // <-- Dán link ảnh Rồng 8K của bạn
    color: "from-cyan-400 to-blue-600",
    isBestSeller: false
  }
];

// --- APP LOGIC (ĐÃ TỐI ƯU CHO NGƯỜI MỚI) ---
const App = () => {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentTab, setPaymentTab] = useState('vietnam'); 
  const [showNotification, setShowNotification] = useState(null);
  const [isBusinessMode, setIsBusinessMode] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);

  // Tự động tải từ Google Sheet nếu có
  useEffect(() => {
    if (CONFIG.GOOGLE_SHEET_CSV) {
      setLoading(true);
      fetch(CONFIG.GOOGLE_SHEET_CSV).then(r => r.text()).then(t => {
        const rows = t.split('\n').slice(1);
        const parsed = rows.map(row => {
          const cols = row.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
          const cl = (x) => x ? x.replace(/^"|"$/g, '').trim() : '';
          if(cols.length<5) return null;
          return {
            id: cl(cols[0]), name: cl(cols[1]), category: cl(cols[2]),
            price: Number(cl(cols[3]))||0, priceUSD: Number(cl(cols[4]))||0,
            commercialPrice: Number(cl(cols[5]))||0, commercialPriceUSD: Number(cl(cols[6]))||0,
            image: cl(cols[7]), color: cl(cols[8])||"from-gray-500 to-gray-900", isBestSeller: cl(cols[9])==='true'
          };
        }).filter(p=>p);
        if(parsed.length) setProducts(parsed);
        setLoading(false);
      }).catch(()=>{ setLoading(false); });
    }
  }, []);

  const [timeLeft, setTimeLeft] = useState(300);
  const [receiptImage, setReceiptImage] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let timer;
    if (showPaymentModal && timeLeft > 0 && !isVerifying) timer = setInterval(() => setTimeLeft(p=>p-1), 1000);
    else if (timeLeft === 0 && showPaymentModal) { setShowPaymentModal(false); setCart([]); setReceiptImage(null); alert("⏳ Hết giờ thanh toán!"); }
    return () => clearInterval(timer);
  }, [showPaymentModal, timeLeft, isVerifying]);

  const addToCart = (p) => {
    if (cart.find(i => i.id === p.id && i.isCommercial === isBusinessMode)) { showToast("Đã có trong giỏ!"); return; }
    setCart([...cart, { ...p, isCommercial: isBusinessMode, finalPrice: isBusinessMode ? p.commercialPrice : p.price, finalPriceUSD: isBusinessMode ? p.commercialPriceUSD : p.priceUSD }]);
    setIsCartOpen(true); showToast(`Đã thêm ${p.name}`);
  };

  const removeFromCart = (idx) => { const n = [...cart]; n.splice(idx, 1); setCart(n); };
  const totalVND = cart.reduce((s, i) => s + i.finalPrice, 0);
  const totalUSD = cart.reduce((s, i) => s + i.finalPriceUSD, 0);
  const showToast = (msg) => { setShowNotification(msg); setTimeout(() => setShowNotification(null), 3000); };
  const getQRLink = () => `https://img.vietqr.io/image/${CONFIG.BANK.BANK_ID}-${CONFIG.BANK.ACCOUNT_NO}-${CONFIG.BANK.TEMPLATE}.png?amount=${totalVND}&addInfo=MUA ${orderId.replace('#','')}`;
  const handleOpenPayment = () => { setOrderId(`#${Math.floor(1000+Math.random()*9000)}`); setIsCartOpen(false); setShowPaymentModal(true); setTimeLeft(300); setReceiptImage(null); setIsVerifying(false); };
  
  const filteredProducts = activeCategory === "All" ? products : products.filter(p => p.category === activeCategory);
  const categories = ["All", ...new Set(products.map(p => p.category))];

  return (
    <div className={`min-h-screen font-sans selection:bg-cyan-500 selection:text-black transition-colors duration-500 ${isBusinessMode ? 'bg-slate-950 text-white' : 'bg-black text-white'}`}>
      
      {/* HEADER */}
      <nav className="fixed top-0 w-full z-40 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            {isBusinessMode ? <Printer className="text-yellow-400" /> : <Zap className="text-cyan-400 fill-cyan-400" />}
            <span className="font-bold text-xl tracking-tighter">NEON<span className={isBusinessMode ? "text-yellow-400" : "text-cyan-400"}>STORE</span></span>
          </div>
          <div className="flex items-center gap-4">
            <div onClick={() => { setIsBusinessMode(!isBusinessMode); setCart([]); showToast(isBusinessMode ? "Khách lẻ" : "Chế độ Bán Sỉ/Resell"); }} 
                 className="hidden md:flex items-center gap-2 cursor-pointer bg-white/10 px-4 py-2 rounded-full border border-white/10 hover:bg-white/20 transition-all">
              <span className={`text-sm font-bold ${!isBusinessMode ? 'text-cyan-400' : 'text-gray-500'}`}>Shop</span>
              {isBusinessMode ? <ToggleRight className="text-yellow-400 w-8 h-8" /> : <ToggleLeft className="text-cyan-400 w-8 h-8" />}
              <span className={`text-sm font-bold ${isBusinessMode ? 'text-yellow-400' : 'text-gray-500'}`}>Sỉ/Resell</span>
            </div>
            <button onClick={() => setIsCartOpen(true)} className="relative p-3 hover:bg-white/10 rounded-full">
              <ShoppingCart className="w-6 h-6" />
              {cart.length > 0 && <span className={`absolute top-0 right-0 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce ${isBusinessMode ? 'bg-yellow-500 text-black' : 'bg-fuchsia-500 text-white'}`}>{cart.length}</span>}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE TOGGLE */}
      <div className="md:hidden pt-24 px-4 flex justify-center">
         <div onClick={() => { setIsBusinessMode(!isBusinessMode); setCart([]); }} className="flex items-center gap-4 cursor-pointer bg-white/5 px-6 py-3 rounded-xl border border-white/10 w-full justify-center">
            <User size={18} className={!isBusinessMode ? 'text-cyan-400' : 'text-gray-600'} />
            <div className="relative w-12 h-6 bg-white/10 rounded-full p-1"><div className={`w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${isBusinessMode ? 'translate-x-6 bg-yellow-400' : 'translate-x-0 bg-cyan-400'}`} /></div>
            <Printer size={18} className={isBusinessMode ? 'text-yellow-400' : 'text-gray-600'} />
          </div>
      </div>

      {/* HERO */}
      <header className={`relative ${isBusinessMode ? 'pt-10' : 'pt-32'} md:pt-32 pb-20 px-4 text-center overflow-hidden transition-all duration-500`}>
        <div className={`absolute inset-0 bg-gradient-to-b ${isBusinessMode ? 'from-yellow-900/20' : 'from-cyan-900/20'} via-black to-black z-0 transition-colors duration-1000`} />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className={`inline-block px-4 py-1.5 rounded-full border text-sm font-medium mb-4 animate-pulse ${isBusinessMode ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400' : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'}`}>
            {isBusinessMode ? '🚀 Kho tài nguyên Sỉ & Resell' : '✨ Digital Art & Courses'}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">KHO TÀI NGUYÊN <br /><span className={`text-transparent bg-clip-text bg-gradient-to-r ${isBusinessMode ? 'from-yellow-300 to-orange-500' : 'from-cyan-400 to-fuchsia-500'}`}>{isBusinessMode ? 'PREMIUM' : 'SỐ #1'}</span></h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto">{isBusinessMode ? "Mua quyền bán lại (Resell Rights). Kiếm tiền thụ động." : "Sở hữu khóa học AI, Marketing & Hình nền 4K chất lượng cao."}</p>
        </div>
      </header>

      {/* SHOP GRID */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        {loading ? ( <div className="text-center py-20 flex flex-col items-center gap-4"><Loader className="animate-spin text-cyan-400" size={48} /><p className="text-gray-400">Đang tải...</p></div> ) : (
          <>
            <div className="flex overflow-x-auto gap-3 pb-8 scrollbar-hide">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all ${activeCategory === cat ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {cat === 'Courses' ? '📚 Khóa Học' : (cat === 'Neon Art' ? '🎨 Tranh Neon' : cat)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(p => (
                <div key={p.id} className={`group relative bg-neutral-900 border rounded-2xl overflow-hidden transition-all duration-300 ${isBusinessMode ? 'border-yellow-500/20 hover:border-yellow-500' : 'border-white/5 hover:border-cyan-500/50'}`}>
                  {p.isBestSeller && <div className="absolute top-3 left-3 z-20 bg-red-500 text-white text-xs font-black px-2 py-1 rounded shadow-lg">HOT</div>}
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-20 mix-blend-color group-hover:opacity-0 transition-opacity`} />
                    <img src={p.image} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-0 left-0 w-full p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="flex gap-2 mb-3">
                        <span className={`text-[10px] uppercase tracking-wider bg-black/80 backdrop-blur border px-2 py-1 rounded text-white font-bold ${isBusinessMode ? 'border-yellow-500/50 text-yellow-400' : 'border-cyan-500/50 text-cyan-400'}`}>
                          {p.category === 'Courses' ? 'VIDEO + PDF' : 'PNG 4K'}
                        </span>
                        {isBusinessMode && <span className="text-[10px] uppercase tracking-wider bg-green-900/80 border border-green-500/30 px-2 py-1 rounded text-green-400 font-bold">RESELL</span>}
                      </div>
                      <h3 className="text-xl font-black text-white mb-2 leading-tight line-clamp-2">{p.name}</h3>
                      <div className="flex items-end justify-between mt-4">
                        <div>
                          <p className="text-gray-400 text-xs mb-1">{isBusinessMode ? 'Giá bản quyền:' : 'Giá:'}</p>
                          <span className={`font-mono text-xl font-bold ${isBusinessMode ? 'text-yellow-400' : 'text-cyan-400'}`}>{(isBusinessMode ? p.commercialPrice : p.price).toLocaleString()}đ</span>
                        </div>
                        <button onClick={() => addToCart(p)} className={`p-3 rounded-full transition-colors shadow-lg transform active:scale-95 ${isBusinessMode ? 'bg-yellow-500 text-black' : 'bg-white text-black'}`}>{isBusinessMode ? <Briefcase size={20} /> : <ShoppingCart size={20} />}</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* GIỎ HÀNG */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-neutral-900 border-l border-white/10 shadow-2xl p-6 flex flex-col animate-slide-in-right">
            <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-black">Giỏ Hàng ({cart.length})</h2><button onClick={() => setIsCartOpen(false)}><X /></button></div>
            <div className="flex-1 overflow-y-auto space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-4 p-3 bg-white/5 rounded-xl border border-white/5 relative">
                  <img src={item.image} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm line-clamp-2">{item.name}</h4>
                    <p className={`font-mono text-sm ${item.isCommercial ? 'text-yellow-400' : 'text-cyan-400'}`}>{item.finalPrice.toLocaleString()}đ</p>
                    {item.isCommercial && <span className="text-[10px] text-yellow-500 font-bold uppercase">Commercial</span>}
                  </div>
                  <button onClick={() => removeFromCart(idx)} className="absolute top-2 right-2 text-gray-500 hover:text-red-400"><X size={14} /></button>
                </div>
              ))}
            </div>
            {cart.length > 0 && <div className="mt-4 pt-4 border-t border-white/10"><button onClick={handleOpenPayment} className={`w-full py-4 font-black rounded-xl ${isBusinessMode ? 'bg-yellow-500 text-black' : 'bg-cyan-500 text-black'}`}>THANH TOÁN: {totalVND.toLocaleString()}đ</button></div>}
          </div>
        </div>
      )}

      {/* THANH TOÁN */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowPaymentModal(false)} />
          <div className="relative bg-neutral-900 border border-white/10 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div><h3 className="font-black text-white">Thanh Toán</h3><p className="text-xs text-cyan-400">{orderId}</p></div>
              <div className="flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full"><Clock size={14} className="text-red-400" /><span className="text-red-400 font-bold">{Math.floor(timeLeft/60)}:{timeLeft%60<10?'0':''}{timeLeft%60}</span></div>
            </div>
            <div className="flex border-b border-white/10">
              <button onClick={() => setPaymentTab('vietnam')} className={`flex-1 py-3 font-bold text-sm ${paymentTab === 'vietnam' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'}`}>Chuyển khoản (VN)</button>
              <button onClick={() => setPaymentTab('international')} className={`flex-1 py-3 font-bold text-sm ${paymentTab === 'international' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-500'}`}>Quốc tế</button>
            </div>
            <div className="p-6 overflow-y-auto">
              {paymentTab === 'vietnam' ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-2 rounded-xl"><img src={getQRLink()} className="w-48 h-48 object-contain" /></div>
                  <div className="w-full bg-white/5 p-4 rounded-xl text-sm space-y-2">
                    <div className="flex justify-between"><span className="text-gray-400">Số tiền:</span><span className="font-bold text-cyan-400 text-lg">{totalVND.toLocaleString()}đ</span></div>
                    <div className="flex justify-between items-center"><span className="text-gray-400">Nội dung:</span><span className="font-bold text-yellow-400 flex items-center gap-2">MUA {orderId.replace('#','')} <Copy size={12} onClick={() => { navigator.clipboard.writeText(`MUA ${orderId.replace('#','')}`); showToast("Đã sao chép!"); }} className="cursor-pointer"/></span></div>
                  </div>
                  <label className="w-full border-2 border-dashed border-white/20 h-20 rounded-xl flex items-center justify-center cursor-pointer hover:border-cyan-500/50">
                    <input type="file" hidden onChange={handleImageUpload} />
                    {receiptImage ? <span className="text-green-400 font-bold flex gap-2"><Check /> Đã tải ảnh</span> : <span className="text-gray-400 flex gap-2"><Upload /> Tải ảnh giao dịch</span>}
                  </label>
                  <button onClick={() => { if(!receiptImage) return alert("Vui lòng tải ảnh bill!"); setIsVerifying(true); setTimeout(() => { setIsVerifying(false); setShowPaymentModal(false); setCart([]); alert("Thành công! Link tải sẽ gửi qua Zalo/Mail."); }, 2000); }} className={`w-full py-3 rounded-xl font-bold ${receiptImage ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-500'}`}>{isVerifying ? 'Đang kiểm tra...' : 'Tôi đã chuyển khoản'}</button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <h4 className="text-xl font-bold text-blue-400 mb-4">Total: ${totalUSD.toFixed(2)}</h4>
                  <a href={CONFIG.LINKS.gumroad} target="_blank" className="block w-full py-4 bg-blue-600 rounded-xl font-bold text-white mb-4 hover:bg-blue-500">Thanh toán Gumroad</a>
                  <a href={CONFIG.LINKS.kofi} target="_blank" className="block w-full py-4 bg-[#13C3FF] rounded-xl font-bold text-white hover:opacity-90">Donate Ko-fi</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {showNotification && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-3 rounded-full font-bold shadow-lg z-[80] flex items-center gap-2"><Check size={18} className="text-green-600" />{showNotification}</div>}
    </div>
  );
};

export default App;
