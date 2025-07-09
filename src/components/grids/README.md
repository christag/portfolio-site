# Grid System Documentation

## Overview

Our grid system embodies "controlled chaos" - deliberately breaking traditional grid rules while maintaining accessibility and usability.

## Components

### AsymmetricGrid

- **Purpose**: Print-style layouts that break conventional grid patterns
- **Variants**:
  - `standard`: Traditional 12-column grid
  - `chaos`: Deliberately misaligned items
  - `print`: Magazine-style layout

### MasonryGrid

- **Purpose**: Pinterest-style layouts for portfolio content
- **Features**:
  - Responsive column counts
  - Prevents item breaking across columns
  - Subtle randomness for visual interest

### ResponsiveGrid

- **Purpose**: Mobile-first grid with optional misalignment
- **Features**:
  - Custom breakpoints (xs to 3xl)
  - Optional deliberate misalignment
  - Accessibility-aware (removes misalignment for reduced motion)

## Usage Examples

```astro
<!-- Asymmetric chaos grid -->
<AsymmetricGrid variant="chaos" gap="gap-8">
  <div>Content 1</div>
  <div>Content 2</div>
  <div>Content 3</div>
</AsymmetricGrid>

<!-- Masonry portfolio grid -->
<MasonryGrid columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}>
  <div>Portfolio Item 1</div>
  <div>Portfolio Item 2</div>
  <div>Portfolio Item 3</div>
</MasonryGrid>

<!-- Responsive grid with misalignment -->
<ResponsiveGrid misalign={true} gap="gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</ResponsiveGrid>
```

## Accessibility Considerations

- Misalignment is removed on mobile devices for better UX
- Respects `prefers-reduced-motion` settings
- Maintains logical reading order despite visual chaos
- Focus states remain clear and accessible
