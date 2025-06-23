
import React from 'react';

import { Tailwind } from '@react-email/tailwind';

interface TailwindconfigProps {
  children: React.ReactNode;
}

export function TailwindConfig({ children }: TailwindconfigProps) {
  return (
    <Tailwind
      config={{
        theme: {
          extend: {
            colors: {
              foodiary: {
                green: '#64A30D'
              },
              gray: {
                600: '#A1A1A1'
              }
            }
          }
        }
      }}>
      {children}
    </Tailwind>
  )
}
