"use client";

import { useState, useEffect } from 'react';

export function useCountries() {
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/countries`)
      .then(async (r) => {
        if (!r.ok) {
          console.error('Failed to fetch countries');
          return;
        }
        const data = await r.json();
        setCountries(data);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }, []);

  return countries;
}
