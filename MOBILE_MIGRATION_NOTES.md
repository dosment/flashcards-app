# Mobile-First Migration Notes

## Changes Made for iPhone SE Compatibility

### HTML Changes (`index.html`)
- **Line 5**: Added `viewport-fit=cover` to viewport meta tag for notch support

### CSS Changes (`styles.css`)
- **Lines 9-14**: Added mobile core rules preventing all scrolling with `overflow: hidden` and `position: fixed`
- **Lines 53-64**: Converted main layout to CSS Grid with `dvh` units and safe-area-inset padding
- **Lines 69-74**: Updated screen containers with dynamic padding and overflow protection
- **Lines 86-93**: Implemented responsive header with clamp() functions
- **Lines 97**: App title uses clamp(16px, 4vw, 20px) to prevent iOS zoom
- **Lines 374-376**: All buttons have min-height 44px and min-width 44px for tap targets
- **Lines 705-710**: Flashcard height now uses clamp(180px, 35vh, 400px) for dynamic sizing
- **Lines 1632-1734**: Added SE Mode media query for 320x568 devices with aggressive space optimization
- **Lines 1736-1762**: Added defensive overflow rules and text protection

### JavaScript Changes (`app.js`)
- **Line 47**: Added `setupMobileHandlers()` call to initialization
- **Lines 1428-1501**: Implemented comprehensive mobile viewport handling:
  - Dynamic viewport height calculation with URL bar compensation
  - Debounced resize/orientation handlers
  - Automatic compact mode detection for small screens
  - iOS input zoom prevention
  - Pull-to-refresh and double-tap zoom prevention

## Why These Changes Were Made

1. **Zero Scrolling**: The original app used `overflow-y: auto` which created scrollable areas. All overflow has been eliminated.

2. **Dynamic Heights**: Fixed pixel heights (400px flashcards) wouldn't fit on SE. Now uses viewport-relative units with clamps.

3. **Font Size Safety**: iOS zooms when font-size < 16px. All interactive elements now have min 16px fonts.

4. **Tap Targets**: iOS requires 44x44px minimum tap targets for accessibility.

5. **Safe Areas**: Added padding for iPhone notches and home indicators.

6. **Layout Shift Prevention**: JavaScript handlers prevent layout shifts when URL bar appears/disappears.

## Architecture Preserved

- No rewrite performed - only targeted patches
- Original functionality unchanged
- Vanilla JS/CSS maintained
- All existing features work identically