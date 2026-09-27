/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#17223B',
    tint: '#FF6B5F',
    background: '#FFFDF7',
    foreground: '#17223B',
    card: '#FFFFFF',
    cardForeground: '#17223B',
    primary: '#FF6B5F',
    primaryForeground: '#FFFFFF',
    secondary: '#FFE58A',
    secondaryForeground: '#17223B',
    muted: '#F0F2F4',
    mutedForeground: '#6D7587',
    accent: '#A8D7EE',
    accentForeground: '#17223B',
    destructive: '#E94F4F',
    destructiveForeground: '#FFFFFF',
    border: '#E8E3D9',
    input: '#E8E3D9',
    navy: '#17223B',
    yellow: '#FFD95A',
    coral: '#FF6B5F',
    sky: '#A8D7EE',
    mint: '#9ED8B7',
    purple: '#6C63FF',
    paper: '#FFFDF7',
  },
  radius: 22,
};

export default colors;
