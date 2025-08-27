# QA Checklist for Mobile Optimization

Test on each target device to verify "no scrolling" requirement:

## Target Matrix - MUST PASS ALL

### iPhone SE (1st gen) - 320×568 CSS px
- [ ] **Home screen**: All content visible without scrolling
- [ ] **Subject list**: Cards fit without vertical scroll
- [ ] **Chapter list**: Study/Quiz buttons accessible without scroll
- [ ] **Lesson list**: All lessons visible without scroll
- [ ] **Study mode**: Header + flashcard + controls fit without scroll
- [ ] **Quiz mode**: Question + 4 options + progress fit without scroll
- [ ] **Results screen**: Score display + actions fit without scroll

### iPhone SE (2nd/3rd gen) - 375×667 CSS px  
- [ ] **Home screen**: Content centered with extra space
- [ ] **Subject list**: More comfortable spacing
- [ ] **Study mode**: Larger flashcard, better button spacing
- [ ] **Quiz mode**: Comfortable option spacing
- [ ] **No layout shift**: URL bar show/hide doesn't break layout

### iPhone 12/13/14/15 - 390×844 CSS px
- [ ] **All screens**: Content scales gracefully upward
- [ ] **Flashcards**: Use more available height
- [ ] **Text**: Readable without being too large

### iPhone Plus/Max - 414×896 CSS px
- [ ] **Content**: Proper centering with max-width container
- [ ] **Buttons**: Maintain min 44px tap targets
- [ ] **Typography**: Scales appropriately

### Android Common - 360×800 CSS px
- [ ] **Chrome**: No horizontal scroll in any orientation
- [ ] **Chrome**: Address bar behavior doesn't cause overflow

### Android Common - 412×915 CSS px  
- [ ] **All content**: Fits comfortably in viewport
- [ ] **Touch targets**: Easily tappable

## Critical Verification Steps

### 1. Load Test
1. Open app on target device
2. **VERIFY**: No horizontal scrollbars appear
3. **VERIFY**: No vertical scrollbars appear  
4. **VERIFY**: Content doesn't extend beyond viewport edges

### 2. Navigation Test
1. Navigate through: Home → Subject → Chapter → Study
2. **VERIFY**: Each screen transition shows all content immediately
3. **VERIFY**: No scrolling needed to reach any interactive element
4. **VERIFY**: Back buttons always visible and accessible

### 3. Study Mode Test
1. Start studying any lesson
2. **VERIFY**: Header (progress, back button) fully visible
3. **VERIFY**: Flashcard fully visible
4. **VERIFY**: Control buttons (flip, got it, try again) fully visible
5. **VERIFY**: No content cut off at bottom

### 4. Quiz Mode Test  
1. Start any chapter quiz
2. **VERIFY**: Question text fully visible
3. **VERIFY**: All 4 answer options visible without scroll
4. **VERIFY**: Next button visible after selection
5. **VERIFY**: Progress bar and back button accessible

### 5. Orientation Test
1. Rotate device to landscape
2. **VERIFY**: Content reflows without scroll
3. **VERIFY**: No layout shift or broken elements
4. Rotate back to portrait
5. **VERIFY**: Returns to proper layout

### 6. URL Bar Test (iOS Safari)
1. Load app, note initial layout
2. Scroll down to hide URL bar
3. **VERIFY**: Layout doesn't break or create scrollbars
4. Tap top to show URL bar
5. **VERIFY**: Content adjusts smoothly

### 7. Text Length Test
1. Find lesson with longest vocabulary terms
2. **VERIFY**: Text doesn't overflow container
3. **VERIFY**: Text remains readable (not cut off)
4. **VERIFY**: Long definitions use text clamping properly

### 8. Touch Target Test
1. Try tapping all buttons with thumb
2. **VERIFY**: All buttons respond to touch
3. **VERIFY**: No accidental taps on nearby elements
4. **VERIFY**: Buttons feel appropriately sized

## Failure Criteria

**IMMEDIATE FAIL** if any of these occur:
- Horizontal scrollbar appears
- Vertical scrollbar appears  
- Content extends beyond viewport
- Interactive elements not reachable without scrolling
- Text cut off or illegible
- Touch targets too small (< 44px)
- Layout breaks on orientation change
- App unusable on iPhone SE 320×568

## Success Criteria

**PASS** requires:
- ✅ Zero scrollbars on all target devices
- ✅ All content fits above the fold
- ✅ Smooth navigation between screens
- ✅ Responsive behavior on resize/orientation
- ✅ Proper text clamping for long content
- ✅ Accessible touch targets (≥44px)
- ✅ No iOS zoom triggered on input focus