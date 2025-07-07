import React from 'react';

interface CompletedIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
}

const CompletedIcon: React.FC<CompletedIconProps> = ({
  size = 24,
  color = '#333333',
  ...props
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx={12} cy={12} r={10} />
    <polyline points="8 12 11 15 16 10" />
  </svg>
);

export default CompletedIcon;
