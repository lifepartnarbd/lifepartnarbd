/**
 * Hero background: golden-hour silhouette of a couple seen from behind.
 * Pure SVG — no faces, no skin, no image file. Hands are implied by the
 * two figures' arms meeting, never detailed.
 */
export default function HeroScene() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="hero-scene absolute right-0 bottom-0 h-[420px] md:h-full w-auto max-w-none pointer-events-none select-none opacity-40 xl:opacity-100"
      viewBox="0 0 900 600"
      preserveAspectRatio="xMaxYMax slice"
    >
      <defs>
        <radialGradient id="hs-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#f59e0b" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="hs-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f766e" stopOpacity="0" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.28" />
        </linearGradient>
        <linearGradient id="hs-fade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="hs-mask">
          <rect width="900" height="600" fill="url(#hs-fade)" />
        </mask>
      </defs>

      <g mask="url(#hs-mask)">
        {/* sky warmth + sun */}
        <rect width="900" height="600" fill="url(#hs-sky)" />
        <circle cx="600" cy="420" r="300" fill="url(#hs-glow)" />
        <circle cx="600" cy="430" r="62" fill="#fde68a" opacity="0.6" />

        {/* birds */}
        <g fill="none" stroke="#fde68a" strokeOpacity="0.55" strokeWidth="2" strokeLinecap="round">
          <path d="M470 150 q9 -9 18 0 q9 -9 18 0" />
          <path d="M540 118 q7 -7 14 0 q7 -7 14 0" />
          <path d="M760 190 q8 -8 16 0 q8 -8 16 0" />
        </g>

        {/* distant mosque skyline */}
        <g fill="#064e46" opacity="0.75">
          <rect x="250" y="440" width="120" height="90" />
          <path d="M262 440 a48 48 0 0 1 96 0 z" />
          <rect x="308" y="376" width="4" height="14" />
          <rect x="228" y="380" width="14" height="150" />
          <path d="M228 380 l7 -26 l7 26 z" />
          <rect x="378" y="400" width="14" height="130" />
          <path d="M378 400 l7 -26 l7 26 z" />
        </g>

        {/* far + near ground */}
        <path d="M0 500 Q200 470 420 500 T900 490 V600 H0 Z" fill="#053b35" opacity="0.9" />
        <path d="M0 535 Q300 505 560 528 T900 520 V600 H0 Z" fill="#032b27" />

        {/* couple — back view silhouette */}
        <g fill="#021f1c">
          {/* man: topi, panjabi */}
          <circle cx="600" cy="336" r="15.5" />
          <path d="M585 331 Q600 313 615 331 Z" />
          <path d="M584 352 Q600 345 616 352 L626 410 L628 458 L616 458 L614 522 L604 522 L601 468 L599 468 L596 522 L586 522 L584 458 L572 458 L574 410 Z" />
          <path d="M584 354 L574 356 L568 420 L575 424 L582 372 Z" />
          <path d="M614 354 L622 358 L640 424 L633 430 L612 372 Z" />
          {/* woman: hijab, abaya */}
          <ellipse cx="668" cy="338" rx="17" ry="19" />
          <path d="M648 342 Q650 318 668 316 Q686 318 688 342 L696 392 Q668 402 640 392 Z" />
          <path d="M646 388 Q668 380 690 388 L706 522 L630 522 Z" />
          {/* hands meeting */}
          <ellipse cx="638" cy="428" rx="8" ry="6.5" />
        </g>
      </g>
    </svg>
  );
}
