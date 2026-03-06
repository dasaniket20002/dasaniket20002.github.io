# Aniket Das — Portfolio

This repository contains the source code for my personal portfolio website.

The site is built to showcase my work, experiments, and interactive projects, with a strong focus on **creative development, real-time graphics, and smooth UI interactions**. It combines modern web technologies with WebGL and animation libraries to create a visually engaging and performant experience.

The project uses React, Three.js, and modern frontend tooling to render interactive 3D elements, animated transitions, and fluid scrolling behavior.

Additional sections of this README will document the individual components and systems used throughout the site.

## Tech Stack

Core technologies used in this project:

- **React 19** – UI framework
- **Three.js** – WebGL rendering
- **React Three Fiber** – React renderer for Three.js
- **Drei** – Useful helpers for React Three Fiber
- **Rapier** – Physics engine for WebGL scenes
- **Motion** – Animations and transitions
- **Lenis** – Smooth scrolling
- **Tailwind CSS** – Utility-first styling
- **Vite** – Build tool and dev server
- **TypeScript** – Static typing
- **Bun** – Package manager and runtime

## Getting Started

This project uses `bun` for dependency management and running scripts.

### Install Bun

If you don’t already have Bun installed:

```bash
curl -fsSL https://bun.sh/install | bash
```

### Install Dependencies

```bash
bun install
```

### Run Development Server

```bash
bun run dev
```

The Development server will start at: `http://localhost:5173`

### Hosting a Development Server

To make the development server accessible from other devices on your local network (for example, to test on a phone or tablet), run:

```bash
bun run host
```

This starts the Vite dev server with the `--host` flag enabled, allowing the site to be accessed via your machine's local IP address.
Example: `http://192.168.x.x:5173`

### Build for Production

```bash
bun run build
```

### Preview Production Build

```bash
bun run preview
```

## Components - UI

### AnimatedTicker - `src\lib\components\ui\animated-ticker.tsx`

`AnimatedTicker` is a React component that animates numeric values using a slot-machine style rolling digit animation.

Instead of replacing the entire number when the value changes, each digit animates independently, producing a smooth transition that works well for metrics, counters, or real-time values.

The animation is implemented using Motion (Framer Motion v12) springs and transforms.

#### Features

- Smooth digit transitions using spring animations
- Each digit animates independently
- Optional decimal display
- Optional fixed integer places
- Automatic digit height measurement
- Layout-aware animations using LayoutGroup

#### Example

```tsx
<AnimatedTicker value={124.37} showDecimals />
```

#### Props

| Prop           | Type      | Description                                      |
| -------------- | --------- | ------------------------------------------------ |
| `value`        | `number`  | The numeric value to display                     |
| `className`    | `string`  | Optional styling for the container               |
| `showDecimals` | `boolean` | Whether to render decimal digits                 |
| `fixedPlaces`  | `number`  | Minimum number of integer digits (pads with `0`) |

### Button - `src\lib\components\ui\button.tsx`

`Button` is a reusable animated button component built with Motion for React.
It combines layout animations, hover interactions, and optional magnetic movement to create a dynamic UI element suitable for interactive portfolio interfaces.

The component supports animated text, optional icons, and a physics-inspired hover behavior.

#### Features

- Animated text using the TextRoll component
- Optional icon reveal on hover
- Magnetic hover interaction
- Motion-powered tap and hover animations
- Variant-based styling (light / dark)
- Forwarded ref support
- Fully compatible with Motion HTML props

#### Example

```tsx
<Button text="View Project" icon={<ArrowRight />} variant="dark" magnetic />
```

#### Props

| Prop        | Type                | Description                       |
| ----------- | ------------------- | --------------------------------- |
| `text`      | `string`            | Button label                      |
| `icon`      | `ReactNode`         | Optional icon displayed on hover  |
| `variant`   | `"light" \| "dark"` | Visual theme of the button        |
| `magnetic`  | `boolean`           | Enables magnetic drag interaction |
| `className` | `string`            | Additional styling                |
| `onClick`   | `MouseEventHandler` | Click handler                     |
| `disabled`  | `boolean`           | Disables interactions             |

### Header - `src\lib\components\ui\header.tsx`

`Header` is the primary navigation component for the portfolio website.
It combines **scroll-aware behavior, animated navigation links, and a real-time scroll progress indicator**.

