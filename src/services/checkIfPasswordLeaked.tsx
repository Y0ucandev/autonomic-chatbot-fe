export const checkIfPasswordLeaked = async (password: string) => {
    const sha1 = await generateSHA1(password);
    const prefix = sha1.substring(0, 5);
    const suffix = sha1.substring(5).toUpperCase();
    try {
        const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
        if (!response.ok) {
            throw new Error(`Błąd API: ${response.status}`);
        }
        const data = await response.text();
        const lines = data.split('\n');
        for (const line of lines) {
            const [foundSuffix, count] = line.split(':');
            if (foundSuffix.trim() === suffix) {
                return {
                    leaked: true,
                    count: parseInt(count.trim())
                };
            }
        }
        return {
            leaked: false,
            count: 0
        };
    } catch (error) {
        console.error('Błąd podczas sprawdzania hasła:', error);
        throw error;
    }
}
async function generateSHA1(message: string) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.toUpperCase();
}