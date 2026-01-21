import { useMemo } from "react";
import "katex/dist/katex.min.css";
import katex from "katex";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const renderedContent = useMemo(() => {
    return parseMarkdown(content);
  }, [content]);

  return (
    <div 
      className={`markdown-content ${className}`}
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  );
}

function parseMarkdown(text: string): string {
  // 保存代码块，避免被其他规则处理
  const codeBlocks: string[] = [];
  let result = text;

  // 处理代码块 ```code```
  result = result.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    const index = codeBlocks.length;
    const escapedCode = escapeHtml(code.trim());
    const langClass = lang ? `language-${lang}` : "";
    codeBlocks.push(`<pre class="code-block ${langClass}"><code>${escapedCode}</code></pre>`);
    return `__CODE_BLOCK_${index}__`;
  });

  // 处理行内代码 `code`
  result = result.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

  // 处理 LaTeX 块级公式 $$...$$
  result = result.replace(/\$\$([\s\S]*?)\$\$/g, (_, formula) => {
    try {
      const rendered = katex.renderToString(formula.trim(), {
        displayMode: true,
        throwOnError: false,
        trust: true,
      });
      return `<div class="latex-block">${rendered}</div>`;
    } catch (e) {
      return `<div class="latex-error">${escapeHtml(formula)}</div>`;
    }
  });

  // 处理 LaTeX 行内公式 $...$
  result = result.replace(/\$([^$\n]+)\$/g, (_, formula) => {
    try {
      const rendered = katex.renderToString(formula.trim(), {
        displayMode: false,
        throwOnError: false,
        trust: true,
      });
      return `<span class="latex-inline">${rendered}</span>`;
    } catch (e) {
      return `<span class="latex-error">${escapeHtml(formula)}</span>`;
    }
  });

  // 处理标题
  result = result.replace(/^### (.*$)/gm, '<h3 class="content-h3">$1</h3>');
  result = result.replace(/^#### (.*$)/gm, '<h4 class="content-h4">$1</h4>');

  // 处理粗体 **text**
  result = result.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');

  // 处理斜体 *text*
  result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // 处理引用 > text
  result = result.replace(/^> (.*$)/gm, '<blockquote class="content-blockquote">$1</blockquote>');

  // 合并连续的引用块
  result = result.replace(/<\/blockquote>\n<blockquote class="content-blockquote">/g, '<br/>');

  // 处理无序列表
  result = result.replace(/^- (.*$)/gm, '<li class="content-li">$1</li>');
  result = result.replace(/(<li class="content-li">.*<\/li>\n?)+/g, (match) => {
    return `<ul class="content-ul">${match}</ul>`;
  });

  // 处理有序列表
  result = result.replace(/^\d+\. (.*$)/gm, '<li class="content-oli">$1</li>');
  result = result.replace(/(<li class="content-oli">.*<\/li>\n?)+/g, (match) => {
    return `<ol class="content-ol">${match}</ol>`;
  });

  // 处理表格
  result = processTable(result);

  // 处理水平线
  result = result.replace(/^---+$/gm, '<hr class="content-hr" />');

  // 处理段落（连续的非空行）
  result = result.replace(/^(?!<[a-z]|__CODE_BLOCK)(.+)$/gm, '<p class="content-p">$1</p>');

  // 移除多余的空行
  result = result.replace(/\n{3,}/g, '\n\n');

  // 恢复代码块
  codeBlocks.forEach((block, index) => {
    result = result.replace(`__CODE_BLOCK_${index}__`, block);
  });

  return result;
}

function processTable(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let inTable = false;
  let tableRows: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 检测表格行（包含 | 的行）
    if (line.includes('|') && line.trim().startsWith('|')) {
      if (!inTable) {
        inTable = true;
        tableRows = [];
      }
      
      // 跳过分隔行 |---|---|
      if (/^\|[\s-:|]+\|$/.test(line.trim())) {
        continue;
      }
      
      tableRows.push(line);
    } else {
      if (inTable && tableRows.length > 0) {
        result.push(renderTable(tableRows));
        tableRows = [];
        inTable = false;
      }
      result.push(line);
    }
  }

  // 处理最后一个表格
  if (inTable && tableRows.length > 0) {
    result.push(renderTable(tableRows));
  }

  return result.join('\n');
}

function renderTable(rows: string[]): string {
  if (rows.length === 0) return '';

  let html = '<div class="table-wrapper"><table class="content-table">';
  
  rows.forEach((row, index) => {
    const cells = row.split('|').filter(cell => cell.trim() !== '');
    const tag = index === 0 ? 'th' : 'td';
    const rowClass = index === 0 ? 'table-header' : 'table-row';
    
    html += `<tr class="${rowClass}">`;
    cells.forEach(cell => {
      html += `<${tag} class="table-cell">${cell.trim()}</${tag}>`;
    });
    html += '</tr>';
  });

  html += '</table></div>';
  return html;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
