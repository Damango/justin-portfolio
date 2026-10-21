import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 18, children, strokeWidth = 1.8, ...rest }: P) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const HomeIcon = (p: P) => (
  <Svg {...p}>
    <path d="M3 10.5 12 3l9 7.5" />
    <path d="M5.5 9v11.5h13V9" />
  </Svg>
);
export const GridIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.6" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.6" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.6" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.6" />
  </Svg>
);
export const BriefcaseIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2.2" />
    <path d="M8.5 7V5.2A1.7 1.7 0 0 1 10.2 3.5h3.6a1.7 1.7 0 0 1 1.7 1.7V7" />
    <path d="M3 12.5h18" />
  </Svg>
);
export const PenIcon = (p: P) => (
  <Svg {...p}>
    <path d="M12 20h8.5" />
    <path d="M16.4 3.6a2.1 2.1 0 0 1 3 3L7.2 18.8 3.5 19.8l1-3.7Z" />
  </Svg>
);
export const MailIcon = (p: P) => (
  <Svg {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2.2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </Svg>
);
export const CheckCircle = (p: P) => (
  <Svg strokeWidth={2.1} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.2 2.4 2.4 4.8-5" />
  </Svg>
);
export const Check = (p: P) => (
  <Svg strokeWidth={2.2} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);
export const Spinner = (p: P) => (
  <Svg strokeWidth={2.2} {...p}>
    <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
  </Svg>
);
export const Bell = (p: P) => (
  <Svg strokeWidth={2} {...p}>
    <path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15Z" />
    <path d="M10 21h4" />
  </Svg>
);
export const Archive = (p: P) => (
  <Svg strokeWidth={2} {...p}>
    <rect x="3.5" y="4" width="17" height="5" rx="1.2" />
    <path d="M5 9v9.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V9" />
    <path d="M10 13h4" />
  </Svg>
);
export const Book = (p: P) => (
  <Svg strokeWidth={2} {...p}>
    <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5Z" />
    <path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5Z" />
  </Svg>
);
export const Pin = (p: P) => (
  <Svg strokeWidth={2} {...p}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </Svg>
);
export const Clock = (p: P) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7.5V12l3 2" />
  </Svg>
);
export const Code = (p: P) => (
  <Svg strokeWidth={1.9} {...p}>
    <path d="m8 8-4 4 4 4" />
    <path d="m16 8 4 4-4 4" />
  </Svg>
);
export const ArrowRight = (p: P) => (
  <Svg strokeWidth={2.1} {...p}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Svg>
);
export const ArrowUpRight = (p: P) => (
  <Svg strokeWidth={2} {...p}>
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </Svg>
);
export const Download = (p: P) => (
  <Svg strokeWidth={1.9} {...p}>
    <path d="M12 4v11" />
    <path d="m7 10.5 5 5 5-5" />
    <path d="M5 20h14" />
  </Svg>
);
export const Share = (p: P) => (
  <Svg strokeWidth={1.9} {...p}>
    <path d="M12.5 4.5H7a2.5 2.5 0 0 0-2.5 2.5v10A2.5 2.5 0 0 0 7 19.5h10a2.5 2.5 0 0 0 2.5-2.5v-5.5" />
    <circle cx="18" cy="6" r="2.3" />
  </Svg>
);
export const Flag = (p: P) => (
  <Svg strokeWidth={1.9} {...p}>
    <path d="M5 21V4" />
    <path d="M5 4.5h11.5l-2 4 2 4H5" />
  </Svg>
);
export const Search = (p: P) => (
  <Svg strokeWidth={2} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m20 20-4.2-4.2" />
  </Svg>
);
export const Copy = (p: P) => (
  <Svg strokeWidth={1.9} {...p}>
    <rect x="8.5" y="8.5" width="11" height="11" rx="2" />
    <path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" />
  </Svg>
);
export const Pointer = (p: P) => (
  <Svg strokeWidth={1.9} {...p}>
    <path d="M5 3.5 18.5 10l-6 1.6-2.4 6.2Z" />
  </Svg>
);
export const Menu = (p: P) => (
  <Svg strokeWidth={2} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);
export const Close = (p: P) => (
  <Svg strokeWidth={2} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Svg>
);
