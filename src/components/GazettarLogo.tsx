interface LogoProps {
  variant?: "horizontal" | "icon" | "vertical";
  className?: string;
  onDark?: boolean;
}

export default function GazettarLogo({
  variant = "horizontal",
  className = "",
  onDark = false
}: LogoProps) {
  const orangeColor = "#FF5A00";
  const blackColor = "#1F1F1F";
  const whiteColor = "#FFFFFF";

  const iconBgColor = orangeColor;
  const iconGColor = whiteColor;
  const textColor = onDark ? whiteColor : blackColor;

  if (variant === "icon") {
    return (
      <svg
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Orange rounded square background */}
        <rect width="140" height="140" rx="28" fill={iconBgColor} />
        {/* White bold G symbol */}
        <path
          d="M70 30C47.9 30 30 47.9 30 70C30 92.1 47.9 110 70 110C84.4 110 96.8 102.1 103.5 90.5H70V70H110C110 47.9 92.1 30 70 30ZM70 98C54.5 98 42 85.5 42 70C42 54.5 54.5 42 70 42C78.9 42 86.7 45.9 92.2 52L83.5 60.7C79.8 56.5 75.2 54.8 70 54.8C61.5 54.8 54.8 61.5 54.8 70C54.8 78.5 61.5 85.2 70 85.2C76.8 85.2 82.2 80.8 84.2 74.8H70V70H98C97 84.9 85.2 98 70 98Z"
          fill={iconGColor}
        />
      </svg>
    );
  }

  if (variant === "vertical") {
    return (
      <svg
        viewBox="0 0 280 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Orange rounded square background */}
        <rect x="70" y="10" width="140" height="140" rx="28" fill={iconBgColor} />
        {/* White bold G symbol */}
        <path
          d="M140 40C117.9 40 100 57.9 100 80C100 102.1 117.9 120 140 120C154.4 120 166.8 112.1 173.5 100.5H140V80H180C180 57.9 162.1 40 140 40ZM140 108C124.5 108 112 95.5 112 80C112 64.5 124.5 52 140 52C148.9 52 156.7 55.9 162.2 62L153.5 70.7C149.8 66.5 145.2 64.8 140 64.8C131.5 64.8 124.8 71.5 124.8 80C124.8 88.5 131.5 95.2 140 95.2C146.8 95.2 152.2 90.8 154.2 84.8H140V80H168C167 94.9 155.2 108 140 108Z"
          fill={iconGColor}
        />
        {/* Text */}
        <text x="140" y="190" textAnchor="middle" fill={textColor} fontSize="28" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif">
          The
        </text>
        <text x="140" y="230" textAnchor="middle" fill={textColor} fontSize="42" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif">
          Gazettar
        </text>
        <text x="140" y="255" textAnchor="middle" fill={textColor} fontSize="11" fontWeight="400" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1.8">
          THE WORLD. YOUR WORLD.
        </text>
      </svg>
    );
  }

  // Horizontal variant (default) - based on brand guide layout
  return (
    <svg
      viewBox="0 0 420 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Orange rounded square background */}
      <rect x="5" y="5" width="90" height="90" rx="18" fill={iconBgColor} />
      {/* White bold G symbol */}
      <path
        d="M50 25C37.42 25 27.14 35.28 27.14 47.86C27.14 60.44 37.42 70.71 50 70.71C57.78 70.71 64.66 66.87 68.75 60.93H50V47.86H72.86C72.86 35.28 62.58 25 50 25ZM50 65C40.31 65 32.5 57.19 32.5 47.5C32.5 37.81 40.31 30 50 30C55.21 30 59.77 32.14 63 35.53L57.86 40.67C55.71 38.19 52.58 37.14 50 37.14C44.11 37.14 39.29 41.96 39.29 47.86C39.29 53.75 44.11 58.57 50 58.57C54.18 58.57 57.5 55.87 58.75 52.14H50V47.86H67.5C66.96 57.89 58.93 65 50 65Z"
        fill={iconGColor}
      />
      {/* "The" text */}
      <text
        x="115"
        y="42"
        fill={textColor}
        fontSize="22"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        The
      </text>
      {/* "Gazettar" text */}
      <text
        x="115"
        y="70"
        fill={textColor}
        fontSize="34"
        fontWeight="700"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        Gazettar
      </text>
      {/* Tagline */}
      <text
        x="115"
        y="84"
        fill={textColor}
        fontSize="8.5"
        fontWeight="400"
        fontFamily="system-ui, -apple-system, sans-serif"
        letterSpacing="1.2"
      >
        THE WORLD. YOUR WORLD.
      </text>
    </svg>
  );
}
