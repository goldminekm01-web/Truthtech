// Minimal stub so the build passes.
export function normalizePhone(phone: string) {
    return phone || null;
}
export function detectNetwork(_phone?: string): "safaricom" | "airtel" | "other" {
    return "other";
}
