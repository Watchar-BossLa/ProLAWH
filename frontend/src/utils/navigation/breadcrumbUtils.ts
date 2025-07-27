
import { routeConfig } from '@/config/navigationRoutes';
import type { BreadcrumbItem } from '@/types/navigation';

export function generateBreadcrumbs(path: string): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = [];
  const config = routeConfig[path];
  
  if (!config) return breadcrumbs;

  // Build breadcrumb chain
  const buildChain = (currentPath: string) => {
    const currentConfig = routeConfig[currentPath];
    if (!currentConfig) return;

    if (currentConfig.parent) {
      buildChain(currentConfig.parent);
    }

    breadcrumbs.push({
      label: currentConfig.title,
      href: currentPath === path ? undefined : currentPath,
      current: currentPath === path
    });
  };

  buildChain(path);
  return breadcrumbs;
}
