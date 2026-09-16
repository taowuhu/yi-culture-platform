export const APPLICATION_INTENTS = [
    'calculate',
    'analyze',
    'knowledge',
    'explain',
];
export function isApplicationIntent(value) {
    return (typeof value === 'string' &&
        APPLICATION_INTENTS.includes(value));
}
