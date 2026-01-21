/**
 * 算法复习宝典 - 主页面
 * 设计风格：现代卡片流 - 毛玻璃效果 + 用户提供的背景图片
 */

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/Sidebar";
import ContentDisplay from "@/components/ContentDisplay";
import { algorithmData, getCategoryById } from "@/data/algorithmData";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState(algorithmData[0].id);
  const [activeSection, setActiveSection] = useState(algorithmData[0].sections[0].id);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentCategory = getCategoryById(activeCategory);
  const currentSection = currentCategory?.sections.find(s => s.id === activeSection);

  // 计算当前索引和总数
  const allSections = algorithmData.flatMap(cat =>
    cat.sections.map(sec => ({ categoryId: cat.id, sectionId: sec.id }))
  );
  const currentIndex = allSections.findIndex(
    s => s.categoryId === activeCategory && s.sectionId === activeSection
  );
  const totalSections = allSections.length;

  // 导航到上一节
  const goToPrevSection = useCallback(() => {
    if (currentIndex > 0) {
      const prev = allSections[currentIndex - 1];
      setActiveCategory(prev.categoryId);
      setActiveSection(prev.sectionId);
    }
  }, [currentIndex, allSections]);

  // 导航到下一节
  const goToNextSection = useCallback(() => {
    if (currentIndex < totalSections - 1) {
      const next = allSections[currentIndex + 1];
      setActiveCategory(next.categoryId);
      setActiveSection(next.sectionId);
    }
  }, [currentIndex, totalSections, allSections]);

  // 键盘导航
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goToPrevSection();
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        goToNextSection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevSection, goToNextSection]);

  // 滚动到顶部
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeSection]);

  const handleSelectSection = (categoryId: string, sectionId: string) => {
    setActiveCategory(categoryId);
    setActiveSection(sectionId);
  };

  if (!currentCategory || !currentSection) {
    return <div>加载中...</div>;
  }

  return (
    <div className="min-h-screen relative">
      {/* 背景图片层 */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/images/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      
      {/* 毛玻璃遮罩层 */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-white/85 via-white/80 to-indigo-50/85 backdrop-blur-sm" />

      {/* 装饰性渐变 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-200/30 to-transparent rounded-full blur-3xl" />
      </div>

      {/* 主布局 */}
      <div className="relative z-10 flex min-h-screen">
        {/* 侧边栏 */}
        <Sidebar
          activeCategory={activeCategory}
          activeSection={activeSection}
          onSelectSection={handleSelectSection}
          isMobileOpen={isMobileMenuOpen}
          onMobileToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* 主内容区 */}
        <main className="flex-1 lg:ml-0 min-h-screen">
          <div className="p-4 md:p-8 lg:p-12 pt-16 lg:pt-8">
            <ContentDisplay
              category={currentCategory}
              section={currentSection}
              onPrevSection={goToPrevSection}
              onNextSection={goToNextSection}
              hasPrev={currentIndex > 0}
              hasNext={currentIndex < totalSections - 1}
              currentIndex={currentIndex}
              totalSections={totalSections}
            />

            {/* 页脚提示 */}
            <footer className="mt-12 text-center text-sm text-muted-foreground">
              <p>使用 ← → 方向键快速切换章节</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