The component dynamically hides and reveals itself based on scroll direction and integrates with the site's **Lenis smooth scrolling system and sticky snap navigation context**.

#### Features

- Scroll-aware auto-hide header
- Animated navigation links using Motion variants
- Scroll progress indicator
- Integrated Lenis smooth scrolling
- Sticky section navigation support
- Responsive layout behavior
- Animated entry after loading

#### Example

```tsx
<Header isLoading={false} className="fixed top-0" />
```

#### Props

| Prop        | Type      | Description                                           |
| ----------- | --------- | ----------------------------------------------------- |
| `isLoading` | `boolean` | Controls delayed header reveal during initial loading |
| `className` | `string`  | Optional styling overrides                            |

#### Navigation

Navigation links are defined using a static configuration:

```ts
const NAV_LINKS = [
  { name: "Work", href: "#work" },
  { name: "Services", href: "#services" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];
```

Each link is animated using Motion variants to create a **staggered reveal effect**.

#### Link Animation

Links animate sequentially when the header appears.

```ts
const LINK_VARIANTS = {
  hidden: { x: 24, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};
```

A container variant applies staggered timing using Motion's `stagger` helper.

```ts
delayChildren: stagger(0.1);
```

This produces a cascading animation from right to left.

#### Scroll-Aware Header Behavior

The header automatically hides when the user scrolls _downward_ and reappears when scrolling _upward_.

```ts
useMotionValueEvent(scrollY, "change", (latest) => {
  const previous = scrollY.getPrevious() ?? 0;

  if (latest - previous > 10) setHidden(true);
  if (previous - latest > 5) setHidden(false);
});
```

This creates a common UX pattern where navigation stays out of the way while reading content.

Hovering over the header also forces it to remain visible.

#### Delayed Initial Reveal

The header is hidden during the loading phase and appears after a short delay.

```ts
const HEADER_INITIAL_DELAY = 1000;
```

This allows the h**ero section and initial animations** of the page to complete before navigation appears.

#### Scroll Progress Viewer

The header includes a vertical scroll progress indicator showing how far the user has navigated through the page.

The indicator consists of:

- A vertical progress bar
- A numeric percentage display
- An animated ticker for smooth number transitions

##### Progress Calculation

Scroll progress is derived from Motion's `useScroll`.

```ts
const { scrollYProgress } = useScroll();
```

Values are converted to a percentage:

```ts
Math.round(scrollYProgress * 100);
```

##### Animated Progress Indicator

Two Motion transforms control the position of the indicator:

```ts
const top = useTransform(scrollYProgress, [0, 1], ["-3%", "103%"]);
const y = useTransform(scrollYProgress, [0, 1], ["0%", "-100%"]);
```

These values are then smoothed using springs.

```ts
useSpring(..., { damping: 40, stiffness: 300 });
```

This prevents abrupt jumps during rapid scrolling.

#### Smooth Scroll Integration

The header integrates with Lenis for smooth scrolling.

Clicking the logo scrolls back to the top of the page:

```ts
lenis?.scrollTo(0);
```

During the scroll action, sticky snap behavior is temporarily locked:

```ts
lockSnap();
lenis?.scrollTo(0, { onComplete: unlockSnap });
```

This prevents snapping conflicts while scrolling programmatically.

#### Visual Styling

The header uses:

- `mix-blend-difference` to maintain visibility across backgrounds
- Tailwind utility classes for layout and spacing
- Motion layout animations for smooth entry and exit

### Link - `src\lib\components\ui\link.tsx`

`Link` is an animated navigation component designed for smooth scrolling and interactive hover effects.
It integrates with **Lenis smooth scrolling, sticky snap navigation, and Motion animations** to create a responsive and polished link interaction.

The component supports both internal anchor navigation and external links, while providing animated underline and background transitions.

#### Features

- Smooth scrolling using Lenis
- Animated underline reveal
- Optional hover background animation
- Rolling text animation using TextRoll
- Support for internal anchor navigation and external links
- Optional controlled hover state
- Fully compatible with Motion anchor props

#### Example

```tsx
<Link href="#work">Work</Link>
```

```tsx
<Link href="https://github.com/username">GitHub</Link>
```

