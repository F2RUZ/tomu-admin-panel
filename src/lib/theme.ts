import { extendTheme } from "@mui/joy/styles";

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          solidBg: "#0284c7",
          solidHoverBg: "#0369a1",
          solidActiveBg: "#075985",
          outlinedColor: "#0284c7",
          outlinedBorder: "#bae6fd",
          outlinedHoverBg: "#f0f9ff",
          softBg: "#e0f2fe",
          softColor: "#0369a1",
        },
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
        success: {
          500: "#22c55e",
          600: "#16a34a",
          solidBg: "#16a34a",
          solidHoverBg: "#15803d",
          softBg: "#dcfce7",
          softColor: "#15803d",
        },
        warning: {
          500: "#f59e0b",
          600: "#d97706",
          solidBg: "#d97706",
          softBg: "#fef3c7",
          softColor: "#b45309",
        },
        danger: {
          500: "#ef4444",
          600: "#dc2626",
          solidBg: "#dc2626",
          softBg: "#fee2e2",
          softColor: "#b91c1c",
        },
        background: {
          body: "#f1f5f9",
          surface: "#ffffff",
          level1: "#f8fafc",
          level2: "#f1f5f9",
          level3: "#e2e8f0",
          popup: "#ffffff",
        },
        text: {
          primary: "#0f172a",
          secondary: "#475569",
          tertiary: "#94a3b8",
          icon: "#64748b",
        },
        divider: "rgba(15,23,42,0.08)",
      },
    },
    dark: {
      palette: {
        primary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
          solidBg: "#9333ea",
          solidHoverBg: "#7e22ce",
          solidActiveBg: "#6b21a8",
          outlinedColor: "#c084fc",
          outlinedBorder: "rgba(168,85,247,0.3)",
          outlinedHoverBg: "rgba(168,85,247,0.08)",
          softBg: "rgba(168,85,247,0.12)",
          softColor: "#d8b4fe",
        },
        neutral: {
          50: "#18181b",
          100: "#1c1c21",
          200: "#26262d",
          300: "#3a3a44",
          400: "#52525e",
          500: "#71717d",
          600: "#a1a1aa",
          700: "#d4d4d8",
          800: "#e4e4e7",
          900: "#fafafa",
        },
        success: {
          500: "#4ade80",
          solidBg: "#16a34a",
          softBg: "rgba(74,222,128,0.1)",
          softColor: "#4ade80",
        },
        warning: {
          500: "#fbbf24",
          solidBg: "#d97706",
          softBg: "rgba(251,191,36,0.1)",
          softColor: "#fbbf24",
        },
        danger: {
          500: "#f87171",
          solidBg: "#dc2626",
          softBg: "rgba(248,113,113,0.1)",
          softColor: "#f87171",
        },
        background: {
          body: "#0e0e12",
          surface: "#18181b",
          level1: "#1c1c21",
          level2: "#26262d",
          level3: "#3a3a44",
          popup: "#1c1c21",
        },
        text: {
          primary: "#fafafa",
          secondary: "#a1a1aa",
          tertiary: "#71717d",
          icon: "#71717d",
        },
        divider: "rgba(255,255,255,0.07)",
      },
    },
  },

  fontFamily: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    display:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    code: "'JetBrains Mono', 'Fira Code', monospace",
  },

  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    xl2: "1.5rem",
    xl3: "1.875rem",
    xl4: "2.25rem",
  },

  radius: {
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "24px",
  },

  components: {
    JoyButton: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          fontWeight: 600,
          letterSpacing: "-0.01em",
          transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          ...(ownerState.size === "sm" && { borderRadius: "8px" }),
          ...(ownerState.size === "md" && { borderRadius: "10px" }),
          ...(ownerState.size === "lg" && { borderRadius: "12px" }),
        }),
      },
    },
    JoyCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
        },
      },
    },
    JoyInput: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          transition: "all 0.2s ease",
        },
      },
    },
    JoyChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "0.75rem",
        },
      },
    },
  },
});

export default theme;
