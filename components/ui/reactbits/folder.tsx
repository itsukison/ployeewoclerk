import React, { useState } from "react";
import Link from "next/link";

interface InterviewData {
  id: string;
  companyName?: string;
  company_name?: string;
  interviewFocus?: string;
  interview_focus?: string;
  created_at: string;
}

interface FolderProps {
  color?: string;
  size?: number;
  items?: React.ReactNode[];
  className?: string;
  interview?: InterviewData;
}

const darkenColor = (hex: string, percent: number): string => {
  let color = hex.startsWith("#") ? hex.slice(1) : hex;
  if (color.length === 3) {
    color = color
      .split("")
      .map((c) => c + c)
      .join("");
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) & 0xff;
  let g = (num >> 8) & 0xff;
  let b = num & 0xff;
  r = Math.max(0, Math.min(255, Math.floor(r * (1 - percent))));
  g = Math.max(0, Math.min(255, Math.floor(g * (1 - percent))));
  b = Math.max(0, Math.min(255, Math.floor(b * (1 - percent))));
  return (
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()
  );
};

// Helper function to translate interview focus to Japanese
const getInterviewFocusLabel = (focus: string) => {
  const focusMap: { [key: string]: string } = {
    consulting: "コンサル",
    finance: "金融",
    manufacturing: "メーカー",
    trading: "商社",
    it: "IT・通信",
    advertising: "広告・マスコミ",
    hr: "人材",
    infrastructure: "インフラ",
    real_estate: "不動産・建設",
    // Legacy mappings for backwards compatibility
    case: "ケース面接",
    technical: "テクニカル面接",
    final: "最終面接",
    general: "一般的な行動面接",
    product: "プロダクト・ケース面接",
    leadership: "リーダーシップ面接",
    custom: "カスタム",
  };
  return focusMap[focus] || focus;
};

