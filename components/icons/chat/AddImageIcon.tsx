import React from 'react';

interface AddImageIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  imageColor?: string;
  plusColor?: string;
}

const AddImageIcon: React.FC<AddImageIconProps> = ({
  size = 24,
  imageColor = '#6c757d', // 기본 풍경 색
  // plusColor = '#333333', // + 기호 색
  ...props
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
    {/* 프레임 (사진틀) */}
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="2"
      ry="2"
      stroke={imageColor}
      strokeWidth="2"
    />
    {/* 태양 or 원 */}
    <circle cx="8.5" cy="8.5" r="1.5" fill={imageColor} />
    {/* 산 라인 */}
    <polyline
      points="21 15 16 10 5 21"
      stroke={imageColor}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* + 기호 위에 오버레이 */}
    {/* <line
      x1="12"
      y1="7"
      x2="12"
      y2="17"
      stroke={plusColor}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="7"
      y1="12"
      x2="17"
      y2="12"
      stroke={plusColor}
      strokeWidth="2"
      strokeLinecap="round"
    /> */}
  </svg>
);

export default AddImageIcon;
