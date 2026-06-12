/**
 * TIER SYSTEM BUSINESS RULES
 * Berdasarkan total poin yang pernah diperoleh (totalPointsEarned)
 * bukan saldo poin saat ini
 *
 * BRONZE   : 0     - 499   pts
 * SILVER   : 500   - 1499  pts
 * GOLD     : 1500  - 4999  pts
 * PLATINUM : 5000+ pts
 */

const TIER_RULES = [
    { tier: 'PLATINUM', min: 5000, label: 'Platinum', color: '#6366F1', bg: '#EEF2FF', emoji: '💎' },
    { tier: 'GOLD', min: 1500, label: 'Gold', color: '#F59E0B', bg: '#FFFBEB', emoji: '🥇' },
    { tier: 'SILVER', min: 500, label: 'Silver', color: '#64748B', bg: '#F1F5F9', emoji: '🥈' },
    { tier: 'BRONZE', min: 0, label: 'Bronze', color: '#92400E', bg: '#FEF3C7', emoji: '🥉' },
];

const calculateTier = (totalPointsEarned = 0) => {
    const rule = TIER_RULES.find((r) => totalPointsEarned >= r.min);
    return rule ? rule.tier : 'BRONZE';
};

const getNextTier = (totalPointsEarned = 0) => {
    const currentTierIndex = TIER_RULES.findIndex((r) => totalPointsEarned >= r.min);
    if (currentTierIndex <= 0) return null; // sudah Platinum
    const next = TIER_RULES[currentTierIndex - 1];
    const pointsNeeded = next.min - totalPointsEarned;
    return { tier: next.tier, label: next.label, pointsNeeded, min: next.min };
};

const getTierInfo = (tier) => {
    return TIER_RULES.find((r) => r.tier === tier) || TIER_RULES[3];
};

module.exports = { TIER_RULES, calculateTier, getNextTier, getTierInfo };