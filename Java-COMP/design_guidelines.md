# Design Guidelines: Fullstack JavaScript Starter Application

## Design Approach
**System-Based Approach**: Using modern, clean design principles with a developer-friendly aesthetic. Taking inspiration from Linear and Vercel for their minimalist, functional approach perfect for a customizable starter template.

## Core Design Elements

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Headings**: Font weight 700, sizes ranging from text-4xl (hero) to text-lg (section headers)
- **Body Text**: Font weight 400-500, text-base to text-sm
- **Code/Technical**: Font family mono for any code snippets or technical references

### Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16, and 24
- Base padding/margins: p-4, p-6, p-8
- Section spacing: py-12, py-16, py-24
- Component gaps: gap-4, gap-6, gap-8

### Component Structure

**Navigation Bar**
- Fixed top navigation with subtle border bottom
- Logo/brand name on left
- Navigation links centered or right-aligned
- Height: h-16
- Padding: px-6
- Background with subtle backdrop blur

**Hero Section**
- Clean, centered content area
- Hero heading (text-4xl lg:text-6xl, font-bold)
- Supporting text (text-xl, reduced opacity)
- Primary and secondary CTA buttons arranged horizontally with gap-4
- Max width container: max-w-4xl mx-auto
- Vertical padding: py-24 to py-32
- Background: Subtle gradient or pattern treatment

**Feature Grid**
- 3-column grid on desktop (grid-cols-1 md:grid-cols-3)
- Each card includes:
  - Icon from Heroicons (outline style, w-8 h-8)
  - Feature title (text-xl font-semibold)
  - Description text (text-base)
- Card styling: Subtle border, rounded-xl, padding p-6
- Grid gap: gap-6 to gap-8

**Getting Started Section**
- 2-column layout (grid-cols-1 lg:grid-cols-2)
- Left: Numbered steps list with clear hierarchy
- Right: Code preview box with syntax highlighting placeholder
- Background differentiation for code area

**Footer**
- Simple, compact design
- Centered or split layout
- Links to documentation, GitHub, resources
- Padding: py-8
- Border top separator

### Visual Hierarchy
- Use font weight and size to establish clear hierarchy
- Generous whitespace between sections
- Subtle borders and shadows for depth
- Consistent border radius: rounded-lg for cards, rounded-xl for larger containers

### Interactive Elements
**Buttons**
- Primary: Larger size (px-6 py-3), bold font weight
- Secondary: Ghost style with border, same sizing
- Rounded corners: rounded-lg
- No custom hover states specified

**Cards/Containers**
- Border: border border-neutral-200/50
- Shadow: Minimal, shadow-sm
- Hover: Subtle lift effect (translate-y)
- Background: Semi-transparent white/neutral

### Images
**Hero Section Image**: No large hero image - keep it clean and code-focused
**Feature Icons**: Use Heroicons CDN for all icons (outline style for consistency)

### Responsive Behavior
- Mobile: Single column stack, increased vertical spacing
- Tablet: 2-column grids where appropriate
- Desktop: Full multi-column layouts with max-width constraints

### Content Sections
1. **Hero**: Welcome message, quick description of starter kit, dual CTAs
2. **Features**: 3-4 key capabilities (React, Express, Tailwind, Hot Reload)
3. **Quick Start**: Step-by-step getting started guide
4. **API Example**: Simple demonstration of frontend-backend connection
5. **Footer**: Links and minimal info

### Animations
Minimal animations only:
- Subtle fade-in on page load
- Smooth scroll behavior
- Card hover transitions (transform, shadow)

This design creates a professional, welcoming starting point that developers can easily customize while demonstrating the full-stack capabilities clearly and cleanly.