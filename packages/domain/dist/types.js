export const DOMAIN_IDS = [
    'iching',
    'bazi',
    'ziwei',
    'liuyao',
    'meihua',
    'qimen',
];
export function isDomainId(value) {
    return (typeof value === 'string' &&
        DOMAIN_IDS.includes(value));
}
