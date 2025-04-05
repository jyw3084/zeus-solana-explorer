import { useEffect, useState } from 'react';

export const useNetwork = () => {
  const [network, setNetwork] = useState('Mainnet');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedNetwork = localStorage.getItem('network') || 'Mainnet';
      setNetwork(savedNetwork);
    }
  }, []);

  const changeNetwork = (newNetwork: string) => {
    setNetwork(newNetwork);
    localStorage.setItem('network', newNetwork);
    window.location.href = '/';
  };

  return { network, changeNetwork };
};