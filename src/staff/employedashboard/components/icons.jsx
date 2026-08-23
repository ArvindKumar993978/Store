import React from "react";

/**
 * Local icon set — replaces the lucide-react dependency.
 * Every icon is a plain inline SVG so it can be sized/colored purely
 * with Tailwind utility classes (className="w-5 h-5 text-primary" etc.)
 * or with the legacy `size` prop for drop-in compatibility.
 */
function Icon({ size = 24, className = "", strokeWidth = 2, children, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const LayoutDashboard = (props) => (
  <Icon {...props}>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </Icon>
);

export const Wallet = (props) => (
  <Icon {...props}>
    <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    <path d="M16 12h3" />
    <path d="M3 9h18" />
  </Icon>
);

export const CalendarX = (props) => (
  <Icon {...props}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M3 9h18" />
    <path d="M8 2v4M16 2v4" />
    <path d="m9.5 13.5 5 5M14.5 13.5l-5 5" />
  </Icon>
);

export const Settings = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1.08-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1.08 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
  </Icon>
);

export const Clock = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

export const Headset = (props) => (
  <Icon {...props}>
    <path d="M4 13v-1a8 8 0 0 1 16 0v1" />
    <rect x="2.5" y="13" width="5" height="7" rx="1.5" />
    <rect x="16.5" y="13" width="5" height="7" rx="1.5" />
    <path d="M19.5 20a4 4 0 0 1-4 3h-2" />
  </Icon>
);

export const LogOut = (props) => (
  <Icon {...props}>
    <path d="M9 21H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3" />
    <path d="m15 16 4-4-4-4" />
    <path d="M19 12H9" />
  </Icon>
);

export const Bell = (props) => (
  <Icon {...props}>
    <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
    <path d="M9.5 20a2.5 2.5 0 0 0 5 0" />
  </Icon>
);

export const Menu = (props) => (
  <Icon {...props}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </Icon>
);

export const HelpCircle = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.33c-.86.34-1.4 1.1-1.4 1.92V14" />
    <path d="M12 17.5h.01" />
  </Icon>
);

export const Download = (props) => (
  <Icon {...props}>
    <path d="M12 3v13" />
    <path d="m7 11 5 5 5-5" />
    <path d="M4 20h16" />
  </Icon>
);

export const Plus = (props) => (
  <Icon {...props}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);

export const CalendarDays = (props) => (
  <Icon {...props}>
    <rect x="3" y="4" width="18" height="17" rx="2" />
    <path d="M3 9h18" />
    <path d="M8 2v4M16 2v4" />
    <path d="M7.5 13h1M11.5 13h1M15.5 13h1M7.5 17h1M11.5 17h1" />
  </Icon>
);

export const PlaneTakeoff = (props) => (
  <Icon {...props}>
    <path d="M3 20h18" />
    <path d="M6 14l5.5-2 7-6.5a1.4 1.4 0 0 1 2 2L14 14l-2 6-2-1-.5-4.5-4.5-.5-1-2Z" />
  </Icon>
);

export const CalendarClock = (props) => (
  <Icon {...props}>
    <path d="M9 3v4M15 3v4" />
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h9" />
    <circle cx="16.5" cy="16.5" r="4.5" />
    <path d="M16.5 14.5v2l1.3.8" />
  </Icon>
);

export const Receipt = (props) => (
  <Icon {...props}>
    <path d="M5 3v18l2-1.3L9 21l2-1.3L13 21l2-1.3L17 21l2-1.3L21 21V3l-2 1.3L17 3l-2 1.3L13 3l-2 1.3L9 3 7 4.3 5 3Z" />
    <path d="M8 9h8M8 13h8M8 17h4" />
  </Icon>
);

export const CheckCircle2 = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.3 2.3L16 10" />
  </Icon>
);

export const Coffee = (props) => (
  <Icon {...props}>
    <path d="M4 9h13v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9Z" />
    <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" />
    <path d="M7 3c0 1-1 1-1 2s1 1 1 2M11 3c0 1-1 1-1 2s1 1 1 2" />
  </Icon>
);

export const Stethoscope = (props) => (
  <Icon {...props}>
    <path d="M5 4v6a5 5 0 0 0 10 0V4" />
    <path d="M8 4H6M12 4h-2" />
    <path d="M15 10v2a6 6 0 0 0 12 0v-1" />
    <circle cx="20" cy="7" r="2" />
  </Icon>
);

export const Umbrella = (props) => (
  <Icon {...props}>
    <path d="M12 3a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9Z" />
    <path d="M12 12v7a2 2 0 0 1-4 0" />
    <path d="M12 3v1" />
  </Icon>
);

export const Eye = (props) => (
  <Icon {...props}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </Icon>
);

export const ChevronLeft = (props) => (
  <Icon {...props}>
    <path d="m15 18-6-6 6-6" />
  </Icon>
);

export const ChevronRight = (props) => (
  <Icon {...props}>
    <path d="m9 18 6-6-6-6" />
  </Icon>
);

export const X = (props) => (
  <Icon {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </Icon>
);

export const User = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
  </Icon>
);

export const Home = (props) => (
  <Icon {...props}>
    <path d="m3 11 9-7 9 7" />
    <path d="M5 10v10h14V10" />
    <path d="M9 20v-6h6v6" />
  </Icon>
);

export const Landmark = (props) => (
  <Icon {...props}>
    <path d="M3 21h18" />
    <path d="M4 21V10M9 21V10M15 21V10M20 21V10" />
    <path d="m2 10 10-6 10 6" />
  </Icon>
);

export const HeartPulse = (props) => (
  <Icon {...props}>
    <path d="M12 20s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 5.5 5.5 5.5 0 0 1 21.5 11c-.5 1.1-1.2 2.1-2 3" />
    <path d="M3 12h4l1.5-3L11 15l1.5-4H21" />
  </Icon>
);

export const Pencil = (props) => (
  <Icon {...props}>
    <path d="M17 3a2.83 2.83 0 0 1 4 4L7 21l-4 1 1-4Z" />
    <path d="m14.5 5.5 4 4" />
  </Icon>
);

export const Camera = (props) => (
  <Icon {...props}>
    <path d="M4 8a2 2 0 0 1 2-2h1.5l1-2h7l1 2H18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8Z" />
    <circle cx="12" cy="13" r="3.5" />
  </Icon>
);

export const Info = (props) => (
  <Icon {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5" />
    <path d="M12 7.5h.01" />
  </Icon>
);

export const Filter = (props) => (
  <Icon {...props}>
    <path d="M4 4h16l-6.5 8v6l-3 2v-8L4 4Z" />
  </Icon>
);

export const ArrowRight = (props) => (
  <Icon {...props}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </Icon>
);

export const Search = (props) => (
  <Icon {...props}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </Icon>
);

export const FileText = (props) => (
  <Icon {...props}>
    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 3v5h5" />
    <path d="M8 13h8M8 17h5" />
  </Icon>
);

export default Icon;
