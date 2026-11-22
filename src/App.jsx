import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Boxes,
  Building2,
  Cake,
  Calendar,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChefHat,
  ChevronDown,
  ChevronRight,
  CircleDashed,
  CircleDollarSign,
  ClipboardList,
  Clock,
  Coffee,
  Download,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Flame,
  Info,
  LayoutDashboard,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Minus,
  Package,
  Pencil,
  Phone,
  Plus,
  Printer,
  Receipt,
  RefreshCw,
  Search,
  SearchX,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Timer,
  Trash2,
  TrendingUp,
  User,
  Users,
  Wallet,
  Wheat,
  X,
  XCircle,
} from "lucide-react";

/* ----------------------------------------------------------------------------
 *  POTOTAN ARTISANAL BAKERY
 *  Ordering & Management Platform — single-file application
 *  Customer marketplace · Bakery staff workspace · Executive audit portal
 * ------------------------------------------------------------------------- */

/* ============================== 1. TOKENS ================================= */

const BRAND = {
  cream: "#FAF6F0",
  brioche: "#F3ECE1",
  paper: "#FFFFFF",
  espresso: "#231812",
  cacao: "#6E5A4F",
  terracotta: "#C85A32",
  pandan: "#2D6A4F",
  ube: "#6C3B8C",
  butter: "#D97706",
  line: "#E6DDD0",
};

const CATEGORIES = [
  "All",
  "Hot Pugon Pandesal",
  "Ilonggo Pasalubong & Biscocho",
  "Ensaymada & Pastries",
  "Celebration Cakes",
  "Kakanin & Native Delicacies",
  "Kapeng Barako & Tsokolate",
];

const CATEGORY_META = {
  "Hot Pugon Pandesal": { accent: "#C85A32", icon: Wheat },
  "Ilonggo Pasalubong & Biscocho": { accent: "#D97706", icon: ShoppingBag },
  "Ensaymada & Pastries": { accent: "#B4743A", icon: Cake },
  "Celebration Cakes": { accent: "#6C3B8C", icon: Cake },
  "Kakanin & Native Delicacies": { accent: "#2D6A4F", icon: Flame },
  "Kapeng Barako & Tsokolate": { accent: "#6E5A4F", icon: Coffee },
};

const STATUS_FLOW = ["Pending", "Confirmed", "Ready For Pickup", "Completed"];
const STATUSES = ["Pending", "Confirmed", "Ready For Pickup", "Completed", "Cancelled"];

const STATUS_META = {
  Pending: {
    chip: "border-[#EBD9B4] bg-[#FBF4E6] text-[#8A5A10]",
    dot: "#D97706",
    step: 0,
  },
  Confirmed: {
    chip: "border-[#CBE1D5] bg-[#EDF5F0] text-[#2D6A4F]",
    dot: "#2D6A4F",
    step: 1,
  },
  "Ready For Pickup": {
    chip: "border-[#D8C9E4] bg-[#F4EEF9] text-[#6C3B8C]",
    dot: "#6C3B8C",
    step: 2,
  },
  Completed: {
    chip: "border-[#CFE3D6] bg-[#E6F1EA] text-[#1F513A]",
    dot: "#1F513A",
    step: 3,
  },
  Cancelled: {
    chip: "border-[#EBCFC7] bg-[#FBF0ED] text-[#A33B22]",
    dot: "#A33B22",
    step: -1,
  },
};

const PICKUP_TIMES = [
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 NN",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
];

const BARANGAYS = [
  "Poblacion",
  "Lopez Jaena",
  "Rumbang",
  "Iwa Macatol",
  "Cato-ogan",
  "San Jose",
  "Balabag",
  "Bita",
  "Cawayan",
  "Dawis",
  "Ganzon",
  "Malubog",
  "Pandan",
  "Tuburan",
];

const STORAGE_KEYS = ["users", "bakeries", "products", "orders", "cart", "session"];
const EMPTY_CART = { bakeryId: null, items: [] };

/* =============================== 2. UTILS ================================= */

const cx = (...parts) => parts.filter(Boolean).join(" ");

const pesoFmt = new Intl.NumberFormat("en-PH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const peso = (value) => `₱${pesoFmt.format(Number(value) || 0)}`;
const compactPeso = (value) => {
  const n = Number(value) || 0;
  if (n >= 1000000) return `₱${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `₱${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return `₱${n.toFixed(0)}`;
};

const uid = (prefix = "id") =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const toISODate = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
};
const todayISO = () => toISODate(new Date());
const addDaysISO = (iso, days) => {
  const d = iso ? new Date(`${iso}T12:00:00`) : new Date();
  d.setDate(d.getDate() + Number(days || 0));
  return toISODate(d);
};
const asDate = (value) => {
  if (!value) return null;
  const d = new Date(String(value).length <= 10 ? `${value}T12:00:00` : value);
  return Number.isNaN(d.getTime()) ? null : d;
};
const fmtDate = (value, opts = {}) => {
  const d = asDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...opts,
  });
};
const fmtDateShort = (value) => {
  const d = asDate(value);
  if (!d) return "—";
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric" });
};
const fmtTime = (value) => {
  const d = asDate(value);
  if (!d) return "—";
  return d.toLocaleTimeString("en-PH", { hour: "numeric", minute: "2-digit" });
};
const fmtDateTime = (value) => {
  const d = asDate(value);
  if (!d) return "—";
  return `${fmtDate(d)} · ${d.toLocaleTimeString("en-PH", {
    hour: "numeric",
    minute: "2-digit",
  })}`;
};
const monthKey = (value) => {
  const d = asDate(value);
  if (!d) return "";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};
const monthLabel = (key) => {
  const [year, month] = key.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("en-PH", { month: "short" });
};
const monthLabelLong = (key) => {
  const [year, month] = key.split("-");
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString("en-PH", { month: "long", year: "numeric" });
};

const phoneDigits = (value) => String(value || "").replace(/\D/g, "");
const isValidPHMobile = (value) => {
  let digits = phoneDigits(value);
  if (digits.startsWith("63")) digits = digits.slice(2);
  else if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.length === 10 && digits.startsWith("9");
};
const normalizeMobile = (value) => {
  let digits = phoneDigits(value);
  if (digits.startsWith("63")) digits = `0${digits.slice(2)}`;
  if (!digits.startsWith("0")) digits = `0${digits}`;
  return digits;
};
const prettyMobile = (value) => {
  const digits = normalizeMobile(value);
  return digits.length === 11
    ? `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`
    : digits;
};
const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const isValidEmail = (value) => emailPattern.test(String(value || "").trim());

const stockMeta = (stock) => {
  const n = Number(stock) || 0;
  if (n <= 0)
    return {
      key: "out",
      label: "Sold Out",
      dot: "#B3261E",
      chip: "border-[#EBCFC7] bg-[#FBF0ED] text-[#A33B22]",
      overlay: "bg-[#B3261E]/95 text-white",
    };
  if (n <= 10)
    return {
      key: "low",
      label: "Low Stock",
      dot: "#D97706",
      chip: "border-[#EBD9B4] bg-[#FBF4E6] text-[#8A5A10]",
      overlay: "bg-[#FBF4E6]/95 text-[#8A5A10]",
    };
  return {
    key: "in",
    label: "In Stock",
    dot: "#2D6A4F",
    chip: "border-[#CBE1D5] bg-[#EDF5F0] text-[#2D6A4F]",
    overlay: "bg-white/95 text-[#2D6A4F]",
  };
};

const makeOrderNumber = (orders) => {
  const year = String(new Date().getFullYear()).slice(-2);
  const used = (orders || [])
    .map((o) => Number(String(o.orderNumber || "").split("-").pop()))
    .filter((n) => !Number.isNaN(n));
  const next = Math.max(1040, ...used) + 1;
  return `PB-${year}-${next}`;
};

const downloadFile = (filename, content, type = "text/html;charset=utf-8") => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
};

const escapeHTML = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/* =============================== 3. SEED ================================= */

const u = (id, width = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=80`;

const local = (name) => `/images/${name}.jpg`;

const IMG = {
  pandesal: local("pandesal"),
  ubePandesal: local("ube-pandesal"),
  panDeCoco: local("pan-de-coco"),
  spanishBread: local("spanish-bread"),
  ensaymada: local("ensaymada"),
  kinihad: local("biscocho"),
  coffee: u("1514432324607-a09d9b4aefdd"),
  brazo: local("brazo-de-mercedes"),
  sansRival: local("sans-rival"),
  dreamCake: local("ube-cake"),
  butterscotch: local("butterscotch"),
  cafeEnsaymada: local("ensaymada"),
  pianono: local("pianono"),
  tsokolate: local("tsokolate"),
  spanishLatte: local("spanish-latte"),
  biscocho: local("biscocho"),
  galletas: u("1499636136210-6f4ee915583e"),
  barquillos: local("barquillos"),
  banadas: local("ensaymada"),
  rumbangPandesal: local("pandesal"),
  pasalubongBox: local("pasalubong"),
  bibingka: local("bibingka"),
  tablea: local("tablea"),
  loaf: u("1509440159596-0249088772ff"),
  kalamay: local("kalamay"),
  putoSeko: local("puto-seko"),
  ensaymadaBox: local("ensaymada"),
  flan: local("leche-flan"),
  mangoFloat: local("mango-float"),
  butterscotch2: local("butterscotch"),
  brewBag: u("1512568400610-62da28bc8a13"),
  bakery1: u("1587241321921-91a834d6d191", 1200),
  bakery2: u("1568254183919-78a4f43a2877", 1200),
  bakery3: u("1608198093002-ad4e005484ec", 1200),
  bakery4: u("1517686469429-8bdb88b9f907", 1200),
  bakery5: u("1554118811-1e0d58224f24", 1200),
  hero: u("1555507036-ab1f4038808a", 1400),
  baker: u("1517433670267-08bbd4be890f", 1200),
};

const BAKERIES = [
  {
    id: "b1",
    name: "Panaderia de Pototan",
    address: "San Jose St., Brgy. Poblacion, Pototan, Iloilo",
    shortAddress: "San Jose St. · Poblacion",
    barangay: "Poblacion",
    hours: "4:00 AM – 8:00 PM",
    specialties: ["Pugon Pandesal", "Queso de Bola Ensaymada", "Kinihad Tostado"],
    image: IMG.bakery1,
    since: 1962,
    phone: "0917 412 8860",
    story:
      "Three generations of the same family have fired the same clay pugon on San Jose Street. The first batch hits the counter before the church bells ring.",
    rating: 4.9,
  },
  {
    id: "b2",
    name: "Plaza Hermosa Artisanal Bakehouse",
    address: "Across Pototan Public Plaza, Brgy. Lopez Jaena, Pototan, Iloilo",
    shortAddress: "Across the Public Plaza · Lopez Jaena",
    barangay: "Lopez Jaena",
    hours: "6:00 AM – 9:00 PM",
    specialties: ["Brazo de Mercedes", "Ube Halaya Dream Cake", "Kapeng Barako"],
    image: IMG.bakery2,
    since: 2011,
    phone: "0918 337 2205",
    story:
      "A plaza-side bakehouse built for celebration cakes and slow mornings, with picture windows facing the old town square.",
    rating: 4.8,
  },
  {
    id: "b3",
    name: "Rumbang Pugon & Pasalubong Co.",
    address: "Brgy. Rumbang, Pototan, Iloilo",
    shortAddress: "Rumbang",
    barangay: "Rumbang",
    hours: "5:00 AM – 7:00 PM",
    specialties: ["Biscocho Principe", "Galletas de Pototan", "Barquillos"],
    image: IMG.bakery3,
    since: 1978,
    phone: "0920 764 1193",
    story:
      "The pasalubong stop of the barangay: biscuit tins stacked to the ceiling, warm barquillos rolled by hand beside the oven.",
    rating: 4.7,
  },
  {
    id: "b4",
    name: "Suague River Heritage Tinapay",
    address: "Brgy. Iwa Macatol, Pototan, Iloilo",
    shortAddress: "Iwa Macatol",
    barangay: "Iwa Macatol",
    hours: "5:30 AM – 6:30 PM",
    specialties: ["Bibingka Galapong", "Tablea Batirol", "Kalamay-hati"],
    image: IMG.bakery4,
    since: 1989,
    phone: "0926 551 8074",
    story:
      "Rice cakes steam in banana leaf while tablea from Suague valley cacao is whisked by hand — heritage recipes kept by the riverside.",
    rating: 4.8,
  },
  {
    id: "b5",
    name: "Mantikilya kag Harina Bakeshop",
    address: "Brgy. Cato-ogan, Pototan, Iloilo",
    shortAddress: "Cato-ogan",
    barangay: "Cato-ogan",
    hours: "6:00 AM – 8:00 PM",
    specialties: ["Ube Pandesal", "Butterscotch Bars", "Mango Float"],
    image: IMG.bakery5,
    since: 2004,
    phone: "0995 208 4471",
    story:
      "A modern neighborhood bakeshop where carabao's milk butter and local ube meet — small batches, weighed by hand every morning.",
    rating: 4.6,
  },
];

const mkProduct = (
  id,
  bakeryId,
  name,
  category,
  price,
  stock,
  description,
  image,
  bakingSchedule
) => ({
  id,
  bakeryId,
  name,
  category,
  price,
  stock,
  description,
  image,
  bakingSchedule,
  createdAt: new Date().toISOString(),
});

const PRODUCTS = [
  mkProduct(
    "p01",
    "b1",
    "Pugon Pandesal (Dozen)",
    "Hot Pugon Pandesal",
    85,
    60,
    "Pull-apart rolls with a blistered crust and a soft, faintly sweet crumb — baked twice daily in the wood-fired pugon.",
    IMG.pandesal,
    "Baked 4:00 AM & 3:00 PM"
  ),
  mkProduct(
    "p02",
    "b1",
    "Ube Cheese Pandesal (6-pc)",
    "Hot Pugon Pandesal",
    165,
    18,
    "Purple yam-enriched pandesal filled with quick-melting cheese, finished with a dusting of bread crumbs.",
    IMG.ubePandesal,
    "Baked 5:00 AM"
  ),
  mkProduct(
    "p03",
    "b1",
    "Pan de Coco (6-pc)",
    "Hot Pugon Pandesal",
    150,
    7,
    "Sweetened grated coconut tucked into a buttery roll, brushed with muscovado syrup while still warm.",
    IMG.panDeCoco,
    "Baked 4:30 AM"
  ),
  mkProduct(
    "p04",
    "b1",
    "Spanish Bread (6-pc)",
    "Hot Pugon Pandesal",
    145,
    24,
    "Soft rolled bread with a caramelized breadcrumb filling — the merienda of every Pototan childhood.",
    IMG.spanishBread,
    "Baked 4:30 AM & 2:00 PM"
  ),
  mkProduct(
    "p05",
    "b1",
    "Classic Queso de Bola Ensaymada",
    "Ensaymada & Pastries",
    120,
    12,
    "Feather-light brioche coiled with cultured butter, granulated sugar, and sharp queso de bola.",
    IMG.ensaymada,
    "Baked 6:00 AM"
  ),
  mkProduct(
    "p06",
    "b1",
    "Kinihad Tostado",
    "Ilonggo Pasalubong & Biscocho",
    95,
    3,
    "Twice-baked slivers of sweet bread, crisp enough for coffee and sturdy enough for the trip home.",
    IMG.kinihad,
    "Baked 7:00 AM"
  ),
  mkProduct(
    "p07",
    "b1",
    "Kapeng Barako Cold Brew",
    "Kapeng Barako & Tsokolate",
    150,
    30,
    "Slow-steeped Batangas barako served over ice with a touch of muscovado syrup. Bottled fresh each morning.",
    IMG.coffee,
    "Brewed daily from 6:00 AM"
  ),
  mkProduct(
    "p08",
    "b2",
    "Whole Brazo de Mercedes",
    "Celebration Cakes",
    780,
    4,
    "A whole roll of soft meringue wrapped around silky custard, torched to order and dusted with powdered sugar.",
    IMG.brazo,
    "Made to order — 3 hours notice"
  ),
  mkProduct(
    "p09",
    "b2",
    "Sans Rival Roll",
    "Celebration Cakes",
    650,
    6,
    "Layered cashew dacquoise and French buttercream, rolled tight and chilled overnight for a clean slice.",
    IMG.sansRival,
    "Made to order — 4 hours notice"
  ),
  mkProduct(
    "p10",
    "b2",
    "Ube Halaya Dream Cake",
    "Celebration Cakes",
    950,
    3,
    "Three layers of ube chiffon with halaya custard, whipped cream, and toasted macapuno between each tier.",
    IMG.dreamCake,
    "Made to order — 6 hours notice"
  ),
  mkProduct(
    "p11",
    "b2",
    "Guimaras Mango Butterscotch Bars",
    "Ilonggo Pasalubong & Biscocho",
    320,
    14,
    "Buttery brown-sugar squares studded with dried Guimaras mango — chewy at the center, crackled on top.",
    IMG.butterscotch,
    "Baked 8:00 AM"
  ),
  mkProduct(
    "p12",
    "b2",
    "Cafe con Leche Ensaymada",
    "Ensaymada & Pastries",
    135,
    9,
    "Ensaymada brushed with espresso syrup and finished with a milk crumble. Best with the house barako.",
    IMG.cafeEnsaymada,
    "Baked 6:00 AM"
  ),
  mkProduct(
    "p13",
    "b2",
    "Pianono Classic",
    "Ensaymada & Pastries",
    25,
    40,
    "A tender sponge roll with a thin layer of buttercream — the simplest thing on the counter, and the first to go.",
    IMG.pianono,
    "Baked 7:00 AM"
  ),
  mkProduct(
    "p14",
    "b2",
    "Tablea Tsokolate de Batirol",
    "Kapeng Barako & Tsokolate",
    130,
    25,
    "Thick, grainy tsokolate made from Iloilo tablea and whisked in a wooden batirol until frothy.",
    IMG.tsokolate,
    "Served from 6:00 AM"
  ),
  mkProduct(
    "p15",
    "b2",
    "Spanish Latte Kapeng Barako",
    "Kapeng Barako & Tsokolate",
    175,
    22,
    "A double barako shot with carabao's milk and a whisper of cinnamon. Served hot or over ice.",
    IMG.spanishLatte,
    "Brewed from 6:00 AM"
  ),
  mkProduct(
    "p16",
    "b3",
    "Special Ilonggo Biscocho Principe",
    "Ilonggo Pasalubong & Biscocho",
    220,
    20,
    "The house biscuit: butter-rich bread baked low and slow until amber, then packed in a resealable tin.",
    IMG.biscocho,
    "Baked 5:00 AM"
  ),
  mkProduct(
    "p17",
    "b3",
    "Galletas de Pototan (15-pc Pack)",
    "Ilonggo Pasalubong & Biscocho",
    180,
    0,
    "Thin, crisp galletas stamped by hand and baked until barely golden — the classic Pototan pasalubong.",
    IMG.galletas,
    "Baked 6:00 AM"
  ),
  mkProduct(
    "p18",
    "b3",
    "Crispy Barquillos Tube",
    "Ilonggo Pasalubong & Biscocho",
    110,
    16,
    "Rolled wafers with a delicate snap, made on cast-iron plates and rolled while still pliable.",
    IMG.barquillos,
    "Baked 7:00 AM"
  ),
  mkProduct(
    "p19",
    "b3",
    "Bañadas de Pototan",
    "Ilonggo Pasalubong & Biscocho",
    140,
    11,
    "Sugar-glazed bread fingers with a crackly white shell and a soft, buttery center.",
    IMG.banadas,
    "Baked 5:30 AM"
  ),
  mkProduct(
    "p20",
    "b3",
    "Pugon Pandesal sa Rumbang (Dozen)",
    "Hot Pugon Pandesal",
    90,
    35,
    "The barangay's morning staple: a dozen pugon rolls with a thin crust and a pillowy interior.",
    IMG.rumbangPandesal,
    "Baked 4:00 AM"
  ),
  mkProduct(
    "p21",
    "b3",
    "Pasalubong Box: Ilonggo Favorites",
    "Ilonggo Pasalubong & Biscocho",
    680,
    5,
    "Biscocho, barquillos, galletas, and bañadas in a woven gift box — ready to carry home from Iloilo.",
    IMG.pasalubongBox,
    "Packed daily from 8:00 AM"
  ),
  mkProduct(
    "p22",
    "b4",
    "Bibingka Galapong",
    "Kakanin & Native Delicacies",
    160,
    10,
    "Stone-ground rice cake baked in banana leaf with salted egg, kesong puti, and a brush of butter.",
    IMG.bibingka,
    "Baked 5:00 AM"
  ),
  mkProduct(
    "p23",
    "b4",
    "Suague Tablea Batirol",
    "Kapeng Barako & Tsokolate",
    145,
    18,
    "Heritage tablea from cacao grown along the Suague, served thick and unsweetened with muscovado on the side.",
    IMG.tablea,
    "Served from 6:00 AM"
  ),
  mkProduct(
    "p24",
    "b4",
    "Heritage Kinihad Loaf",
    "Hot Pugon Pandesal",
    130,
    0,
    "A whole loaf of twice-baked kinihad — shatteringly crisp edges, tender middle, made for dipping.",
    IMG.loaf,
    "Baked 5:00 AM"
  ),
  mkProduct(
    "p25",
    "b4",
    "Kalamay-hati sa Bao",
    "Kakanin & Native Delicacies",
    190,
    8,
    "Sticky rice and coconut jam steamed in a coconut shell, finished with latik crumbs.",
    IMG.kalamay,
    "Steamed 6:00 AM"
  ),
  mkProduct(
    "p26",
    "b4",
    "Puto Seko de Pototan",
    "Kakanin & Native Delicacies",
    120,
    26,
    "Dry, slightly crumbly puto with a clean sweetness — the kakanin that travels best.",
    IMG.putoSeko,
    "Baked 6:00 AM"
  ),
  mkProduct(
    "p27",
    "b5",
    "Mantikilya Ensaymada (4-pc)",
    "Ensaymada & Pastries",
    280,
    15,
    "A four-piece box of the bakery's butter-forward ensaymada, baked dark at the edges and snowed with sugar.",
    IMG.ensaymadaBox,
    "Baked 6:00 AM"
  ),
  mkProduct(
    "p28",
    "b5",
    "Mantikilya Ube Pandesal (6-pc)",
    "Hot Pugon Pandesal",
    175,
    3,
    "Pillowy ube rolls brushed with browned butter and finished with a pinch of sea salt.",
    IMG.ubePandesal,
    "Baked 5:00 AM"
  ),
  mkProduct(
    "p29",
    "b5",
    "Caramel Custard Flan Cake",
    "Celebration Cakes",
    520,
    7,
    "Chiffon cake with a wobbly caramel custard top, baked in a water bath and chilled before pickup.",
    IMG.flan,
    "Made to order — 4 hours notice"
  ),
  mkProduct(
    "p30",
    "b5",
    "Mango Float Supreme",
    "Celebration Cakes",
    620,
    5,
    "Layers of graham, whipped cream, and ripe Guimaras mangoes, assembled the morning of pickup.",
    IMG.mangoFloat,
    "Made to order — 4 hours notice"
  ),
  mkProduct(
    "p31",
    "b5",
    "Butterscotch Bars Classic",
    "Ilonggo Pasalubong & Biscocho",
    260,
    19,
    "Chewy brown-sugar bars with a crackly top and a long, buttery finish. Sold by the half-dozen.",
    IMG.butterscotch2,
    "Baked 8:00 AM"
  ),
  mkProduct(
    "p32",
    "b5",
    "Kapeng Barako Brew Bag (250g)",
    "Kapeng Barako & Tsokolate",
    350,
    12,
    "Coarsely ground barako for the home batirol or drip — roasted every Monday in small batches.",
    IMG.brewBag,
    "Roasted every Monday"
  ),
];

const USERS = [
  {
    id: "u-admin",
    role: "system_admin",
    name: "Rafael M. Sotelo",
    email: "admin@pototanbakers.ph",
    mobile: "",
    password: "admin123",
    address: "Pototan Bakers Cooperative, Poblacion, Pototan, Iloilo",
    title: "Cooperative Administrator",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-cust-1",
    role: "customer",
    name: "Maria Clara Santos",
    email: "maria.santos@email.ph",
    mobile: "09171234567",
    password: "password123",
    address: "Brgy. Poblacion, Pototan, Iloilo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-cust-2",
    role: "customer",
    name: "Juan Dela Cruz",
    email: "juan.delacruz@email.ph",
    mobile: "09181234568",
    password: "password123",
    address: "Brgy. Rumbang, Pototan, Iloilo",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-staff-1",
    role: "bakery_staff",
    name: "Corazon Alipao",
    email: "staff@panaderiapototan.ph",
    mobile: "09173000001",
    password: "staff123",
    bakeryId: "b1",
    title: "Head Baker",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-staff-2",
    role: "bakery_staff",
    name: "Emmanuel Tordesillas",
    email: "staff@plazahermosa.ph",
    mobile: "09173000002",
    password: "staff123",
    bakeryId: "b2",
    title: "Pastry Chef",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-staff-3",
    role: "bakery_staff",
    name: "Leticia Bermejo",
    email: "staff@rumbangpugon.ph",
    mobile: "09173000003",
    password: "staff123",
    bakeryId: "b3",
    title: "Pasalubong Manager",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-staff-4",
    role: "bakery_staff",
    name: "Danilo Suague",
    email: "staff@suagueriver.ph",
    mobile: "09173000004",
    password: "staff123",
    bakeryId: "b4",
    title: "Heritage Baker",
    createdAt: new Date().toISOString(),
  },
  {
    id: "u-staff-5",
    role: "bakery_staff",
    name: "Andrea Manikilya",
    email: "staff@mantikilyaharina.ph",
    mobile: "09173000005",
    password: "staff123",
    bakeryId: "b5",
    title: "Bakeshop Supervisor",
    createdAt: new Date().toISOString(),
  },
];

const SEED_CONTACTS = {
  "Maria Clara Santos": { id: "u-cust-1", contact: "09171234567" },
  "Juan Dela Cruz": { id: "u-cust-2", contact: "09181234568" },
  "Ana Liza Fajardo": { id: null, contact: "09173348621" },
  "Ramon Gulmatico": { id: null, contact: "09208841273" },
  "Tessie Villanueva": { id: null, contact: "09194412780" },
  "Nilo Soriano": { id: null, contact: "09267720914" },
  "Grace Ann Tambal": { id: null, contact: "09358813320" },
  "Paolo Escander": { id: null, contact: "09162104783" },
  "Mae Ann Caligdong": { id: null, contact: "09207441129" },
  "Jovelyn Bacabac": { id: null, contact: "09393382071" },
  "Eduardo Pama": { id: null, contact: "09178823410" },
  "Lorna Dacuma": { id: null, contact: "09219885542" },
};

const SEED_SPEC = [
  {
    days: 1,
    bakeryId: "b1",
    customer: "Maria Clara Santos",
    type: "standard",
    payment: "GCash",
    status: "Pending",
    ref: "0917321456789",
    items: [
      ["p01", 2],
      ["p05", 1],
    ],
  },
  {
    days: 2,
    bakeryId: "b2",
    customer: "Ana Liza Fajardo",
    type: "reservation",
    payment: "GCash",
    status: "Confirmed",
    ref: "0918456123789",
    pickupTime: "10:00 AM",
    note: "Please write “Happy 60th, Tatay Ben” on the cake board.",
    items: [["p09", 1]],
  },
  {
    days: 3,
    bakeryId: "b3",
    customer: "Juan Dela Cruz",
    type: "standard",
    payment: "Cash on Pickup",
    status: "Ready For Pickup",
    items: [
      ["p16", 1],
      ["p18", 2],
    ],
  },
  {
    days: 4,
    bakeryId: "b4",
    customer: "Ramon Gulmatico",
    type: "standard",
    payment: "Cash on Pickup",
    status: "Completed",
    items: [
      ["p22", 2],
      ["p26", 1],
    ],
  },
  {
    days: 5,
    bakeryId: "b5",
    customer: "Tessie Villanueva",
    type: "standard",
    payment: "GCash",
    status: "Completed",
    ref: "0917554098123",
    items: [
      ["p27", 1],
      ["p31", 1],
    ],
  },
  {
    days: 8,
    bakeryId: "b1",
    customer: "Nilo Soriano",
    type: "reservation",
    payment: "Cash on Pickup",
    status: "Completed",
    pickupTime: "9:00 AM",
    note: "Pickup before the 9:30 mass, please.",
    items: [["p03", 2]],
  },
  {
    days: 11,
    bakeryId: "b2",
    customer: "Grace Ann Tambal",
    type: "standard",
    payment: "GCash",
    status: "Cancelled",
    ref: "0919338776120",
    note: "Cancelled by customer — schedule conflict.",
    items: [["p10", 1]],
  },
  {
    days: 14,
    bakeryId: "b3",
    customer: "Paolo Escander",
    type: "standard",
    payment: "Cash on Pickup",
    status: "Completed",
    items: [
      ["p20", 2],
      ["p19", 1],
    ],
  },
  {
    days: 18,
    bakeryId: "b4",
    customer: "Mae Ann Caligdong",
    type: "reservation",
    payment: "GCash",
    status: "Completed",
    ref: "0920447182931",
    pickupTime: "2:00 PM",
    note: "Two separate bags for two households, if possible.",
    items: [
      ["p23", 2],
      ["p25", 1],
    ],
  },
  {
    days: 23,
    bakeryId: "b5",
    customer: "Jovelyn Bacabac",
    type: "standard",
    payment: "GCash",
    status: "Completed",
    ref: "0918220934516",
    items: [
      ["p29", 1],
      ["p28", 1],
    ],
  },
  {
    days: 34,
    bakeryId: "b1",
    customer: "Eduardo Pama",
    type: "standard",
    payment: "Cash on Pickup",
    status: "Completed",
    items: [
      ["p02", 1],
      ["p04", 1],
    ],
  },
  {
    days: 47,
    bakeryId: "b2",
    customer: "Maria Clara Santos",
    type: "reservation",
    payment: "GCash",
    status: "Completed",
    ref: "0917661203984",
    pickupTime: "4:00 PM",
    note: "Keep the brazo chilled until pickup.",
    items: [
      ["p08", 1],
      ["p14", 1],
    ],
  },
  {
    days: 61,
    bakeryId: "b5",
    customer: "Lorna Dacuma",
    type: "standard",
    payment: "Cash on Pickup",
    status: "Cancelled",
    note: "No pickup within the hold window.",
    items: [["p30", 1]],
  },
  {
    days: 76,
    bakeryId: "b3",
    customer: "Juan Dela Cruz",
    type: "standard",
    payment: "GCash",
    status: "Completed",
    ref: "0919445218670",
    items: [["p21", 1]],
  },
  {
    days: 92,
    bakeryId: "b4",
    customer: "Ana Liza Fajardo",
    type: "standard",
    payment: "Cash on Pickup",
    status: "Completed",
    items: [
      ["p24", 1],
      ["p22", 1],
    ],
  },
  {
    days: 108,
    bakeryId: "b2",
    customer: "Nilo Soriano",
    type: "reservation",
    payment: "GCash",
    status: "Completed",
    ref: "0920117764523",
    pickupTime: "11:00 AM",
    note: "Office merienda — please pack individually.",
    items: [["p13", 3]],
  },
  {
    days: 0,
    bakeryId: "b5",
    customer: "Grace Ann Tambal",
    type: "standard",
    payment: "Cash on Pickup",
    status: "Pending",
    items: [["p32", 1]],
  },
  {
    days: 6,
    bakeryId: "b2",
    customer: "Maria Clara Santos",
    type: "reservation",
    payment: "GCash",
    status: "Ready For Pickup",
    ref: "0917331908472",
    pickupTime: "5:00 PM",
    note: "Add a box of matches for the candles, please.",
    items: [["p11", 1]],
  },
];

function buildSeedOrders() {
  const year = String(new Date().getFullYear()).slice(-2);
  const productMap = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));

  return SEED_SPEC.map((spec, index) => {
    const created = new Date(Date.now() - spec.days * 86400000);
    created.setHours(7 + (index % 10), (index * 13) % 60, 0, 0);
    const createdAt = created.toISOString();
    const items = spec.items.map(([productId, qty]) => {
      const product = productMap[productId];
      return {
        productId,
        name: product.name,
        price: product.price,
        qty,
      };
    });
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const contact = SEED_CONTACTS[spec.customer] || { id: null, contact: "" };
    const pickupDate =
      spec.type === "reservation"
        ? addDaysISO(toISODate(created), 2)
        : toISODate(created);

    const history = [
      { status: "Pending", at: createdAt, actor: "Customer" },
    ];
    if (spec.status === "Cancelled") {
      const cancelledAt = new Date(created.getTime() + 2 * 3600000).toISOString();
      history.push({
        status: "Cancelled",
        at: cancelledAt,
        actor: "Bakery staff",
        note: spec.note || "Transaction cancelled.",
      });
    } else if (spec.status !== "Pending") {
      const offsets = ["Confirmed", "Ready For Pickup", "Completed"];
      offsets.forEach((status, i) => {
        history.push({
          status,
          at: new Date(created.getTime() + (i + 1) * 45 * 60000).toISOString(),
          actor: "Bakery staff",
        });
      });
    }

    return {
      id: `ord-seed-${index + 1}`,
      orderNumber: `PB-${year}-${1041 + index}`,
      type: spec.type,
      bakeryId: spec.bakeryId,
      customerId: contact.id,
      customerName: spec.customer,
      customerContact: contact.contact,
      items,
      subtotal,
      total: subtotal,
      paymentMethod: spec.payment,
      gcashReference: spec.ref || "",
      pickupDate,
      pickupTime:
        spec.pickupTime ||
        (spec.type === "reservation" ? "10:00 AM" : "3:00 PM – 5:00 PM"),
      notes: spec.note || "",
      status: spec.status,
      createdAt,
      updatedAt: history[history.length - 1].at,
      completedAt:
        spec.status === "Completed" ? history[history.length - 1].at : null,
      cancelledAt:
        spec.status === "Cancelled" ? history[history.length - 1].at : null,
      stockDeducted: ["Confirmed", "Ready For Pickup", "Completed"].includes(spec.status),
      channel: "online",
      history,
    };
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function seedDatabase() {
  return {
    users: USERS,
    bakeries: BAKERIES,
    products: PRODUCTS,
    orders: buildSeedOrders(),
    cart: { ...EMPTY_CART },
    session: null,
  };
}

/* ============================ 4. PERSISTENCE ============================== */

function persistDatabase(data) {
  try {
    STORAGE_KEYS.forEach((key) => {
      localStorage.setItem(key, JSON.stringify(data[key] ?? null));
    });
  } catch (error) {
    console.warn("Unable to persist bakery data", error);
  }
}

function loadDatabase() {
  try {
    const parsed = {};
    let missing = false;
    STORAGE_KEYS.forEach((key) => {
      const raw = localStorage.getItem(key);
      if (raw === null) {
        missing = true;
        return;
      }
      try {
        parsed[key] = JSON.parse(raw);
      } catch {
        missing = true;
      }
    });

    const invalid =
      missing ||
      !Array.isArray(parsed.users) ||
      !Array.isArray(parsed.bakeries) ||
      !Array.isArray(parsed.products) ||
      parsed.bakeries.length === 0 ||
      parsed.products.length === 0;

    if (invalid) {
      const seeded = seedDatabase();
      persistDatabase(seeded);
      return seeded;
    }

    return {
      users: parsed.users,
      bakeries: parsed.bakeries,
      products: parsed.products,
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
      cart:
        parsed.cart && Array.isArray(parsed.cart.items)
          ? parsed.cart
          : { ...EMPTY_CART },
      session: parsed.session ?? null,
    };
  } catch (error) {
    console.warn("Unable to load bakery data", error);
    const seeded = seedDatabase();
    persistDatabase(seeded);
    return seeded;
  }
}

const DBContext = createContext(null);
const useDB = () => {
  const ctx = useContext(DBContext);
  if (!ctx) throw new Error("useDB must be used inside DBProvider");
  return ctx;
};

function DBProvider({ children }) {
  const [db, setDb] = useState(loadDatabase);

  useEffect(() => {
    persistDatabase(db);
  }, [db]);

  useEffect(() => {
    const onStorage = (event) => {
      if (!event.key || !STORAGE_KEYS.includes(event.key) || event.newValue === null)
        return;
      try {
        const next = JSON.parse(event.newValue);
        setDb((prev) => ({ ...prev, [event.key]: next }));
      } catch {
        /* ignore malformed external writes */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((recipe) => {
    setDb((prev) => recipe(JSON.parse(JSON.stringify(prev))));
  }, []);

  const value = useMemo(() => ({ db, update }), [db, update]);
  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
}

/* ============================== 5. TOASTS ================================= */

const ToastContext = createContext(() => {});
const useToast = () => useContext(ToastContext);

const TOAST_STYLE = {
  success: { icon: CheckCircle2, accent: "#2D6A4F", bar: "bg-[#2D6A4F]" },
  error: { icon: AlertTriangle, accent: "#A33B22", bar: "bg-[#A33B22]" },
  info: { icon: Info, accent: "#6C3B8C", bar: "bg-[#6C3B8C]" },
};

function ToastProvider({ children }) {
  const [items, setItems] = useState([]);

  const toast = useCallback((message, tone = "success") => {
    const id = uid("toast");
    setItems((prev) => [...prev.slice(-2), { id, message, tone }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[120] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2 sm:bottom-6 sm:right-6">
        {items.map((item) => {
          const style = TOAST_STYLE[item.tone] || TOAST_STYLE.info;
          const Icon = style.icon;
          return (
            <div
              key={item.id}
              className="anim-toast pointer-events-auto flex items-start gap-3 overflow-hidden rounded-xl border border-[#E6DDD0] bg-white p-3.5 shadow-[0_16px_48px_-16px_rgba(35,24,18,0.4)]"
            >
              <span className={`mt-0.5 h-full w-1 self-stretch rounded-full ${style.bar}`} />
              <Icon size={17} style={{ color: style.accent }} className="mt-0.5 shrink-0" />
              <p className="text-[12.5px] leading-relaxed text-[#231812]">{item.message}</p>
              <button
                onClick={() => setItems((prev) => prev.filter((x) => x.id !== item.id))}
                className="ml-auto shrink-0 rounded p-0.5 text-[#A6968A] hover:bg-[#F3ECE1] hover:text-[#231812]"
                aria-label="Dismiss notification"
              >
                <X size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

/* =========================== 6. UI PRIMITIVES ============================= */

const BTN_VARIANTS = {
  primary:
    "bg-[#C85A32] text-white border border-[#C85A32] hover:bg-[#B24D29] hover:border-[#B24D29] shadow-[0_1px_2px_rgba(35,24,18,0.12)]",
  dark: "bg-[#231812] text-[#FAF6F0] border border-[#231812] hover:bg-[#3A2A20] hover:border-[#3A2A20]",
  outline:
    "bg-white text-[#231812] border border-[#E6DDD0] hover:border-[#C9B8A5] hover:bg-[#FAF6F0]",
  ghost:
    "bg-transparent text-[#6E5A4F] border border-transparent hover:bg-[#F3ECE1] hover:text-[#231812]",
  soft: "bg-[#F3ECE1] text-[#231812] border border-[#E6DDD0] hover:bg-[#EAE0D2]",
  danger:
    "bg-[#B3261E] text-white border border-[#B3261E] hover:bg-[#97201A] hover:border-[#97201A]",
  dangerGhost:
    "bg-white text-[#A33B22] border border-[#EBCFC7] hover:bg-[#FBF0ED] hover:border-[#DDB6AA]",
  green:
    "bg-[#2D6A4F] text-white border border-[#2D6A4F] hover:bg-[#245741] hover:border-[#245741]",
  ube: "bg-[#6C3B8C] text-white border border-[#6C3B8C] hover:bg-[#5B3177] hover:border-[#5B3177]",
  cream:
    "bg-[#FAF6F0] text-[#231812] border border-[#E6DDD0] hover:bg-white hover:border-[#C9B8A5]",
};

const BTN_SIZES = {
  xs: "h-7 px-2.5 text-[11px] gap-1 rounded-md font-medium",
  sm: "h-8 px-3 text-[12px] gap-1.5 rounded-lg font-medium",
  md: "h-10 px-4 text-[13px] gap-2 rounded-lg font-medium",
  lg: "h-12 px-6 text-[14px] gap-2 rounded-xl font-semibold",
};

function Btn({
  variant = "primary",
  size = "md",
  className = "",
  children,
  type = "button",
  ...props
}) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex select-none items-center justify-center whitespace-nowrap transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C85A32]/40 disabled:cursor-not-allowed disabled:opacity-45",
        BTN_VARIANTS[variant] || BTN_VARIANTS.primary,
        BTN_SIZES[size] || BTN_SIZES.md,
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Badge({ children, className = "", dot }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-semibold uppercase tracking-[0.08em]",
        className
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: dot }} />}
      {children}
    </span>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Pending;
  return (
    <Badge className={meta.chip} dot={meta.dot}>
      {status}
    </Badge>
  );
}

function StockBadge({ stock, className = "" }) {
  const meta = stockMeta(stock);
  return (
    <Badge className={cx(meta.chip, className)} dot={meta.dot}>
      {meta.label} · {Math.max(0, stock)}
    </Badge>
  );
}

const INPUT_CLS =
  "w-full rounded-lg border border-[#E6DDD0] bg-white px-3.5 py-2.5 text-[13.5px] text-[#231812] outline-none transition placeholder:text-[#AB9C90] focus:border-[#C85A32] focus:ring-2 focus:ring-[#C85A32]/15 disabled:cursor-not-allowed disabled:bg-[#F7F2EA] disabled:text-[#A6968A]";

const SELECT_CLS = `${INPUT_CLS} cursor-pointer appearance-none pr-9`;

function Field({ label, hint, error, required, children, className = "", right }) {
  return (
    <label className={className}>
      <span className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[11.5px] font-semibold uppercase tracking-[0.09em] text-[#6E5A4F]">
          {label}
          {required && <span className="ml-0.5 text-[#C85A32]">*</span>}
        </span>
        {right}
      </span>
      {children}
      {error ? (
        <span className="mt-1 flex items-center gap-1 text-[11px] font-medium text-[#A33B22]">
          <AlertTriangle size={11} /> {error}
        </span>
      ) : hint ? (
        <span className="mt-1 block text-[11px] leading-relaxed text-[#9A887A]">{hint}</span>
      ) : null}
    </label>
  );
}

function PasswordInput({ value, onChange, placeholder = "Enter password", id, ...props }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Lock
        size={15}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6968A]"
      />
      <input
        id={id}
        type={open ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="current-password"
        className={`${INPUT_CLS} pl-10 pr-11`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Hide password" : "Show password"}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-[#A6968A] transition hover:bg-[#F3ECE1] hover:text-[#231812]"
      >
        {open ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = "md",
  headerAccent,
}) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="anim-fade-in absolute inset-0 bg-[#231812]/45 backdrop-blur-[3px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cx(
          "anim-scale-in relative flex max-h-[94vh] w-full flex-col overflow-hidden rounded-t-2xl border border-[#E6DDD0] bg-[#FAF6F0] shadow-[0_30px_90px_-20px_rgba(35,24,18,0.55)] sm:rounded-2xl",
          widths[size] || widths.md
        )}
      >
        {(title || subtitle) && (
          <div className="flex items-start justify-between gap-4 border-b border-[#E6DDD0] bg-white px-5 py-4 sm:px-6">
            <div className="min-w-0">
              {headerAccent && (
                <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#C85A32]">
                  {headerAccent}
                </div>
              )}
              {title && (
                <h3
                  id={titleId}
                  className="font-display text-[19px] font-semibold leading-tight text-[#231812]"
                >
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-1 text-[12px] leading-relaxed text-[#6E5A4F]">{subtitle}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 rounded-lg border border-transparent p-1.5 text-[#8A786A] transition hover:border-[#E6DDD0] hover:bg-[#FAF6F0] hover:text-[#231812]"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <div className="border-t border-[#E6DDD0] bg-white px-5 py-3.5 sm:px-6">{footer}</div>
        )}
      </div>
    </div>
  );
}

function SmartImage({ src, alt, className = "", imgClassName = "", fallbackLabel }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cx("relative overflow-hidden bg-[#F3ECE1]", className)}>
      {failed || !src ? (
        <div className="paper flex h-full w-full flex-col items-center justify-center gap-2 text-[#B7A695]">
          <Wheat size={26} strokeWidth={1.4} />
          <span className="px-3 text-center text-[10px] font-medium uppercase tracking-[0.14em]">
            {fallbackLabel || "Pugon bake"}
          </span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className={cx("h-full w-full object-cover", imgClassName)}
        />
      )}
    </div>
  );
}

function BrandMark({ dark = false, compact = false, className = "" }) {
  return (
    <div className={cx("flex items-center gap-2.5", className)}>
      <span
        className={cx(
          "flex shrink-0 items-center justify-center rounded-full border",
          compact ? "h-8 w-8" : "h-10 w-10",
          dark
            ? "border-[#C85A32]/40 bg-[#C85A32]/15 text-[#E9A98F]"
            : "border-[#E6DDD0] bg-white text-[#C85A32]"
        )}
      >
        <Wheat size={compact ? 15 : 18} strokeWidth={1.7} />
      </span>
      <div className="leading-none">
        <div
          className={cx(
            "font-display font-semibold tracking-tight",
            compact ? "text-[15px]" : "text-[17px]",
            dark ? "text-[#FAF6F0]" : "text-[#231812]"
          )}
        >
          Pototan
        </div>
        <div
          className={cx(
            "mt-1 text-[8px] font-semibold uppercase tracking-[0.22em]",
            dark ? "text-[#BDAE9F]" : "text-[#8A786A]"
          )}
        >
          Artisanal Bakery
        </div>
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, subtitle, right, className = "" }) {
  return (
    <div className={cx("flex flex-wrap items-end justify-between gap-4", className)}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C85A32]">
            <span className="h-px w-6 bg-[#C85A32]/50" />
            {eyebrow}
          </div>
        )}
        <h2 className="font-display text-[26px] font-semibold leading-tight text-[#231812] sm:text-[32px]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-[#6E5A4F]">
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

function Empty({ icon: Icon = SearchX, title, body, action, className = "" }) {
  return (
    <div
      className={cx(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E0D4C4] bg-white/60 px-6 py-14 text-center",
        className
      )}
    >
      <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#F3ECE1] text-[#A6968A]">
        <Icon size={22} strokeWidth={1.6} />
      </span>
      <h4 className="font-display text-[18px] font-semibold text-[#231812]">{title}</h4>
      {body && <p className="mt-1 max-w-sm text-[12.5px] leading-relaxed text-[#6E5A4F]">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function Kpi({ label, value, icon: Icon, hint, accent = "#C85A32", className = "" }) {
  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-xl border border-[#E6DDD0] bg-white p-4 shadow-[0_1px_2px_rgba(35,24,18,0.03)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#8A786A]">
            {label}
          </p>
          <p className="mt-2 font-display text-[26px] font-semibold leading-none text-[#231812] tnum">
            {value}
          </p>
          {hint && <p className="mt-2 text-[11px] text-[#8A786A]">{hint}</p>}
        </div>
        {Icon && (
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${accent}14`, color: accent }}
          >
            <Icon size={17} strokeWidth={1.8} />
          </span>
        )}
      </div>
      <span
        className="absolute bottom-0 left-0 h-0.5 w-full opacity-60"
        style={{ backgroundColor: accent }}
      />
    </div>
  );
}

