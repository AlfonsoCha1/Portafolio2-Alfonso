import { BrainCircuit, Clapperboard, Code2, Cpu, Drone, FlaskConical, ShieldCheck, Workflow, type LucideProps } from 'lucide-react';

const ICONS = {
  cyber: ShieldCheck,
  ai: BrainCircuit,
  drones: Drone,
  web: Code2,
  automation: Workflow,
  hardware: Cpu,
  content: Clapperboard,
  practice: FlaskConical,
} as const;

export function CategoryIcon({ id, ...props }: { id: string } & LucideProps) {
  const Icon = ICONS[id as keyof typeof ICONS] ?? FlaskConical;
  return <Icon aria-hidden="true" {...props} />;
}
