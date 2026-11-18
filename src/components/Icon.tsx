import {
  ArrowRight, BarChart3, Blinds, Check, ChevronDown, Diamond, Droplets, Factory, FileText, Flame, Gem, Grid2x2, Hand,
  HardHat, Mail, MapPin, Menu, MessageCircle, MessagesSquare, MousePointer2, PanelBottom, Phone, Play, Rows3, Ruler,
  Scan, Send, Settings, Shield, Sparkles, Thermometer, Warehouse, Wind, Wrench, X, Palette, Maximize2, Clock, Globe,
  ChevronLeft, ChevronRight, Info, LayoutGrid, RotateCcw,
} from "lucide-react";

const map = {
  arrow: ArrowRight, chart: BarChart3, blinds: Blinds, check: Check, chevron: ChevronDown, diamond: Diamond,
  droplets: Droplets, factory: Factory, file: FileText, flame: Flame, gem: Gem, grid: Grid2x2, hand: Hand,
  hardhat: HardHat, mail: Mail, pin: MapPin, menu: Menu, chat: MessagesSquare, bubble: MessageCircle,
  pointer: MousePointer2, panel: PanelBottom, phone: Phone, play: Play, rows: Rows3, ruler: Ruler, scan: Scan,
  send: Send, settings: Settings, shield: Shield, sparkles: Sparkles, thermometer: Thermometer,
  warehouse: Warehouse, wind: Wind, wrench: Wrench, x: X, palette: Palette, resize: Maximize2, clock: Clock,
  globe: Globe, left: ChevronLeft, right: ChevronRight, info: Info, layout: LayoutGrid, restart: RotateCcw,
} as const;

export type IconName = keyof typeof map;

export function Icon({ name, className = "size-5", strokeWidth = 1.8 }: { name: IconName | string; className?: string; strokeWidth?: number }) {
  const C = map[name as IconName] ?? Info;
  return <C className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
