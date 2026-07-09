import * as React from 'react';
import * as LucideIcons from 'lucide-react';

export type IconName = keyof typeof LucideIcons;

interface IconProps extends React.ComponentProps<'svg'> {
  name: IconName;
  size?: number | string;
  className?: string;
}

export function Icon({ name, size = 20, className, ...props }: IconProps) {
  const LucideIcon = LucideIcons[name] as React.ComponentType<any>;
  if (!LucideIcon) {
    const Fallback = LucideIcons.HelpCircle;
    return <Fallback size={size} className={className} {...props} />;
  }
  return <LucideIcon size={size} className={className} {...props} />;
}
