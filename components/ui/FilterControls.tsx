"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterControlsProps {
  currentFilter: string;
  currentSort: string;
}

const FilterControls = ({
  currentFilter,
  currentSort,
}: FilterControlsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateURL = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    params.delete("page"); // Reset to page 1 when filtering/sorting
    router.push(`/interview?${params.toString()}`);
  };

  const filterOptions = [
    { value: "all", label: "全ての面接" },
    { value: "consulting", label: "コンサル" },
    { value: "finance", label: "金融" },
    { value: "manufacturing", label: "メーカー" },
    { value: "trading", label: "商社" },
    { value: "it", label: "IT・通信" },
    { value: "advertising", label: "広告・マスコミ" },
    { value: "hr", label: "人材" },
    { value: "infrastructure", label: "インフラ" },
    { value: "real_estate", label: "不動産・建設" },
  ];

  const sortOptions = [
    { value: "newest", label: "新しい順" },
    { value: "oldest", label: "古い順" },
    { value: "popularity", label: "人気順" },
  ];

  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      {/* Clear filters button - left side */}
      <div>
        {(currentFilter !== "all" || currentSort !== "newest") && (
          <Link
            href="/interview"
            className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#163300] transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            フィルターをクリア
          </Link>
        )}
      </div>

      {/* Filter and Sort Controls - right side */}
      <div className="flex flex-col -mt-4 mb-3 sm:flex-row gap-3 items-start sm:items-center">
        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#163300] whitespace-nowrap">
            フィルター
          </span>
          <Select
            value={currentFilter}
            onValueChange={(value) => updateURL("filter", value)}
          >
            <SelectTrigger className="w-[140px] border-gray-300 focus:border-[#9fe870] focus:ring-[#9fe870]/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {filterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#163300] whitespace-nowrap">
            並び順
          </span>
          <Select
            value={currentSort}
            onValueChange={(value) => updateURL("sort", value)}
          >
            <SelectTrigger className="w-[120px] border-gray-300 focus:border-[#9fe870] focus:ring-[#9fe870]/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;
