export const TIER_RULES = [
    { tier: 'PLATINUM', min: 5000, label: 'Platinum', color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE', emoji: '💎' },
    { tier: 'GOLD', min: 1500, label: 'Gold', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A', emoji: '🥇' },
    { tier: 'SILVER', min: 500, label: 'Silver', color: '#64748B', bg: '#F1F5F9', border: '#CBD5E1', emoji: '🥈' },
    { tier: 'BRONZE', min: 0, label: 'Bronze', color: '#92400E', bg: '#FEF3C7', border: '#FCD34D', emoji: '🥉' },
];

export const getTierInfo = (tier) => {
    return TIER_RULES.find((r) => r.tier === tier) || TIER_RULES[3];
};

export const getNextTier = (totalPointsEarned = 0) => {
    const currentIndex = TIER_RULES.findIndex((r) => totalPointsEarned >= r.min);
    if (currentIndex <= 0) return null;
    const next = TIER_RULES[currentIndex - 1];
    return {
        ...next,
        pointsNeeded: next.min - totalPointsEarned,
    };
};

export const getTierProgress = (totalPointsEarned = 0) => {
    const currentIndex = TIER_RULES.findIndex((r) => totalPointsEarned >= r.min);
    if (currentIndex <= 0) return 100; // Platinum = 100%
    const current = TIER_RULES[currentIndex];
    const next = TIER_RULES[currentIndex - 1];
    const progress = ((totalPointsEarned - current.min) / (next.min - current.min)) * 100;
    return Math.min(Math.round(progress), 100);
}; 