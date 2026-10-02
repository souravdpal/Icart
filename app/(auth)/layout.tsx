// app/(auth)/layout.tsx
import type { ReactNode } from 'react'
import Link from 'next/link'
import './main.css'
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div> 
        {children}

        </div>
  )
}