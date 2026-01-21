/**
 * 内容展示组件
 * 设计风格：现代卡片流 - 毛玻璃卡片展示算法知识点
 */

import { cn } from "@/lib/utils";
import { type Category, type Section } from "@/data/algorithmData";
import { Streamdown } from "streamdown";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Hash, Lightbulb, Code2 } from "lucide-react";

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
      className="max-w-4xl mx-auto"
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
      <div className="glass-card rounded-2xl p-6 md:p-8 shadow-xl">
        {/* 标题区域 */}
        <header className="mb-8 pb-6 border-b border-border/50">
          <h1
            className="text-2xl md:text-3xl font-bold text-foreground leading-tight"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            {section.title}
          </h1>
        </header>

        {/* 内容区域 */}
        <article className="prose prose-slate max-w-none">
          <div className="algorithm-content">
            <Streamdown
              components={{
                // 自定义代码块渲染
                pre: ({ children, ...props }) => (
                  <div className="relative group my-6">
                    <div className="absolute -top-3 left-4 px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300 flex items-center gap-1">
                      <Code2 size={12} />
                      <span>代码</span>
                    </div>
                    <pre
                      className="code-block !mt-0 !rounded-xl overflow-x-auto"
                      {...props}
                    >
                      {children}
                    </pre>
                  </div>
                ),
                // 自定义引用块渲染
                blockquote: ({ children, ...props }) => (
                  <div className="my-6 flex gap-3">
                    <div className="flex-shrink-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500 rounded-full" />
                    <blockquote
                      className="flex-1 pl-4 py-2 bg-amber-50/80 rounded-r-xl border-0 text-slate-700 italic"
                      {...props}
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <div>{children}</div>
                      </div>
                    </blockquote>
                  </div>
                ),
                // 自定义表格渲染
                table: ({ children, ...props }) => (
                  <div className="my-6 overflow-x-auto rounded-xl border border-border/50">
                    <table className="w-full" {...props}>
                      {children}
                    </table>
                  </div>
                ),
                th: ({ children, ...props }) => (
                  <th
                    className="px-4 py-3 bg-slate-100 text-left font-semibold text-slate-700 border-b border-border/50"
                    {...props}
                  >
                    {children}
                  </th>
                ),
                td: ({ children, ...props }) => (
                  <td
                    className="px-4 py-3 border-b border-border/30 text-slate-600"
                    {...props}
                  >
                    {children}
                  </td>
                ),
                // 自定义标题渲染
                h3: ({ children, ...props }) => (
                  <h3
                    className="text-xl font-bold text-slate-800 mt-8 mb-4 flex items-center gap-2"
                    style={{ fontFamily: "'Noto Serif SC', serif" }}
                    {...props}
                  >
                    <span className="w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
                    {children}
                  </h3>
                ),
                h4: ({ children, ...props }) => (
                  <h4
                    className="text-lg font-semibold text-slate-700 mt-6 mb-3"
                    {...props}
                  >
                    {children}
                  </h4>
                ),
                // 自定义列表渲染
                ul: ({ children, ...props }) => (
                  <ul className="my-4 space-y-2 list-none" {...props}>
                    {children}
                  </ul>
                ),
                li: ({ children, ...props }) => (
                  <li className="flex items-start gap-2 text-slate-600" {...props}>
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2.5 flex-shrink-0" />
                    <span>{children}</span>
                  </li>
                ),
                // 自定义段落
                p: ({ children, ...props }) => (
                  <p className="my-4 text-slate-600 leading-relaxed" {...props}>
                    {children}
                  </p>
                ),
                // 自定义行内代码
                code: ({ children, className, ...props }) => {
                  // 如果是代码块内的code，不添加额外样式
                  if (className?.includes('language-')) {
                    return <code className={className} {...props}>{children}</code>;
                  }
                  return (
                    <code
                      className="px-1.5 py-0.5 bg-slate-100 text-indigo-600 rounded text-sm font-mono"
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                // 自定义强调
                strong: ({ children, ...props }) => (
                  <strong className="font-bold text-slate-800" {...props}>
                    {children}
                  </strong>
                ),
                // 自定义分隔线
                hr: (props) => (
                  <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" {...props} />
                ),
              }}
            >
              {section.content}
            </Streamdown>
          </div>
        </article>
      </div>

      {/* 导航按钮 */}
      <div className="flex justify-between items-center mt-8 gap-4">
        <button
          onClick={onPrevSection}
          disabled={!hasPrev}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200",
            "glass-card hover:shadow-lg",
            hasPrev
              ? "text-foreground hover:translate-x-[-4px]"
              : "opacity-50 cursor-not-allowed"
          )}
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">上一节</span>
        </button>

        <div className="flex-1 flex justify-center">
          <div className="flex gap-1.5">
            {Array.from({ length: Math.min(totalSections, 10) }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i === currentIndex
                    ? "bg-primary w-6"
                    : "bg-muted-foreground/30"
                )}
              />
            ))}
            {totalSections > 10 && (
              <span className="text-xs text-muted-foreground ml-1">...</span>
            )}
          </div>
        </div>

        <button
          onClick={onNextSection}
          disabled={!hasNext}
          className={cn(
            "flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200",
            "glass-card hover:shadow-lg",
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
