import { useState } from 'react'

export const useSecretPassword = () => {
    const [passwordReveal, setPasswordReveal] = useState<'password' | 'text'>('password');

    const togglePasswordReveal = () => {
        setPasswordReveal(prev => prev === 'password' ? 'text' : 'password');
    };
    return { passwordReveal, togglePasswordReveal };
}