const Folder: React.FC<FolderProps> = ({
  color = "#9fe870",
  size = 1,
  items = [],
  className = "",
  interview,
}) => {
  const maxItems = 3;

  // Generate cards based on interview data if provided - reordered: 再挑戦, フィードバック, 詳細
  const defaultCards = interview
    ? [
        // Card 1: Retry Interview (Left)
        <Link
          key="retry"
          href={`/interview/new?company=${encodeURIComponent(
            interview.companyName || interview.company_name || ""
          )}&focus=${
            interview.interviewFocus || interview.interview_focus || ""
          }`}
          className="w-full h-full flex flex-col items-center justify-center p-2 text-center hover:bg-gray-50 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6 text-[#163300] mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          <span className="text-xs text-[#163300] font-medium">再挑戦</span>
        </Link>,
        // Card 2: View Feedback (Middle - now on top)
        <Link
          key="feedback"
          href={`/feedback/${interview.id}`}
          className="w-full h-full flex flex-col items-center justify-center p-2 text-center hover:bg-gray-50 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6 text-[#163300] mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-xs text-[#163300] font-medium">振り返り</span>
        </Link>,
        // Card 3: Interview Details (Right)
        <div
          key="details"
          className="w-full h-full flex flex-col items-center justify-center p-2 text-center"
        >
          <svg
            className="w-6 h-6 text-[#163300] mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs text-[#163300] font-medium">詳細</span>
        </div>,
      ]
    : items;

  const papers: React.ReactNode[] = defaultCards.slice(0, maxItems);
  while (papers.length < maxItems) {
    papers.push(null);
  }

  const [open, setOpen] = useState(false);
  const [paperOffsets, setPaperOffsets] = useState<{ x: number; y: number }[]>(
    Array.from({ length: maxItems }, () => ({ x: 0, y: 0 }))
  );

  const folderBackColor = darkenColor(color, 0.08);
  const paper1 = darkenColor("#ffffff", 0.1);
  const paper2 = darkenColor("#ffffff", 0.05);
  const paper3 = "#ffffff";

  const handleClick = () => {
    setOpen((prev) => !prev);
    if (open) {
      setPaperOffsets(Array.from({ length: maxItems }, () => ({ x: 0, y: 0 })));
    }
  };

  const handlePaperMouseMove = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    if (!open) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (e.clientX - centerX) * 0.15;
    const offsetY = (e.clientY - centerY) * 0.15;
    setPaperOffsets((prev) => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: offsetX, y: offsetY };
      return newOffsets;
    });
  };

  const handlePaperMouseLeave = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number
  ) => {
    setPaperOffsets((prev) => {
      const newOffsets = [...prev];
      newOffsets[index] = { x: 0, y: 0 };
      return newOffsets;
    });
  };

  const folderStyle: React.CSSProperties = {
    "--folder-color": color,
    "--folder-back-color": folderBackColor,
    "--paper-1": paper1,
    "--paper-2": paper2,
    "--paper-3": paper3,
  } as React.CSSProperties;

  const scaleStyle = { transform: `scale(${size})` };

  const getOpenTransform = (index: number) => {
    if (index === 0) return "translate(-120%, -70%) rotate(-15deg)"; // 再挑戦 (Left)
    if (index === 1) return "translate(-50%, -120%) rotate(0deg)"; // フィードバック (Top Middle)
    if (index === 2) return "translate(20%, -70%) rotate(15deg)"; // 詳細 (Right)
    return "";
  };

  const getZIndex = (index: number) => {
    if (index === 1) return 25; // フィードバック (feedback) on top
    return 20;
  };

  return (
    <div style={scaleStyle} className={className}>
      <div
        className={`group relative transition-all duration-200 ease-in cursor-pointer ${
          !open ? "hover:-translate-y-2" : ""
        }`}
        style={{
          ...folderStyle,
          transform: open ? "translateY(-8px)" : undefined,
        }}
        onClick={handleClick}
      >
        <div
          className="relative w-[100px] h-[80px] rounded-tl-0 rounded-tr-[10px] rounded-br-[10px] rounded-bl-[10px]"
          style={{ backgroundColor: folderBackColor }}
        >
          <span
            className="absolute z-0 bottom-[98%] left-0 w-[30px] h-[10px] rounded-tl-[5px] rounded-tr-[5px] rounded-bl-0 rounded-br-0"
            style={{ backgroundColor: folderBackColor }}
          ></span>
          {papers.map((item, i) => {
            let sizeClasses = "";
            if (i === 0)
              sizeClasses = open ? "w-[70%] h-[80%]" : "w-[70%] h-[80%]";
            if (i === 1)
              sizeClasses = open ? "w-[80%] h-[80%]" : "w-[80%] h-[70%]";
            if (i === 2)
              sizeClasses = open ? "w-[90%] h-[80%]" : "w-[90%] h-[60%]";

            const transformStyle = open
              ? `${getOpenTransform(i)} translate(${paperOffsets[i].x}px, ${
                  paperOffsets[i].y
                }px)`
              : undefined;

            return (
              <div
                key={i}
                onMouseMove={(e) => handlePaperMouseMove(e, i)}
                onMouseLeave={(e) => handlePaperMouseLeave(e, i)}
                className={`absolute bottom-[10%] left-1/2 transition-all duration-300 ease-in-out ${
                  !open
                    ? "transform -translate-x-1/2 translate-y-[10%] group-hover:translate-y-0"
                    : "hover:scale-110"
                } ${sizeClasses}`}
                style={{
                  zIndex: getZIndex(i),
                  ...(!open ? {} : { transform: transformStyle }),
                  backgroundColor: i === 0 ? paper1 : i === 1 ? paper2 : paper3,
                  borderRadius: "10px",
                }}
              >
                {item}
              </div>
            );
          })}
          <div
            className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${
              !open ? "group-hover:[transform:skew(15deg)_scaleY(0.6)]" : ""
            }`}
            style={{
              backgroundColor: color,
              borderRadius: "5px 10px 10px 10px",
              ...(open && { transform: "skew(15deg) scaleY(0.6)" }),
            }}
          ></div>
          <div
            className={`absolute z-30 w-full h-full origin-bottom transition-all duration-300 ease-in-out ${
              !open ? "group-hover:[transform:skew(-15deg)_scaleY(0.6)]" : ""
            }`}
            style={{
              backgroundColor: color,
              borderRadius: "5px 10px 10px 10px",
              ...(open && { transform: "skew(-15deg) scaleY(0.6)" }),
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Folder;
