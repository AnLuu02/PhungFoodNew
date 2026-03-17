import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type Hook<T> = {
  activeTab: T;
  changeTab: (tag: T) => void;
};
export function useHashTabs<T extends string>(validTabs: T[], defaultTab: T): Hook<T> {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<T>(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : '';
    return validTabs.includes(hash as T) ? (hash as T) : defaultTab;
  });

  const changeTab = useCallback((tab: T) => {
    const newUrl = `${window.location.pathname}${tab == defaultTab ? '' : '#' + tab}`;
    router.replace(newUrl, { scroll: false });
    setActiveTab(tab);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash.replace('#', '') as T;
      if (validTabs.includes(currentHash)) {
        setActiveTab(currentHash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [validTabs]);

  return { activeTab, changeTab };
}