#### Props

| Prop                 | Type                | Description                         |
| -------------------- | ------------------- | ----------------------------------- |
| `children`           | `string`            | Link label                          |
| `href`               | `string`            | Target URL or anchor                |
| `theme`              | `"light" \| "dark"` | Color theme                         |
| `underlineThickness` | `number`            | Thickness of animated underline     |
| `showBG`             | `boolean`           | Enables background reveal animation |
| `hovered`            | `boolean`           | Controlled hover state              |
| `setHovered`         | `(boolean) => void` | Controlled hover setter             |
| `className`          | `string`            | Additional styling                  |

The component also supports all Motion anchor props via: `HTMLMotionProps<"a">`

### LogoName - `src\lib\components\ui\logo-name.tsx`

`LogoName` is an animated logo component used in the site header.
It displays the author's name and reveals the full text through staggered character animations on hover.

When idle, the logo shows only the initials separated by a dash. Hovering over the logo expands the name with animated letter transitions.

#### Features

- Hover-triggered name reveal animation
- Staggered character-by-character animation
- Layout-aware transitions using Motion
- Minimal idle state with initials + dash
- Fully compatible with Motion section props

#### Example

```tsx
<LogoName />
```

#### Props

| Prop        | Type     | Description                |
| ----------- | -------- | -------------------------- |
| `className` | `string` | Optional styling overrides |

The component also accepts Motion props via: `HTMLMotionProps<"section">`

#### Animation Flow

The animation sequence works as follows:

- Initials remain visible
- Dash disappears
- Remaining letters appear
- Characters animate sequentially
  `AnimatePresence` ensures smooth transitions between these states.

### MorphingDialog - `src\lib\components\ui\morphing-dialog.tsx`

`MorphingDialog` is a composable animated dialog system built with Motion for React.
It allows UI elements to morph smoothly into modal dialogs using shared layout animations.

The system uses layoutId-based transitions, enabling elements such as buttons, images, or text to animate seamlessly into their dialog counterparts.

