import {
  Bot,
  BrainCircuit,
  Code,
  Coffee,
  FileSpreadsheet,
  GitBranch,
  Globe,
  Headset,
  Landmark,
  MessagesSquare,
  Network,
  Presentation,
  Router,
  Server,
  ShieldCheck,
  Sparkles,
  SquareKanban,
  SquareTerminal,
  Users,
  type LucideProps,
} from 'lucide-react';
import type { CertIcon as CertIconName } from '@/data/types';

const ICONS: Record<CertIconName, typeof ShieldCheck> = {
  shield: ShieldCheck,
  headset: Headset,
  network: Network,
  router: Router,
  server: Server,
  terminal: SquareTerminal,
  landmark: Landmark,
  brain: BrainCircuit,
  sparkles: Sparkles,
  kanban: SquareKanban,
  users: Users,
  git: GitBranch,
  coffee: Coffee,
  code: Code,
  bot: Bot,
  messages: MessagesSquare,
  globe: Globe,
  sheet: FileSpreadsheet,
  presentation: Presentation,
};

export function CertIcon({ name, ...props }: { name: CertIconName } & LucideProps) {
  const Icon = ICONS[name] ?? ShieldCheck;
  return <Icon aria-hidden="true" {...props} />;
}
