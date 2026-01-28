/**
 * 内容展示组件
 * 设计风格：现代卡片流 - 毛玻璃卡片展示算法知识点
 * - 统一手机端页面宽度
 * - 正确渲染Markdown和LaTeX
 * - 重要概念单独强调
 */

import { cn } from "@/lib/utils";
import { type Category, type Section } from "@/data/algorithmData";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Hash, Lightbulb, Code2 } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

interface ContentDisplayProps {
  category: Category;
  section: Section;
  onPrevSection: () => void;
  onNextSection: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  currentIndex: number;
  totalSections: number;
}

export default function ContentDisplay({
  category,
  section,
  onPrevSection,
  onNextSection,
  hasPrev,
  hasNext,
  currentIndex,
  totalSections,
}: ContentDisplayProps) {
  return (
    <motion.div
      key={section.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto px-4 md:px-0"
    >
      {/* 面包屑和标签 */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span
          className={cn(
            "px-3 py-1 rounded-full text-white text-sm font-medium shadow-md",
            category.tagClass
          )}
        >
          {category.icon} {category.title}
        </span>
        <span className="text-muted-foreground text-sm flex items-center gap-1">
          <Hash size={14} />
          {currentIndex + 1} / {totalSections}
        </span>
      </div>

      {/* 主内容卡片 */}
      <div className="glass-card rounded-2xl p-4 sm:p-6 md:p-8 shadow-xl">
        {/* 标题区域 */}
        <header className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border/50">
          <h1
            className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            {section.title}
          </h1>
        </header>

        {/* 内容区域 - 使用自定义Markdown渲染器 */}
        <article className="algorithm-content">
          <MarkdownRenderer content={section.content} />
        </article>
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between items-center mt-6 sm:mt-8 gap-2 sm:gap-4">
        <button
          onClick={onPrevSection}
          disabled={!hasPrev}
          className={cn(
            "flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-xl transition-all duration-200",
            "glass-card hover:shadow-lg text-sm sm:text-base",
            hasPrev
              ? "text-foreground hover:translate-x-[-4px]"
              : "opacity-50 cursor-not-allowed"
          )}
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">上一节</span>
        </button>

        <div className="flex-1 flex justify-center">
          <div className="flex gap-1 sm:gap-1.5">
            {Array.from({ length: Math.min(totalSections, 7) }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full transition-all duration-300",
                  i === currentIndex
                    ? "bg-primary w-4 sm:w-6"
                    : "bg-muted-foreground/30"
                )}
              />
            ))}
            {totalSections > 7 && (
              <span className="text-xs text-muted-foreground ml-1">...</span>
            )}
          </div>
        </div>

        <button
          onClick={onNextSection}
          disabled={!hasNext}
          className={cn(
            "flex items-center gap-1 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-xl transition-all duration-200",
            "glass-card hover:shadow-lg text-sm sm:text-base",
            hasNext
              ? "text-foreground hover:translate-x-[4px]"
              : "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="hidden sm:inline">下一节</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </motion.div>
  );
}