Full Documentation is available at: [Motion Primitives](https://motion-primitives.com/docs/morphing-dialog)

### NoiseOverlay - `src\lib\components\ui\noise-overlay.tsx`

`NoiseOverlay` renders a subtle animated noise texture over the entire viewport.
It uses SVG fractal noise to create a grain effect that adds visual depth and reduces flat digital surfaces.

The component is rendered as a fixed overlay that does not interfere with user interaction.

#### Features

- Full-screen procedural noise texture
- Uses SVG `feTurbulence` fractal noise
- Responsive to viewport size
- Lightweight GPU-friendly effect
- Non-interactive overlay (`pointer-events: none`)

#### Example

```tsx
<NoiseOverlay />
```

#### Visual Purpose

The noise overlay is used to:

- Reduce banding in gradients
- Add subtle texture to UI surfaces
- Improve perceived visual richness

This technique is common in modern design systems and motion-heavy interfaces.

### Popover - `src\lib\components\ui\popover.tsx`

`Popover` is a lightweight floating UI component that renders contextual content relative to an anchor element.
It automatically positions itself above or below the anchor depending on available viewport space and updates its position dynamically during scroll or resize events.

The component is rendered using a **React portal**, ensuring it appears above the main application layout.

#### Features

- Automatic smart placement (above or below anchor)
- Responsive positioning on scroll and resize
- Click-outside detection for closing
- Rendered using React portals
- Fixed-position layout for stable placement
- Anchor-based positioning using `getBoundingClientRect`

```tsx
const buttonRef = useRef<HTMLButtonElement>(null);
const [open, setOpen] = useState(false);
return (
  <button ref={buttonRef} onClick={() => setOpen(true)}>
    Open Popover
  </button>

  <Popover
    open={open}
    onClose={() => setOpen(false)}
    anchorRef={buttonRef}
  >
    Popover content
  </Popover>
)
```

#### Props

| Prop        | Type                     | Description                                  |
| ----------- | ------------------------ | -------------------------------------------- |
| `open`      | `boolean`                | Controls whether the popover is visible      |
| `onClose`   | `() => void`             | Callback triggered when popover should close |
| `anchorRef` | `RefObject<HTMLElement>` | Reference to the anchor element              |
| `children`  | `ReactNode`              | Content displayed inside the popover         |
| `gap`       | `number`                 | Distance between the anchor and popover      |

### ScrollTextPressure - `src\lib\components\ui\scroll-text-pressure.tsx`

`ScrollTextPressure` is a scroll-driven typography component that progressively reveals and transforms text as the user scrolls through a section.

Each character animates individually using Motion values, producing a pressure-like visual effect where text gradually sharpens, gains weight, and expands typographically.

The component **leverages variable font axes** and scroll progress to create a dynamic reading experience.

Notes:

- The container should always bigger in height than the viewport height.
- The fonts used should have variable font features; example - Nunito Sans

#### Features

- Scroll-driven character-by-character animation
- Variable font axis animation (`wdth`, `wght`, `ital`, `YTLC`)
- Smooth opacity and blur transitions
- Highlighted word emphasis
- Sticky layout behavior for immersive reading sections
- Motion-powered scroll progress tracking

#### Example

```tsx
<ScrollTextPressure
  displayText="Designing expressive interfaces through motion and typography."
  highlights={["expressive", "motion"]}
  containerRef={sectionRef}
/>
```

#### Props

| Prop           | Type                     | Description                         |
| -------------- | ------------------------ | ----------------------------------- |
| `displayText`  | `string`                 | Text to render and animate          |
| `highlights`   | `string[]`               | Words to emphasize during animation |
| `containerRef` | `RefObject<HTMLElement>` | Scroll container reference          |
| `theme`        | `"light" \| "dark"`      | Color theme                         |
| `className`    | `string`                 | Additional styling                  |

The component also supports Motion div props via: `HTMLMotionProps<"div">`

#### Variable Font Axes

The component animates several font variation settings to create a pressure effect.
| Axis | Effect |
| ------ | ------------------------ |
| `wdth` | Expands character width |
| `wght` | Increases font weight |
| `ital` | Adds italic slant |
| `YTLC` | Adjusts font's _x-height_ |

Example Transformation:

```
fontVariationSettings:
'wdth' 85 → 125
'wght' 300 → 800
'YLTC' 440 → 540
'ital' 0 → 1
```

These values are interpolated using Motion templates:

```tsx
useMotionTemplate(...)
```

### ScrollVelocityMasonry - `src\lib\components\ui\scroll-velocity-masonry.tsx`

`ScrollVelocityMasonry` is a scroll-reactive masonry layout that animates image columns vertically based on the user's scroll velocity.

Instead of moving at a fixed rate, each column adjusts its speed dynamically depending on scroll momentum, creating a fluid parallax-like gallery effect.

Images can be expanded into fullscreen dialogs using the `MorphingDialog` animation system.

#### Features

- Scroll-velocity driven animation
- Infinite looping masonry columns
- Alternating column directions
- Responsive column layout
- Hover slowdown interaction
- Morphing dialog image viewer
- GPU-friendly transform animations

#### Example

```tsx
<ScrollVelocityMasonry images={images} baseVelocity={3} />
```

#### Props

| Prop              | Type             | Description                             |
| ----------------- | ---------------- | --------------------------------------- |
| `images`          | `MasonryImage[]` | List of images to display               |
| `columns`         | `number`         | Fixed number of columns                 |
| `baseVelocity`    | `number`         | Base scroll speed                       |
| `gap`             | `number`         | Gap between images and columns          |
| `damping`         | `number`         | Spring damping for velocity smoothing   |
| `stiffness`       | `number`         | Spring stiffness for velocity smoothing |
| `className`       | `string`         | Container styling                       |
| `columnClassName` | `string`         | Column styling                          |

#### Image Data

```tsx
export interface MasonryImage {
  src: string;
  alt?: string;
  name: string;
}
```

#### Column Distribution

Images are evenly distributed across columns.

```tsx
distribute(images, columns);
```

Example:

```
images: [1,2,3,4,5,6]
columns: 3

result:
column 1 → [1,4]
column 2 → [2,5]
column 3 → [3,6]
```

This keeps the masonry visually balanced.

#### Alternating Direction

Columns alternate direction to increase visual movement.

```
Column 1 → downward
Column 2 → upward
Column 3 → downward
Column 4 → upward
```

This is determined by the column index.

```ts
direction = i % 2 === 0 ? 1 : -1;
```

#### Image Interaction

Each image is wrapped in a MorphingDialog trigger.

Clicking an image opens a fullscreen preview with a smooth layout morph transition.

The dialog shows:

- high-resolution image
- image title
- attribution ("Made in Blender")

#### Responsive Columns

If columns is not provided, the component automatically adjusts the layout based on viewport width.
| Screen Width | Columns |
| ------------ | ------- |
| `< 640px` | 2 |
| `< 1024px` | 3 |
| `< 1536px` | 4 |
| `≥ 1536px` | 5 |

#### Visual Effect

The combined system produces a dynamic gallery where:

- columns move continuously
- motion reacts to scroll speed
- hover interaction slows motion
- images expand smoothly into dialogs

### TextEffect - `src\lib\components\ui\text-effect.tsx`

`TextEffect` is a highly customizable animated typography component built with Motion for React.
It enables animated text reveals at the **line, word, or character level**, with configurable animation presets, token styling, and staggered transitions.

The component is designed as a flexible text animation engine used throughout the project to create expressive typography and narrative-driven UI interactions.

#### Features

- Animate text per line, word, or character
- Multiple animation presets
- Token-based word highlighting
- Configurable animation timing and stagger
- Fully customizable Motion variants
- Accessible screen-reader fallback
- Works with any HTML text element

#### Example

```tsx
<TextEffect preset="fade-in-blur" per="word">
  Designing expressive interfaces through motion.
</TextEffect>
```

#### Props

| Prop                      | Type                         | Description                      |
| ------------------------- | ---------------------------- | -------------------------------- |
| `children`                | `string`                     | Text content to animate          |
| `per`                     | `"line" \| "word" \| "char"` | Animation segmentation level     |
| `as`                      | HTML tag                     | Rendered element type            |
| `preset`                  | `PresetType`                 | Animation style                  |
| `delay`                   | `number`                     | Delay before animation starts    |
| `speedReveal`             | `number`                     | Controls stagger speed           |
| `speedSegment`            | `number`                     | Controls segment animation speed |
| `trigger`                 | `boolean`                    | Controls animation state         |
| `variants`                | `TextEffectVariant`          | Custom animation variants        |
| `tokenStyles`             | `TokenStyle[]`               | Word styling rules               |
| `className`               | `string`                     | Styling for container            |
| `segmentWrapperClassName` | `string`                     | Styling for each segment wrapper |

#### Animation Presets

The component includes several built-in animation styles.
| Preset | Description |
| -------------- | ----------------------------------- |
| `blur` | Text fades in while removing blur |
| `fade-in-blur` | Text slides upward while unblurring |
| `scale` | Text scales from 0 to full size |
| `fade` | Simple opacity animation |
| `slide` | Vertical slide reveal |
| `default` | Clip-path text reveal |

#### Token Styling

Specific words can receive custom styles using tokenStyles.

```tsx
<TextEffect
  tokenStyles={[
    { match: "motion", className: "text-accent" },
    { match: "interfaces", style: { fontWeight: 700 } },
  ]}
>
  Designing expressive interfaces through motion
</TextEffect>
```

The component detects matching words and applies styles automatically.

#### Staggered Animation

Segment animations are staggered automatically based on the selected segmentation level.

Default stagger timings:
| Mode | Stagger |
| ------ | ------- |
| `char` | 0.03s |
| `word` | 0.05s |
| `line` | 0.1s |

### TextRoll

`TextRoll` is an animated typography component that creates a rolling text transition where characters slide upward like a mechanical ticker or slot machine.

Each character animates independently with a staggered delay, producing a smooth rolling effect commonly used in interactive UI elements such as buttons, links, and navigation labels.

#### Features

- Character-by-character rolling animation
- Staggered motion timing
- Hover-triggered animation
- Controlled hover mode support
- Reusable typography interaction component
- Motion-powered animation controls

#### Example

```tsx
<TextRoll>View Project</TextRoll>
```

#### Props

| Prop        | Type      | Description            |
| ----------- | --------- | ---------------------- |
| `children`  | `string`  | Text to animate        |
| `hovered`   | `boolean` | Controlled hover state |
| `className` | `string`  | Additional styling     |

The component also supports Motion span props via: `HTMLMotionProps<"span">`
