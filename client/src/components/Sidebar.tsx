/**
 * 侧边栏导航组件
 * 设计风格：现代卡片流 - 毛玻璃效果导航栏
 */

import { cn } from "@/lib/utils";
import { algorithmData, type Category } from "@/data/algorithmData";
import { ChevronDown, ChevronRight, BookOpen, Menu, X, FileText } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  activeCategory: string;
  activeSection: string;
  onSelectSection: (categoryId: string, sectionId: string) => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

export default function Sidebar({
  activeCategory,
  activeSection,
  onSelectSection,
  isMobileOpen,
  onMobileToggle,
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([activeCategory]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSectionClick = (categoryId: string, sectionId: string) => {
    onSelectSection(categoryId, sectionId);
    if (window.innerWidth < 1024) {
      onMobileToggle();
    }
  };

  return (
    <>
      {/* 移动端菜单按钮 */}
      <button
        onClick={onMobileToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass-card"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* 移动端遮罩 */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onMobileToggle}
        />
      )}

      {/* 侧边栏 */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen w-72 z-40",
          "bg-white/80 backdrop-blur-xl border-r border-white/30",
          "transform transition-transform duration-300 ease-in-out",
          "lg:transform-none overflow-hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo区域 */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  算法复习宝典
                </h1>
                <p className="text-xs text-muted-foreground">知识点整理</p>
              </div>
            </div>
          </div>

          {/* 导航列表 */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {algorithmData.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                isExpanded={expandedCategories.includes(category.id)}
                activeSection={activeCategory === category.id ? activeSection : null}
                onToggle={() => toggleCategory(category.id)}
                onSelectSection={(sectionId) => handleSectionClick(category.id, sectionId)}
              />
            ))}
          </nav>

          {/* 底部链接 */}
          <div className="p-4 border-t border-border/50 space-y-2">
            <a
              href="/summary.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 text-sm font-medium text-blue-600 transition-all hover:scale-105 group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-colors shadow-sm">
                <FileText size={16} />
              </div>
              <span>2025 期末总结 PPT</span>
            </a>

            <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border/30">
              共 {algorithmData.reduce((acc, cat) => acc + cat.sections.length, 0)} 个知识点
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

interface CategoryItemProps {
  category: Category;
  isExpanded: boolean;
  activeSection: string | null;
  onToggle: () => void;
  onSelectSection: (sectionId: string) => void;
}

function CategoryItem({
  category,
  isExpanded,
  activeSection,
  onToggle,
  onSelectSection,
}: CategoryItemProps) {
  return (
    <div className="rounded-xl overflow-hidden">
      {/* 分类标题 */}
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
          "hover:bg-accent/50",
          isExpanded && "bg-accent/30"
        )}
      >
        <span
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm shadow-md",
            category.tagClass
          )}
        >
          {category.icon}
        </span>
        <span className="flex-1 text-left font-medium text-foreground">
          {category.title}
        </span>
        <span className="text-muted-foreground">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </span>
      </button>

      {/* 子项列表 */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="pl-4 pr-2 pb-2 space-y-1">
          {category.sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSelectSection(section.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200",
                "hover:bg-accent/50 hover:translate-x-1",
                activeSection === section.id
                  ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                  : "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-2">
                {section.icon && <span>{section.icon}</span>}
                <span>{section.title}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