function ProgressSteps({ status, compact = false }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-[#EBCFC7] bg-[#FBF0ED] px-3 py-2 text-[11.5px] font-medium text-[#A33B22]">
        <XCircle size={14} />
        Order cancelled
      </div>
    );
  }
  const activeIndex = STATUS_META[status]?.step ?? 0;
  return (
    <div className="flex items-start gap-0">
      {STATUS_FLOW.map((step, index) => {
        const done = index <= activeIndex;
        const current = index === activeIndex;
        return (
          <React.Fragment key={step}>
            <div className="flex min-w-0 flex-1 flex-col items-center">
              <div
                className={cx(
                  "flex items-center justify-center rounded-full border-2 transition-colors",
                  compact ? "h-6 w-6" : "h-8 w-8",
                  done
                    ? "border-[#2D6A4F] bg-[#2D6A4F] text-white"
                    : "border-[#E0D4C4] bg-white text-[#B7A695]"
                )}
              >
                {done ? (
                  <Check size={compact ? 11 : 14} strokeWidth={3} />
                ) : (
                  <span className="text-[10px] font-semibold">{index + 1}</span>
                )}
              </div>
              {!compact && (
                <span
                  className={cx(
                    "mt-2 max-w-[76px] text-center text-[9.5px] font-semibold uppercase leading-tight tracking-[0.06em]",
                    current ? "text-[#231812]" : done ? "text-[#6E5A4F]" : "text-[#B7A695]"
                  )}
                >
                  {step === "Ready For Pickup" ? "Ready" : step}
                </span>
              )}
            </div>
            {index < STATUS_FLOW.length - 1 && (
              <div
                className={cx(
                  "mt-3 h-0.5 flex-1 rounded sm:mt-4",
                  index < activeIndex ? "bg-[#2D6A4F]" : "bg-[#E6DDD0]"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/* ============================== 7. AUTH ================================== */

function AuthError({ children }) {
  if (!children) return null;
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-[#EBCFC7] bg-[#FBF0ED] px-3.5 py-2.5 text-[12px] leading-relaxed text-[#8E3219]">
      <AlertTriangle size={15} className="mt-0.5 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function PortalLinks({ onStaff, onAdmin, onCustomer, current, dark = false }) {
  const base = dark
    ? "border-white/10 bg-white/5 text-[#D7CABB] hover:border-white/25 hover:text-white"
    : "border-[#E6DDD0] bg-white/70 text-[#6E5A4F] hover:border-[#C9B8A5] hover:text-[#231812]";
  return (
    <div className="flex flex-wrap items-center gap-2">
      {onCustomer && (
        <button
          onClick={onCustomer}
          className={cx(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] transition",
            current === "customer"
              ? "border-[#C85A32] bg-[#C85A32] text-white hover:bg-[#B24D29]"
              : base
          )}
        >
          <ShoppingBag size={12} /> Customers
        </button>
      )}
      {onStaff && (
        <button
          onClick={onStaff}
          className={cx(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] transition",
            current === "staff"
              ? "border-[#C85A32] bg-[#C85A32] text-white hover:bg-[#B24D29]"
              : base
          )}
        >
          <Store size={12} /> Bakery partners
        </button>
      )}
      {onAdmin && (
        <button
          onClick={onAdmin}
          className={cx(
            "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] transition",
            current === "admin"
              ? "border-[#C85A32] bg-[#C85A32] text-white hover:bg-[#B24D29]"
              : base
          )}
        >
          <ShieldCheck size={12} /> Admin
        </button>
      )}
    </div>
  );
}

function CustomerAuthPortal({ onAuthed, onStaffPortal, onAdminPortal }) {
  const { db, update } = useDB();
  const toast = useToast();
  const [tab, setTab] = useState("signin");

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState("");

  const [registerBy, setRegisterBy] = useState("mobile");
  const [form, setForm] = useState({
    name: "",
    address: "",
    barangay: "Poblacion",
    mobile: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const setField = (key) => (event) =>
    setForm((prev) => ({ ...prev, [key]: event.target.value }));

  const finishAuth = (session) => {
    update((draft) => ({ ...draft, session }));
    onAuthed(session);
  };

  const submitSignIn = (event) => {
    event.preventDefault();
    setSignInError("");
    if (!identifier.trim() || !password) {
      setSignInError("Enter your registered mobile number or email, and your password.");
      return;
    }
    const emailInput = identifier.trim().toLowerCase();
    const mobileInput = normalizeMobile(identifier);
    const user = db.users.find(
      (candidate) =>
        (candidate.email && candidate.email.toLowerCase() === emailInput) ||
        (candidate.mobile &&
          isValidPHMobile(identifier) &&
          normalizeMobile(candidate.mobile) === mobileInput)
    );

    if (!user) {
      setSignInError(
        "We could not find an account with those details. Check your mobile number or email, or create a new account."
      );
      return;
    }
    if (user.role === "bakery_staff") {
      setSignInError(
        "This account belongs to bakery staff. Please use the Bakery Partner portal to access your assigned branch."
      );
      return;
    }
    if (user.role === "system_admin") {
      setSignInError(
        "This is an executive account. Please use the Admin Oversight portal to sign in."
      );
      return;
    }
    if (user.password !== password) {
      setSignInError("The password you entered does not match this account.");
      return;
    }

    finishAuth({
      role: "customer",
      userId: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
      startedAt: new Date().toISOString(),
    });
    toast(`Welcome back, ${user.name.split(" ")[0]}. The pugon is warm.`);
  };

  const submitRegister = (event) => {
    event.preventDefault();
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name.";
    if (!form.address.trim() || form.address.trim().length < 4)
      next.address = "Enter your street or barangay address.";
    if (registerBy === "mobile") {
      if (!isValidPHMobile(form.mobile))
        next.mobile = "Use 09XX-XXX-XXXX, 09171234567, or +639171234567.";
    } else if (!isValidEmail(form.email)) {
      next.email = "Enter a valid email address, e.g. name@email.ph.";
    }
    if (form.password.length < 6) next.password = "Use at least 6 characters.";

    if (registerBy === "mobile" && isValidPHMobile(form.mobile)) {
      const normalized = normalizeMobile(form.mobile);
      if (
        db.users.some(
          (candidate) => candidate.mobile && normalizeMobile(candidate.mobile) === normalized
        )
      ) {
        next.mobile = "That mobile number already has an account. Sign in instead.";
      }
    }
    if (registerBy === "email" && isValidEmail(form.email)) {
      if (
        db.users.some(
          (candidate) =>
            candidate.email && candidate.email.toLowerCase() === form.email.trim().toLowerCase()
        )
      ) {
        next.email = "That email already has an account. Sign in instead.";
      }
    }

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const user = {
      id: uid("u"),
      role: "customer",
      name: form.name.trim(),
      email: registerBy === "email" ? form.email.trim().toLowerCase() : "",
      mobile: registerBy === "mobile" ? normalizeMobile(form.mobile) : "",
      password: form.password,
      address: `${form.address.trim()}, Brgy. ${form.barangay}, Pototan, Iloilo`,
      createdAt: new Date().toISOString(),
    };

    update((draft) => ({ ...draft, users: [...draft.users, user] }));
    finishAuth({
      role: "customer",
      userId: user.id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      address: user.address,
      startedAt: new Date().toISOString(),
    });
    toast("Your account is ready. Welcome to the marketplace.");
  };

  const continueAsGuest = () => {
    finishAuth({
      role: "guest",
      guestId: uid("guest"),
      name: "Guest",
      startedAt: new Date().toISOString(),
    });
    toast("Browsing as a guest. You can sign in later at checkout.", "info");
  };

  const tabButton = (key, label, shortLabel) => (
    <button
      type="button"
      onClick={() => {
        setTab(key);
        setSignInError("");
        setErrors({});
      }}
      className={cx(
        "flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-2 text-[11.5px] font-semibold transition sm:text-[12.5px]",
        tab === key
          ? "border border-[#E6DDD0] bg-white text-[#231812] shadow-[0_1px_3px_rgba(35,24,18,0.08)]"
          : "border border-transparent text-[#6E5A4F] hover:text-[#231812]"
      )}
    >
      <span className="hidden items-center gap-1.5 sm:inline-flex">{label}</span>
      <span className="sm:hidden">{shortLabel}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#FAF6F0] lg:grid lg:grid-cols-[1.05fr_1fr]">
      {/* Editorial brand panel */}
      <aside className="relative hidden overflow-hidden bg-[#231812] lg:block">
        <SmartImage
          src={IMG.hero}
          alt="Freshly baked bread at a Pototan pugon"
          className="absolute inset-0 h-full w-full"
          imgClassName="scale-105 object-cover saturate-[0.85]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#160E09] via-[#231812]/70 to-[#231812]/25" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#231812]/65 via-transparent to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-9 xl:p-12">
          <div className="flex items-center justify-between">
            <BrandMark dark />
            <span className="rounded-full border border-white/20 bg-black/20 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#EAE0D2] backdrop-blur">
              Pototan · Iloilo
            </span>
          </div>

          <div className="max-w-lg">
            <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E9A98F]">
              <Flame size={13} /> Five ovens. One town.
            </div>
            <h1 className="font-display text-[44px] font-light leading-[1.03] tracking-tight text-[#FAF6F0] xl:text-[52px]">
              The pugon is lit
              <br />
              before the town
              <br />
              <em className="font-normal text-[#E9A98F]">wakes.</em>
            </h1>
            <p className="mt-5 max-w-md text-[13.5px] leading-relaxed text-[#D7CABB]">
              Order small-batch pandesal, ensaymada, and heritage pasalubong directly
              from the neighborhood bakeries of Pototan - and pick them up the same day.
            </p>
          </div>

          <div className="grid max-w-lg grid-cols-3 gap-4 border-t border-white/15 pt-5">
            {[
              ["05", "Neighborhood bakeries"],
              ["32", "Small-batch bakes"],
              ["64", "Years of pugon craft"],
            ].map(([value, label]) => (
              <div key={label}>
                <div className="font-display text-[24px] font-semibold text-[#FAF6F0]">
                  {value}
                </div>
                <div className="mt-1 text-[9.5px] uppercase leading-tight tracking-[0.12em] text-[#BDAE9F]">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Auth panel */}
      <main className="flex min-h-screen flex-col">
        <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-8 lg:px-10">
          <BrandMark className="lg:hidden" />
          <div className="hidden lg:block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8A786A]">
            Customer Portal
          </div>
          <PortalLinks
            onStaff={onStaffPortal}
            onAdmin={onAdminPortal}
            current="customer"
          />
        </div>

        <div className="flex flex-1 items-center justify-center px-5 pb-10 pt-4 sm:px-8 lg:px-10">
          <div className="w-full max-w-[430px]">
            <div className="mb-6">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C85A32]">
                <span className="h-px w-7 bg-[#C85A32]/50" /> Marketplace access
              </div>
              <h2 className="font-display text-[30px] font-semibold leading-tight text-[#231812]">
                {tab === "signin"
                  ? "Welcome back to the counter."
                  : tab === "register"
                  ? "Create your bakery account."
                  : "Come in and look around."}
              </h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#6E5A4F]">
                {tab === "signin"
                  ? "Sign in to order from Pototan's neighborhood bakeries and follow every batch from pugon to pickup."
                  : tab === "register"
                  ? "One account for all five bakeries. Save your barangay and reorder your favorites in seconds."
                  : "Guests may browse bakeries, build a cart, and check out with a name and contact number."}
              </p>
            </div>

            <div className="mb-5 grid grid-cols-3 gap-1 rounded-xl border border-[#E6DDD0] bg-[#F3ECE1]/70 p-1">
              {tabButton("signin", <><LogIn size={13} /> Sign In</>, "Sign In")}
              {tabButton("register", <><User size={13} /> Create Account</>, "Register")}
              {tabButton("guest", <><ShoppingBag size={13} /> Guest</>, "Guest")}
            </div>

            <div className="rounded-2xl border border-[#E6DDD0] bg-white p-5 shadow-[0_18px_50px_-32px_rgba(35,24,18,0.35)] sm:p-6">
              {tab === "signin" && (
                <form onSubmit={submitSignIn} className="space-y-4">
                  <AuthError>{signInError}</AuthError>
                  <Field label="Mobile number or email" required>
                    <div className="relative">
                      <User
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6968A]"
                      />
                      <input
                        value={identifier}
                        onChange={(event) => setIdentifier(event.target.value)}
                        placeholder="09171234567 or name@email.ph"
                        autoComplete="username"
                        className={`${INPUT_CLS} pl-10`}
                      />
                    </div>
                  </Field>
                  <Field label="Password" required>
                    <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} />
                  </Field>
                  <Btn type="submit" size="lg" className="w-full">
                    Sign in to the marketplace <ArrowRight size={16} />
                  </Btn>
                  <p className="text-center text-[11.5px] text-[#8A786A]">
                    New here?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("register")}
                      className="font-semibold text-[#C85A32] underline decoration-[#C85A32]/30 underline-offset-2 hover:decoration-[#C85A32]"
                    >
                      Create an account
                    </button>
                  </p>
                </form>
              )}

              {tab === "register" && (
                <form onSubmit={submitRegister} className="space-y-4">
                  <div>
                    <div className="mb-1.5 text-[11.5px] font-semibold uppercase tracking-[0.09em] text-[#6E5A4F]">
                      Register by
                    </div>
                    <div className="grid grid-cols-2 gap-1 rounded-lg border border-[#E6DDD0] bg-[#FAF6F0] p-1">
                      {[
                        ["mobile", "Mobile number", Smartphone],
                        ["email", "Email address", Mail],
                      ].map(([key, label, Icon]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setRegisterBy(key)}
                          className={cx(
                            "flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-[11.5px] font-medium transition",
                            registerBy === key
                              ? "border border-[#E6DDD0] bg-white text-[#231812] shadow-sm"
                              : "border border-transparent text-[#8A786A] hover:text-[#231812]"
                          )}
                        >
                          <Icon size={13} /> {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Field label="Full name" required error={errors.name}>
                    <input
                      value={form.name}
                      onChange={setField("name")}
                      placeholder="Maria Clara Santos"
                      autoComplete="name"
                      className={INPUT_CLS}
                    />
                  </Field>

                  <div className="grid grid-cols-[1fr_120px] gap-3">
                    <Field label="Barangay / address" required error={errors.address}>
                      <input
                        value={form.address}
                        onChange={setField("address")}
                        placeholder="House no., street, sitio"
                        className={INPUT_CLS}
                      />
                    </Field>
                    <Field label="Barangay" required>
                      <select
                        value={form.barangay}
                        onChange={setField("barangay")}
                        className={SELECT_CLS}
                      >
                        {BARANGAYS.map((barangay) => (
                          <option key={barangay} value={barangay}>
                            {barangay}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {registerBy === "mobile" ? (
                    <Field
                      label="Mobile number"
                      required
                      error={errors.mobile}
                      hint="Format: 09XX-XXX-XXXX, 09171234567, or +639171234567"
                    >
                      <div className="relative">
                        <Phone
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6968A]"
                        />
                        <input
                          value={form.mobile}
                          onChange={setField("mobile")}
                          placeholder="09171234567"
                          inputMode="tel"
                          autoComplete="tel"
                          className={`${INPUT_CLS} pl-10`}
                        />
                      </div>
                    </Field>
                  ) : (
                    <Field label="Email address" required error={errors.email}>
                      <div className="relative">
                        <Mail
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6968A]"
                        />
                        <input
                          value={form.email}
                          onChange={setField("email")}
                          placeholder="name@email.ph"
                          inputMode="email"
                          autoComplete="email"
                          className={`${INPUT_CLS} pl-10`}
                        />
                      </div>
                    </Field>
                  )}

                  <Field
                    label="Password"
                    required
                    error={errors.password}
                    hint="At least 6 characters."
                  >
                    <PasswordInput
                      value={form.password}
                      onChange={setField("password")}
                      placeholder="Create a password"
                    />
                  </Field>

                  <Btn type="submit" size="lg" className="w-full">
                    Create my account <ArrowRight size={16} />
                  </Btn>
                  <p className="text-center text-[11.5px] text-[#8A786A]">
                    Already registered?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("signin")}
                      className="font-semibold text-[#C85A32] underline decoration-[#C85A32]/30 underline-offset-2"
                    >
                      Sign in
                    </button>
                  </p>
                </form>
              )}

              {tab === "guest" && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-[#E6DDD0] bg-[#FAF6F0] p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F3ECE1] text-[#C85A32]">
                        <ShoppingBag size={15} />
                      </span>
                      <div>
                        <p className="text-[12.5px] font-semibold text-[#231812]">
                          Browse first, decide later
                        </p>
                        <p className="mt-1 text-[11.5px] leading-relaxed text-[#6E5A4F]">
                          Guests can explore all five bakeries and fill a cart. At checkout
                          we will only ask for your full name and a mobile number or email.
                        </p>
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-2.5">
                    {[
                      "Browse products, stock, and baking schedules",
                      "Add to cart from one bakery at a time",
                      "Check out with contact details at pickup",
                      "Download a receipt and track order status",
                    ].map((line) => (
                      <li key={line} className="flex items-start gap-2.5 text-[12px] text-[#4E4038]">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#EDF5F0] text-[#2D6A4F]">
                          <Check size={10} strokeWidth={3} />
                        </span>
                        {line}
                      </li>
                    ))}
                  </ul>

                  <Btn size="lg" className="w-full" onClick={continueAsGuest}>
                    Continue as guest <ArrowRight size={16} />
                  </Btn>
                  <p className="text-center text-[11.5px] leading-relaxed text-[#8A786A]">
                    You can sign in or register at any time before placing an order.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex flex-col items-center gap-3">
              <p className="text-center text-[10px] uppercase tracking-[0.12em] text-[#A6968A]">
                One marketplace · five independently run bakeries
              </p>
              <PortalLinks
                onStaff={onStaffPortal}
                onAdmin={onAdminPortal}
                current="customer"
                dark={false}
              />
            </div>
          </div>
        </div>

        <div className="px-5 pb-5 text-center text-[10px] leading-relaxed text-[#A6968A] sm:px-8">
          Pototan Artisanal Bakery · Poblacion, Pototan, Iloilo 5003 · Orders are for
          pickup only
        </div>
      </main>
    </div>
  );
}

function StaffLoginPortal({ onAuthed, onCustomerPortal, onAdminPortal }) {
  const { db, update } = useDB();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    setError("");
    const emailInput = email.trim().toLowerCase();
    if (!isValidEmail(emailInput)) {
      setError("Enter the staff email issued to your bakery.");
      return;
    }
    const user = db.users.find(
      (candidate) => candidate.role === "bakery_staff" && candidate.email?.toLowerCase() === emailInput
    );
    if (!user) {
      setError(
        "No bakery partner account matches this email. Staff sign-in works only for assigned bakery accounts."
      );
      return;
    }
    if (user.password !== password) {
      setError("Incorrect password for this bakery account.");
      return;
    }
    const bakery = db.bakeries.find((candidate) => candidate.id === user.bakeryId);
    if (!bakery) {
      setError("This account has no assigned bakery. Contact the cooperative administrator.");
      return;
    }

    const session = {
      role: "bakery_staff",
      userId: user.id,
      name: user.name,
      email: user.email,
      bakeryId: user.bakeryId,
      startedAt: new Date().toISOString(),
    };
    update((draft) => ({ ...draft, session }));
    toast(`Signed in to ${bakery.name}.`);
    onAuthed(session);
  };

  return (
    <div className="min-h-screen bg-[#1A120D] lg:grid lg:grid-cols-[1fr_1.02fr]">
      <aside className="relative hidden overflow-hidden lg:block">
        <SmartImage
          src={IMG.bakery3}
          alt="Baker removing bread from a pugon"
          className="absolute inset-0 h-full w-full"
          imgClassName="scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120B07] via-[#1A120D]/80 to-[#1A120D]/30" />
        <div className="relative flex h-full flex-col justify-between p-10">
          <div className="flex items-center justify-between">
            <BrandMark dark />
            <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#D7CABB]">
              Bakeshop operations
            </span>
          </div>

          <div className="max-w-md">
            <div className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E9A98F]">
              <ChefHat size={14} /> Partner workspace
            </div>
            <h1 className="font-display text-[42px] font-light leading-[1.05] text-[#FAF6F0]">
              Your branch.
              <br />
              Your ovens.
              <br />
              <em className="text-[#E9A98F]">Your ledger.</em>
            </h1>
            <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-[#C9B8A5]">
              Sign in to manage inventory, confirm orders, deduct stock automatically,
              and read the numbers for your assigned bakery only.
            </p>
          </div>

          <div className="space-y-2.5 border-t border-white/10 pt-5">
            {db.bakeries.map((bakery) => (
              <div key={bakery.id} className="flex items-center gap-3 text-[11.5px] text-[#BDAE9F]">
                <span className="h-1 w-1 rounded-full bg-[#C85A32]" />
                <span className="min-w-0 flex-1 truncate">{bakery.name}</span>
                <span className="shrink-0 text-[10px] uppercase tracking-wider text-[#7E6B5C]">
                  {bakery.barangay}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="flex min-h-screen flex-col bg-[#1A120D] lg:bg-[#231812]">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4 sm:px-8">
          <BrandMark dark compact className="lg:hidden" />
          <div className="hidden text-[10px] font-semibold uppercase tracking-[0.16em] text-[#9A887A] lg:block">
            Bakery Partner Portal
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onCustomerPortal}
              className="inline-flex items-center gap-1.5 text-[11px] text-[#BDAE9F] transition hover:text-white"
            >
              <ArrowLeft size={12} /> Marketplace
            </button>
            <button
              onClick={onAdminPortal}
              className="hidden items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#D7CABB] transition hover:border-white/30 hover:text-white sm:inline-flex"
            >
              <ShieldCheck size={12} /> Admin
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[400px]">
            <div className="mb-7">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#E9A98F]">
                <span className="h-px w-7 bg-[#E9A98F]/50" /> Staff access only
              </div>
              <h2 className="font-display text-[30px] font-semibold leading-tight text-[#FAF6F0]">
                Sign in to your bakery.
              </h2>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-[#BDAE9F]">
                Use the staff email assigned to your branch. Customer and admin accounts
                cannot enter this workspace.
              </p>
            </div>

            <form
              onSubmit={submit}
              className="rounded-2xl border border-white/10 bg-[#2C1E16] p-5 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] sm:p-6"
            >
              <div className="space-y-4">
                <AuthError>{error}</AuthError>
                <Field label="Staff email" required className="[&>span>span:first-child]:text-[#BDAE9F]">
                  <div className="relative">
                    <Mail
                      size={15}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A786A]"
                    />
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="staff@yourbakery.ph"
                      autoComplete="username"
                      className={`${INPUT_CLS} border-white/10 bg-[#1A120D] pl-10 text-[#FAF6F0] placeholder:text-[#7E6B5C] focus:border-[#C85A32]`}
                    />
                  </div>
                </Field>
                <Field label="Password" required className="[&>span>span:first-child]:text-[#BDAE9F]">
                  <PasswordInput
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Staff password"
                  />
                </Field>
                <Btn type="submit" size="lg" className="w-full">
                  Enter bakery workspace <ArrowRight size={16} />
                </Btn>
              </div>
            </form>

            <div className="mt-5 flex items-start gap-2.5 rounded-lg border border-white/10 bg-white/[0.03] px-3.5 py-3 text-[11px] leading-relaxed text-[#9A887A]">
              <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#C85A32]" />
              Branch scoping is enforced at sign-in. You will only ever see orders,
              inventory, and analytics for your assigned bakery.
            </div>

            <div className="mt-5 flex justify-center">
              <PortalLinks
                onCustomer={onCustomerPortal}
                onAdmin={onAdminPortal}
                current="staff"
                dark
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AdminLoginPortal({ onAuthed, onCustomerPortal, onStaffPortal }) {
  const { db, update } = useDB();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    setError("");
    const emailInput = email.trim().toLowerCase();
    const user = db.users.find(
      (candidate) =>
        candidate.role === "system_admin" && candidate.email?.toLowerCase() === emailInput
    );
    if (!user) {
      setError(
        "Executive access requires a system administrator account. Staff and customer accounts are not permitted here."
      );
      return;
    }
    if (user.password !== password) {
      setError("Incorrect password for this executive account.");
      return;
    }
    const session = {
      role: "system_admin",
      userId: user.id,
      name: user.name,
      email: user.email,
      title: user.title || "Cooperative Administrator",
      startedAt: new Date().toISOString(),
    };
    update((draft) => ({ ...draft, session }));
    toast("Executive audit view opened.");
    onAuthed(session);
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <div className="bg-[#231812] text-[#FAF6F0]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D97706]/40 bg-[#D97706]/10 text-[#F0B85A]">
              <ShieldCheck size={15} />
            </span>
            <div className="leading-tight">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#D7CABB]">
                Pototan Bakers Cooperative
              </div>
              <div className="font-display text-[13px] text-[#FAF6F0]">
                Executive Oversight
              </div>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-[#9A887A] sm:flex">
            <Lock size={11} /> Restricted system
          </div>
        </div>
      </div>

      <div className="pugon-glow min-h-[calc(100vh-64px)]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_420px] lg:items-center lg:py-20">
          <div className="max-w-xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D8C9B8] bg-white px-3 py-1 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-[#8A786A]">
              <BadgeCheck size={12} className="text-[#2D6A4F]" /> Cooperative financial oversight
            </div>
            <h1 className="font-display text-[38px] font-semibold leading-[1.06] text-[#231812] sm:text-[48px]">
              The whole network,
              <br />
              <span className="text-[#C85A32]">on one ledger.</span>
            </h1>
            <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-[#6E5A4F]">
              Executive access to network revenue, bakery performance, and the complete
              transaction audit trail. This portal is permanently read-only.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                ["5", "Bakeries audited", Store],
                ["Completed", "Revenue basis", Receipt],
                ["Read-only", "Audit enforcement", Lock],
              ].map(([value, label, Icon]) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#E6DDD0] bg-white/80 p-3.5 backdrop-blur"
                >
                  <Icon size={15} className="text-[#C85A32]" />
                  <div className="mt-2 font-display text-[15px] font-semibold text-[#231812]">
                    {value}
                  </div>
                  <div className="mt-0.5 text-[9.5px] uppercase tracking-[0.1em] text-[#9A887A]">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 border-t border-[#E6DDD0] pt-5 text-[11px] leading-relaxed text-[#8A786A]">
              <div className="font-semibold uppercase tracking-[0.12em] text-[#6E5A4F]">
                Audit notice
              </div>
              <p className="mt-1.5 max-w-md">
                Financial figures are derived from transactions marked{" "}
                <span className="font-semibold text-[#231812]">Completed</span>. Pending,
                confirmed, ready-for-pickup, and cancelled transactions are shown for
                audit context but excluded from revenue.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-[#E6DDD0] bg-white p-6 shadow-[0_30px_80px_-40px_rgba(35,24,18,0.5)] sm:p-7">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <div className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-[#C85A32]">
                  Executive sign-in
                </div>
                <h2 className="mt-1 font-display text-[22px] font-semibold text-[#231812]">
                  Verify your authority
                </h2>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3ECE1] text-[#6E5A4F]">
                <Lock size={16} />
              </span>
            </div>

            <form onSubmit={submit} className="space-y-4">
              <AuthError>{error}</AuthError>
              <Field label="Administrator email" required>
                <div className="relative">
                  <Mail
                    size={15}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6968A]"
                  />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@pototanbakers.ph"
                    autoComplete="username"
                    className={`${INPUT_CLS} pl-10`}
                  />
                </div>
              </Field>
              <Field label="Password" required>
                <PasswordInput
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Executive password"
                />
              </Field>
              <Btn type="submit" size="lg" className="w-full">
                Open audit portal <ArrowRight size={16} />
              </Btn>
              <p className="flex items-start gap-2 pt-1 text-[10.5px] leading-relaxed text-[#9A887A]">
                <Info size={13} className="mt-0.5 shrink-0 text-[#C85A32]" />
                Admin credentials are separate from bakery and customer accounts. No
                changes can be made from this portal.
              </p>
            </form>

            <div className="mt-5 flex justify-center border-t border-[#E6DDD0] pt-5">
              <PortalLinks
                onCustomer={onCustomerPortal}
                onStaff={onStaffPortal}
                current="admin"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================== 8. RECEIPT & EXPORT ============================ */

function receiptHTML(order, bakery) {
  const rows = order.items
    .map(
      (item) => `
        <tr>
          <td>
            <strong>${escapeHTML(item.name)}</strong>
            <div class="muted">${item.qty} × ${peso(item.price)}</div>
          </td>
          <td class="right">${peso(item.qty * item.price)}</td>
        </tr>`
    )
    .join("");

  const metaRow = (label, value) =>
    `<tr><td class="meta-label">${escapeHTML(label)}</td><td class="meta-value">${escapeHTML(
      value
    )}</td></tr>`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHTML(order.orderNumber)} — Pototan Artisanal Bakery</title>
<style>
  * { box-sizing: border-box; }
  body { margin: 0; padding: 40px 22px; background: #FAF6F0; color: #231812; font-family: -apple-system, "Segoe UI", Helvetica, Arial, sans-serif; }
  .sheet { max-width: 640px; margin: 0 auto; background: #fff; border: 1px solid #E6DDD0; border-radius: 14px; overflow: hidden; }
  .top { padding: 30px 34px 24px; background: #231812; color: #FAF6F0; }
  .eyebrow { font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: #E9A98F; font-weight: 700; }
  h1 { margin: 7px 0 3px; font-family: Georgia, "Times New Roman", serif; font-size: 25px; font-weight: 600; letter-spacing: -0.02em; }
  .sub { font-size: 10.5px; color: #C9B8A5; letter-spacing: 0.04em; }
  .order-band { display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 16px 34px; border-bottom: 1px dashed #E6DDD0; background: #FAF6F0; }
  .order-no { font-size: 16px; font-weight: 700; letter-spacing: 0.02em; }
  .status { display: inline-block; padding: 4px 10px; border-radius: 999px; border: 1px solid #CBE1D5; background: #EDF5F0; color: #2D6A4F; font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; }
  .body { padding: 26px 34px 30px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
  .grid h2 { margin: 0 0 6px; font-size: 8.5px; letter-spacing: 0.16em; text-transform: uppercase; color: #9A887A; }
  .grid p { margin: 0; font-size: 12px; line-height: 1.55; color: #4E4038; }
  .grid strong { color: #231812; }
  table { width: 100%; border-collapse: collapse; }
  .items th { text-align: left; font-size: 8.5px; letter-spacing: 0.14em; text-transform: uppercase; color: #9A887A; padding: 0 0 8px; border-bottom: 1px solid #E6DDD0; }
  .items th.right, .items td.right { text-align: right; }
  .items td { padding: 11px 0; border-bottom: 1px solid #F0E8DC; font-size: 12px; vertical-align: top; }
  .muted { font-size: 10px; color: #8A786A; margin-top: 2px; }
  .totals { margin-left: auto; width: 240px; margin-top: 14px; }
  .totals td { padding: 4px 0; font-size: 12px; }
  .totals .grand td { padding-top: 10px; border-top: 1px solid #E6DDD0; font-size: 16px; font-weight: 700; }
  .meta { margin-top: 22px; width: 100%; }
  .meta td { padding: 4px 0; font-size: 11px; vertical-align: top; }
  .meta-label { color: #8A786A; width: 42%; }
  .meta-value { color: #231812; text-align: right; font-weight: 600; }
  .note { margin-top: 20px; padding: 12px 14px; border: 1px solid #E6DDD0; border-radius: 8px; background: #FAF6F0; font-size: 11px; line-height: 1.6; color: #6E5A4F; }
  .footer { border-top: 1px solid #E6DDD0; padding: 18px 34px 24px; text-align: center; font-size: 9.5px; line-height: 1.7; color: #9A887A; }
  .footer strong { color: #6E5A4F; }
  @media print { body { background: #fff; padding: 0; } .sheet { border: 0; border-radius: 0; max-width: none; } }
</style>
</head>
<body>
  <div class="sheet">
    <div class="top">
      <div class="eyebrow">Pototan Artisanal Bakery</div>
      <h1>Pickup Receipt</h1>
      <div class="sub">${escapeHTML(bakery.name)} · ${escapeHTML(bakery.shortAddress)}</div>
    </div>
    <div class="order-band">
      <div>
        <div class="eyebrow" style="color:#9A887A;">Order number</div>
        <div class="order-no">${escapeHTML(order.orderNumber)}</div>
      </div>
      <span class="status">${escapeHTML(order.status)}</span>
    </div>
    <div class="body">
      <div class="grid">
        <div>
          <h2>Customer</h2>
          <p><strong>${escapeHTML(order.customerName)}</strong><br/>${escapeHTML(
    order.customerContact
  )}</p>
        </div>
        <div>
          <h2>Pickup</h2>
          <p><strong>${escapeHTML(order.type === "reservation" ? "Advance reservation" : "Standard order")}</strong><br/>${escapeHTML(
    fmtDate(order.pickupDate)
  )}<br/>${escapeHTML(order.pickupTime)}</p>
        </div>
      </div>

      <table class="items">
        <thead><tr><th>Item</th><th class="right">Amount</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>

      <table class="totals">
        <tr><td>Subtotal</td><td class="right">${peso(order.subtotal)}</td></tr>
        <tr><td>Pickup fee</td><td class="right">₱0.00</td></tr>
        <tr class="grand"><td>Total</td><td class="right">${peso(order.total)}</td></tr>
      </table>

      <table class="meta">
        ${metaRow("Payment method", order.paymentMethod)}
        ${
          order.paymentMethod === "GCash"
            ? metaRow("GCash reference", order.gcashReference)
            : ""
        }
        ${metaRow("Placed on", fmtDateTime(order.createdAt))}
        ${metaRow("Bakery", `${bakery.name}, ${bakery.address}`)}
        ${metaRow("Bakery hours", bakery.hours)}
      </table>

      ${
        order.notes
          ? `<div class="note"><strong>Special notes:</strong> ${escapeHTML(order.notes)}</div>`
          : ""
      }
      <div class="note">Please present this receipt at the counter. Orders are held for
      two hours past the pickup schedule; unclaimed orders may be released.</div>
    </div>
    <div class="footer">
      <strong>Pototan Artisanal Bakery Ordering &amp; Management Platform</strong><br/>
      Generated ${escapeHTML(fmtDateTime(new Date().toISOString()))} · This is a
      system-generated receipt · Pickup only, no delivery
    </div>
  </div>
</body>
</html>`;
}

function downloadReceipt(order, bakery) {
  downloadFile(`${order.orderNumber}-receipt.html`, receiptHTML(order, bakery));
}

function printReceipt(order, bakery) {
  const html = receiptHTML(order, bakery);
  const win = window.open("", "_blank", "width=860,height=900");
  if (!win) {
    downloadReceipt(order, bakery);
    return false;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  window.setTimeout(() => win.print(), 350);
  return true;
}

/* ======================= 9. CUSTOMER MARKETPLACE ========================= */

const STANDARD_WINDOWS = [
  "9:00 AM – 12:00 NN",
  "1:00 PM – 4:00 PM",
  "5:00 PM – 7:00 PM",
];

function ProductCard({ product, bakery, onAdd }) {
  const meta = stockMeta(product.stock);
  const cat = CATEGORY_META[product.category] || {};
  const soldOut = product.stock <= 0;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[#E6DDD0] bg-white shadow-[0_1px_2px_rgba(35,24,18,0.03)] transition duration-200 hover:-translate-y-0.5 hover:border-[#D8C9B8] hover:shadow-[0_16px_36px_-24px_rgba(35,24,18,0.45)]">
      <div className="relative overflow-hidden">
        <SmartImage
          src={product.image}
          alt={product.name}
          fallbackLabel={product.category}
          className="aspect-[4/3] w-full"
          imgClassName="transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span
            className={cx(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.08em] shadow-sm backdrop-blur",
              meta.overlay
            )}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: meta.dot }} />
            {meta.label}
          </span>
          <span className="rounded-full border border-white/60 bg-white/90 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.06em] text-[#5C4A3E] backdrop-blur">
            {peso(product.price)}
          </span>
        </div>
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#231812]/35">
            <span className="rotate-[-4deg] rounded-md border border-white/40 bg-[#231812]/85 px-4 py-2 text-[10.5px] font-bold uppercase tracking-[0.2em] text-white">
              Sold out today
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.09em] text-[#8A786A]">
          <Store size={11} className="shrink-0" style={{ color: cat.accent || "#C85A32" }} />
          <span className="truncate">{bakery?.name || "Pototan bakery"}</span>
        </div>
        <h3 className="mt-1.5 font-display text-[17px] font-semibold leading-snug text-[#231812]">
          {product.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-[#6E5A4F]">
          {product.description}
        </p>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#9A887A]">
          <Clock size={11} className="shrink-0" />
          <span className="truncate">{product.bakingSchedule}</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#F0E8DC] pt-3.5">
          <div className="min-w-0">
            <div className="font-display text-[18px] font-semibold leading-none text-[#231812] tnum">
              {peso(product.price)}
            </div>
            <div className="mt-1.5 text-[10px] font-medium text-[#8A786A]">
              {product.stock > 0 ? `${product.stock} available` : "Restocking tomorrow"}
            </div>
          </div>
          <Btn
            size="sm"
            variant={soldOut ? "soft" : "primary"}
            disabled={soldOut}
            onClick={() => onAdd(product)}
            className="shrink-0"
          >
            {soldOut ? (
              "Sold Out"
            ) : (
              <>
                <Plus size={13} /> Add
              </>
            )}
          </Btn>
        </div>
      </div>
    </article>
  );
}

function StoreHeader({ session, search, setSearch, cartCount, onCart, onTracker, onSignOut, onSignIn, onStaffPortal, onAdminPortal }) {
  return (
    <header className="border-b border-[#E6DDD0] bg-[#FAF6F0]">
      <div className="border-b border-[#E6DDD0]/80 bg-[#F3ECE1]/50">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 text-[9.5px] font-medium uppercase tracking-[0.1em] text-[#8A786A] sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <MapPin size={10} className="shrink-0 text-[#C85A32]" />
            <span className="truncate">Pototan Artisanal Bakery Marketplace</span>
            <span className="hidden text-[#A6968A] sm:inline">· Pototan, Iloilo · Pickup only</span>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <button onClick={onStaffPortal} className="transition hover:text-[#231812]">
              Bakery partner
            </button>
            <span className="h-2.5 w-px bg-[#D8C9B8]" />
            <button onClick={onAdminPortal} className="transition hover:text-[#231812]">
              Admin oversight
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between gap-3">
          <div className="flex shrink-0 items-center gap-3">
            <BrandMark />
            <span className="hidden h-8 w-px bg-[#E6DDD0] xl:block" />
            <span className="hidden text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-[#9A887A] xl:block">
              Pototan Artisanal
              <br />
              Bakery Marketplace
            </span>
          </div>

          <div className="relative hidden w-full max-w-md flex-1 md:block">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6968A]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search pandesal, biscocho, cakes, bakeries…"
              className={`${INPUT_CLS} h-10 bg-white pl-10 text-[12.5px]`}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-[#A6968A] hover:text-[#231812]"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <button
              onClick={onTracker}
              className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-[12px] font-medium text-[#4E4038] transition hover:bg-[#F3ECE1] sm:inline-flex"
            >
              <Receipt size={15} /> My orders
            </button>
            {session?.role === "customer" ? (
              <div className="hidden items-center gap-1.5 border-l border-[#E6DDD0] pl-2.5 lg:flex">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2D6A4F]/10 text-[11px] font-bold uppercase text-[#2D6A4F]">
                  {session.name?.charAt(0) || "C"}
                </span>
                <span className="max-w-[88px] truncate text-[11.5px] font-medium text-[#4E4038]">
                  {session.name?.split(" ")[0]}
                </span>
                <button
                  onClick={onSignOut}
                  className="rounded p-1.5 text-[#8A786A] transition hover:bg-[#F3ECE1] hover:text-[#231812]"
                  title="Sign out"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : session?.role === "guest" ? (
              <button
                onClick={onSignIn}
                className="hidden rounded-lg px-2.5 py-2 text-[12px] font-medium text-[#4E4038] transition hover:bg-[#F3ECE1] lg:block"
              >
                Sign in
              </button>
            ) : (
              <button
                onClick={onSignIn}
                className="hidden rounded-lg px-2.5 py-2 text-[12px] font-medium text-[#4E4038] transition hover:bg-[#F3ECE1] lg:block"
              >
                Sign in
              </button>
            )}

            <button
              onClick={onCart}
              className="relative inline-flex h-10 items-center gap-2 rounded-lg border border-[#231812] bg-[#231812] px-3 text-[12px] font-semibold text-[#FAF6F0] transition hover:bg-[#3A2A20]"
            >
              <ShoppingBag size={15} />
              <span className="hidden sm:inline">Bag</span>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#C85A32] px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        <div className="relative pb-3 md:hidden">
          <Search
            size={15}
            className="pointer-events-none absolute left-3.5 top-[19px] -translate-y-1/2 text-[#A6968A]"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search the day's bake…"
            className={`${INPUT_CLS} h-10 bg-white pl-10 text-[12.5px]`}
          />
        </div>
      </div>
    </header>
  );
}

function BakeryRail({ bakeries, selected, onSelect }) {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 pt-1">
      <button
        onClick={() => onSelect("all")}
        className={cx(
          "group flex w-[248px] shrink-0 flex-col justify-between rounded-2xl border p-5 text-left transition sm:w-[268px]",
          selected === "all"
            ? "border-[#231812] bg-[#231812] text-[#FAF6F0]"
            : "border-[#E6DDD0] bg-white text-[#231812] hover:border-[#C9B8A5]"
        )}
      >
        <div>
          <span
            className={cx(
              "flex h-9 w-9 items-center justify-center rounded-full border",
              selected === "all"
                ? "border-white/20 bg-white/10 text-[#E9A98F]"
                : "border-[#E6DDD0] bg-[#FAF6F0] text-[#C85A32]"
            )}
          >
            <Store size={16} />
          </span>
          <h3 className="mt-4 font-display text-[20px] font-semibold leading-tight">
            All five bakeries
          </h3>
          <p
            className={cx(
              "mt-1.5 text-[11.5px] leading-relaxed",
              selected === "all" ? "text-[#C9B8A5]" : "text-[#6E5A4F]"
            )}
          >
            Browse every small-batch bake across Pototan, from pugon pandesal to
            celebration cakes.
          </p>
        </div>
        <div
          className={cx(
            "mt-5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em]",
            selected === "all" ? "text-[#E9A98F]" : "text-[#C85A32]"
          )}
        >
          Show everything <ArrowRight size={12} />
        </div>
      </button>

      {bakeries.map((bakery) => {
        const active = selected === bakery.id;
        return (
          <button
            key={bakery.id}
            onClick={() => onSelect(active ? "all" : bakery.id)}
            className={cx(
              "group relative w-[276px] shrink-0 overflow-hidden rounded-2xl border text-left transition sm:w-[310px]",
              active
                ? "border-[#C85A32] ring-2 ring-[#C85A32]/20"
                : "border-[#E6DDD0] hover:border-[#C9B8A5]"
            )}
          >
            <div className="relative h-[132px] overflow-hidden">
              <SmartImage
                src={bakery.image}
                alt={bakery.name}
                fallbackLabel="Bakery"
                className="h-full w-full"
                imgClassName="transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#231812]/85 via-[#231812]/20 to-transparent" />
              <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-[#4E4038] backdrop-blur">
                <Star size={9} className="fill-[#D97706] text-[#D97706]" />
                {bakery.rating} · Since {bakery.since}
              </div>
              <div className="absolute inset-x-3 bottom-2.5">
                <h3 className="font-display text-[16px] font-semibold leading-snug text-white">
                  {bakery.name}
                </h3>
              </div>
              {active && (
                <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#C85A32] text-white">
                  <Check size={11} strokeWidth={3} />
                </span>
              )}
            </div>
            <div className="bg-white p-3.5">
              <div className="flex items-start gap-1.5 text-[10.5px] leading-snug text-[#6E5A4F]">
                <MapPin size={11} className="mt-0.5 shrink-0 text-[#C85A32]" />
                <span className="line-clamp-2">{bakery.shortAddress}</span>
              </div>
              <div className="mt-1.5 flex items-center gap-1.5 text-[10.5px] text-[#8A786A]">
                <Clock size={11} className="shrink-0" /> {bakery.hours}
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1">
                {bakery.specialties.slice(0, 2).map((item) => (
                  <span
                    key={item}
                    className="rounded border border-[#E6DDD0] bg-[#FAF6F0] px-1.5 py-0.5 text-[9px] font-medium text-[#6E5A4F]"
                  >
                    {item}
                  </span>
                ))}
                {bakery.specialties.length > 2 && (
                  <span className="rounded border border-transparent px-1 py-0.5 text-[9px] text-[#A6968A]">
                    +{bakery.specialties.length - 2}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CartDrawer({ open, onClose, cartItems, bakery, totals, onQty, onRemove, onCheckout, onBrowse }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <div
        className="anim-fade-in absolute inset-0 bg-[#231812]/45 backdrop-blur-[3px]"
        onClick={onClose}
      />
      <aside className="anim-slide-right absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col border-l border-[#E6DDD0] bg-[#FAF6F0] shadow-[-24px_0_60px_-20px_rgba(35,24,18,0.4)]">
        <div className="flex items-center justify-between border-b border-[#E6DDD0] bg-white px-5 py-4">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-[#C85A32]" />
              <h2 className="font-display text-[19px] font-semibold text-[#231812]">
                Your bakery bag
              </h2>
            </div>
            <p className="mt-0.5 truncate text-[11px] text-[#8A786A]">
              {bakery ? bakery.name : "No bakery selected yet"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-transparent p-1.5 text-[#8A786A] transition hover:border-[#E6DDD0] hover:bg-[#FAF6F0] hover:text-[#231812]"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <span className="mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-[#E6DDD0] bg-white text-[#B7A695]">
              <ShoppingBag size={24} strokeWidth={1.5} />
            </span>
            <h3 className="font-display text-[19px] font-semibold text-[#231812]">
              Your bag is still warm and empty.
            </h3>
            <p className="mt-1 max-w-[260px] text-[12px] leading-relaxed text-[#6E5A4F]">
              Choose a bakery and add today's bake. You can only order from one bakery
              at a time.
            </p>
            <Btn className="mt-4" onClick={onBrowse} variant="dark" size="md">
              Browse the bake <ArrowRight size={14} />
            </Btn>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3">
              <div className="mb-2 flex items-center justify-between px-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9A887A]">
                <span>
                  {cartItems.reduce((sum, item) => sum + item.qty, 0)} items
                </span>
                <span>{bakery?.barangay}</span>
              </div>
              <ul className="space-y-2.5">
                {cartItems.map((item) => (
                  <li
                    key={item.product.id}
                    className="rounded-xl border border-[#E6DDD0] bg-white p-3"
                  >
                    <div className="flex gap-3">
                      <SmartImage
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-[62px] w-[62px] shrink-0 rounded-lg"
                        fallbackLabel="Bake"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-[12.5px] font-semibold leading-snug text-[#231812]">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => onRemove(item.product.id)}
                            className="shrink-0 rounded p-0.5 text-[#B7A695] transition hover:text-[#A33B22]"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <p className="mt-0.5 text-[10.5px] text-[#8A786A]">
                          {peso(item.product.price)} each
                        </p>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <div className="flex items-center rounded-md border border-[#E6DDD0] bg-[#FAF6F0]">
                            <button
                              onClick={() => onQty(item.product.id, item.qty - 1)}
                              className="flex h-7 w-7 items-center justify-center text-[#6E5A4F] transition hover:bg-[#F3ECE1] hover:text-[#231812]"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="flex h-7 w-7 items-center justify-center border-x border-[#E6DDD0] text-[11.5px] font-semibold tnum">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => onQty(item.product.id, item.qty + 1)}
                              disabled={item.qty >= item.product.stock}
                              className="flex h-7 w-7 items-center justify-center text-[#6E5A4F] transition hover:bg-[#F3ECE1] hover:text-[#231812] disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <span className="font-display text-[14px] font-semibold text-[#231812] tnum">
                            {peso(item.product.price * item.qty)}
                          </span>
                        </div>
                      </div>
                    </div>
                    {item.qty >= item.product.stock && item.product.stock > 0 && (
                      <p className="mt-2 flex items-center gap-1 text-[10px] text-[#8A5A10]">
                        <Info size={10} /> Maximum available stock reached
                      </p>
                    )}
                    {item.qty > item.product.stock && (
                      <p className="mt-2 flex items-center gap-1 text-[10px] font-medium text-[#A33B22]">
                        <AlertTriangle size={10} /> Only {item.product.stock} left — reduce
                        quantity before checkout
                      </p>
                    )}
                  </li>
                ))}
              </ul>

              <div className="mt-3 rounded-xl border border-[#CBE1D5] bg-[#EDF5F0] px-3.5 py-3">
                <div className="flex items-start gap-2 text-[10.5px] leading-relaxed text-[#2D6A4F]">
                  <Info size={13} className="mt-0.5 shrink-0" />
                  <span>
                    Stock is reserved when the bakery confirms your order. Pick up at{" "}
                    <strong>{bakery?.shortAddress}</strong>.
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E6DDD0] bg-white px-4 py-4">
              <div className="space-y-1.5 text-[12px]">
                <div className="flex items-center justify-between text-[#6E5A4F]">
                  <span>Subtotal</span>
                  <span className="tnum">{peso(totals.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-[#6E5A4F]">
                  <span>Pickup fee</span>
                  <span className="tnum">₱0.00</span>
                </div>
                <div className="flex items-end justify-between border-t border-[#E6DDD0] pt-2">
                  <span className="text-[12px] font-semibold text-[#231812]">Total</span>
                  <span className="font-display text-[22px] font-semibold leading-none text-[#231812] tnum">
                    {peso(totals.total)}
                  </span>
                </div>
              </div>
              <Btn size="lg" className="mt-3 w-full" onClick={onCheckout}>
                Proceed to pickup checkout <ArrowRight size={15} />
              </Btn>
              <p className="mt-2 flex items-center justify-center gap-1.5 text-[10px] text-[#9A887A]">
                <Lock size={10} /> Cash on pickup or GCash · No delivery
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function CheckoutSheet({ open, onClose, cartItems, bakery, session, totals, onPlace, onAdjust }) {
  const [fulfilment, setFulfilment] = useState("standard");
  const [payment, setPayment] = useState("Cash on Pickup");
  const [gcash, setGcash] = useState("");
  const [window, setWindow] = useState(STANDARD_WINDOWS[0]);
  const [resDate, setResDate] = useState(addDaysISO(todayISO(), 1));
  const [resTime, setResTime] = useState("10:00 AM");
  const [notes, setNotes] = useState("");
  const [name, setName] = useState(
    session?.role === "customer" ? session.name || "" : ""
  );
  const [contact, setContact] = useState(
    session?.role === "customer" ? session.mobile || session.email || "" : ""
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
  }, [open]);

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (name.trim().length < 2) next.name = "Enter the name for this pickup.";
    if (!contact.trim()) {
      next.contact = "A mobile number or email is required for pickup updates.";
    } else if (!isValidPHMobile(contact) && !isValidEmail(contact)) {
      next.contact = "Enter a valid mobile number (e.g. 09171234567) or email address.";
    }
    if (fulfilment === "reservation") {
      if (!resDate) next.resDate = "Choose a reservation date.";
      else if (resDate < todayISO()) next.resDate = "Reservation date cannot be in the past.";
      if (!resTime) next.resTime = "Choose a pickup time.";
    }
    if (payment === "GCash") {
      if (!/^\d{13}$/.test(gcash)) {
        next.gcash = "Enter the 13-digit GCash reference number from your receipt.";
      }
    }
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    const pickupDate = fulfilment === "reservation" ? resDate : todayISO();
    const pickupTime = fulfilment === "reservation" ? resTime : window;

    onPlace({
      type: fulfilment,
      paymentMethod: payment,
      gcashReference: payment === "GCash" ? gcash : "",
      pickupDate,
      pickupTime,
      notes: notes.trim(),
      customerName: name.trim(),
      customerContact: contact.trim(),
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="full"
      headerAccent="Pickup checkout"
      title="Complete your bakery order"
      subtitle={`${bakery?.name || "Bakery"} · ${bakery?.shortAddress || "Pototan, Iloilo"}`}
    >
      <form onSubmit={submit}>
        <div className="grid gap-0 lg:grid-cols-[1fr_340px]">
          <div className="px-5 py-5 sm:px-6">
            <div className="space-y-6">
              {errors.form && <AuthError>{errors.form}</AuthError>}

              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#231812] text-[10px] font-bold text-[#FAF6F0]">
                    1
                  </span>
                  <h3 className="font-display text-[16px] font-semibold text-[#231812]">
                    Pickup details
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Full name" required error={errors.name}>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Name for the pickup"
                      className={INPUT_CLS}
                    />
                  </Field>
                  <Field
                    label="Mobile number or email"
                    required
                    error={errors.contact}
                    hint="Used only for pickup coordination."
                  >
                    <input
                      value={contact}
                      onChange={(event) => setContact(event.target.value)}
                      placeholder="09171234567 or name@email.ph"
                      className={INPUT_CLS}
                    />
                  </Field>
                </div>
                {session?.role === "guest" && (
                  <p className="mt-2 flex items-start gap-1.5 text-[10.5px] leading-relaxed text-[#8A786A]">
                    <Info size={12} className="mt-0.5 shrink-0" />
                    You are checking out as a guest. Keep your order number to track this
                    order on this device.
                  </p>
                )}
              </section>

              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#231812] text-[10px] font-bold text-[#FAF6F0]">
                    2
                  </span>
                  <h3 className="font-display text-[16px] font-semibold text-[#231812]">
                    Fulfilment type
                  </h3>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setFulfilment("standard")}
                    className={cx(
                      "rounded-xl border p-3.5 text-left transition",
                      fulfilment === "standard"
                        ? "border-[#C85A32] bg-[#FBF0EB] ring-1 ring-[#C85A32]/20"
                        : "border-[#E6DDD0] bg-white hover:border-[#C9B8A5]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-semibold text-[#231812]">
                        Standard order
                      </span>
                      <span
                        className={cx(
                          "flex h-4 w-4 items-center justify-center rounded-full border",
                          fulfilment === "standard"
                            ? "border-[#C85A32] bg-[#C85A32] text-white"
                            : "border-[#D8C9B8]"
                        )}
                      >
                        {fulfilment === "standard" && <Check size={9} strokeWidth={3} />}
                      </span>
                    </div>
                    <p className="mt-1 text-[10.5px] leading-relaxed text-[#6E5A4F]">
                      Same-day pickup from today's bake, within the bakery's open hours.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfilment("reservation")}
                    className={cx(
                      "rounded-xl border p-3.5 text-left transition",
                      fulfilment === "reservation"
                        ? "border-[#6C3B8C] bg-[#F6F0FA] ring-1 ring-[#6C3B8C]/20"
                        : "border-[#E6DDD0] bg-white hover:border-[#C9B8A5]"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-semibold text-[#231812]">
                        Advance reservation
                      </span>
                      <span
                        className={cx(
                          "flex h-4 w-4 items-center justify-center rounded-full border",
                          fulfilment === "reservation"
                            ? "border-[#6C3B8C] bg-[#6C3B8C] text-white"
                            : "border-[#D8C9B8]"
                        )}
                      >
                        {fulfilment === "reservation" && <Check size={9} strokeWidth={3} />}
                      </span>
                    </div>
                    <p className="mt-1 text-[10.5px] leading-relaxed text-[#6E5A4F]">
                      Schedule a future pickup date for a celebration or pasalubong run.
                    </p>
                  </button>
                </div>

                {fulfilment === "standard" ? (
                  <div className="mt-3 rounded-xl border border-[#E6DDD0] bg-white p-3.5">
                    <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6E5A4F]">
                      Pickup window · today, {fmtDate(todayISO())}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {STANDARD_WINDOWS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setWindow(slot)}
                          className={cx(
                            "rounded-lg border px-3 py-1.5 text-[11px] font-medium transition",
                            window === slot
                              ? "border-[#2D6A4F] bg-[#EDF5F0] text-[#2D6A4F]"
                              : "border-[#E6DDD0] bg-[#FAF6F0] text-[#6E5A4F] hover:border-[#C9B8A5]"
                          )}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 rounded-xl border border-[#D8C9E4] bg-[#FBF7FD] p-3.5">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Reservation date" required error={errors.resDate}>
                        <input
                          type="date"
                          min={todayISO()}
                          value={resDate}
                          onChange={(event) => setResDate(event.target.value)}
                          className={INPUT_CLS}
                        />
                      </Field>
                      <Field label="Pickup time" required error={errors.resTime}>
                        <div className="relative">
                          <select
                            value={resTime}
                            onChange={(event) => setResTime(event.target.value)}
                            className={SELECT_CLS}
                          >
                            {PICKUP_TIMES.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A786A]"
                          />
                        </div>
                      </Field>
                    </div>
                    <Field
                      label="Special notes"
                      hint="Cake message, packing requests, or pickup instructions."
                      className="mt-3"
                    >
                      <textarea
                        rows={3}
                        value={notes}
                        onChange={(event) => setNotes(event.target.value)}
                        placeholder="e.g. Please write “Happy birthday, Lola” on the cake board."
                        className={`${INPUT_CLS} resize-none`}
                      />
                    </Field>
                  </div>
                )}
              </section>

              <section>
                <div className="mb-3 flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#231812] text-[10px] font-bold text-[#FAF6F0]">
                    3
                  </span>
                  <h3 className="font-display text-[16px] font-semibold text-[#231812]">
                    Payment method
                  </h3>
                </div>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {[
                    {
                      key: "Cash on Pickup",
                      icon: Banknote,
                      title: "Cash on pickup",
                      body: "Pay at the counter when you collect your order.",
                    },
                    {
                      key: "GCash",
                      icon: Smartphone,
                      title: "GCash",
                      body: "Send payment and enter the 13-digit reference number.",
                    },
                  ].map((method) => {
                    const Icon = method.icon;
                    const active = payment === method.key;
                    return (
                      <button
                        key={method.key}
                        type="button"
                        onClick={() => setPayment(method.key)}
                        className={cx(
                          "rounded-xl border p-3.5 text-left transition",
                          active
                            ? "border-[#C85A32] bg-[#FBF0EB] ring-1 ring-[#C85A32]/20"
                            : "border-[#E6DDD0] bg-white hover:border-[#C9B8A5]"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-2 text-[12.5px] font-semibold text-[#231812]">
                            <Icon
                              size={15}
                              className={active ? "text-[#C85A32]" : "text-[#8A786A]"}
                            />
                            {method.title}
                          </span>
                          <span
                            className={cx(
                              "flex h-4 w-4 items-center justify-center rounded-full border",
                              active
                                ? "border-[#C85A32] bg-[#C85A32] text-white"
                                : "border-[#D8C9B8]"
                            )}
                          >
                            {active && <Check size={9} strokeWidth={3} />}
                          </span>
                        </div>
                        <p className="mt-1 text-[10.5px] leading-relaxed text-[#6E5A4F]">
                          {method.body}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {payment === "GCash" && (
                  <div className="mt-3 rounded-xl border border-[#CBE1D5] bg-[#EDF5F0] p-3.5">
                    <Field
                      label="GCash reference number"
                      required
                      error={errors.gcash}
                      hint="Exactly 13 digits, found on your GCash confirmation receipt."
                    >
                      <div className="relative">
                        <Smartphone
                          size={15}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#2D6A4F]"
                        />
                        <input
                          value={gcash}
                          onChange={(event) =>
                            setGcash(event.target.value.replace(/\D/g, "").slice(0, 13))
                          }
                          inputMode="numeric"
                          placeholder="1234567890123"
                          className={`${INPUT_CLS} border-[#CBE1D5] pl-10 pr-12 tracking-[0.08em]`}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-[#8A786A] tnum">
                          {gcash.length}/13
                        </span>
                      </div>
                    </Field>
                    <p className="mt-2 flex items-start gap-1.5 text-[10px] leading-relaxed text-[#2D6A4F]">
                      <Info size={11} className="mt-0.5 shrink-0" />
                      The bakery verifies the reference before confirming your order. No
                      card details are stored.
                    </p>
                  </div>
                )}
              </section>
            </div>
          </div>

          {/* Summary */}
          <aside className="border-t border-[#E6DDD0] bg-[#F3ECE1]/50 px-5 py-5 sm:px-6 lg:border-l lg:border-t-0">
            <div className="lg:sticky lg:top-2">
              <div className="mb-3 flex items-center gap-2">
                <ShoppingBag size={15} className="text-[#C85A32]" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#6E5A4F]">
                  Order summary
                </h3>
              </div>
              <div className="rounded-xl border border-[#E6DDD0] bg-white p-3">
                <div className="flex items-center gap-2 border-b border-[#F0E8DC] pb-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#F3ECE1] text-[10px] text-[#C85A32]">
                    <Store size={11} />
                  </span>
                  <div className="min-w-0">
                    <div className="truncate text-[11.5px] font-semibold text-[#231812]">
                      {bakery?.name}
                    </div>
                    <div className="truncate text-[9.5px] text-[#8A786A]">
                      {bakery?.shortAddress}
                    </div>
                  </div>
                </div>

                <ul className="max-h-52 divide-y divide-[#F0E8DC] overflow-y-auto">
                  {cartItems.map((item) => (
                    <li key={item.product.id} className="flex items-start gap-2 py-2">
                      <span className="mt-0.5 flex h-5 min-w-5 items-center justify-center rounded bg-[#F3ECE1] px-1 text-[9.5px] font-bold text-[#6E5A4F] tnum">
                        {item.qty}×
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[11px] leading-snug text-[#231812]">
                          {item.product.name}
                        </div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[9px] text-[#A6968A]">
                          <span>{peso(item.product.price)} each</span>
                          {item.qty > item.product.stock && (
                            <span className="text-[#A33B22]">· stock changed</span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] font-medium text-[#231812] tnum">
                        {peso(item.product.price * item.qty)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-1 space-y-1 border-t border-[#E6DDD0] pt-2.5 text-[11px] text-[#6E5A4F]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="tnum">{peso(totals.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pickup fee</span>
                    <span className="tnum">₱0.00</span>
                  </div>
                  <div className="flex items-end justify-between border-t border-[#E6DDD0] pt-2">
                    <span className="font-semibold text-[#231812]">Total</span>
                    <span className="font-display text-[20px] font-semibold leading-none text-[#231812] tnum">
                      {peso(totals.total)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-[#E6DDD0] bg-white px-3 py-2.5 text-[10.5px] leading-relaxed text-[#6E5A4F]">
                <div className="flex items-center gap-1.5 font-semibold text-[#231812]">
                  <Clock size={12} className="text-[#C85A32]" />
                  {fulfilment === "reservation"
                    ? `${fmtDate(resDate)} · ${resTime}`
                    : `Today · ${window}`}
                </div>
                <div className="mt-1">
                  {fulfilment === "reservation" ? "Advance reservation" : "Standard order"} ·{" "}
                  {payment}
                </div>
              </div>

              <Btn type="submit" size="lg" className="mt-3 w-full">
                Place pickup order <ArrowRight size={15} />
              </Btn>
              <p className="mt-2 text-center text-[9.5px] leading-relaxed text-[#9A887A]">
                Stock is verified again when the bakery confirms. You will not be charged
                until pickup or GCash verification.
              </p>
            </div>
          </aside>
        </div>
      </form>
    </Modal>
  );
}

function SwitchBakeryModal({ open, onClose, currentBakery, nextProduct, nextBakery, onConfirm }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="One bakery per pickup"
      subtitle="Each pickup is prepared by a single bakery, so your bag can only hold items from one branch."
      size="sm"
    >
      <div className="px-5 py-5 sm:px-6">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <div className="rounded-xl border border-[#E6DDD0] bg-white p-3 text-center">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-[#F3ECE1] text-[#6E5A4F]">
              <Store size={15} />
            </div>
            <div className="text-[10px] uppercase tracking-[0.08em] text-[#9A887A]">Current bag</div>
            <div className="mt-0.5 text-[11.5px] font-semibold leading-snug text-[#231812]">
              {currentBakery?.name || "No bakery"}
            </div>
          </div>
          <ArrowRight size={16} className="text-[#C85A32]" />
          <div className="rounded-xl border border-[#C85A32]/40 bg-[#FBF0EB] p-3 text-center">
            <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#C85A32]">
              <ShoppingBag size={15} />
            </div>
            <div className="text-[10px] uppercase tracking-[0.08em] text-[#A6968A]">New bakery</div>
            <div className="mt-0.5 text-[11.5px] font-semibold leading-snug text-[#231812]">
              {nextBakery?.name}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-[#EBD9B4] bg-[#FBF4E6] px-3.5 py-3 text-[11px] leading-relaxed text-[#8A5A10]">
          Adding <strong>{nextProduct?.name}</strong> will clear your current bag. This keeps
          every order tied to one bakery's stock and pickup counter.
        </div>
      </div>
      <div className="flex flex-col-reverse gap-2 border-t border-[#E6DDD0] bg-white px-5 py-3.5 sm:flex-row sm:justify-end sm:px-6">
        <Btn variant="outline" onClick={onClose}>
          Keep current bag
        </Btn>
        <Btn variant="primary" onClick={onConfirm}>
          Clear bag & switch bakery
        </Btn>
      </div>
    </Modal>
  );
}

function ReceiptModal({ order, bakery, open, onClose, onTrack }) {
  if (!order || !bakery) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title="Pickup receipt ready"
      subtitle={`${order.orderNumber} · ${order.status}`}
      headerAccent="Order placed"
    >
      <div className="px-5 py-5 sm:px-6">
        <div className="rounded-xl border border-[#CBE1D5] bg-[#EDF5F0] p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#2D6A4F]">
              <CheckCircle2 size={18} />
            </span>
            <div>
              <p className="text-[12.5px] font-semibold text-[#1F513A]">
                Your order is with {bakery.name}.
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#2D6A4F]">
                The bakery will confirm your order and reserve stock. Follow the status
                in My Orders. Please bring this receipt to the counter.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-xl border border-[#E6DDD0] bg-white">
          <div className="flex items-start justify-between gap-3 border-b border-dashed border-[#E6DDD0] bg-[#FAF6F0] px-4 py-3">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#9A887A]">
                Order number
              </div>
              <div className="mt-0.5 font-display text-[18px] font-semibold text-[#231812]">
                {order.orderNumber}
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>
          <div className="grid gap-3 px-4 py-3.5 sm:grid-cols-2">
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9A887A]">
                Customer
              </div>
              <div className="mt-0.5 text-[12px] font-medium text-[#231812]">
                {order.customerName}
              </div>
              <div className="text-[10.5px] text-[#6E5A4F]">{order.customerContact}</div>
            </div>
            <div>
              <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9A887A]">
                Pickup
              </div>
              <div className="mt-0.5 text-[12px] font-medium text-[#231812]">
                {fmtDate(order.pickupDate)}
              </div>
              <div className="text-[10.5px] text-[#6E5A4F]">{order.pickupTime}</div>
            </div>
          </div>
          <ul className="divide-y divide-[#F0E8DC] border-t border-[#E6DDD0] px-4">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-start justify-between gap-3 py-2.5">
                <span className="text-[11.5px] text-[#4E4038]">
                  {item.name}
                  <span className="ml-1.5 text-[10px] text-[#9A887A]">× {item.qty}</span>
                </span>
                <span className="shrink-0 text-[11.5px] font-medium text-[#231812] tnum">
                  {peso(item.price * item.qty)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-[#E6DDD0] bg-[#FAF6F0] px-4 py-3">
            <div className="text-[10.5px] text-[#6E5A4F]">
              {order.paymentMethod}
              {order.gcashReference ? ` · ${order.gcashReference}` : ""}
            </div>
            <div className="font-display text-[19px] font-semibold text-[#231812] tnum">
              {peso(order.total)}
            </div>
          </div>
        </div>

        {order.notes && (
          <div className="mt-3 rounded-lg border border-[#E6DDD0] bg-[#FAF6F0] px-3.5 py-2.5 text-[11px] leading-relaxed text-[#6E5A4F]">
            <span className="font-semibold text-[#231812]">Special notes:</span> {order.notes}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-2 border-t border-[#E6DDD0] bg-white px-5 py-3.5 sm:flex-row sm:justify-end sm:px-6">
        <Btn variant="outline" onClick={() => printReceipt(order, bakery)}>
          <Printer size={14} /> Print
        </Btn>
        <Btn variant="outline" onClick={() => downloadReceipt(order, bakery)}>
          <Download size={14} /> Download receipt
        </Btn>
        <Btn
          onClick={() => {
            onClose();
            onTrack?.();
          }}
        >
          Track my order <ArrowRight size={14} />
        </Btn>
      </div>
    </Modal>
  );
}

function OrderTracker({ session, onBack, onReceipt, onSignOut }) {
  const { db } = useDB();
  const [tab, setTab] = useState("active");

  const mine = db.orders
    .filter((order) => {
      if (session.role === "customer") return order.customerId === session.userId;
      if (session.role === "guest") return order.guestKey === session.guestId;
      return false;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const active = mine.filter((order) => !["Completed", "Cancelled"].includes(order.status));
  const history = mine.filter((order) => ["Completed", "Cancelled"].includes(order.status));
  const list = tab === "active" ? active : history;
  const completedSpend = mine
    .filter((order) => order.status === "Completed")
    .reduce((sum, order) => sum + order.total, 0);

  const bakeryFor = (id) => db.bakeries.find((bakery) => bakery.id === id);

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <header className="border-b border-[#E6DDD0] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <BrandMark />
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E6DDD0] bg-white px-3 py-2 text-[11.5px] font-medium text-[#4E4038] transition hover:border-[#C9B8A5] hover:bg-[#FAF6F0]"
            >
              <ArrowLeft size={14} /> Marketplace
            </button>
            <button
              onClick={onSignOut}
              className="rounded-lg p-2 text-[#8A786A] transition hover:bg-[#F3ECE1] hover:text-[#231812]"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#C85A32]">
              <span className="h-px w-7 bg-[#C85A32]/50" /> Order tracking
            </div>
            <h1 className="font-display text-[32px] font-semibold leading-tight text-[#231812] sm:text-[38px]">
              Your bakery orders
            </h1>
            <p className="mt-1 text-[12.5px] text-[#6E5A4F]">
              {session.role === "guest"
                ? "Guest orders placed on this device."
                : `Signed in as ${session.name}.`}{" "}
              Status updates come straight from the bakery counter.
            </p>
          </div>
          <div className="flex gap-2">
            <div className="rounded-xl border border-[#E6DDD0] bg-white px-3.5 py-2">
              <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A887A]">
                Active
              </div>
              <div className="font-display text-[18px] font-semibold leading-none text-[#231812]">
                {active.length}
              </div>
            </div>
            <div className="rounded-xl border border-[#E6DDD0] bg-white px-3.5 py-2">
              <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A887A]">
                Completed spend
              </div>
              <div className="font-display text-[18px] font-semibold leading-none text-[#231812] tnum">
                {peso(completedSpend)}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-4 inline-flex rounded-xl border border-[#E6DDD0] bg-[#F3ECE1]/70 p-1">
          {[
            ["active", "Active", active.length],
            ["history", "History", history.length],
          ].map(([key, label, count]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={cx(
                "flex items-center gap-2 rounded-lg px-4 py-2 text-[12px] font-semibold transition",
                tab === key
                  ? "border border-[#E6DDD0] bg-white text-[#231812] shadow-sm"
                  : "border border-transparent text-[#6E5A4F] hover:text-[#231812]"
              )}
            >
              {label}
              <span
                className={cx(
                  "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold",
                  tab === key ? "bg-[#C85A32] text-white" : "bg-[#E0D4C4] text-[#6E5A4F]"
                )}
              >
                {count}
              </span>
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <Empty
            icon={tab === "active" ? ShoppingBag : Receipt}
            title={tab === "active" ? "No active orders right now" : "No order history yet"}
            body={
              tab === "active"
                ? "When you place a pickup order, you can follow it here from pending to completed."
                : "Completed and cancelled orders will be kept here with downloadable receipts."
            }
            action={
              <Btn onClick={onBack} variant="dark">
                Browse the day's bake <ArrowRight size={14} />
              </Btn>
            }
          />
        ) : (
          <div className="stagger space-y-4">
            {list.map((order) => {
              const bakery = bakeryFor(order.bakeryId);
              return (
                <article
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-[#E6DDD0] bg-white shadow-[0_1px_2px_rgba(35,24,18,0.03)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#F0E8DC] px-4 py-3.5 sm:px-5">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display text-[16px] font-semibold text-[#231812]">
                          {order.orderNumber}
                        </span>
                        <StatusBadge status={order.status} />
                        <span className="rounded border border-[#E6DDD0] bg-[#FAF6F0] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.07em] text-[#8A786A]">
                          {order.type === "reservation" ? "Reservation" : "Standard"}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-[#8A786A]">
                        <span className="inline-flex items-center gap-1">
                          <Store size={11} className="text-[#C85A32]" /> {bakery?.name}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={11} /> {fmtDate(order.pickupDate)} · {order.pickupTime}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-[18px] font-semibold leading-none text-[#231812] tnum">
                        {peso(order.total)}
                      </div>
                      <div className="mt-1 text-[10px] text-[#8A786A]">
                        {order.paymentMethod}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 px-4 py-4 sm:px-5 lg:grid-cols-[1fr_300px] lg:items-center">
                    <div>
                      <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                        {order.items.map((item) => (
                          <li key={item.productId} className="text-[11px] text-[#4E4038]">
                            <span className="font-medium">{item.name}</span>
                            <span className="ml-1 text-[#9A887A]">× {item.qty}</span>
                          </li>
                        ))}
                      </ul>
                      {order.notes && (
                        <p className="mt-2 line-clamp-2 text-[10.5px] italic text-[#8A786A]">
                          “{order.notes}”
                        </p>
                      )}
                      {order.status === "Cancelled" && (
                        <p className="mt-2 flex items-center gap-1.5 text-[10.5px] text-[#A33B22]">
                          <XCircle size={11} /> This order was cancelled. Any reserved stock
                          has been returned to the bakery.
                        </p>
                      )}
                      {order.status === "Completed" && (
                        <p className="mt-2 flex items-center gap-1.5 text-[10.5px] text-[#2D6A4F]">
                          <CheckCircle2 size={11} /> Picked up on {fmtDateTime(order.completedAt)}
                        </p>
                      )}
                    </div>

                    <div>
                      <ProgressSteps status={order.status} />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F0E8DC] bg-[#FAF6F0] px-4 py-2.5 sm:px-5">
                    <span className="text-[10px] text-[#9A887A]">
                      Placed {fmtDateTime(order.createdAt)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Btn
                        size="xs"
                        variant="outline"
                        onClick={() => downloadReceipt(order, bakery)}
                      >
                        <Download size={11} /> Receipt
                      </Btn>
                      <Btn size="xs" variant="soft" onClick={() => onReceipt(order)}>
                        <Eye size={11} /> View details
                      </Btn>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function Marketplace({
  session,
  onSignIn,
  onSignOut,
  onTracker,
  onStaffPortal,
  onAdminPortal,
}) {
  const { db, update } = useDB();
  const toast = useToast();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [bakeryFilter, setBakeryFilter] = useState("all");
  const [sort, setSort] = useState("featured");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [pendingSwitch, setPendingSwitch] = useState(null);
  const [receiptOrder, setReceiptOrder] = useState(null);

  const bakeryMap = useMemo(
    () => Object.fromEntries(db.bakeries.map((bakery) => [bakery.id, bakery])),
    [db.bakeries]
  );
  const productMap = useMemo(
    () => Object.fromEntries(db.products.map((product) => [product.id, product])),
    [db.products]
  );

  const cartItems = useMemo(
    () =>
      (db.cart.items || [])
        .map((item) => {
          const product = productMap[item.productId];
          if (!product) return null;
          return { ...item, product };
        })
        .filter((item) => item && item.qty > 0),
    [db.cart.items, productMap]
  );

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const cartBakery = bakeryMap[db.cart.bakeryId];
  const totals = {
    subtotal: cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0),
    total: cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0),
  };

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    let list = db.products.filter((product) => {
      if (bakeryFilter !== "all" && product.bakeryId !== bakeryFilter) return false;
      if (category !== "All" && product.category !== category) return false;
      if (!query) return true;
      const bakeryName = bakeryMap[product.bakeryId]?.name || "";
      return (
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        bakeryName.toLowerCase().includes(query)
      );
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "stock") list = [...list].sort((a, b) => b.stock - a.stock);
    else
      list = [...list].sort((a, b) => {
        const rank = (product) => (product.stock <= 0 ? 2 : product.stock <= 10 ? 1 : 0);
        return rank(a) - rank(b);
      });

    return list;
  }, [db.products, bakeryFilter, category, search, sort, bakeryMap]);

  const addToCart = (product) => {
    const live = productMap[product.id];
    if (!live || live.stock <= 0) {
      toast("That bake is sold out for today.", "error");
      return;
    }
    if (
      db.cart.bakeryId &&
      db.cart.bakeryId !== live.bakeryId &&
      db.cart.items.length > 0
    ) {
      setPendingSwitch(live);
      return;
    }

    const inBag = db.cart.items.find((item) => item.productId === live.id)?.qty || 0;
    if (inBag >= live.stock) {
      toast(
        `Only ${live.stock} of ${live.name} ${live.stock === 1 ? "is" : "are"} available today.`,
        "info"
      );
      return;
    }

    update((draft) => {
      const current = draft.products.find((item) => item.id === live.id);
      if (!current) return draft;
      if (!draft.cart.bakeryId) draft.cart.bakeryId = current.bakeryId;
      const existing = draft.cart.items.find((item) => item.productId === current.id);
      if (existing) existing.qty = Math.min(existing.qty + 1, current.stock);
      else draft.cart.items.push({ productId: current.id, qty: 1 });
      return draft;
    });
    toast(`${live.name} added to your bag.`);
  };

  const setQty = (productId, qty) => {
    update((draft) => {
      const product = draft.products.find((item) => item.id === productId);
      const item = draft.cart.items.find((entry) => entry.productId === productId);
      if (!item || !product) return draft;
      const capped = Math.max(0, Math.min(qty, product.stock));
      if (capped === 0) {
        draft.cart.items = draft.cart.items.filter((entry) => entry.productId !== productId);
      } else {
        item.qty = capped;
      }
      if (draft.cart.items.length === 0) draft.cart = { ...EMPTY_CART };
      return draft;
    });
  };

  const removeItem = (productId) => {
    update((draft) => {
      draft.cart.items = draft.cart.items.filter((entry) => entry.productId !== productId);
      if (draft.cart.items.length === 0) draft.cart = { ...EMPTY_CART };
      return draft;
    });
    toast("Item removed from your bag.", "info");
  };

  const confirmSwitch = () => {
    if (!pendingSwitch) return;
    const next = pendingSwitch;
    update((draft) => {
      draft.cart = {
        bakeryId: next.bakeryId,
        items: [{ productId: next.id, qty: 1 }],
      };
      return draft;
    });
    setPendingSwitch(null);
    setCartOpen(true);
    toast(`Bag switched to ${bakeryMap[next.bakeryId]?.name}.`);
  };

  const placeOrder = (payload) => {
    const liveItems = db.cart.items
      .map((entry) => {
        const product = productMap[entry.productId];
        if (!product) return null;
        return {
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: entry.qty,
          stock: product.stock,
        };
      })
      .filter(Boolean);

    if (liveItems.length === 0) {
      return { error: "Your bag is empty. Add a bake before checking out." };
    }
    const shortage = liveItems.find((item) => item.qty > item.stock);
    if (shortage) {
      return {
        error: `Only ${shortage.stock} of ${shortage.name} remain. Adjust your bag to continue.`,
      };
    }
    if (!db.cart.bakeryId) {
      return { error: "Choose a bakery before checking out." };
    }

    const subtotal = liveItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order = {
      id: uid("ord"),
      orderNumber: makeOrderNumber(db.orders),
      type: payload.type,
      bakeryId: db.cart.bakeryId,
      customerId: session.role === "customer" ? session.userId : null,
      guestKey: session.role === "guest" ? session.guestId : null,
      customerName: payload.customerName,
      customerContact: payload.customerContact,
      items: liveItems.map(({ stock, ...item }) => item),
      subtotal,
      total: subtotal,
      paymentMethod: payload.paymentMethod,
      gcashReference: payload.gcashReference,
      pickupDate: payload.pickupDate,
      pickupTime: payload.pickupTime,
      notes: payload.notes,
      status: "Pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completedAt: null,
      cancelledAt: null,
      stockDeducted: false,
      channel: "online",
      history: [
        {
          status: "Pending",
          at: new Date().toISOString(),
          actor: payload.customerName,
        },
      ],
    };

    update((draft) => ({
      ...draft,
      orders: [order, ...draft.orders],
      cart: { ...EMPTY_CART },
    }));

    setCheckoutOpen(false);
    setCartOpen(false);
    setReceiptOrder(order);
    toast("Order placed. The bakery will confirm shortly.");
    return { order };
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
    setBakeryFilter("all");
    setSort("featured");
  };

  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach((name) => {
      counts[name] =
        name === "All"
          ? db.products.length
          : db.products.filter((product) => product.category === name).length;
    });
    return counts;
  }, [db.products]);

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <StoreHeader
        session={session}
        search={search}
        setSearch={setSearch}
        cartCount={cartCount}
        onCart={() => setCartOpen(true)}
        onTracker={onTracker}
        onSignOut={onSignOut}
        onSignIn={onSignIn}
        onStaffPortal={onStaffPortal}
        onAdminPortal={onAdminPortal}
      />

      <main>
        {/* Editorial hero */}
        <section className="pugon-glow relative overflow-hidden border-b border-[#E6DDD0]">
          <div className="mx-auto grid max-w-7xl gap-9 px-4 py-10 sm:px-6 md:py-12 lg:grid-cols-[1.06fr_0.94fr] lg:items-center lg:gap-12 lg:px-8 lg:py-16">
            <div className="anim-fade-up">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E6DDD0] bg-white/80 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-[#8A786A]">
                  <MapPin size={10} className="text-[#C85A32]" /> Pototan, Iloilo
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#CBE1D5] bg-[#EDF5F0] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#2D6A4F]">
                  <Flame size={10} /> Pugon-fired since 1962
                </span>
              </div>
              <h1 className="font-display text-[40px] font-semibold leading-[1.02] tracking-tight text-[#231812] sm:text-[52px] lg:text-[58px]">
                Today's bake, from
                <br />
                the town's own{" "}
                <em className="font-light text-[#C85A32]">pugon.</em>
              </h1>
              <p className="mt-4 max-w-lg text-[13.5px] leading-relaxed text-[#6E5A4F] sm:text-[14px]">
                Five independent bakeries, one marketplace. Order warm pandesal,
                ensaymada, heritage biscocho, and celebration cakes directly from the
                families who bake them — then collect at the counter.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Btn
                  size="lg"
                  onClick={() =>
                    document
                      .getElementById("todays-bake")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                >
                  Shop today's bake <ArrowRight size={16} />
                </Btn>
                <Btn
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    document
                      .getElementById("bakeries")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                >
                  Meet the bakeries
                </Btn>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#E6DDD0] pt-4 text-[10.5px] text-[#8A786A]">
                <span className="inline-flex items-center gap-1.5">
                  <Store size={12} className="text-[#C85A32]" /> 5 neighborhood bakeries
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={12} className="text-[#C85A32]" /> Same-day pickup
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Banknote size={12} className="text-[#C85A32]" /> Cash or GCash
                </span>
              </div>
            </div>

            <div className="anim-fade-up relative" style={{ animationDelay: "120ms" }}>
              <div className="relative overflow-hidden rounded-2xl border border-[#E6DDD0] bg-white p-2 shadow-[0_30px_70px_-40px_rgba(35,24,18,0.55)]">
                <SmartImage
                  src={IMG.baker}
                  alt="Fresh bread from a Pototan bakery"
                  className="aspect-[4/3] w-full rounded-xl"
                  imgClassName="object-cover"
                />
                <div className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-white/50 bg-[#231812]/75 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.13em] text-[#FAF6F0] backdrop-blur">
                  <Flame size={11} className="text-[#E9A98F]" /> First batch · 4:00 AM
                </div>
                <div className="absolute bottom-5 right-5 max-w-[190px] rounded-xl border border-[#E6DDD0] bg-[#FAF6F0]/95 p-3 backdrop-blur">
                  <div className="flex items-center justify-between">
                    <span className="text-[8.5px] font-bold uppercase tracking-[0.12em] text-[#9A887A]">
                      Today's counter
                    </span>
                    <Star size={11} className="fill-[#D97706] text-[#D97706]" />
                  </div>
                  <div className="mt-1 font-display text-[26px] font-semibold leading-none text-[#231812]">
                    32
                  </div>
                  <div className="mt-0.5 text-[10px] leading-snug text-[#6E5A4F]">
                    small-batch bakes across five ovens
                  </div>
                </div>
              </div>

              <div className="absolute -left-3 bottom-8 hidden rotate-[-6deg] rounded-lg border border-[#E6DDD0] bg-white px-3 py-2 shadow-[0_8px_24px_-12px_rgba(35,24,18,0.4)] sm:block">
                <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#2D6A4F]">
                  <CheckCircle2 size={11} /> Stock verified
                </div>
                <div className="mt-0.5 text-[9.5px] text-[#8A786A]">
                  Baked and counted each morning
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-xl border border-[#E6DDD0] bg-white/80 px-3.5 py-2.5 text-[10px] text-[#6E5A4F]">
                <span className="flex items-center gap-1.5">
                  <Timer size={12} className="text-[#C85A32]" /> Order until 6:00 PM for
                  same-day pickup
                </span>
                <span className="hidden items-center gap-1 text-[#2D6A4F] sm:flex">
                  <ShieldCheck size={11} /> Local pickup only
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Bakery showcase */}
        <section id="bakeries" className="scroll-mt-24 border-b border-[#E6DDD0]">
          <div className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8 lg:py-11">
            <SectionHead
              eyebrow="The neighborhood"
              title="Five ovens, one town"
              subtitle="Each bakery runs its own stock, schedule, and pickup counter. Choose a branch to see only its bake."
              right={
                <div className="flex items-center gap-2">
                  {bakeryFilter !== "all" && (
                    <Btn size="sm" variant="soft" onClick={() => setBakeryFilter("all")}>
                      <X size={12} /> Clear branch
                    </Btn>
                  )}
                  <span className="hidden text-[10px] uppercase tracking-[0.1em] text-[#9A887A] sm:block">
                    Swipe to explore →
                  </span>
                </div>
              }
            />
            <div className="mt-5">
              <BakeryRail
                bakeries={db.bakeries}
                selected={bakeryFilter}
                onSelect={(value) => setBakeryFilter(value)}
              />
            </div>
          </div>
        </section>

        {/* Sticky categories */}
        <div className="sticky top-0 z-30 border-b border-[#E6DDD0] bg-[#FAF6F0]/95 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 py-2.5">
              <span className="hidden shrink-0 items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.13em] text-[#9A887A] lg:flex">
                <SlidersHorizontal size={12} /> Browse counter
              </span>
              <div className="flex flex-1 gap-1.5 overflow-x-auto no-scrollbar">
                {CATEGORIES.map((name) => {
                  const active = category === name;
                  return (
                    <button
                      key={name}
                      onClick={() => setCategory(name)}
                      className={cx(
                        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition",
                        active
                          ? "border-[#231812] bg-[#231812] text-[#FAF6F0]"
                          : "border-[#E6DDD0] bg-white text-[#6E5A4F] hover:border-[#C9B8A5] hover:text-[#231812]"
                      )}
                    >
                      {name}
                      <span
                        className={cx(
                          "text-[9px] font-bold",
                          active ? "text-[#E9A98F]" : "text-[#B7A695]"
                        )}
                      >
                        {categoryCounts[name]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Product grid */}
        <section id="todays-bake" className="scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-1.5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#C85A32]">
                  <Flame size={12} /> {bakeryFilter === "all" ? "All bakeries" : bakeryMap[bakeryFilter]?.name}
                </div>
                <h2 className="font-display text-[26px] font-semibold leading-tight text-[#231812] sm:text-[30px]">
                  {search ? `Results for “${search}”` : "Today's bake"}
                </h2>
                <p className="mt-1 text-[12px] text-[#6E5A4F]">
                  {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
                  {category !== "All" ? ` in ${category}` : ""} · prices in Philippine pesos
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    className="h-9 appearance-none rounded-lg border border-[#E6DDD0] bg-white pl-3 pr-8 text-[11.5px] font-medium text-[#4E4038] outline-none transition focus:border-[#C85A32]"
                    aria-label="Sort products"
                  >
                    <option value="featured">Featured order</option>
                    <option value="price-asc">Price: low to high</option>
                    <option value="price-desc">Price: high to low</option>
                    <option value="stock">Most stock</option>
                  </select>
                  <ChevronDown
                    size={13}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A786A]"
                  />
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <Empty
                title="No bakes match this counter"
                body="Try another category, clear the bakery filter, or search for pandesal, biscocho, or cake."
                action={
                  <Btn variant="dark" onClick={clearFilters}>
                    <RefreshCw size={14} /> Reset filters
                  </Btn>
                }
              />
            ) : (
              <div className="stagger grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    bakery={bakeryMap[product.bakeryId]}
                    onAdd={addToCart}
                  />
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-[#E6DDD0] bg-white px-5 py-4 sm:flex-row">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3ECE1] text-[#C85A32]">
                  <Info size={16} />
                </span>
                <div>
                  <p className="text-[12px] font-semibold text-[#231812]">
                    One bakery per bag, always.
                  </p>
                  <p className="text-[10.5px] text-[#6E5A4F]">
                    Adding a bake from another branch will ask before clearing your bag.
                  </p>
                </div>
              </div>
              <Btn variant="outline" size="sm" onClick={() => setCartOpen(true)}>
                Review my bag ({cartCount}) <ChevronRight size={13} />
              </Btn>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#E6DDD0] bg-[#231812] text-[#C9B8A5]">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr] lg:px-8">
          <div>
            <BrandMark dark />
            <p className="mt-4 max-w-sm text-[11.5px] leading-relaxed text-[#9A887A]">
              A shared ordering counter for the artisanal bakeries of Pototan, Iloilo.
              Built around wood-fired pugon traditions, small-batch stock, and the
              families who keep them alive.
            </p>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] text-[#7E6B5C]">
              <MapPin size={11} className="text-[#C85A32]" /> Poblacion, Pototan, Iloilo 5003
            </div>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#E9A98F]">
              Marketplace
            </div>
            <ul className="mt-3 space-y-2 text-[11.5px]">
              <li>
                <button
                  onClick={() => setBakeryFilter("all")}
                  className="transition hover:text-white"
                >
                  All five bakeries
                </button>
              </li>
              <li>
                <button onClick={onTracker} className="transition hover:text-white">
                  My bakery orders
                </button>
              </li>
              <li>
                <button onClick={onSignIn} className="transition hover:text-white">
                  Sign in / create account
                </button>
              </li>
              <li>
                <button onClick={onStaffPortal} className="transition hover:text-white">
                  Bakery partner portal
                </button>
              </li>
              <li>
                <button onClick={onAdminPortal} className="transition hover:text-white">
                  Admin oversight
                </button>
              </li>
            </ul>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#E9A98F]">
              Pickup notes
            </div>
            <ul className="mt-3 space-y-2 text-[11.5px] text-[#9A887A]">
              <li className="flex items-start gap-2">
                <Clock size={12} className="mt-0.5 shrink-0 text-[#C85A32]" />
                Bakery hours vary; check the branch card before ordering.
              </li>
              <li className="flex items-start gap-2">
                <Banknote size={12} className="mt-0.5 shrink-0 text-[#C85A32]" />
                Cash on pickup or GCash with a 13-digit reference.
              </li>
              <li className="flex items-start gap-2">
                <Package size={12} className="mt-0.5 shrink-0 text-[#C85A32]" />
                No delivery. Orders are held for two hours past pickup.
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-[9.5px] text-[#7E6B5C] sm:flex-row sm:px-6 lg:px-8">
            <span>
              © {new Date().getFullYear()} Pototan Artisanal Bakery Ordering & Management
              Platform
            </span>
            <span>Made for the bakeries of Pototan · Pickup only</span>
          </div>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        bakery={cartBakery}
        totals={totals}
        onQty={setQty}
        onRemove={removeItem}
        onCheckout={() => {
          if (cartItems.length === 0) return;
          if (cartItems.some((item) => item.qty > item.product.stock)) {
            toast("Some quantities exceed current stock. Reduce them to continue.", "error");
            return;
          }
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
        onBrowse={() => {
          setCartOpen(false);
          document
            .getElementById("todays-bake")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />

      <SwitchBakeryModal
        open={Boolean(pendingSwitch)}
        onClose={() => setPendingSwitch(null)}
        currentBakery={cartBakery}
        nextProduct={pendingSwitch}
        nextBakery={pendingSwitch ? bakeryMap[pendingSwitch.bakeryId] : null}
        onConfirm={confirmSwitch}
      />

      <CheckoutSheet
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        cartItems={cartItems}
        bakery={cartBakery}
        session={session}
        totals={totals}
        onPlace={placeOrder}
      />

      <ReceiptModal
        open={Boolean(receiptOrder)}
        order={receiptOrder}
        bakery={receiptOrder ? bakeryMap[receiptOrder.bakeryId] : null}
        onClose={() => setReceiptOrder(null)}
        onTrack={() => {
          setReceiptOrder(null);
          onTracker();
        }}
      />
    </div>
  );
}

/* ======================== 10. STAFF WORKSPACE =========================== */

const STAFF_NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "inventory", label: "Inventory", icon: Boxes },
  { key: "orders", label: "Orders", icon: ClipboardList },
  { key: "reservations", label: "Reservations", icon: CalendarDays },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
];

const SECTION_COPY = {
  dashboard: {
    title: "Bakery dashboard",
    subtitle: "Today's counter, confirmations, and stock health at a glance.",
  },
  inventory: {
    title: "Inventory",
    subtitle: "Your branch's bakes, prices, schedules, and available stock.",
  },
  orders: {
    title: "Standard orders",
    subtitle: "Confirm, prepare, and complete same-day pickup orders.",
  },
  reservations: {
    title: "Advance reservations",
    subtitle: "Scheduled pickups with notes and GCash references.",
  },
  analytics: {
    title: "Bakery analytics",
    subtitle: "Revenue, best sellers, and monthly performance for this branch.",
  },
};

const buildMonthlySeries = (orders, monthCount = 6) => {
  const now = new Date();
  const keys = [];
  for (let index = monthCount - 1; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    keys.push(
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    );
  }
  return keys.map((key) => {
    const monthOrders = orders.filter((order) => monthKey(order.createdAt) === key);
    const completed = monthOrders.filter((order) => order.status === "Completed");
    return {
      key,
      label: monthLabel(key),
      fullLabel: monthLabelLong(key),
      revenue: completed.reduce((sum, order) => sum + order.total, 0),
      orders: monthOrders.filter((order) => order.type === "standard").length,
      reservations: monthOrders.filter((order) => order.type === "reservation").length,
      completed: completed.length,
    };
  });
};

function productRevenueFrom(orders) {
  const map = new Map();
  orders
    .filter((order) => order.status === "Completed")
    .forEach((order) => {
      order.items.forEach((item) => {
        const current = map.get(item.productId) || {
          productId: item.productId,
          name: item.name,
          revenue: 0,
          qty: 0,
        };
        current.revenue += item.price * item.qty;
        current.qty += item.qty;
        map.set(item.productId, current);
      });
    });
  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
}

function StaffShell({ bakery, session, section, setSection, counts, onExit, children }) {
  const [navOpen, setNavOpen] = useState(false);

  const nav = (
    <nav className="mt-5 space-y-1 px-3">
      {STAFF_NAV.map((item) => {
        const Icon = item.icon;
        const active = section === item.key;
        const badge =
          item.key === "orders"
            ? counts.pendingOrders
            : item.key === "reservations"
            ? counts.pendingReservations
            : item.key === "inventory"
            ? counts.lowStock
            : 0;
        return (
          <button
            key={item.key}
            onClick={() => {
              setSection(item.key);
              setNavOpen(false);
            }}
            className={cx(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-[12.5px] font-medium transition",
              active
                ? "bg-[#C85A32] text-white shadow-[0_4px_12px_-4px_rgba(200,90,50,0.6)]"
                : "text-[#BDAE9F] hover:bg-white/[0.06] hover:text-white"
            )}
          >
            <Icon size={16} strokeWidth={1.8} />
            <span className="flex-1 text-left">{item.label}</span>
            {badge > 0 && (
              <span
                className={cx(
                  "flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold",
                  active ? "bg-white/20 text-white" : "bg-[#C85A32]/15 text-[#E9A98F]"
                )}
              >
                {badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  const sidebarBody = (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-5">
        <BrandMark dark compact />
        <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-[0.14em] text-[#8A786A]">
            <Store size={10} className="text-[#C85A32]" /> Assigned branch
          </div>
          <div className="mt-1.5 text-[12px] font-semibold leading-snug text-[#FAF6F0]">
            {bakery.name}
          </div>
          <div className="mt-0.5 text-[9.5px] text-[#9A887A]">{bakery.barangay} · Pototan</div>
          <div className="mt-2 flex items-center gap-1.5 text-[9px] text-[#BDAE9F]">
            <Clock size={9} /> {bakery.hours}
          </div>
        </div>
      </div>

      {nav}

      <div className="mt-auto border-t border-white/10 p-3">
        <div className="mb-2 flex items-center gap-2.5 rounded-lg bg-white/[0.04] px-2.5 py-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C85A32]/15 text-[11px] font-bold text-[#E9A98F]">
            {session.name?.charAt(0) || "S"}
          </span>
          <div className="min-w-0">
            <div className="truncate text-[11px] font-semibold text-[#FAF6F0]">
              {session.name}
            </div>
            <div className="truncate text-[8.5px] uppercase tracking-[0.08em] text-[#8A786A]">
              {session.role.replace("_", " ")}
            </div>
          </div>
        </div>
        <button
          onClick={onExit}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-medium text-[#BDAE9F] transition hover:bg-white/[0.06] hover:text-white"
        >
          <LogOut size={13} /> Sign out of workspace
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF6F0]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[252px] flex-col bg-[#231812] lg:flex">
        {sidebarBody}
      </aside>

      {navOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div
            className="anim-fade-in absolute inset-0 bg-[#231812]/55 backdrop-blur-[2px]"
            onClick={() => setNavOpen(false)}
          />
          <aside className="anim-slide-left absolute inset-y-0 left-0 w-[280px] bg-[#231812]">
            <button
              onClick={() => setNavOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-lg p-1.5 text-[#BDAE9F] hover:bg-white/10 hover:text-white"
              aria-label="Close menu"
            >
              <X size={17} />
            </button>
            {sidebarBody}
          </aside>
        </div>
      )}

      <div className="lg:pl-[252px]">
        <header className="sticky top-0 z-30 border-b border-[#E6DDD0] bg-[#FAF6F0]/95 backdrop-blur">
          <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 xl:px-8">
            <div className="flex min-w-0 items-center gap-2.5">
              <button
                onClick={() => setNavOpen(true)}
                className="rounded-lg border border-[#E6DDD0] bg-white p-2 text-[#4E4038] lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={17} />
              </button>
              <div className="min-w-0">
                <div className="truncate text-[9px] font-bold uppercase tracking-[0.14em] text-[#9A887A]">
                  {bakery.name}
                </div>
                <div className="truncate font-display text-[15px] font-semibold leading-tight text-[#231812] sm:text-[17px]">
                  {SECTION_COPY[section]?.title}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full border border-[#CBE1D5] bg-[#EDF5F0] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#2D6A4F] sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2D6A4F]" /> Branch scoped
              </span>
              <span className="hidden text-[10.5px] text-[#8A786A] md:block">
                {fmtDate(todayISO(), { weekday: "short" })} ·{" "}
                {AS_OF_LABEL}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#231812] text-[10px] font-bold text-[#FAF6F0]">
                {session.name?.charAt(0) || "S"}
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-5 sm:px-6 sm:py-6 xl:px-8 xl:py-7">{children}</main>
      </div>
    </div>
  );
}

const AS_OF_LABEL = new Date().toLocaleDateString("en-PH", {
  month: "short",
  day: "numeric",
});

function OrderActions({ order, onChange, size = "xs", onCancel }) {
  const active = ["Pending", "Confirmed", "Ready For Pickup"].includes(order.status);
  const confirmAction =
    order.status === "Pending"
      ? { label: "Confirm", next: "Confirmed", variant: "green", icon: Check }
      : order.status === "Confirmed"
      ? {
          label: "Mark ready",
          next: "Ready For Pickup",
          variant: "ube",
          icon: Package,
        }
      : order.status === "Ready For Pickup"
      ? {
          label: "Complete",
          next: "Completed",
          variant: "primary",
          icon: CheckCircle2,
        }
      : null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {confirmAction && (
        <Btn
          size={size}
          variant={confirmAction.variant}
          onClick={() => onChange(order, confirmAction.next)}
        >
          <confirmAction.icon size={11} /> {confirmAction.label}
        </Btn>
      )}
      {active && (
        <Btn
          size={size}
          variant="dangerGhost"
          onClick={() => (onCancel ? onCancel(order) : onChange(order, "Cancelled"))}
        >
          <X size={11} /> Cancel
        </Btn>
      )}
      {!active && (
        <span className="text-[10px] italic text-[#A6968A]">
          {order.status === "Completed" ? "Fulfilled" : "Closed"}
        </span>
      )}
    </div>
  );
}

function OrderDetailModal({ open, onClose, order, bakery, onChange, onCancel }) {
  if (!order) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={`Order ${order.orderNumber}`}
      subtitle={`${order.type === "reservation" ? "Advance reservation" : "Standard order"} · ${
        bakery?.name
      }`}
      headerAccent="Order detail"
    >
      <div className="px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <StatusBadge status={order.status} />
              <Badge className="border-[#E6DDD0] bg-[#FAF6F0] text-[#6E5A4F]">
                {order.paymentMethod}
              </Badge>
            </div>
            <p className="mt-2 text-[11px] text-[#8A786A]">
              Placed {fmtDateTime(order.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <div className="font-display text-[24px] font-semibold leading-none text-[#231812] tnum">
              {peso(order.total)}
            </div>
            <div className="mt-1 text-[10px] text-[#8A786A]">
              {order.items.reduce((sum, item) => sum + item.qty, 0)} items
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#E6DDD0] bg-white p-3.5">
            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9A887A]">
              Customer
            </div>
            <div className="mt-1 text-[12.5px] font-semibold text-[#231812]">
              {order.customerName}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#6E5A4F]">
              <Phone size={11} /> {order.customerContact}
            </div>
          </div>
          <div className="rounded-xl border border-[#E6DDD0] bg-white p-3.5">
            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9A887A]">
              Pickup schedule
            </div>
            <div className="mt-1 text-[12.5px] font-semibold text-[#231812]">
              {fmtDate(order.pickupDate)}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#6E5A4F]">
              <Clock size={11} /> {order.pickupTime}
            </div>
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-xl border border-[#E6DDD0] bg-white">
          <table className="w-full text-[11.5px]">
            <thead>
              <tr className="border-b border-[#E6DDD0] bg-[#FAF6F0] text-left text-[9px] uppercase tracking-[0.1em] text-[#9A887A]">
                <th className="px-3.5 py-2 font-semibold">Item</th>
                <th className="px-2 py-2 text-center font-semibold">Qty</th>
                <th className="px-2 py-2 text-right font-semibold">Price</th>
                <th className="px-3.5 py-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {order.items.map((item) => (
                <tr key={item.productId}>
                  <td className="px-3.5 py-2.5 text-[#231812]">{item.name}</td>
                  <td className="px-2 py-2.5 text-center tnum">{item.qty}</td>
                  <td className="px-2 py-2.5 text-right text-[#6E5A4F] tnum">
                    {peso(item.price)}
                  </td>
                  <td className="px-3.5 py-2.5 text-right font-medium text-[#231812] tnum">
                    {peso(item.price * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#E6DDD0] bg-[#FAF6F0]">
                <td colSpan={3} className="px-3.5 py-2 text-right text-[10px] uppercase tracking-[0.08em] text-[#8A786A]">
                  Total
                </td>
                <td className="px-3.5 py-2 text-right font-display text-[16px] font-semibold text-[#231812] tnum">
                  {peso(order.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-[#E6DDD0] bg-white p-3.5">
            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9A887A]">
              Payment
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[11.5px] font-medium text-[#231812]">
              {order.paymentMethod === "GCash" ? (
                <Smartphone size={12} className="text-[#2D6A4F]" />
              ) : (
                <Banknote size={12} className="text-[#D97706]" />
              )}
              {order.paymentMethod}
            </div>
            {order.gcashReference && (
              <div className="mt-1 text-[10.5px] text-[#6E5A4F]">
                Ref: <span className="tracking-[0.06em]">{order.gcashReference}</span>
              </div>
            )}
            {order.stockDeducted && (
              <div className="mt-1.5 flex items-center gap-1 text-[9.5px] text-[#2D6A4F]">
                <CheckCircle2 size={10} /> Stock deducted at confirmation
              </div>
            )}
          </div>
          <div className="rounded-xl border border-[#E6DDD0] bg-white p-3.5">
            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9A887A]">
              Order timeline
            </div>
            <ol className="mt-1.5 space-y-1.5">
              {(order.history || []).map((entry, index) => (
                <li key={`${entry.status}-${index}`} className="flex items-start gap-2">
                  <span
                    className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor: STATUS_META[entry.status]?.dot || "#B7A695",
                    }}
                  />
                  <div className="min-w-0 text-[10px] leading-snug">
                    <span className="font-medium text-[#231812]">{entry.status}</span>
                    <span className="text-[#9A887A]"> · {fmtDateTime(entry.at)}</span>
                    {entry.note && (
                      <div className="text-[9.5px] italic text-[#8A786A]">{entry.note}</div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {order.notes && (
          <div className="mt-3 rounded-lg border border-[#EBD9B4] bg-[#FBF4E6] px-3.5 py-2.5 text-[11px] leading-relaxed text-[#8A5A10]">
            <span className="font-semibold">Special notes:</span> {order.notes}
          </div>
        )}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E6DDD0] bg-white px-5 py-3.5 sm:px-6">
        <Btn variant="outline" size="sm" onClick={() => printReceipt(order, bakery)}>
          <Printer size={13} /> Print slip
        </Btn>
        <div className="flex flex-wrap items-center gap-2">
          <OrderActions order={order} onChange={onChange} onCancel={onCancel} size="sm" />
        </div>
      </div>
    </Modal>
  );
}

function StaffDashboard({ bakery, session, products, orders, onChangeOrder, onOpenOrder, onGoTo, onCancelOrder }) {
  const completed = orders.filter((order) => order.status === "Completed");
  const completedOrders = completed.filter((order) => order.type === "standard");
  const completedReservations = completed.filter((order) => order.type === "reservation");
  const revenue = completed.reduce((sum, order) => sum + order.total, 0);
  const lowStock = products.filter((product) => product.stock <= 10);
  const pending = orders.filter((order) => order.status === "Pending");
  const ready = orders.filter((order) => order.status === "Ready For Pickup");
  const monthRevenue = completed
    .filter((order) => monthKey(order.createdAt) === monthKey(todayISO()))
    .reduce((sum, order) => sum + order.total, 0);
  const todayPickups = orders
    .filter(
      (order) =>
        order.pickupDate === todayISO() &&
        ["Pending", "Confirmed", "Ready For Pickup"].includes(order.status)
    )
    .sort((a, b) => a.pickupTime.localeCompare(b.pickupTime));

  const attention = [...pending, ...ready]
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .slice(0, 5);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#C85A32]">
            <span className="h-px w-6 bg-[#C85A32]/50" /> {bakery.barangay} counter
          </div>
          <h1 className="font-display text-[25px] font-semibold leading-tight text-[#231812] sm:text-[29px]">
            {greeting}, {session.name.split(" ")[0]}.
          </h1>
          <p className="mt-1 text-[12px] text-[#6E5A4F]">
            {fortuneLine(pending.length, ready.length, lowStock.length)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Btn size="sm" variant="outline" onClick={() => onGoTo("orders")}>
            <ClipboardList size={13} /> Open order queue
          </Btn>
          <Btn size="sm" onClick={() => onGoTo("inventory")}>
            <Plus size={13} /> Add product
          </Btn>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi
          label="Gross revenue"
          value={peso(revenue)}
          icon={CircleDollarSign}
          hint={`${completed.length} completed fulfillments`}
          accent="#2D6A4F"
        />
        <Kpi
          label="Completed orders"
          value={completedOrders.length}
          icon={ClipboardList}
          hint="Standard pickup tickets"
          accent="#C85A32"
        />
        <Kpi
          label="Completed reservations"
          value={completedReservations.length}
          icon={CalendarCheck}
          hint="Advance pickup tickets"
          accent="#6C3B8C"
        />
        <Kpi
          label="Low stock alerts"
          value={lowStock.length}
          icon={AlertTriangle}
          hint={lowStock.filter((product) => product.stock <= 0).length + " sold out today"}
          accent="#D97706"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <div className="rounded-xl border border-[#E6DDD0] bg-white">
          <div className="flex items-center justify-between border-b border-[#E6DDD0] px-4 py-3">
            <div>
              <h2 className="font-display text-[16px] font-semibold text-[#231812]">
                Needs your attention
              </h2>
              <p className="text-[10.5px] text-[#8A786A]">
                Pending confirmations and ready-for-pickup tickets
              </p>
            </div>
            <button
              onClick={() => onGoTo("orders")}
              className="text-[10.5px] font-semibold text-[#C85A32] hover:underline"
            >
              View all
            </button>
          </div>
          {attention.length === 0 ? (
            <div className="px-4 py-9 text-center">
              <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#EDF5F0] text-[#2D6A4F]">
                <CheckCircle2 size={19} />
              </span>
              <p className="text-[12px] font-medium text-[#231812]">The counter is clear.</p>
              <p className="mt-0.5 text-[10.5px] text-[#8A786A]">
                New orders will appear here in real time.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-[#F0E8DC]">
              {attention.map((order) => (
                <li key={order.id} className="px-4 py-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => onOpenOrder(order)}
                          className="font-display text-[13px] font-semibold text-[#231812] hover:text-[#C85A32]"
                        >
                          {order.orderNumber}
                        </button>
                        <StatusBadge status={order.status} />
                        <span className="rounded border border-[#E6DDD0] bg-[#FAF6F0] px-1.5 py-0.5 text-[8.5px] font-semibold uppercase tracking-[0.06em] text-[#8A786A]">
                          {order.type === "reservation" ? "Reservation" : "Standard"}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-[#8A786A]">
                        <span>{order.customerName}</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={9} /> {order.pickupTime}
                        </span>
                        <span className="tnum">{peso(order.total)}</span>
                      </div>
                    </div>
                    <OrderActions
                      order={order}
                      onChange={onChangeOrder}
                      onCancel={onCancelOrder}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[#E6DDD0] bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[16px] font-semibold text-[#231812]">
                Today at the counter
              </h2>
              <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A887A]">
                {fmtDate(todayISO(), { weekday: "short" })}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-[#E6DDD0] bg-[#FAF6F0] p-2.5">
                <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#9A887A]">
                  Revenue today
                </div>
                <div className="mt-1 font-display text-[18px] font-semibold leading-none text-[#231812] tnum">
                  {peso(
                    completed
                      .filter((order) => toISODate(order.createdAt) === todayISO())
                      .reduce((sum, order) => sum + order.total, 0)
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-[#E6DDD0] bg-[#FAF6F0] p-2.5">
                <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#9A887A]">
                  Month to date
                </div>
                <div className="mt-1 font-display text-[18px] font-semibold leading-none text-[#231812] tnum">
                  {peso(monthRevenue)}
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="mb-2 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A887A]">
                <span>Pickup schedule</span>
                <span>{todayPickups.length} tickets</span>
              </div>
              {todayPickups.length === 0 ? (
                <p className="rounded-lg border border-dashed border-[#E6DDD0] px-3 py-4 text-center text-[10.5px] text-[#A6968A]">
                  No pickups scheduled for today yet.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {todayPickups.slice(0, 4).map((order) => (
                    <li
                      key={order.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-[#E6DDD0] px-2.5 py-1.5"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-[10.5px] font-medium text-[#231812]">
                          {order.customerName}
                        </div>
                        <div className="text-[9px] text-[#9A887A]">
                          {order.orderNumber} · {order.pickupTime}
                        </div>
                      </div>
                      <StatusBadge status={order.status} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#E6DDD0] bg-white p-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-[16px] font-semibold text-[#231812]">
                Low stock watch
              </h2>
              <button
                onClick={() => onGoTo("inventory")}
                className="text-[10px] font-semibold text-[#C85A32] hover:underline"
              >
                Manage
              </button>
            </div>
            {lowStock.length === 0 ? (
              <p className="mt-2 text-[10.5px] text-[#8A786A]">
                All products are above the low-stock threshold.
              </p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {lowStock.slice(0, 4).map((product) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between gap-2 rounded-lg border border-[#E6DDD0] px-2.5 py-1.5"
                  >
                    <span className="min-w-0 truncate text-[10.5px] text-[#231812]">
                      {product.name}
                    </span>
                    <StockBadge stock={product.stock} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[#E6DDD0] bg-[#231812] px-4 py-3.5 text-[#FAF6F0]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[#E9A98F]">
              <Flame size={15} />
            </span>
            <div>
              <div className="text-[11.5px] font-semibold">
                Stock automation is active for this branch.
              </div>
              <div className="text-[10px] text-[#BDAE9F]">
                Confirming an order deducts stock. Cancelling a confirmed order restores it.
              </div>
            </div>
          </div>
          <Btn size="sm" variant="cream" onClick={() => onGoTo("inventory")}>
            Review inventory <ArrowRight size={12} />
          </Btn>
        </div>
      </div>
    </div>
  );
}

function fortuneLine(pending, ready, low) {
  if (pending === 0 && ready === 0) {
    return low > 0
      ? `No tickets waiting. ${low} item${low === 1 ? "" : "s"} need a stock check before tomorrow's bake.`
      : "No tickets waiting. The counter is ready for the next batch.";
  }
  return `${pending} order${pending === 1 ? "" : "s"} awaiting confirmation · ${ready} ready for pickup · ${low} stock watch.`;
}

function ProductFormModal({ open, onClose, product, onSave }) {
  const blank = {
    name: "",
    category: CATEGORIES[1],
    description: "",
    price: "",
    stock: "",
    bakingSchedule: "",
    image: "",
  };
  const [values, setValues] = useState(blank);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setValues(
      product
        ? {
            name: product.name,
            category: product.category,
            description: product.description,
            price: String(product.price),
            stock: String(product.stock),
            bakingSchedule: product.bakingSchedule,
            image: product.image,
          }
        : blank
    );
  }, [open, product]);

  const set = (key) => (event) =>
    setValues((prev) => ({ ...prev, [key]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    const next = {};
    if (values.name.trim().length < 3) next.name = "Enter a product name.";
    if (!CATEGORIES.includes(values.category)) next.category = "Choose a category.";
    if (values.description.trim().length < 10)
      next.description = "Write at least a short description.";
    if (!values.price || Number(values.price) <= 0)
      next.price = "Enter a price greater than zero.";
    if (values.stock === "" || Number(values.stock) < 0 || !Number.isInteger(Number(values.stock)))
      next.stock = "Enter a whole number of available stock.";
    if (values.bakingSchedule.trim().length < 3)
      next.bakingSchedule = "Add the baking or preparation schedule.";
    if (!/^https?:\/\/.+/i.test(values.image.trim()))
      next.image = "Paste a valid image URL starting with http:// or https://.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    onSave({
      name: values.name.trim(),
      category: values.category,
      description: values.description.trim(),
      price: Number(values.price),
      stock: Number(values.stock),
      bakingSchedule: values.bakingSchedule.trim(),
      image: values.image.trim(),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={product ? "Edit product" : "Add a new product"}
      subtitle={
        product
          ? "Update price, category, description, stock, or the bake schedule."
          : "New bakes go live in the marketplace immediately."
      }
      headerAccent={product ? "Inventory update" : "New inventory"}
    >
      <form onSubmit={submit}>
        <div className="grid gap-4 px-5 py-5 sm:grid-cols-[1fr_170px] sm:px-6">
          <div className="space-y-3.5">
            <Field label="Product name" required error={errors.name}>
              <input
                value={values.name}
                onChange={set("name")}
                placeholder="e.g. Pugon Pandesal (Dozen)"
                className={INPUT_CLS}
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Category" required error={errors.category}>
                <div className="relative">
                  <select
                    value={values.category}
                    onChange={set("category")}
                    className={SELECT_CLS}
                  >
                    {CATEGORIES.filter((name) => name !== "All").map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A786A]"
                  />
                </div>
              </Field>
              <Field label="Baking schedule" required error={errors.bakingSchedule}>
                <input
                  value={values.bakingSchedule}
                  onChange={set("bakingSchedule")}
                  placeholder="Baked 4:00 AM"
                  className={INPUT_CLS}
                />
              </Field>
            </div>
            <Field label="Description" required error={errors.description}>
              <textarea
                rows={4}
                value={values.description}
                onChange={set("description")}
                placeholder="What makes this bake worth the trip?"
                className={`${INPUT_CLS} resize-none`}
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Price (PHP)" required error={errors.price}>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[12px] text-[#8A786A]">
                    ₱
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={values.price}
                    onChange={set("price")}
                    placeholder="0.00"
                    className={`${INPUT_CLS} pl-8`}
                  />
                </div>
              </Field>
              <Field label="Stock available" required error={errors.stock}>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={values.stock}
                  onChange={set("stock")}
                  placeholder="0"
                  className={INPUT_CLS}
                />
              </Field>
            </div>
            <Field
              label="Product image URL"
              required
              error={errors.image}
              hint="Use a public image URL. The marketplace falls back to a pugon placeholder if it cannot load."
            >
              <input
                value={values.image}
                onChange={set("image")}
                placeholder="https://images.unsplash.com/..."
                className={INPUT_CLS}
              />
            </Field>
          </div>

          <div>
            <div className="text-[11.5px] font-semibold uppercase tracking-[0.09em] text-[#6E5A4F]">
              Preview
            </div>
            <SmartImage
              src={values.image}
              alt="Product preview"
              className="mt-1.5 aspect-square w-full rounded-xl border border-[#E6DDD0]"
              fallbackLabel="Image preview"
            />
            <div className="mt-2 rounded-lg border border-[#E6DDD0] bg-[#FAF6F0] p-2.5">
              <div className="truncate font-display text-[12px] font-semibold text-[#231812]">
                {values.name || "Product name"}
              </div>
              <div className="mt-0.5 flex items-center justify-between">
                <span className="text-[10px] text-[#8A786A]">
                  {values.category}
                </span>
                <span className="text-[11px] font-semibold text-[#231812]">
                  {peso(Number(values.price) || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-[#E6DDD0] bg-white px-5 py-3.5 sm:flex-row sm:justify-end sm:px-6">
          <Btn variant="outline" onClick={onClose}>
            Cancel
          </Btn>
          <Btn type="submit">
            {product ? "Save changes" : "Add product"} <Check size={14} />
          </Btn>
        </div>
      </form>
    </Modal>
  );
}

function StaffInventory({ products, onSaveProduct, onDeleteProduct }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return products
      .filter((product) => {
        if (query && !`${product.name} ${product.category}`.toLowerCase().includes(query))
          return false;
        const meta = stockMeta(product.stock);
        if (filter === "in" && meta.key !== "in") return false;
        if (filter === "low" && meta.key !== "low") return false;
        if (filter === "out" && meta.key !== "out") return false;
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products, search, filter]);

  const counts = {
    all: products.length,
    in: products.filter((product) => stockMeta(product.stock).key === "in").length,
    low: products.filter((product) => stockMeta(product.stock).key === "low").length,
    out: products.filter((product) => stockMeta(product.stock).key === "out").length,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[25px] font-semibold leading-tight text-[#231812] sm:text-[29px]">
            Inventory
          </h1>
          <p className="mt-1 text-[12px] text-[#6E5A4F]">
            {products.length} products · {counts.out} sold out · stock is deducted only when
            you confirm an order.
          </p>
        </div>
        <Btn
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus size={15} /> Add product
        </Btn>
      </div>

      <div className="rounded-xl border border-[#E6DDD0] bg-white">
        <div className="flex flex-col gap-2.5 border-b border-[#E6DDD0] p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#A6968A]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search this bakery's products…"
              className={`${INPUT_CLS} h-9 pl-9 text-[12px]`}
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {[
              ["all", "All", counts.all],
              ["in", "In stock", counts.in],
              ["low", "Low", counts.low],
              ["out", "Sold out", counts.out],
            ].map(([key, label, count]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cx(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10.5px] font-medium transition",
                  filter === key
                    ? "border-[#231812] bg-[#231812] text-white"
                    : "border-[#E6DDD0] bg-white text-[#6E5A4F] hover:border-[#C9B8A5]"
                )}
              >
                {label}
                <span
                  className={cx(
                    "text-[9px] font-bold",
                    filter === key ? "text-[#E9A98F]" : "text-[#B7A695]"
                  )}
                >
                  {count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <Empty
            icon={Package}
            title="No products match this view"
            body="Adjust the search or stock filter, or add a new bake to this branch."
            className="border-0 bg-transparent"
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full text-left text-[12px]">
                <thead>
                  <tr className="border-b border-[#E6DDD0] bg-[#FAF6F0] text-[9px] uppercase tracking-[0.11em] text-[#9A887A]">
                    <th className="px-4 py-2.5 font-semibold">Product</th>
                    <th className="px-3 py-2.5 font-semibold">Category</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Price</th>
                    <th className="px-3 py-2.5 text-center font-semibold">Stock</th>
                    <th className="px-3 py-2.5 font-semibold">Bake schedule</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8DC]">
                  {filtered.map((product) => (
                    <tr key={product.id} className="transition hover:bg-[#FAF6F0]/70">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <SmartImage
                            src={product.image}
                            alt={product.name}
                            className="h-10 w-10 shrink-0 rounded-lg"
                            fallbackLabel="Bake"
                          />
                          <div className="min-w-0">
                            <div className="truncate text-[12px] font-semibold text-[#231812]">
                              {product.name}
                            </div>
                            <div className="max-w-[260px] truncate text-[10px] text-[#9A887A]">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-[10.5px] text-[#6E5A4F]">
                        {product.category}
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium text-[#231812] tnum">
                        {peso(product.price)}
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[11px] font-semibold text-[#231812] tnum">
                            {product.stock}
                          </span>
                          <StockBadge stock={product.stock} />
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-[10.5px] text-[#6E5A4F]">
                        {product.bakingSchedule}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setEditing(product);
                              setFormOpen(true);
                            }}
                            className="rounded-md border border-[#E6DDD0] bg-white p-1.5 text-[#6E5A4F] transition hover:border-[#C9B8A5] hover:text-[#231812]"
                            title="Edit product"
                          >
                            <Pencil size={12} />
                          </button>
                          <button
                            onClick={() => setDeleting(product)}
                            className="rounded-md border border-[#EBCFC7] bg-white p-1.5 text-[#A33B22] transition hover:bg-[#FBF0ED]"
                            title="Delete product"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#F0E8DC] lg:hidden">
              {filtered.map((product) => (
                <div key={product.id} className="p-3">
                  <div className="flex gap-3">
                    <SmartImage
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 shrink-0 rounded-lg"
                      fallbackLabel="Bake"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="text-[12.5px] font-semibold leading-snug text-[#231812]">
                            {product.name}
                          </h3>
                          <p className="mt-0.5 text-[10px] text-[#8A786A]">{product.category}</p>
                        </div>
                        <StockBadge stock={product.stock} />
                      </div>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="font-display text-[14px] font-semibold text-[#231812] tnum">
                          {peso(product.price)}
                        </span>
                        <span className="text-[10px] text-[#8A786A] tnum">
                          {product.stock} in stock
                        </span>
                      </div>
                      <div className="mt-1 text-[9.5px] text-[#9A887A]">
                        {product.bakingSchedule}
                      </div>
                      <div className="mt-2 flex gap-1.5">
                        <Btn
                          size="xs"
                          variant="outline"
                          onClick={() => {
                            setEditing(product);
                            setFormOpen(true);
                          }}
                        >
                          <Pencil size={10} /> Edit
                        </Btn>
                        <Btn
                          size="xs"
                          variant="dangerGhost"
                          onClick={() => setDeleting(product)}
                        >
                          <Trash2 size={10} /> Delete
                        </Btn>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <ProductFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        product={editing}
        onSave={(values) => onSaveProduct(values, editing?.id)}
      />

      <Modal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete this product?"
        subtitle="This removes the bake from your inventory and the customer marketplace."
        size="sm"
      >
        <div className="px-5 py-5 sm:px-6">
          <div className="flex items-center gap-3 rounded-xl border border-[#E6DDD0] bg-white p-3">
            <SmartImage
              src={deleting?.image}
              alt={deleting?.name}
              className="h-12 w-12 shrink-0 rounded-lg"
              fallbackLabel="Bake"
            />
            <div className="min-w-0">
              <div className="truncate text-[12.5px] font-semibold text-[#231812]">
                {deleting?.name}
              </div>
              <div className="text-[10.5px] text-[#8A786A]">
                {deleting?.stock} in stock · {peso(deleting?.price)}
              </div>
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-[#6E5A4F]">
            Existing order history keeps its item snapshot. This action cannot be undone, and
            any customer bag holding this product will have it removed.
          </p>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-[#E6DDD0] bg-white px-5 py-3.5 sm:flex-row sm:justify-end sm:px-6">
          <Btn variant="outline" onClick={() => setDeleting(null)}>
            Keep product
          </Btn>
          <Btn
            variant="danger"
            onClick={() => {
              onDeleteProduct(deleting);
              setDeleting(null);
            }}
          >
            <Trash2 size={13} /> Delete product
          </Btn>
        </div>
      </Modal>
    </div>
  );
}

function StatusFilter({ value, setValue, counts }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
      {["All", ...STATUSES].map((status) => {
        const count = status === "All" ? counts.total : counts[status] || 0;
        const active = value === status;
        return (
          <button
            key={status}
            onClick={() => setValue(status)}
            className={cx(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[10.5px] font-medium transition",
              active
                ? "border-[#231812] bg-[#231812] text-white"
                : "border-[#E6DDD0] bg-white text-[#6E5A4F] hover:border-[#C9B8A5]"
            )}
          >
            {status}
            <span
              className={cx(
                "text-[9px] font-bold",
                active ? "text-[#E9A98F]" : "text-[#B7A695]"
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function StaffOrders({ orders, onChangeOrder, onCancelOrder, onOpenOrder }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const standard = orders.filter((order) => order.type === "standard");

  const counts = useMemo(() => {
    const result = { total: standard.length };
    STATUSES.forEach((item) => {
      result[item] = standard.filter((order) => order.status === item).length;
    });
    return result;
  }, [standard]);

  const list = useMemo(() => {
    const query = search.trim().toLowerCase();
    return standard
      .filter((order) => {
        if (status !== "All" && order.status !== status) return false;
        if (!query) return true;
        return (
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerContact.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [standard, status, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[25px] font-semibold leading-tight text-[#231812] sm:text-[29px]">
            Standard orders
          </h1>
          <p className="mt-1 text-[12px] text-[#6E5A4F]">
            Same-day pickup tickets only. Advance reservations live in their own queue.
          </p>
        </div>
        <Badge className="border-[#CBE1D5] bg-[#EDF5F0] text-[#2D6A4F]" dot="#2D6A4F">
          {standard.length} total tickets
        </Badge>
      </div>

      <div className="rounded-xl border border-[#E6DDD0] bg-white">
        <div className="flex flex-col gap-2.5 border-b border-[#E6DDD0] p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#A6968A]"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search order number, customer, contact…"
                className={`${INPUT_CLS} h-9 pl-9 text-[12px]`}
              />
            </div>
            <span className="text-[10px] text-[#9A887A]">
              Showing {list.length} of {standard.length}
            </span>
          </div>
          <StatusFilter value={status} setValue={setStatus} counts={counts} />
        </div>

        {list.length === 0 ? (
          <Empty
            icon={ClipboardList}
            title="No standard orders in this view"
            body="New pickup orders appear here as soon as customers check out."
            className="border-0 bg-transparent"
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full text-left text-[11.5px]">
                <thead>
                  <tr className="border-b border-[#E6DDD0] bg-[#FAF6F0] text-[9px] uppercase tracking-[0.1em] text-[#9A887A]">
                    <th className="px-4 py-2.5 font-semibold">Order</th>
                    <th className="px-3 py-2.5 font-semibold">Customer</th>
                    <th className="px-3 py-2.5 font-semibold">Items</th>
                    <th className="px-2 py-2.5 text-center font-semibold">Qty</th>
                    <th className="px-3 py-2.5 text-right font-semibold">Total</th>
                    <th className="px-3 py-2.5 font-semibold">Payment</th>
                    <th className="px-3 py-2.5 font-semibold">Status</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8DC]">
                  {list.map((order) => (
                    <tr key={order.id} className="transition hover:bg-[#FAF6F0]/70">
                      <td className="px-4 py-2.5">
                        <button
                          onClick={() => onOpenOrder(order)}
                          className="font-display text-[12px] font-semibold text-[#231812] hover:text-[#C85A32]"
                        >
                          {order.orderNumber}
                        </button>
                        <div className="text-[9.5px] text-[#9A887A]">
                          {fmtDateShort(order.createdAt)} · {order.pickupTime}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="max-w-[140px] truncate text-[11.5px] font-medium text-[#231812]">
                          {order.customerName}
                        </div>
                        <div className="text-[9.5px] text-[#9A887A]">
                          {order.customerContact}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="max-w-[230px] text-[10.5px] leading-snug text-[#4E4038]">
                          {order.items
                            .map((item) => `${item.qty}× ${item.name}`)
                            .join(", ")}
                        </div>
                      </td>
                      <td className="px-2 py-2.5 text-center text-[11px] text-[#231812] tnum">
                        {order.items.reduce((sum, item) => sum + item.qty, 0)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-medium text-[#231812] tnum">
                        {peso(order.total)}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="text-[10.5px] font-medium text-[#231812]">
                          {order.paymentMethod === "GCash" ? "GCash" : "Cash"}
                        </div>
                        {order.gcashReference && (
                          <div className="text-[8.5px] tracking-[0.04em] text-[#9A887A]">
                            {order.gcashReference}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex justify-end">
                          <OrderActions
                            order={order}
                            onChange={onChangeOrder}
                            onCancel={onCancelOrder}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#F0E8DC] xl:hidden">
              {list.map((order) => (
                <div key={order.id} className="p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button
                          onClick={() => onOpenOrder(order)}
                          className="font-display text-[13px] font-semibold text-[#231812]"
                        >
                          {order.orderNumber}
                        </button>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="mt-0.5 text-[10px] text-[#8A786A]">
                        {order.customerName} · {order.customerContact}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-[15px] font-semibold text-[#231812] tnum">
                        {peso(order.total)}
                      </div>
                      <div className="text-[9px] text-[#8A786A]">{order.paymentMethod}</div>
                    </div>
                  </div>
                  <div className="mt-2 rounded-lg border border-[#F0E8DC] bg-[#FAF6F0] px-2.5 py-2">
                    <div className="text-[10.5px] leading-relaxed text-[#4E4038]">
                      {order.items.map((item) => `${item.qty}× ${item.name}`).join(" · ")}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[9.5px] text-[#8A786A]">
                      <Clock size={9} /> {fmtDateShort(order.pickupDate)} · {order.pickupTime}
                    </div>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between gap-2">
                    <Btn size="xs" variant="outline" onClick={() => onOpenOrder(order)}>
                      <Eye size={10} /> Details
                    </Btn>
                    <OrderActions
                      order={order}
                      onChange={onChangeOrder}
                      onCancel={onCancelOrder}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StaffReservations({ orders, onChangeOrder, onCancelOrder, onOpenOrder }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const reservations = orders.filter((order) => order.type === "reservation");

  const counts = useMemo(() => {
    const result = { total: reservations.length };
    STATUSES.forEach((item) => {
      result[item] = reservations.filter((order) => order.status === item).length;
    });
    return result;
  }, [reservations]);

  const list = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reservations
      .filter((order) => {
        if (status !== "All" && order.status !== status) return false;
        if (!query) return true;
        return (
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.gcashReference.toLowerCase().includes(query)
        );
      })
      .sort(
        (a, b) =>
          new Date(`${a.pickupDate}T00:00:00`) -
          new Date(`${b.pickupDate}T00:00:00`)
      );
  }, [reservations, status, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[25px] font-semibold leading-tight text-[#231812] sm:text-[29px]">
            Advance reservations
          </h1>
          <p className="mt-1 text-[12px] text-[#6E5A4F]">
            Scheduled pickups, celebration orders, and GCash references in one queue.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="border-[#D8C9E4] bg-[#F4EEF9] text-[#6C3B8C]" dot="#6C3B8C">
            {reservations.length} reservations
          </Badge>
        </div>
      </div>

      <div className="rounded-xl border border-[#E6DDD0] bg-white">
        <div className="flex flex-col gap-2.5 border-b border-[#E6DDD0] p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#A6968A]"
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search reservation, customer, GCash ref…"
                className={`${INPUT_CLS} h-9 pl-9 text-[12px]`}
              />
            </div>
            <span className="text-[10px] text-[#9A887A]">
              {list.length} shown · sorted by pickup date
            </span>
          </div>
          <StatusFilter value={status} setValue={setStatus} counts={counts} />
        </div>

        {list.length === 0 ? (
          <Empty
            icon={CalendarDays}
            title="No reservations in this view"
            body="Advance pickups scheduled by customers will appear here with their notes and GCash references."
            className="border-0 bg-transparent"
          />
        ) : (
          <div className="grid gap-3 p-3 md:grid-cols-2">
            {list.map((order) => (
              <article
                key={order.id}
                className="flex flex-col rounded-xl border border-[#E6DDD0] bg-[#FAF6F0]/60 p-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        onClick={() => onOpenOrder(order)}
                        className="font-display text-[13.5px] font-semibold text-[#231812] hover:text-[#C85A32]"
                      >
                        {order.orderNumber}
                      </button>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="mt-1 text-[11px] font-medium text-[#231812]">
                      {order.customerName}
                    </div>
                    <div className="text-[9.5px] text-[#8A786A]">{order.customerContact}</div>
                  </div>
                  <div className="shrink-0 rounded-lg border border-[#D8C9E4] bg-white px-2.5 py-1.5 text-center">
                    <div className="text-[8px] font-bold uppercase tracking-[0.1em] text-[#9A887A]">
                      {fmtDate(order.pickupDate, { month: "short" }).split(" ")[0]}
                    </div>
                    <div className="font-display text-[16px] font-semibold leading-none text-[#6C3B8C]">
                      {asDate(order.pickupDate)?.getDate()}
                    </div>
                    <div className="mt-0.5 text-[8px] font-semibold text-[#6E5A4F]">
                      {order.pickupTime}
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 space-y-1 rounded-lg border border-[#E6DDD0] bg-white px-2.5 py-2">
                  {order.items.map((item) => (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between gap-2 text-[10.5px]"
                    >
                      <span className="min-w-0 truncate text-[#4E4038]">
                        {item.qty}× {item.name}
                      </span>
                      <span className="shrink-0 text-[#6E5A4F] tnum">
                        {peso(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between gap-2 border-t border-[#F0E8DC] pt-1.5 text-[10.5px]">
                    <span className="text-[#8A786A]">
                      {order.paymentMethod}
                      {order.gcashReference ? ` · ${order.gcashReference}` : ""}
                    </span>
                    <span className="font-display text-[13px] font-semibold text-[#231812] tnum">
                      {peso(order.total)}
                    </span>
                  </div>
                </div>

                {order.notes && (
                  <div className="mt-2 rounded-md border border-[#EBD9B4] bg-[#FBF4E6] px-2.5 py-1.5 text-[10px] leading-relaxed text-[#8A5A10]">
                    <span className="font-semibold">Notes:</span> {order.notes}
                  </div>
                )}

                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2.5">
                  <Btn size="xs" variant="outline" onClick={() => onOpenOrder(order)}>
                    <Eye size={10} /> View
                  </Btn>
                  <OrderActions
                    order={order}
                    onChange={onChangeOrder}
                    onCancel={onCancelOrder}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StaffAnalytics({ products, orders, bakery }) {
  const completed = orders.filter((order) => order.status === "Completed");
  const revenue = completed.reduce((sum, order) => sum + order.total, 0);
  const avgTicket = completed.length ? revenue / completed.length : 0;
  const monthly = buildMonthlySeries(orders, 6);
  const productRevenue = productRevenueFrom(orders);
  const bestSellers = [...productRevenue].sort((a, b) => b.qty - a.qty);
  const totalItemsSold = completed.reduce(
    (sum, order) => sum + order.items.reduce((line, item) => line + item.qty, 0),
    0
  );
  const maxMonthRevenue = Math.max(1, ...monthly.map((month) => month.revenue));
  const maxProductRevenue = Math.max(1, ...productRevenue.slice(0, 8).map((p) => p.revenue));
  const maxQty = Math.max(1, ...bestSellers.slice(0, 6).map((p) => p.qty));
  const currentMonth = monthly[monthly.length - 1];
  const previousMonth = monthly[monthly.length - 2];
  const trend =
    previousMonth && previousMonth.revenue > 0
      ? ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100
      : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[25px] font-semibold leading-tight text-[#231812] sm:text-[29px]">
            Bakery analytics
          </h1>
          <p className="mt-1 text-[12px] text-[#6E5A4F]">
            Completed transactions only · {bakery.name} · six-month view
          </p>
        </div>
        <Badge className="border-[#E6DDD0] bg-white text-[#6E5A4F]" dot="#2D6A4F">
          Completed revenue basis
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <Kpi
          label="Completed revenue"
          value={peso(revenue)}
          icon={CircleDollarSign}
          hint={`${completed.length} completed fulfillments`}
          accent="#2D6A4F"
        />
        <Kpi
          label="Average ticket"
          value={peso(avgTicket)}
          icon={Receipt}
          hint="Completed orders and reservations"
          accent="#C85A32"
        />
        <Kpi
          label="Items sold"
          value={totalItemsSold}
          icon={Package}
          hint="Units across completed tickets"
          accent="#6C3B8C"
        />
        <Kpi
          label="Current month"
          value={peso(currentMonth.revenue)}
          icon={TrendingUp}
          hint={
            trend === null
              ? "No prior month data"
              : `${trend >= 0 ? "+" : ""}${trend.toFixed(1)}% vs previous month`
          }
          accent={trend !== null && trend < 0 ? "#A33B22" : "#D97706"}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-xl border border-[#E6DDD0] bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-[17px] font-semibold text-[#231812]">
                Monthly revenue
              </h2>
              <p className="text-[10.5px] text-[#8A786A]">
                Completed orders + reservations, last six months
              </p>
            </div>
            <div className="text-right">
              <div className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A887A]">
                6-month total
              </div>
              <div className="font-display text-[17px] font-semibold text-[#231812] tnum">
                {peso(monthly.reduce((sum, month) => sum + month.revenue, 0))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex h-48 items-end gap-2 sm:gap-4">
            {monthly.map((month, index) => {
              const height = (month.revenue / maxMonthRevenue) * 100;
              const isCurrent = index === monthly.length - 1;
              return (
                <div key={month.key} className="flex h-full flex-1 flex-col justify-end">
                  <div className="mb-1.5 text-center text-[9.5px] font-semibold text-[#6E5A4F] tnum">
                    {month.revenue > 0 ? compactPeso(month.revenue) : "—"}
                  </div>
                  <div
                    className={cx(
                      "w-full rounded-t-md transition-all",
                      isCurrent ? "bg-[#C85A32]" : "bg-[#231812]/75"
                    )}
                    style={{ height: `${Math.max(height, month.revenue > 0 ? 4 : 1)}%` }}
                    title={`${month.fullLabel}: ${peso(month.revenue)}`}
                  />
                  <div
                    className={cx(
                      "mt-2 border-t pt-1.5 text-center text-[9.5px] font-medium",
                      isCurrent
                        ? "border-[#C85A32]/40 text-[#C85A32]"
                        : "border-[#E6DDD0] text-[#8A786A]"
                    )}
                  >
                    {month.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-[#E6DDD0] bg-white p-4 sm:p-5">
          <h2 className="font-display text-[17px] font-semibold text-[#231812]">
            Orders & reservations
          </h2>
          <p className="text-[10.5px] text-[#8A786A]">
            Tickets created per month, all statuses
          </p>
          <div className="mt-4 space-y-3">
            {monthly.map((month) => {
              const maxCount = Math.max(
                1,
                ...monthly.map((entry) => Math.max(entry.orders, entry.reservations))
              );
              return (
                <div key={month.key}>
                  <div className="flex items-center justify-between text-[9.5px]">
                    <span
                      className={cx(
                        "font-semibold uppercase tracking-[0.08em]",
                        month.key === currentMonth.key ? "text-[#C85A32]" : "text-[#8A786A]"
                      )}
                    >
                      {month.fullLabel}
                    </span>
                    <span className="text-[#6E5A4F] tnum">
                      {month.orders} orders · {month.reservations} reservations
                    </span>
                  </div>
                  <div className="mt-1 flex h-2 gap-0.5 overflow-hidden rounded-full bg-[#F3ECE1]">
                    <div
                      className="bg-[#C85A32]"
                      style={{ width: `${(month.orders / maxCount) * 100}%` }}
                      title={`${month.orders} standard orders`}
                    />
                    <div
                      className="bg-[#6C3B8C]"
                      style={{ width: `${(month.reservations / maxCount) * 100}%` }}
                      title={`${month.reservations} reservations`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex items-center gap-4 border-t border-[#E6DDD0] pt-3 text-[9.5px] text-[#6E5A4F]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#C85A32]" /> Standard orders
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#6C3B8C]" /> Reservations
            </span>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-[#E6DDD0] bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-[17px] font-semibold text-[#231812]">
                Product revenue
              </h2>
              <p className="text-[10.5px] text-[#8A786A]">Top performers by completed sales</p>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#9A887A]">
              Top {Math.min(8, productRevenue.length)}
            </span>
          </div>
          {productRevenue.length === 0 ? (
            <p className="mt-4 text-[11px] text-[#8A786A]">No completed sales yet.</p>
          ) : (
            <div className="mt-3 space-y-2.5">
              {productRevenue.slice(0, 8).map((item, index) => (
                <div key={item.productId}>
                  <div className="flex items-center justify-between gap-2 text-[10.5px]">
                    <span className="min-w-0 truncate text-[#4E4038]">
                      <span className="mr-1.5 text-[9px] font-bold text-[#B7A695]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {item.name}
                    </span>
                    <span className="shrink-0 font-semibold text-[#231812] tnum">
                      {peso(item.revenue)}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#F3ECE1]">
                    <div
                      className="h-full rounded-full bg-[#2D6A4F]"
                      style={{ width: `${(item.revenue / maxProductRevenue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-[#E6DDD0] bg-white p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-[17px] font-semibold text-[#231812]">
                Best sellers
              </h2>
              <p className="text-[10.5px] text-[#8A786A]">Units sold on completed tickets</p>
            </div>
            <span className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#9A887A]">
              By quantity
            </span>
          </div>
          {bestSellers.length === 0 ? (
            <p className="mt-4 text-[11px] text-[#8A786A]">No completed sales yet.</p>
          ) : (
            <div className="mt-3 space-y-2.5">
              {bestSellers.slice(0, 6).map((item) => (
                <div key={item.productId}>
                  <div className="flex items-center justify-between gap-2 text-[10.5px]">
                    <span className="min-w-0 truncate text-[#4E4038]">{item.name}</span>
                    <span className="shrink-0 font-semibold text-[#231812] tnum">
                      {item.qty} sold
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#F3ECE1]">
                    <div
                      className="h-full rounded-full bg-[#C85A32]"
                      style={{ width: `${(item.qty / maxQty) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E6DDD0] bg-white">
        <div className="flex items-center justify-between border-b border-[#E6DDD0] px-4 py-3">
          <div>
            <h2 className="font-display text-[16px] font-semibold text-[#231812]">
              Monthly breakdown
            </h2>
            <p className="text-[10px] text-[#8A786A]">
              Completed revenue and ticket volume by month
            </p>
          </div>
          <FileText size={15} className="text-[#B7A695]" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11.5px]">
            <thead>
              <tr className="border-b border-[#E6DDD0] bg-[#FAF6F0] text-[9px] uppercase tracking-[0.1em] text-[#9A887A]">
                <th className="px-4 py-2.5 font-semibold">Month</th>
                <th className="px-3 py-2.5 text-right font-semibold">Revenue</th>
                <th className="px-3 py-2.5 text-center font-semibold">Orders</th>
                <th className="px-3 py-2.5 text-center font-semibold">Reservations</th>
                <th className="px-3 py-2.5 text-center font-semibold">Completed</th>
                <th className="px-4 py-2.5 font-semibold">Revenue share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {monthly.map((month) => {
                const share = revenue > 0 ? (month.revenue / revenue) * 100 : 0;
                return (
                  <tr key={month.key} className="transition hover:bg-[#FAF6F0]/70">
                    <td className="px-4 py-2.5 font-medium text-[#231812]">
                      {month.fullLabel}
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium text-[#231812] tnum">
                      {peso(month.revenue)}
                    </td>
                    <td className="px-3 py-2.5 text-center text-[#6E5A4F] tnum">
                      {month.orders}
                    </td>
                    <td className="px-3 py-2.5 text-center text-[#6E5A4F] tnum">
                      {month.reservations}
                    </td>
                    <td className="px-3 py-2.5 text-center text-[#6E5A4F] tnum">
                      {month.completed}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F3ECE1]">
                          <div
                            className="h-full rounded-full bg-[#2D6A4F]"
                            style={{ width: `${share}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-[9.5px] text-[#8A786A] tnum">
                          {share.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StaffWorkspace({ session, onExit }) {
  const { db, update } = useDB();
  const toast = useToast();
  const [section, setSection] = useState("dashboard");
  const [openOrder, setOpenOrder] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  const bakery = db.bakeries.find((item) => item.id === session.bakeryId);
  const products = db.products.filter((product) => product.bakeryId === session.bakeryId);
  const orders = db.orders
    .filter((order) => order.bakeryId === session.bakeryId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const counts = {
    pendingOrders: orders.filter(
      (order) => order.status === "Pending" && order.type === "standard"
    ).length,
    pendingReservations: orders.filter(
      (order) => order.status === "Pending" && order.type === "reservation"
    ).length,
    lowStock: products.filter((product) => product.stock <= 10).length,
  };

  if (!bakery) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAF6F0] px-5">
        <div className="max-w-sm rounded-2xl border border-[#E6DDD0] bg-white p-6 text-center">
          <Store size={26} className="mx-auto text-[#C85A32]" />
          <h2 className="mt-3 font-display text-[20px] font-semibold text-[#231812]">
            No bakery assigned
          </h2>
          <p className="mt-1 text-[12px] text-[#6E5A4F]">
            This staff account is not linked to a branch. Contact the cooperative
            administrator.
          </p>
          <Btn className="mt-4 w-full" onClick={onExit}>
            <LogOut size={14} /> Sign out
          </Btn>
        </div>
      </div>
    );
  }

  const changeOrderStatus = (order, next) => {
    const live = db.orders.find((item) => item.id === order.id);
    if (!live || live.bakeryId !== session.bakeryId) {
      toast("This order does not belong to your assigned bakery.", "error");
      return;
    }
    const allowed = {
      Pending: ["Confirmed", "Cancelled"],
      Confirmed: ["Ready For Pickup", "Cancelled"],
      "Ready For Pickup": ["Completed", "Cancelled"],
      Completed: [],
      Cancelled: [],
    };
    if (!allowed[live.status]?.includes(next)) {
      toast(`Order ${live.orderNumber} cannot move from ${live.status} to ${next}.`, "error");
      return;
    }

    if (next === "Confirmed") {
      const shortages = [];
      live.items.forEach((item) => {
        const product = db.products.find((entry) => entry.id === item.productId);
        if (!product || product.stock < item.qty) {
          shortages.push(`${item.name} (${product ? product.stock : 0} left, ${item.qty} needed)`);
        }
      });
      if (shortages.length > 0) {
        toast(`Confirmation blocked — insufficient stock: ${shortages.join("; ")}.`, "error");
        return;
      }
    }

    const at = new Date().toISOString();
    update((draft) => {
      const target = draft.orders.find((item) => item.id === order.id);
      if (!target) return draft;
      if (next === "Confirmed") {
        target.items.forEach((item) => {
          const product = draft.products.find((entry) => entry.id === item.productId);
          if (product) product.stock = Math.max(0, product.stock - item.qty);
        });
        target.stockDeducted = true;
      }
      if (next === "Cancelled" && target.stockDeducted) {
        target.items.forEach((item) => {
          const product = draft.products.find((entry) => entry.id === item.productId);
          if (product) product.stock += item.qty;
        });
        target.stockDeducted = false;
      }
      target.status = next;
      target.updatedAt = at;
      if (next === "Completed") target.completedAt = at;
      if (next === "Cancelled") {
        target.cancelledAt = at;
        target.notes = target.notes || "";
      }
      target.history = [
        ...(target.history || []),
        {
          status: next,
          at,
          actor: session.name,
          note:
            next === "Cancelled"
              ? live.stockDeducted
                ? "Cancelled by bakery staff. Stock restored."
                : "Cancelled by bakery staff."
              : "",
        },
      ];
      return draft;
    });

    setOpenOrder((current) =>
      current && current.id === order.id
        ? { ...current, status: next }
        : current
    );

    if (next === "Confirmed") {
      toast(`Order ${order.orderNumber} confirmed. Stock deducted.`);
    } else if (next === "Cancelled") {
      toast(
        `Order ${order.orderNumber} cancelled.${
          live.stockDeducted ? " Reserved stock restored." : ""
        }`,
        "info"
      );
    } else if (next === "Ready For Pickup") {
      toast(`Order ${order.orderNumber} is ready for pickup.`);
    } else if (next === "Completed") {
      toast(`Order ${order.orderNumber} completed. Revenue recorded.`);
    }
  };

  const saveProduct = (values, productId) => {
    const at = new Date().toISOString();
    if (productId) {
      update((draft) => {
        const target = draft.products.find((product) => product.id === productId);
        if (!target || target.bakeryId !== session.bakeryId) return draft;
        Object.assign(target, values, { updatedAt: at });
        return draft;
      });
      toast("Product updated in the marketplace.");
    } else {
      update((draft) => {
        draft.products.push({
          id: uid("p"),
          bakeryId: session.bakeryId,
          ...values,
          createdAt: at,
          updatedAt: at,
        });
        return draft;
      });
      toast("New product added to your bakery.");
    }
  };

  const deleteProduct = (product) => {
    if (!product) return;
    update((draft) => {
      draft.products = draft.products.filter((item) => item.id !== product.id);
      if (draft.cart?.items?.some((item) => item.productId === product.id)) {
        draft.cart.items = draft.cart.items.filter(
          (item) => item.productId !== product.id
        );
        if (draft.cart.items.length === 0) {
          draft.cart = { ...EMPTY_CART };
        }
      }
      return draft;
    });
    toast(`${product.name} removed from inventory.`, "info");
  };

  const requestCancel = (order) => setCancelTarget(order);

  const liveOpenOrder = openOrder
    ? db.orders.find((order) => order.id === openOrder.id) || openOrder
    : null;

  return (
    <>
      <StaffShell
        bakery={bakery}
        session={session}
        section={section}
        setSection={setSection}
        counts={counts}
        onExit={onExit}
      >
        {section === "dashboard" && (
          <StaffDashboard
            bakery={bakery}
            session={session}
            products={products}
            orders={orders}
            onChangeOrder={changeOrderStatus}
            onCancelOrder={requestCancel}
            onOpenOrder={setOpenOrder}
            onGoTo={setSection}
          />
        )}
        {section === "inventory" && (
          <StaffInventory
            products={products}
            onSaveProduct={saveProduct}
            onDeleteProduct={deleteProduct}
          />
        )}
        {section === "orders" && (
          <StaffOrders
            orders={orders}
            onChangeOrder={changeOrderStatus}
            onCancelOrder={requestCancel}
            onOpenOrder={setOpenOrder}
          />
        )}
        {section === "reservations" && (
          <StaffReservations
            orders={orders}
            onChangeOrder={changeOrderStatus}
            onCancelOrder={requestCancel}
            onOpenOrder={setOpenOrder}
          />
        )}
        {section === "analytics" && (
          <StaffAnalytics products={products} orders={orders} bakery={bakery} />
        )}
      </StaffShell>

      <OrderDetailModal
        open={Boolean(liveOpenOrder)}
        onClose={() => setOpenOrder(null)}
        order={liveOpenOrder}
        bakery={bakery}
        onChange={changeOrderStatus}
        onCancel={requestCancel}
      />

      <Modal
        open={Boolean(cancelTarget)}
        onClose={() => setCancelTarget(null)}
        title="Cancel this order?"
        subtitle="Cancellation is recorded in the order timeline and ledger."
        size="sm"
      >
        <div className="px-5 py-5 sm:px-6">
          <div className="rounded-xl border border-[#EBCFC7] bg-[#FBF0ED] p-3.5">
            <div className="text-[12px] font-semibold text-[#8E3219]">
              {cancelTarget?.orderNumber} · {cancelTarget?.customerName}
            </div>
            <div className="mt-1 text-[11px] text-[#A33B22]">
              {cancelTarget?.items
                .map((item) => `${item.qty}× ${item.name}`)
                .join(", ")}
            </div>
          </div>
          <p className="mt-3 text-[11px] leading-relaxed text-[#6E5A4F]">
            {cancelTarget?.stockDeducted
              ? "Because stock was already deducted at confirmation, cancelling will return every reserved unit to your inventory automatically."
              : "No stock has been deducted yet, so cancelling this pending order will not change inventory."}
          </p>
        </div>
        <div className="flex flex-col-reverse gap-2 border-t border-[#E6DDD0] bg-white px-5 py-3.5 sm:flex-row sm:justify-end sm:px-6">
          <Btn variant="outline" onClick={() => setCancelTarget(null)}>
            Keep order
          </Btn>
          <Btn
            variant="danger"
            onClick={() => {
              if (cancelTarget) changeOrderStatus(cancelTarget, "Cancelled");
              setCancelTarget(null);
            }}
          >
            <XCircle size={13} /> Cancel order
          </Btn>
        </div>
      </Modal>
    </>
  );
}

/* ===================== 11. ADMIN OVERSIGHT PORTAL ======================= */

const ADMIN_NAV = [
  { key: "overview", label: "Overview", icon: BarChart3 },
  { key: "network", label: "Network performance", icon: Building2 },
  { key: "ledger", label: "Audit ledger", icon: FileText },
];

function ReadOnlyBadge({ dark = false, className = "" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em]",
        dark
          ? "border-[#D97706]/45 bg-[#D97706]/10 text-[#F0B85A]"
          : "border-[#D97706]/40 bg-[#FDF7EC] text-[#8A5A10]",
        className
      )}
    >
      <Lock size={10} /> Read-only audit view
    </span>
  );
}

function AdminShell({ session, view, setView, onExit, children }) {
  return (
    <div className="min-h-screen bg-[#F6F1E9]">
      <header className="sticky top-0 z-40 border-b border-black/20 bg-[#231812] text-[#FAF6F0]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex min-w-0 items-center gap-4">
              <BrandMark dark compact />
              <span className="hidden h-8 w-px bg-white/15 sm:block" />
              <div className="hidden min-w-0 leading-tight sm:block">
                <div className="text-[8px] font-bold uppercase tracking-[0.18em] text-[#D97706]">
                  Executive Oversight
                </div>
                <div className="truncate font-display text-[12px] text-[#FAF6F0]">
                  Pototan Bakers Cooperative
                </div>
              </div>
            </div>

            <nav className="hidden items-center gap-1 md:flex">
              {ADMIN_NAV.map((item) => {
                const Icon = item.icon;
                const active = view === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setView(item.key)}
                    className={cx(
                      "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[11.5px] font-medium transition",
                      active
                        ? "bg-white/10 text-white"
                        : "text-[#BDAE9F] hover:bg-white/[0.06] hover:text-white"
                    )}
                  >
                    <Icon size={13} /> {item.label}
                  </button>
                );
              })}
            </nav>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <div className="hidden lg:block">
                <ReadOnlyBadge dark />
              </div>
              <div className="hidden items-center gap-2 border-l border-white/10 pl-3 sm:flex">
                <div className="text-right leading-tight">
                  <div className="text-[10.5px] font-semibold text-[#FAF6F0]">
                    {session.name}
                  </div>
                  <div className="text-[8px] uppercase tracking-[0.08em] text-[#8A786A]">
                    {session.title || "Administrator"}
                  </div>
                </div>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D97706]/35 bg-[#D97706]/10 text-[10px] font-bold text-[#F0B85A]">
                  {session.name?.charAt(0) || "A"}
                </span>
              </div>
              <button
                onClick={onExit}
                className="rounded-lg border border-white/10 p-2 text-[#BDAE9F] transition hover:border-white/25 hover:text-white"
                title="Sign out of executive portal"
              >
                <LogOut size={15} />
              </button>
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-2 no-scrollbar md:hidden">
            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              const active = view === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => setView(item.key)}
                  className={cx(
                    "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10.5px] font-medium transition",
                    active ? "bg-white/10 text-white" : "text-[#BDAE9F]"
                  )}
                >
                  <Icon size={12} /> {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
        {children}
      </main>

      <footer className="border-t border-[#E6DDD0] bg-[#F6F1E9]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-2 px-4 py-4 text-[9.5px] text-[#9A887A] sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <span>
            Pototan Artisanal Bakery · Executive audit environment · Completed
            transactions are the revenue basis
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock size={10} /> No write access is provisioned to this portal
          </span>
        </div>
      </footer>
    </div>
  );
}

function AdminPageHeader({ eyebrow, title, subtitle, actions }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="mb-1.5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-[#C85A32]">
          <span className="h-px w-6 bg-[#C85A32]/50" /> {eyebrow}
        </div>
        <h1 className="font-display text-[26px] font-semibold leading-tight text-[#231812] sm:text-[31px]">
          {title}
        </h1>
        <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-[#6E5A4F]">{subtitle}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        <ReadOnlyBadge />
      </div>
    </div>
  );
}

function AdminOverview({ orders, bakeries, products, onGoTo }) {
  const completed = orders.filter((order) => order.status === "Completed");
  const revenue = completed.reduce((sum, order) => sum + order.total, 0);
  const gcashRevenue = completed
    .filter((order) => order.paymentMethod === "GCash")
    .reduce((sum, order) => sum + order.total, 0);
  const cashRevenue = revenue - gcashRevenue;
  const avgBasket = completed.length ? revenue / completed.length : 0;
  const monthly = buildMonthlySeries(orders, 6);
  const maxMonth = Math.max(1, ...monthly.map((month) => month.revenue));
  const statusCounts = STATUSES.map((status) => ({
    status,
    count: orders.filter((order) => order.status === status).length,
  }));

  const networkRows = bakeries
    .map((bakery) => {
      const bakeryOrders = orders.filter((order) => order.bakeryId === bakery.id);
      const bakeryCompleted = bakeryOrders.filter((order) => order.status === "Completed");
      const bakeryProducts = products.filter((product) => product.bakeryId === bakery.id);
      const health = bakeryProducts.length
        ? Math.round(
            (bakeryProducts.filter((product) => product.stock > 0).length /
              bakeryProducts.length) *
              100
          )
        : 0;
      return {
        bakery,
        revenue: bakeryCompleted.reduce((sum, order) => sum + order.total, 0),
        completed: bakeryCompleted.length,
        health,
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const recent = [...completed]
    .sort((a, b) => new Date(b.completedAt || b.updatedAt) - new Date(a.completedAt || a.updatedAt))
    .slice(0, 6);

  const gcashShare = revenue > 0 ? (gcashRevenue / revenue) * 100 : 0;

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Network financial oversight"
        title="Cooperative overview"
        subtitle={`Completed-only revenue across ${bakeries.length} independently operated bakeries in Pototan, Iloilo.`}
        actions={
          <span className="hidden text-[10px] uppercase tracking-[0.1em] text-[#9A887A] sm:block">
            As of {fmtDate(todayISO())}
          </span>
        }
      />

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
        <Kpi
          label="Total revenue"
          value={peso(revenue)}
          icon={CircleDollarSign}
          hint={`${completed.length} completed transactions`}
          accent="#2D6A4F"
          className="border-[#DCD2C4]"
        />
        <Kpi
          label="Average basket"
          value={peso(avgBasket)}
          icon={Receipt}
          hint="Completed fulfillment average"
          accent="#C85A32"
          className="border-[#DCD2C4]"
        />
        <Kpi
          label="Completed fulfillments"
          value={completed.length}
          icon={BadgeCheck}
          hint="Orders and reservations"
          accent="#231812"
          className="border-[#DCD2C4]"
        />
        <Kpi
          label="GCash revenue"
          value={peso(gcashRevenue)}
          icon={Smartphone}
          hint={`${gcashShare.toFixed(0)}% of completed revenue`}
          accent="#6C3B8C"
          className="border-[#DCD2C4]"
        />
        <Kpi
          label="Cash revenue"
          value={peso(cashRevenue)}
          icon={Banknote}
          hint="Cash on pickup"
          accent="#D97706"
          className="border-[#DCD2C4]"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-lg border border-[#DCD2C4] bg-white p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-[17px] font-semibold text-[#231812]">
                Network revenue trend
              </h2>
              <p className="text-[10.5px] text-[#8A786A]">
                Completed transactions, last six months
              </p>
            </div>
            <div className="text-right">
              <div className="text-[8.5px] font-bold uppercase tracking-[0.1em] text-[#9A887A]">
                6-month total
              </div>
              <div className="font-display text-[17px] font-semibold text-[#231812] tnum">
                {peso(monthly.reduce((sum, month) => sum + month.revenue, 0))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex h-44 items-end gap-2 sm:gap-4">
            {monthly.map((month, index) => {
              const height = (month.revenue / maxMonth) * 100;
              const current = index === monthly.length - 1;
              return (
                <div key={month.key} className="flex h-full flex-1 flex-col justify-end">
                  <div className="mb-1.5 text-center text-[9px] font-medium text-[#8A786A] tnum">
                    {month.revenue > 0 ? compactPeso(month.revenue) : "—"}
                  </div>
                  <div
                    className={cx(
                      "w-full rounded-t transition-all",
                      current ? "bg-[#C85A32]" : "bg-[#2D6A4F]/80"
                    )}
                    style={{ height: `${Math.max(height, month.revenue > 0 ? 3 : 1)}%` }}
                    title={`${month.fullLabel}: ${peso(month.revenue)}`}
                  />
                  <div
                    className={cx(
                      "mt-2 border-t pt-1.5 text-center text-[9px] font-medium",
                      current ? "border-[#C85A32]/40 text-[#C85A32]" : "border-[#E6DDD0] text-[#8A786A]"
                    )}
                  >
                    {month.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-[#DCD2C4] bg-white p-4 sm:p-5">
          <h2 className="font-display text-[17px] font-semibold text-[#231812]">
            Revenue composition
          </h2>
          <p className="text-[10.5px] text-[#8A786A]">Completed transactions by settlement</p>

          <div className="mt-4">
            <div className="font-display text-[28px] font-semibold leading-none text-[#231812] tnum">
              {peso(revenue)}
            </div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.1em] text-[#9A887A]">
              Total completed revenue
            </div>
            <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-[#F3ECE1]">
              <div className="bg-[#6C3B8C]" style={{ width: `${gcashShare}%` }} />
              <div className="bg-[#D97706]" style={{ width: `${100 - gcashShare}%` }} />
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            <div className="flex items-center justify-between rounded-lg border border-[#E6DDD0] bg-[#FAF6F0] px-3 py-2">
              <span className="inline-flex items-center gap-2 text-[10.5px] text-[#4E4038]">
                <span className="h-2 w-2 rounded-full bg-[#6C3B8C]" /> GCash
              </span>
              <span className="text-[11.5px] font-semibold text-[#231812] tnum">
                {peso(gcashRevenue)}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#E6DDD0] bg-[#FAF6F0] px-3 py-2">
              <span className="inline-flex items-center gap-2 text-[10.5px] text-[#4E4038]">
                <span className="h-2 w-2 rounded-full bg-[#D97706]" /> Cash on pickup
              </span>
              <span className="text-[11.5px] font-semibold text-[#231812] tnum">
                {peso(cashRevenue)}
              </span>
            </div>
          </div>

          <div className="mt-4 border-t border-[#E6DDD0] pt-3">
            <div className="mb-2 text-[8.5px] font-bold uppercase tracking-[0.1em] text-[#9A887A]">
              Transactions by status
            </div>
            <div className="space-y-1">
              {statusCounts.map(({ status, count }) => (
                <div key={status} className="flex items-center justify-between text-[10px]">
                  <span className="inline-flex items-center gap-1.5 text-[#6E5A4F]">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: STATUS_META[status].dot }}
                    />
                    {status}
                  </span>
                  <span className="font-semibold text-[#231812] tnum">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <div className="overflow-hidden rounded-lg border border-[#DCD2C4] bg-white">
          <div className="flex items-center justify-between border-b border-[#E6DDD0] px-4 py-3">
            <div>
              <h2 className="font-display text-[16px] font-semibold text-[#231812]">
                Recent completed transactions
              </h2>
              <p className="text-[10px] text-[#8A786A]">Most recently fulfilled network-wide</p>
            </div>
            <button
              onClick={() => onGoTo("ledger")}
              className="text-[10px] font-semibold text-[#C85A32] hover:underline"
            >
              Open ledger
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px]">
              <thead>
                <tr className="border-b border-[#E6DDD0] bg-[#FAF6F0] text-[8.5px] uppercase tracking-[0.1em] text-[#9A887A]">
                  <th className="px-4 py-2 font-semibold">Order</th>
                  <th className="px-3 py-2 font-semibold">Bakery</th>
                  <th className="px-3 py-2 font-semibold">Customer</th>
                  <th className="px-3 py-2 font-semibold">Payment</th>
                  <th className="px-4 py-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0E8DC]">
                {recent.map((order) => (
                  <tr key={order.id}>
                    <td className="px-4 py-2.5 font-medium text-[#231812]">
                      {order.orderNumber}
                      <div className="text-[8.5px] font-normal text-[#9A887A]">
                        {fmtDateShort(order.completedAt || order.updatedAt)}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-[10px] text-[#6E5A4F]">
                      {bakeries.find((bakery) => bakery.id === order.bakeryId)?.name}
                    </td>
                    <td className="px-3 py-2.5 text-[10.5px] text-[#4E4038]">
                      {order.customerName}
                    </td>
                    <td className="px-3 py-2.5 text-[10px] text-[#6E5A4F]">
                      {order.paymentMethod}
                    </td>
                    <td className="px-4 py-2.5 text-right font-semibold text-[#231812] tnum">
                      {peso(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-lg border border-[#DCD2C4] bg-white p-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[16px] font-semibold text-[#231812]">
              Branch ranking
            </h2>
            <button
              onClick={() => onGoTo("network")}
              className="text-[10px] font-semibold text-[#C85A32] hover:underline"
            >
              Matrix
            </button>
          </div>
          <div className="mt-3 space-y-2.5">
            {networkRows.map((row, index) => {
              const max = Math.max(1, ...networkRows.map((entry) => entry.revenue));
              return (
                <div key={row.bakery.id}>
                  <div className="flex items-center justify-between gap-2 text-[10px]">
                    <span className="min-w-0 truncate text-[#4E4038]">
                      <span className="mr-1.5 font-bold text-[#B7A695]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {row.bakery.name}
                    </span>
                    <span className="shrink-0 font-semibold text-[#231812] tnum">
                      {compactPeso(row.revenue)}
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#F3ECE1]">
                    <div
                      className="h-full rounded-full bg-[#2D6A4F]"
                      style={{ width: `${(row.revenue / max) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-[#E6DDD0] pt-3 text-[9.5px] text-[#8A786A]">
            <span>Stock health</span>
            <div className="flex items-center gap-1.5">
              {networkRows.map((row) => (
                <span
                  key={row.bakery.id}
                  className={cx(
                    "flex h-5 w-5 items-center justify-center rounded text-[8px] font-bold",
                    row.health >= 80
                      ? "bg-[#EDF5F0] text-[#2D6A4F]"
                      : row.health >= 50
                      ? "bg-[#FBF4E6] text-[#8A5A10]"
                      : "bg-[#FBF0ED] text-[#A33B22]"
                  )}
                  title={`${row.bakery.name}: ${row.health}%`}
                >
                  {row.health}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminNetwork({ orders, bakeries, products }) {
  const rows = bakeries
    .map((bakery) => {
      const bakeryOrders = orders.filter((order) => order.bakeryId === bakery.id);
      const completed = bakeryOrders.filter((order) => order.status === "Completed");
      const standard = bakeryOrders.filter((order) => order.type === "standard");
      const reservations = bakeryOrders.filter((order) => order.type === "reservation");
      const bakeryProducts = products.filter((product) => product.bakeryId === bakery.id);
      const inStock = bakeryProducts.filter((product) => product.stock > 0).length;
      const health = bakeryProducts.length
        ? Math.round((inStock / bakeryProducts.length) * 100)
        : 0;
      return {
        bakery,
        revenue: completed.reduce((sum, order) => sum + order.total, 0),
        completed: completed.length,
        orders: standard.length,
        reservations: reservations.length,
        completedOrders: standard.filter((order) => order.status === "Completed").length,
        completedReservations: reservations.filter((order) => order.status === "Completed")
          .length,
        products: bakeryProducts.length,
        inStock,
        health,
        gcash: completed
          .filter((order) => order.paymentMethod === "GCash")
          .reduce((sum, order) => sum + order.total, 0),
      };
    })
    .sort((a, b) => b.revenue - a.revenue);

  const networkRevenue = rows.reduce((sum, row) => sum + row.revenue, 0);
  const maxRevenue = Math.max(1, ...rows.map((row) => row.revenue));
  const totalOrders = rows.reduce((sum, row) => sum + row.orders, 0);
  const totalReservations = rows.reduce((sum, row) => sum + row.reservations, 0);

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Network performance"
        title="Branch performance matrix"
        subtitle="Completed revenue, transaction volume, and live stock health for all five Pototan bakeries."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi
          label="Network revenue"
          value={peso(networkRevenue)}
          icon={CircleDollarSign}
          hint="Completed only"
          accent="#2D6A4F"
          className="border-[#DCD2C4]"
        />
        <Kpi
          label="Standard orders"
          value={totalOrders}
          icon={ClipboardList}
          hint={`${rows.reduce((sum, row) => sum + row.completedOrders, 0)} completed`}
          accent="#C85A32"
          className="border-[#DCD2C4]"
        />
        <Kpi
          label="Reservations"
          value={totalReservations}
          icon={CalendarDays}
          hint={`${rows.reduce((sum, row) => sum + row.completedReservations, 0)} completed`}
          accent="#6C3B8C"
          className="border-[#DCD2C4]"
        />
        <Kpi
          label="Branches audited"
          value={bakeries.length}
          icon={Building2}
          hint="Read-only network scope"
          accent="#D97706"
          className="border-[#DCD2C4]"
        />
      </div>

      <div className="overflow-hidden rounded-lg border border-[#DCD2C4] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-[11px]">
            <thead>
              <tr className="border-b border-[#E6DDD0] bg-[#FAF6F0] text-[8.5px] uppercase tracking-[0.11em] text-[#9A887A]">
                <th className="w-12 px-4 py-2.5 font-semibold">Rank</th>
                <th className="px-3 py-2.5 font-semibold">Bakery</th>
                <th className="px-3 py-2.5 text-right font-semibold">Revenue</th>
                <th className="px-3 py-2.5 text-center font-semibold">Orders</th>
                <th className="px-3 py-2.5 text-center font-semibold">Reservations</th>
                <th className="px-3 py-2.5 font-semibold">Stock health</th>
                <th className="px-4 py-2.5 font-semibold">Revenue rank</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {rows.map((row, index) => (
                <tr key={row.bakery.id} className="transition hover:bg-[#FAF6F0]/60">
                  <td className="px-4 py-3.5">
                    <span className="font-display text-[16px] font-semibold text-[#C85A32]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <SmartImage
                        src={row.bakery.image}
                        alt={row.bakery.name}
                        className="h-9 w-9 shrink-0 rounded-lg"
                        fallbackLabel="Bakery"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-[11.5px] font-semibold text-[#231812]">
                          {row.bakery.name}
                        </div>
                        <div className="text-[9px] text-[#8A786A]">
                          {row.bakery.barangay} · Since {row.bakery.since}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-right">
                    <div className="font-display text-[15px] font-semibold text-[#231812] tnum">
                      {peso(row.revenue)}
                    </div>
                    <div className="text-[8.5px] text-[#9A887A]">
                      {row.completed} completed
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <div className="text-[11.5px] font-semibold text-[#231812] tnum">
                      {row.orders}
                    </div>
                    <div className="text-[8.5px] text-[#9A887A]">
                      {row.completedOrders} done
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-center">
                    <div className="text-[11.5px] font-semibold text-[#231812] tnum">
                      {row.reservations}
                    </div>
                    <div className="text-[8.5px] text-[#9A887A]">
                      {row.completedReservations} done
                    </div>
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-[#F3ECE1]">
                        <div
                          className={cx(
                            "h-full rounded-full",
                            row.health >= 80
                              ? "bg-[#2D6A4F]"
                              : row.health >= 50
                              ? "bg-[#D97706]"
                              : "bg-[#B3261E]"
                          )}
                          style={{ width: `${row.health}%` }}
                        />
                      </div>
                      <span className="text-[9.5px] font-semibold text-[#4E4038] tnum">
                        {row.health}%
                      </span>
                    </div>
                    <div className="mt-0.5 text-[8.5px] text-[#9A887A]">
                      {row.inStock} of {row.products} products in stock
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-[#F3ECE1]">
                      <div
                        className="h-full rounded-full bg-[#C85A32]"
                        style={{ width: `${(row.revenue / maxRevenue) * 100}%` }}
                      />
                    </div>
                    <div className="mt-1 text-[8.5px] text-[#9A887A]">
                      {networkRevenue > 0
                        ? `${((row.revenue / networkRevenue) * 100).toFixed(1)}% of network`
                        : "No completed revenue"}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#E6DDD0] bg-[#FAF6F0] text-[10.5px]">
                <td className="px-4 py-2.5" />
                <td className="px-3 py-2.5 font-semibold text-[#231812]">Network total</td>
                <td className="px-3 py-2.5 text-right font-display text-[14px] font-semibold text-[#231812] tnum">
                  {peso(networkRevenue)}
                </td>
                <td className="px-3 py-2.5 text-center font-semibold text-[#231812] tnum">
                  {totalOrders}
                </td>
                <td className="px-3 py-2.5 text-center font-semibold text-[#231812] tnum">
                  {totalReservations}
                </td>
                <td colSpan={2} className="px-3 py-2.5 text-[9px] text-[#9A887A]">
                  Stock health is live across current product inventory.
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((row, index) => (
          <div
            key={row.bakery.id}
            className="rounded-lg border border-[#DCD2C4] bg-white p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <SmartImage
                  src={row.bakery.image}
                  alt={row.bakery.name}
                  className="h-9 w-9 rounded-lg"
                  fallbackLabel="Bakery"
                />
                <div>
                  <div className="text-[11px] font-semibold leading-tight text-[#231812]">
                    {row.bakery.name}
                  </div>
                  <div className="text-[8.5px] text-[#8A786A]">{row.bakery.barangay}</div>
                </div>
              </div>
              <span className="font-display text-[15px] font-semibold text-[#C85A32]">
                #{index + 1}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-[#F0E8DC] pt-2.5">
              <div>
                <div className="text-[8px] uppercase tracking-[0.08em] text-[#9A887A]">
                  Revenue
                </div>
                <div className="text-[10.5px] font-semibold text-[#231812]">
                  {compactPeso(row.revenue)}
                </div>
              </div>
              <div>
                <div className="text-[8px] uppercase tracking-[0.08em] text-[#9A887A]">
                  Orders
                </div>
                <div className="text-[10.5px] font-semibold text-[#231812] tnum">
                  {row.orders}
                </div>
              </div>
              <div>
                <div className="text-[8px] uppercase tracking-[0.08em] text-[#9A887A]">
                  Stock
                </div>
                <div className="text-[10.5px] font-semibold text-[#2D6A4F] tnum">
                  {row.health}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function exportLedgerCSV(orders) {
  const header = [
    "Date",
    "Order Number",
    "Bakery",
    "Customer",
    "Contact",
    "Type",
    "Payment Method",
    "GCash Reference",
    "Status",
    "Items",
    "Total PHP",
  ];
  const rows = orders.map((order) => [
    fmtDateTime(order.createdAt),
    order.orderNumber,
    order.bakeryName || "",
    order.customerName,
    order.customerContact,
    order.type,
    order.paymentMethod,
    order.gcashReference || "",
    order.status,
    order.items.map((item) => `${item.qty}x ${item.name}`).join("; "),
    order.total.toFixed(2),
  ]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\r\n");
  downloadFile(
    `pototan-audit-ledger-${todayISO()}.csv`,
    `\ufeff${csv}`,
    "text/csv;charset=utf-8"
  );
}

function AdminLedger({ orders, bakeries, onOpenOrder }) {
  const [search, setSearch] = useState("");
  const [bakeryId, setBakeryId] = useState("all");
  const [status, setStatus] = useState("All");
  const [payment, setPayment] = useState("All");
  const [type, setType] = useState("All");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const enriched = useMemo(
    () =>
      orders.map((order) => ({
        ...order,
        bakeryName: bakeries.find((bakery) => bakery.id === order.bakeryId)?.name || "—",
      })),
    [orders, bakeries]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return enriched
      .filter((order) => {
        if (bakeryId !== "all" && order.bakeryId !== bakeryId) return false;
        if (status !== "All" && order.status !== status) return false;
        if (payment !== "All" && order.paymentMethod !== payment) return false;
        if (type !== "All" && order.type !== type) return false;
        const created = asDate(order.createdAt);
        if (from && created < new Date(`${from}T00:00:00`)) return false;
        if (to && created > new Date(`${to}T23:59:59`)) return false;
        if (!query) return true;
        return (
          order.orderNumber.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerContact.toLowerCase().includes(query) ||
          order.bakeryName.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [enriched, search, bakeryId, status, payment, type, from, to]);

  const filteredCompleted = filtered.filter((order) => order.status === "Completed");
  const filteredValue = filteredCompleted.reduce((sum, order) => sum + order.total, 0);
  const activeFilters =
    search || bakeryId !== "all" || status !== "All" || payment !== "All" || type !== "All" || from || to;

  const reset = () => {
    setSearch("");
    setBakeryId("all");
    setStatus("All");
    setPayment("All");
    setType("All");
    setFrom("");
    setTo("");
  };

  return (
    <div className="space-y-4">
      <AdminPageHeader
        eyebrow="Executive audit ledger"
        title="Transaction ledger"
        subtitle="Search and inspect every order and reservation across the cooperative. Figures are read-only snapshots of completed transactions."
        actions={
          <Btn size="sm" variant="outline" onClick={() => exportLedgerCSV(filtered)}>
            <Download size={13} /> Export filtered CSV
          </Btn>
        }
      />

      <div className="rounded-lg border border-[#DCD2C4] bg-white">
        <div className="border-b border-[#E6DDD0] p-3.5">
          <div className="flex flex-col gap-2.5 lg:flex-row lg:items-end">
            <div className="w-full lg:max-w-sm">
              <div className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A887A]">
                Search
              </div>
              <div className="relative">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#A6968A]"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Order number, customer, contact, bakery…"
                  className={`${INPUT_CLS} h-9 pl-9 text-[12px]`}
                />
              </div>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
              <div>
                <div className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A887A]">
                  Bakery
                </div>
                <div className="relative">
                  <select
                    value={bakeryId}
                    onChange={(event) => setBakeryId(event.target.value)}
                    className={`${SELECT_CLS} h-9 text-[11px]`}
                  >
                    <option value="all">All bakeries</option>
                    {bakeries.map((bakery) => (
                      <option key={bakery.id} value={bakery.id}>
                        {bakery.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A786A]"
                  />
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A887A]">
                  Status
                </div>
                <div className="relative">
                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className={`${SELECT_CLS} h-9 text-[11px]`}
                  >
                    <option value="All">All statuses</option>
                    {STATUSES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={12}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A786A]"
                  />
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A887A]">
                  Payment
                </div>
                <div className="relative">
                  <select
                    value={payment}
                    onChange={(event) => setPayment(event.target.value)}
                    className={`${SELECT_CLS} h-9 text-[11px]`}
                  >
                    <option value="All">All methods</option>
                    <option value="GCash">GCash</option>
                    <option value="Cash on Pickup">Cash on pickup</option>
                  </select>
                  <ChevronDown
                    size={12}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A786A]"
                  />
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A887A]">
                  Type
                </div>
                <div className="relative">
                  <select
                    value={type}
                    onChange={(event) => setType(event.target.value)}
                    className={`${SELECT_CLS} h-9 text-[11px]`}
                  >
                    <option value="All">All types</option>
                    <option value="standard">Standard</option>
                    <option value="reservation">Reservation</option>
                  </select>
                  <ChevronDown
                    size={12}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A786A]"
                  />
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A887A]">
                  From
                </div>
                <input
                  type="date"
                  value={from}
                  onChange={(event) => setFrom(event.target.value)}
                  className={`${INPUT_CLS} h-9 text-[11px]`}
                />
              </div>
              <div>
                <div className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-[#9A887A]">
                  To
                </div>
                <input
                  type="date"
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                  className={`${INPUT_CLS} h-9 text-[11px]`}
                />
              </div>
            </div>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-3 text-[10px] text-[#6E5A4F]">
              <span className="inline-flex items-center gap-1.5">
                <FileText size={11} className="text-[#C85A32]" />
                <strong className="text-[#231812]">{filtered.length}</strong> transactions
              </span>
              <span className="h-3 w-px bg-[#E6DDD0]" />
              <span>
                Completed value: <strong className="text-[#231812] tnum">{peso(filteredValue)}</strong>
              </span>
            </div>
            {activeFilters && (
              <button
                onClick={reset}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#E6DDD0] bg-white px-2 py-1 text-[10px] font-medium text-[#6E5A4F] transition hover:border-[#C9B8A5] hover:text-[#231812]"
              >
                <RefreshCw size={10} /> Reset filters
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <Empty
            icon={SearchX}
            title="No transactions match this audit view"
            body="Adjust the ledger filters or search term. The complete transaction history remains available with filters cleared."
            className="border-0 bg-transparent"
            action={
              <Btn size="sm" variant="outline" onClick={reset}>
                Clear audit filters
              </Btn>
            }
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full text-left text-[10.5px]">
                <thead>
                  <tr className="border-b border-[#E6DDD0] bg-[#FAF6F0] text-[8px] uppercase tracking-[0.1em] text-[#9A887A]">
                    <th className="px-4 py-2.5 font-semibold">Date</th>
                    <th className="px-3 py-2.5 font-semibold">Order</th>
                    <th className="px-3 py-2.5 font-semibold">Bakery</th>
                    <th className="px-3 py-2.5 font-semibold">Customer</th>
                    <th className="px-3 py-2.5 font-semibold">Type</th>
                    <th className="px-3 py-2.5 font-semibold">Items</th>
                    <th className="px-3 py-2.5 font-semibold">Payment</th>
                    <th className="px-3 py-2.5 font-semibold">Status</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8DC]">
                  {filtered.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => onOpenOrder(order)}
                      className="cursor-pointer transition hover:bg-[#FAF6F0]"
                    >
                      <td className="whitespace-nowrap px-4 py-2.5 text-[9.5px] text-[#6E5A4F]">
                        {fmtDateShort(order.createdAt)}
                        <div className="text-[8px] text-[#A6968A]">
                          {fmtTime(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 font-medium text-[#231812]">
                        {order.orderNumber}
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="max-w-[150px] truncate text-[9.5px] text-[#4E4038]">
                          {order.bakeryName}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="max-w-[130px] truncate text-[10px] text-[#231812]">
                          {order.customerName}
                        </div>
                        <div className="text-[8.5px] text-[#9A887A]">
                          {order.customerContact}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="rounded border border-[#E6DDD0] bg-[#FAF6F0] px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-[0.05em] text-[#6E5A4F]">
                          {order.type === "reservation" ? "Reservation" : "Standard"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="max-w-[170px] truncate text-[9.5px] text-[#4E4038]">
                          {order.items.map((item) => `${item.qty}× ${item.name}`).join(", ")}
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="text-[9.5px] text-[#231812]">
                          {order.paymentMethod === "GCash" ? "GCash" : "Cash"}
                        </div>
                        {order.gcashReference && (
                          <div className="text-[8px] text-[#9A887A]">
                            {order.gcashReference}
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2.5">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold text-[#231812] tnum">
                        {peso(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="divide-y divide-[#F0E8DC] xl:hidden">
              {filtered.map((order) => (
                <button
                  key={order.id}
                  onClick={() => onOpenOrder(order)}
                  className="block w-full px-3.5 py-3 text-left transition hover:bg-[#FAF6F0]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-display text-[12.5px] font-semibold text-[#231812]">
                          {order.orderNumber}
                        </span>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="mt-0.5 truncate text-[10px] text-[#6E5A4F]">
                        {order.bakeryName}
                      </div>
                      <div className="mt-0.5 text-[9.5px] text-[#8A786A]">
                        {order.customerName} · {fmtDateShort(order.createdAt)}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="font-display text-[14px] font-semibold text-[#231812] tnum">
                        {peso(order.total)}
                      </div>
                      <div className="text-[8.5px] text-[#8A786A]">{order.paymentMethod}</div>
                      <div className="mt-1 text-[8px] font-semibold uppercase tracking-[0.06em] text-[#C85A32]">
                        Inspect →
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex items-start gap-2.5 rounded-lg border border-[#D97706]/30 bg-[#FDF7EC] px-3.5 py-3 text-[10.5px] leading-relaxed text-[#8A5A10]">
        <Lock size={13} className="mt-0.5 shrink-0" />
        <span>
          This ledger is immutable from the executive portal. Order statuses, stock, and
          payment records can only be changed by the assigned bakery's staff workspace.
        </span>
      </div>
    </div>
  );
}

function AdminOrderView({ open, onClose, order, bakery }) {
  if (!order) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={`Audit view · ${order.orderNumber}`}
      subtitle={bakery ? `${bakery.name} · ${bakery.address}` : ""}
      headerAccent="Read-only transaction"
    >
      <div className="px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={order.status} />
              <Badge className="border-[#E6DDD0] bg-[#FAF6F0] text-[#6E5A4F]">
                {order.type === "reservation" ? "Advance reservation" : "Standard order"}
              </Badge>
              <ReadOnlyBadge />
            </div>
            <div className="mt-2 text-[10px] text-[#8A786A]">
              Placed {fmtDateTime(order.createdAt)} · Updated {fmtDateTime(order.updatedAt)}
            </div>
          </div>
          <div className="text-right">
            <div className="font-display text-[25px] font-semibold leading-none text-[#231812] tnum">
              {peso(order.total)}
            </div>
            <div className="mt-1 text-[9.5px] text-[#8A786A]">{order.paymentMethod}</div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[#E6DDD0] bg-white p-3.5">
            <div className="text-[8.5px] font-bold uppercase tracking-[0.11em] text-[#9A887A]">
              Customer
            </div>
            <div className="mt-1 text-[12px] font-semibold text-[#231812]">
              {order.customerName}
            </div>
            <div className="text-[10.5px] text-[#6E5A4F]">{order.customerContact}</div>
          </div>
          <div className="rounded-lg border border-[#E6DDD0] bg-white p-3.5">
            <div className="text-[8.5px] font-bold uppercase tracking-[0.11em] text-[#9A887A]">
              Pickup schedule
            </div>
            <div className="mt-1 text-[12px] font-semibold text-[#231812]">
              {fmtDate(order.pickupDate)}
            </div>
            <div className="text-[10.5px] text-[#6E5A4F]">{order.pickupTime}</div>
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-lg border border-[#E6DDD0] bg-white">
          <table className="w-full text-[10.5px]">
            <thead>
              <tr className="border-b border-[#E6DDD0] bg-[#FAF6F0] text-[8px] uppercase tracking-[0.1em] text-[#9A887A]">
                <th className="px-3 py-2 text-left font-semibold">Item</th>
                <th className="px-2 py-2 text-center font-semibold">Qty</th>
                <th className="px-2 py-2 text-right font-semibold">Unit</th>
                <th className="px-3 py-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {order.items.map((item) => (
                <tr key={item.productId}>
                  <td className="px-3 py-2 text-[#231812]">{item.name}</td>
                  <td className="px-2 py-2 text-center tnum">{item.qty}</td>
                  <td className="px-2 py-2 text-right text-[#6E5A4F] tnum">{peso(item.price)}</td>
                  <td className="px-3 py-2 text-right font-medium text-[#231812] tnum">
                    {peso(item.price * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#E6DDD0] bg-[#FAF6F0]">
                <td colSpan={3} className="px-3 py-2 text-right text-[9px] uppercase tracking-[0.08em] text-[#8A786A]">
                  Completed total
                </td>
                <td className="px-3 py-2 text-right font-display text-[14px] font-semibold text-[#231812] tnum">
                  {peso(order.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[#E6DDD0] bg-white p-3.5">
            <div className="text-[8.5px] font-bold uppercase tracking-[0.11em] text-[#9A887A]">
              Settlement
            </div>
            <div className="mt-1 text-[11px] font-medium text-[#231812]">
              {order.paymentMethod}
            </div>
            {order.gcashReference && (
              <div className="mt-0.5 text-[10px] tracking-[0.05em] text-[#6E5A4F]">
                Ref {order.gcashReference}
              </div>
            )}
            {order.notes && (
              <div className="mt-2 border-t border-[#F0E8DC] pt-2 text-[10px] italic leading-relaxed text-[#8A786A]">
                “{order.notes}”
              </div>
            )}
          </div>
          <div className="rounded-lg border border-[#E6DDD0] bg-white p-3.5">
            <div className="text-[8.5px] font-bold uppercase tracking-[0.11em] text-[#9A887A]">
              Status history
            </div>
            <ol className="mt-1.5 space-y-1.5">
              {(order.history || []).map((entry, index) => (
                <li key={`${entry.status}-${index}`} className="flex items-start gap-2">
                  <span
                    className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: STATUS_META[entry.status]?.dot || "#B7A695" }}
                  />
                  <div className="min-w-0 text-[9.5px] leading-snug">
                    <span className="font-medium text-[#231812]">{entry.status}</span>
                    <span className="text-[#9A887A]"> · {fmtDateTime(entry.at)}</span>
                    {entry.actor && (
                      <div className="text-[8.5px] text-[#A6968A]">{entry.actor}</div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-lg border border-[#D97706]/30 bg-[#FDF7EC] px-3 py-2.5 text-[10px] leading-relaxed text-[#8A5A10]">
          <Lock size={12} className="shrink-0" />
          Read-only audit record. No field on this transaction can be modified from the
          executive portal.
        </div>
      </div>
      <div className="flex justify-end border-t border-[#E6DDD0] bg-white px-5 py-3.5 sm:px-6">
        <Btn variant="outline" onClick={onClose}>
          Close audit view
        </Btn>
      </div>
    </Modal>
  );
}

function AdminWorkspace({ session, onExit }) {
  const { db } = useDB();
  const [view, setView] = useState("overview");
  const [auditOrder, setAuditOrder] = useState(null);

  const orders = db.orders;
  const bakery = auditOrder
    ? db.bakeries.find((item) => item.id === auditOrder.bakeryId)
    : null;

  return (
    <>
      <AdminShell session={session} view={view} setView={setView} onExit={onExit}>
        {view === "overview" && (
          <AdminOverview
            orders={orders}
            bakeries={db.bakeries}
            products={db.products}
            onGoTo={setView}
          />
        )}
        {view === "network" && (
          <AdminNetwork orders={orders} bakeries={db.bakeries} products={db.products} />
        )}
        {view === "ledger" && (
          <AdminLedger
            orders={orders}
            bakeries={db.bakeries}
            onOpenOrder={setAuditOrder}
          />
        )}
      </AdminShell>

      <AdminOrderView
        open={Boolean(auditOrder)}
        onClose={() => setAuditOrder(null)}
        order={auditOrder}
        bakery={bakery}
      />
    </>
  );
}

/* ===================== 12. CUSTOMER ORDER DETAIL ======================== */

function CustomerOrderView({ open, onClose, order, bakery }) {
  if (!order || !bakery) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      size="lg"
      title={`Order ${order.orderNumber}`}
      subtitle={`${bakery.name} · ${bakery.address}`}
      headerAccent="Pickup receipt"
    >
      <div className="px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={order.status} />
            <Badge className="border-[#E6DDD0] bg-[#FAF6F0] text-[#6E5A4F]">
              {order.type === "reservation" ? "Advance reservation" : "Standard order"}
            </Badge>
          </div>
          <div className="font-display text-[22px] font-semibold text-[#231812] tnum">
            {peso(order.total)}
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-[#E6DDD0] bg-white p-3.5">
          <ProgressSteps status={order.status} />
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[#E6DDD0] bg-white p-3.5">
            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9A887A]">
              Pickup
            </div>
            <div className="mt-1 text-[12px] font-semibold text-[#231812]">
              {fmtDate(order.pickupDate)}
            </div>
            <div className="text-[10.5px] text-[#6E5A4F]">{order.pickupTime}</div>
            <div className="mt-1.5 text-[9.5px] text-[#8A786A]">{bakery.hours}</div>
          </div>
          <div className="rounded-lg border border-[#E6DDD0] bg-white p-3.5">
            <div className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#9A887A]">
              Payment
            </div>
            <div className="mt-1 flex items-center gap-1.5 text-[12px] font-semibold text-[#231812]">
              {order.paymentMethod === "GCash" ? (
                <Smartphone size={13} className="text-[#2D6A4F]" />
              ) : (
                <Banknote size={13} className="text-[#D97706]" />
              )}
              {order.paymentMethod}
            </div>
            {order.gcashReference && (
              <div className="mt-0.5 text-[10px] tracking-[0.04em] text-[#6E5A4F]">
                Ref {order.gcashReference}
              </div>
            )}
            <div className="mt-1 text-[9.5px] text-[#8A786A]">
              {order.paymentMethod === "GCash"
                ? "Reference verified by the bakery at confirmation."
                : "Pay at the counter when you collect."}
            </div>
          </div>
        </div>

        <div className="mt-3 overflow-hidden rounded-lg border border-[#E6DDD0] bg-white">
          <table className="w-full text-[10.5px]">
            <thead>
              <tr className="border-b border-[#E6DDD0] bg-[#FAF6F0] text-[8px] uppercase tracking-[0.1em] text-[#9A887A]">
                <th className="px-3 py-2 text-left font-semibold">Item</th>
                <th className="px-2 py-2 text-center font-semibold">Qty</th>
                <th className="px-3 py-2 text-right font-semibold">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8DC]">
              {order.items.map((item) => (
                <tr key={item.productId}>
                  <td className="px-3 py-2 text-[#231812]">{item.name}</td>
                  <td className="px-2 py-2 text-center text-[#6E5A4F] tnum">{item.qty}</td>
                  <td className="px-3 py-2 text-right font-medium text-[#231812] tnum">
                    {peso(item.price * item.qty)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#E6DDD0] bg-[#FAF6F0]">
                <td colSpan={2} className="px-3 py-2 text-right text-[9px] uppercase tracking-[0.08em] text-[#8A786A]">
                  Total
                </td>
                <td className="px-3 py-2 text-right font-display text-[14px] font-semibold text-[#231812] tnum">
                  {peso(order.total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {order.notes && (
          <div className="mt-3 rounded-lg border border-[#EBD9B4] bg-[#FBF4E6] px-3.5 py-2.5 text-[10.5px] leading-relaxed text-[#8A5A10]">
            <span className="font-semibold">Special notes:</span> {order.notes}
          </div>
        )}

        <div className="mt-3 text-[9.5px] text-[#9A887A]">
          Placed {fmtDateTime(order.createdAt)} · Customer {order.customerName}
        </div>
      </div>
      <div className="flex flex-col-reverse gap-2 border-t border-[#E6DDD0] bg-white px-5 py-3.5 sm:flex-row sm:justify-end sm:px-6">
        <Btn variant="outline" onClick={() => printReceipt(order, bakery)}>
          <Printer size={14} /> Print
        </Btn>
        <Btn onClick={() => downloadReceipt(order, bakery)}>
          <Download size={14} /> Download receipt
        </Btn>
      </div>
    </Modal>
  );
}

/* ========================== 13. APP ROOT ================================= */

function initialRoute(session) {
  if (!session) return "customer-auth";
  if (session.role === "bakery_staff") return "staff";
  if (session.role === "system_admin") return "admin";
  return "store";
}

function Root() {
  const { db, update } = useDB();
  const session = db.session;
  const [route, setRoute] = useState(() => initialRoute(session));
  const [viewOrder, setViewOrder] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [route]);

  const setSession = (next) => update((draft) => ({ ...draft, session: next }));

  const exitTo = (nextSession, nextRoute) => {
    setSession(nextSession);
    setRoute(nextRoute);
  };

  const customerPortal = () =>
    setRoute(session && ["customer", "guest"].includes(session.role) ? "store" : "customer-auth");

  const customerAuthed = () => setRoute("store");

  const signOutCustomer = () => {
    exitTo(null, "customer-auth");
  };

  const signOutStaff = () => {
    exitTo(null, "staff-auth");
  };

  const signOutAdmin = () => {
    exitTo(null, "admin-auth");
  };

  const openReceipt = (order) => setViewOrder(order);
  const receiptBakery = viewOrder
    ? db.bakeries.find((bakery) => bakery.id === viewOrder.bakeryId)
    : null;

  if (route === "staff" || route === "staff-auth") {
    if (session?.role === "bakery_staff") {
      return <StaffWorkspace session={session} onExit={signOutStaff} />;
    }
    return (
      <StaffLoginPortal
        onAuthed={() => setRoute("staff")}
        onCustomerPortal={customerPortal}
        onAdminPortal={() => setRoute("admin-auth")}
      />
    );
  }

  if (route === "admin" || route === "admin-auth") {
    if (session?.role === "system_admin") {
      return <AdminWorkspace session={session} onExit={signOutAdmin} />;
    }
    return (
      <AdminLoginPortal
        onAuthed={() => setRoute("admin")}
        onCustomerPortal={customerPortal}
        onStaffPortal={() => setRoute("staff-auth")}
      />
    );
  }

  if (route === "store" || route === "tracker") {
    if (!session || !["customer", "guest"].includes(session.role)) {
      return (
        <CustomerAuthPortal
          onAuthed={customerAuthed}
          onStaffPortal={() => setRoute("staff-auth")}
          onAdminPortal={() => setRoute("admin-auth")}
        />
      );
    }
    if (route === "tracker") {
      return (
        <>
          <OrderTracker
            session={session}
            onBack={() => setRoute("store")}
            onReceipt={openReceipt}
            onSignOut={signOutCustomer}
          />
          <CustomerOrderView
            open={Boolean(viewOrder)}
            onClose={() => setViewOrder(null)}
            order={viewOrder}
            bakery={receiptBakery}
          />
        </>
      );
    }
    return (
      <Marketplace
        session={session}
        onSignIn={signOutCustomer}
        onSignOut={signOutCustomer}
        onTracker={() => setRoute("tracker")}
        onStaffPortal={() => setRoute("staff-auth")}
        onAdminPortal={() => setRoute("admin-auth")}
      />
    );
  }

  return (
    <CustomerAuthPortal
      onAuthed={customerAuthed}
      onStaffPortal={() => setRoute("staff-auth")}
      onAdminPortal={() => setRoute("admin-auth")}
    />
  );
}

export default function App() {
  return (
    <DBProvider>
      <ToastProvider>
        <Root />
      </ToastProvider>
    </DBProvider>
  );
}



