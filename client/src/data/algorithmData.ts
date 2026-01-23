/**
 * 算法复习宝典 - 完整数据文件
 * 包含所有知识点内容，正确处理Markdown和LaTeX符号
 */

import { bilibiliProjectData } from "./bilibiliProjectData";

export interface Section {
    id: string;
    title: string;
    content: string;
}

export interface Category {
    id: string;
    title: string;
    icon: string;
    tagClass: string;
    sections: Section[];
}

export const algorithmData: Category[] = [
    {
        id: "binary-search",
        title: "二分查找",
        icon: "🔍",
        tagClass: "bg-gradient-to-r from-blue-500 to-cyan-500",
        sections: [
            {
                id: "binary-search-basic",
                title: "1. 二分查找基础",
                content: `
### 什么时候用 \`<\` (不带等于)?

你会看到有些高手的代码里确实写的是 \`while (left < right)\`，那是因为他们第一行写的不一样：\`int right = nums.length;\`（注意没有 \`-1\`）

这就变成了 **\`[left, right)\`**（左闭右开区间）。

- \`right\` 变成了"界外"的围栏。
- 这种情况下，当 \`left == right\` 时，说明搜索空间已经空了（因为 \`right\` 本身是不包含的），所以不需要等于号。

### 总结：怎么记最快？

只要你的 \`right\` 赋值是 **\`nums.length - 1\`**（指向最后一个真实的元素）：

> **一定要带 \`=\` 号！** 因为当 \`left\` 撞上 \`right\` 时，那是一个**有效的、待检查的**格子。**不带等于号，就是"死在了黎明前的最后一刻"。**

### 场景模拟：指针的"错身而过"

我们要找一个数 \`target\`，如果找不到，循环结束时，指针一定呈现这个状态：**\`right\` 在左，\`left\` 在右**（交叉了）。

就像两个人相向而行，最后擦肩而过背对背。

- **\`right\` 指针**：最后一定会停在**比 target 小**的那个数上（或者边界 -1）。
- **\`left\` 指针**：最后一定会停在**比 target 大（或等于）**的第一个数上（或者边界 length）。

**结论：** 因为我们要找"插入位置"或者"按顺序排哪里"，通常是把新数字放在"大数"的前面，占据它的位置。所以要返回 **\`left\`**。

### 深度逻辑：\`left\` 的不变性

我们可以给 \`left\` 赋予一个永远成立的**"物理定义"**：

> **\`left\` 的左边（不含 left），永远全是小于 \`target\` 的数。**

\`\`\`java
public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) return mid;
        else if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
\`\`\`
`
            },
            {
                id: "binary-search-2d",
                title: "2. 二维数组",
                content: `
### 二维数组的二分查找

把二维数组看成一维数组进行二分查找。

**核心思想：坐标转换**

- 一维索引 \`mid\` 转二维坐标：\`row = mid / n\`, \`col = mid % n\`
- 其中 \`n\` 是列数

#### 幼儿园数学验证（举例）：
假设矩阵是 **4列宽** (\`n = 4\`)。如果你排在第 **10个** 位置（索引 \`9\`，因为从0开始）：

- \`9 / 4 = 2\` (余1)：说明你坐满了前两排，你肯定在 **第三排**（索引 \`2\`）。
- \`9 % 4 = 1\`：说明你在这一排剩下的那个余数位置，即 **第2个座位**（索引 \`1\`）。

**这就是物理定义的证明：**
- **除法 (/)** 算的是"在第几行"。
- **取余 (%)** 算的是"在这一行的第几个"。

\`\`\`java
public boolean searchMatrix(int[][] matrix, int target) {
    int m = matrix.length, n = matrix[0].length;
    int left = 0, right = m * n - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        int row = mid / n;
        int col = mid % n;
        
        if (matrix[row][col] == target) return true;
        else if (matrix[row][col] < target) left = mid + 1;
        else right = mid - 1;
    }
    return false;
}
\`\`\`
`
            },
            {
                id: "binary-search-boundary",
                title: "3. 找到两个边界",
                content: `
### 第一阶段：变量选角 (The Casting Call) —— 为什么要加个 \`result\`?

你引入了一个新变量：\`int result = -1;\`

**1. \`result\` (记分牌/插主)**

> **幼儿园比喻**：这是一个"暂定的冠军"。

**之前的写法**：一旦找到 \`target\`，我们要么马上返回（普通二分），要么还要在循环结束时去判断 \`left\` 和 \`right\` 到底谁挪到哪里了。这很容易搞混，而且容易出边界错误。

**现在的写法**：每次找到一个符合条件的候选人，就先把它的"身份证号"（索引）记在 \`result\` 里。然后继续找，看看有没有更好的。循环结束后，\`result\` 里存的就是最终答案。这很容易搞混，而且容易出边界错误。

**2. 为什么不直接返回 \`mid\`?**

因为我们找的是**边界**，不是随便哪个 target。

- 找**左边界**：找到一个 target 后，可能它左边还有更多 target，所以要继续往左找。
- 找**右边界**：找到一个 target 后，可能它右边还有更多 target，所以要继续往右找。

\`result\` 就是用来"暂存"当前找到的最佳答案，然后继续缩小范围。

\`\`\`java
// 找左边界
public int findLeft(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    int result = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            result = mid;      // 记录当前位置
            right = mid - 1;   // 继续往左找
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return result;
}

// 找右边界
public int findRight(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    int result = -1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            result = mid;      // 记录当前位置
            left = mid + 1;    // 继续往右找
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return result;
}
\`\`\`
`
            },
            {
                id: "binary-search-rotated",
                title: "4. 旋转数组（有序）",
                content: `
### 旋转数组的二分查找

**核心思想**：旋转后的数组，至少有一半是有序的。

**判断逻辑**：
1. 如果 \`nums[left] <= nums[mid]\`，说明左半部分有序
2. 否则右半部分有序

**在有序的那一半中判断 target 是否在范围内**

\`\`\`java
public int search(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] == target) return mid;
        
        // 左半部分有序
        if (nums[left] <= nums[mid]) {
            // target 在左半部分
            if (nums[left] <= target && target < nums[mid]) {
                right = mid - 1;
            } else {
                left = mid + 1;
            }
        }
        // 右半部分有序
        else {
            // target 在右半部分
            if (nums[mid] < target && target <= nums[right]) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
    }
    return -1;
}
\`\`\`
`
            },
            {
                id: "binary-search-min",
                title: "5. 旋转数组找最小的（大胆）",
                content: `
### 旋转数组找最小值

**核心思想**：最小值一定在"断崖"处。

**判断逻辑**：
- 如果 \`nums[mid] > nums[right]\`，最小值在右半部分
- 否则最小值在左半部分（包括 mid）

\`\`\`java
public int findMin(int[] nums) {
    int left = 0, right = nums.length - 1;
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        if (nums[mid] > nums[right]) {
            // 最小值在右半部分
            left = mid + 1;
        } else {
            // 最小值在左半部分（包括mid）
            right = mid;
        }
    }
    return nums[left];
}
\`\`\`

> **注意**：这里用 \`left < right\` 而不是 \`left <= right\`，因为我们要找的是最小值的位置，不是某个特定值。
`
            },
            {
                id: "binary-search-median",
                title: "6. 两个数组找中位数",
                content: `
### 两个有序数组的中位数

**核心思想**：在较短的数组上二分，找到一个分割点，使得左边所有元素都小于右边。

**时间复杂度**：O(log(min(m, n)))

\`\`\`java
public double findMedianSortedArrays(int[] nums1, int[] nums2) {
    // 确保 nums1 是较短的数组
    if (nums1.length > nums2.length) {
        return findMedianSortedArrays(nums2, nums1);
    }
    
    int m = nums1.length, n = nums2.length;
    int left = 0, right = m;
    
    while (left <= right) {
        int i = left + (right - left) / 2;
        int j = (m + n + 1) / 2 - i;
        
        int maxLeft1 = (i == 0) ? Integer.MIN_VALUE : nums1[i - 1];
        int minRight1 = (i == m) ? Integer.MAX_VALUE : nums1[i];
        int maxLeft2 = (j == 0) ? Integer.MIN_VALUE : nums2[j - 1];
        int minRight2 = (j == n) ? Integer.MAX_VALUE : nums2[j];
        
        if (maxLeft1 <= minRight2 && maxLeft2 <= minRight1) {
            if ((m + n) % 2 == 0) {
                return (Math.max(maxLeft1, maxLeft2) + 
                        Math.min(minRight1, minRight2)) / 2.0;
            } else {
                return Math.max(maxLeft1, maxLeft2);
            }
        } else if (maxLeft1 > minRight2) {
            right = i - 1;
        } else {
            left = i + 1;
        }
    }
    return 0.0;
}
\`\`\`
`
            }
        ]
    },
    {
        id: "backtracking",
        title: "回溯算法",
        icon: "🔄",
        tagClass: "bg-gradient-to-r from-purple-500 to-pink-500",
        sections: [
            {
                id: "backtracking-core",
                title: "回溯核心思想",
                content: `
### 回溯算法的本质

回溯算法本质上是一种**穷举**算法，通过**递归**的方式遍历所有可能的解。

**核心模板**：

\`\`\`java
void backtrack(路径, 选择列表) {
    if (满足结束条件) {
        result.add(路径);
        return;
    }
    
    for (选择 : 选择列表) {
        做选择;
        backtrack(路径, 选择列表);
        撤销选择;
    }
}
\`\`\`

**三个关键点**：
1. **路径**：已经做出的选择
2. **选择列表**：当前可以做的选择
3. **结束条件**：到达决策树底层，无法再做选择

> **回溯的精髓**：在递归之前"做选择"，在递归之后"撤销选择"。
`
            },
            {
                id: "backtracking-permutation",
                title: "1. 全排列",
                content: `
### 全排列问题

给定一个不含重复数字的数组，返回其所有可能的全排列。

**思路**：每次从剩余数字中选一个，直到选完所有数字。

\`\`\`java
List<List<Integer>> result = new ArrayList<>();

public List<List<Integer>> permute(int[] nums) {
    List<Integer> path = new ArrayList<>();
    boolean[] used = new boolean[nums.length];
    backtrack(nums, path, used);
    return result;
}

void backtrack(int[] nums, List<Integer> path, boolean[] used) {
    // 结束条件：路径长度等于数组长度
    if (path.size() == nums.length) {
        result.add(new ArrayList<>(path));
        return;
    }
    
    for (int i = 0; i < nums.length; i++) {
        // 跳过已使用的数字
        if (used[i]) continue;
        
        // 做选择
        path.add(nums[i]);
        used[i] = true;
        
        // 递归
        backtrack(nums, path, used);
        
        // 撤销选择
        path.remove(path.size() - 1);
        used[i] = false;
    }
}
\`\`\`
`
            },
            {
                id: "backtracking-subset",
                title: "2. 子集",
                content: `
### 子集问题

给定一个整数数组，返回所有可能的子集。

**思路**：每个元素都有"选"或"不选"两种状态。

\`\`\`java
List<List<Integer>> result = new ArrayList<>();

public List<List<Integer>> subsets(int[] nums) {
    List<Integer> path = new ArrayList<>();
    backtrack(nums, 0, path);
    return result;
}

void backtrack(int[] nums, int start, List<Integer> path) {
    // 每个节点都是一个子集
    result.add(new ArrayList<>(path));
    
    for (int i = start; i < nums.length; i++) {
        // 做选择
        path.add(nums[i]);
        
        // 递归（注意 i+1，避免重复）
        backtrack(nums, i + 1, path);
        
        // 撤销选择
        path.remove(path.size() - 1);
    }
}
\`\`\`

> **关键点**：用 \`start\` 参数控制遍历起点，避免产生重复子集。
`
            },
            {
                id: "backtracking-phone",
                title: "3. 电话字符",
                content: `
### 电话号码的字母组合

**必须要有个"手指头" (Index)**：我们需要知道现在在处理到 "23" 里的哪一位了。是刚开始按 '2'，还是已经按完了 '3'？所以需要一个 \`int index\`。

**必须要有个"草稿本" (Path)**：我们在拼凑 "ad" 的过程中，得先写下 'a'，然后再写 'd'，发现不对了，还得能擦掉 'd' 换成 'e'。普通的 String 修改太慢（每次都造新房子），所以我们需要一个能随时涂改的 \`StringBuilder path\`。

**必须要有个"成品箱" (Result)**：每次草稿本上凑齐了长度（比如凑齐了两位），就得把这个结果剪下来，扔进一个大箱子里存好。这就是 \`List<String> result\`。

\`\`\`java
// StringBuilder path（神奇画板）
StringBuilder path = new StringBuilder();
\`\`\`

> **幼儿园比喻**：这是一个"磁力画板"（写了能擦的那种）。

**为什么要用 StringBuilder 而不是 String?**

- **String（普通纸）**：在 Java 里，String 是"一次性"的。如果你用 String，每次你想把 'a' 变成 'ad'，计算机就要把 'a' 抄一遍，再拿张新纸写 'ad'。如果回溯要撤销，又得再抄再写。太浪费纸（内存）了！
- **StringBuilder（磁力板）**：它是可变的。你想加一个字母 \`append\`，就在后面画一笔；想擦掉最后一个 \`deleteCharAt\`，又得找张新纸写 'ad'。如果回溯要撤销，又得再抄再写。太浪费纸（内存）了！

\`\`\`java
String[] tel = new String[] {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
\`\`\`

> **幼儿园比喻**：这是特工的"密码翻译表"。看到数字 2，就要翻译成 "abc"。

**为什么要设计成 Array?**

- 因为电话按键是连续的数字（0-9），用数组下标（Index）直接查表是速度最快的方式（O(1)），比用 HashMap 省内存且快。

**你的问题**：Java 中数组初始化语法很严格。

- ❌ 错：\`new String{"...", "..."}\`
- ✅ 对：\`new String[]{"...", "..."}\` 或者直接 \`{"...", "..."}\`（如果在声明时直接赋值）

\`\`\`java
List<String> result = new ArrayList<>();
String[] tel = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};

public List<String> letterCombinations(String digits) {
    if (digits == null || digits.length() == 0) return result;
    backtrack(digits, 0, new StringBuilder());
    return result;
}

void backtrack(String digits, int index, StringBuilder path) {
    if (index == digits.length()) {
        result.add(path.toString());
        return;
    }
    
    String letters = tel[digits.charAt(index) - '0'];
    for (char c : letters.toCharArray()) {
        path.append(c);
        backtrack(digits, index + 1, path);
        path.deleteCharAt(path.length() - 1);
    }
}
\`\`\`
`
            },
            {
                id: "backtracking-combination-sum",
                title: "4. 组合总和问题",
                content: `
### 组合总和

用个排序然后就是target是这里需要注意的一直是剩的目标大小。

\`\`\`java
List<List<Integer>> result = new ArrayList<>();

public List<List<Integer>> combinationSum(int[] candidates, int target) {
    Arrays.sort(candidates);  // 排序便于剪枝
    backtrack(candidates, target, 0, new ArrayList<>());
    return result;
}

void backtrack(int[] candidates, int target, int start, List<Integer> path) {
    if (target == 0) {
        result.add(new ArrayList<>(path));
        return;
    }
    
    for (int i = start; i < candidates.length; i++) {
        // 剪枝：如果当前数字已经大于target，后面的更大，直接跳过
        if (candidates[i] > target) break;
        
        path.add(candidates[i]);
        // 注意这里是 i 不是 i+1，因为可以重复使用
        backtrack(candidates, target - candidates[i], i, path);
        path.remove(path.size() - 1);
    }
}
\`\`\`
`
            },
            {
                id: "backtracking-parentheses",
                title: "5. 括号匹配",
                content: `
### 生成有效括号

**核心规则**：
1. 左括号数量不能超过 n
2. 右括号数量不能超过左括号数量

\`\`\`java
List<String> result = new ArrayList<>();

public List<String> generateParenthesis(int n) {
    backtrack(n, 0, 0, new StringBuilder());
    return result;
}

void backtrack(int n, int left, int right, StringBuilder path) {
    // 结束条件
    if (path.length() == 2 * n) {
        result.add(path.toString());
        return;
    }
    
    // 可以添加左括号
    if (left < n) {
        path.append('(');
        backtrack(n, left + 1, right, path);
        path.deleteCharAt(path.length() - 1);
    }
    
    // 可以添加右括号
    if (right < left) {
        path.append(')');
        backtrack(n, left, right + 1, path);
        path.deleteCharAt(path.length() - 1);
    }
}
\`\`\`
`
            },
            {
                id: "backtracking-word-search",
                title: "6. 单词追踪",
                content: `
### 单词搜索

在二维网格中搜索单词，可以上下左右移动。

**Trick：借尸还魂 (Masking)**
为了省去 \`visited\` 数组的空间，我们直接在 \`board\` 上动手脚。走过的地方标记为 \`'#'\`，回来的时候再还原。

\`\`\`java
public boolean exist(char[][] board, String word) {
    for (int i = 0; i < board.length; i++) {
        for (int j = 0; j < board[0].length; j++) {
            if (backtrack(board, word, 0, i, j)) return true;
        }
    }
    return false;
}

boolean backtrack(char[][] board, String word, int index, int row, int col) {
    // 结束条件：单词的所有字符都找到了
    if (index == word.length()) return true;
    
    // 边界检查 + 字符不匹配 + 已经访问过('#')
    if (row < 0 || row >= board.length || 
        col < 0 || col >= board[0].length || 
        board[row][col] != word.charAt(index)) {
        return false;
    }
    
    // Core: 借尸还魂 (Masking)
    char temp = board[row][col]; // 1. 记下当前字符
    board[row][col] = '#';      // 2. 毁尸灭迹 (标记为已访问)
    
    // 四个方向递归
    boolean found = backtrack(board, word, index + 1, row + 1, col) ||
                    backtrack(board, word, index + 1, row - 1, col) ||
                    backtrack(board, word, index + 1, row, col + 1) ||
                    backtrack(board, word, index + 1, row, col - 1);
                    
    board[row][col] = temp;     // 3. 还魂 (回溯恢复)
    
    return found;
}
\`\`\`
`
            },
            {
                id: "backtracking-word-break",
                title: "7. 单词切割",
                content: `
### 单词拆分（回溯 + 记忆化）

判断字符串是否可以被拆分为字典中的单词。

\`\`\`java
public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> dict = new HashSet<>(wordDict);
    Boolean[] memo = new Boolean[s.length()];
    return backtrack(s, 0, dict, memo);
}

boolean backtrack(String s, int start, Set<String> dict, Boolean[] memo) {
    if (start == s.length()) return true;
    
    if (memo[start] != null) return memo[start];
    
    for (int end = start + 1; end <= s.length(); end++) {
        String word = s.substring(start, end);
        if (dict.contains(word) && backtrack(s, end, dict, memo)) {
            memo[start] = true;
            return true;
        }
    }
    
    memo[start] = false;
    return false;
}
\`\`\`
`
            },
            {
                id: "backtracking-nqueens",
                title: "8. 八皇后问题",
                content: `
### N皇后问题

在 N×N 棋盘上放置 N 个皇后，使它们互不攻击。

**三大侍卫 (The Three Guards)**
为了保护皇后，我们需要三个方向的“侍卫”来检查安全性：
1. **列侍卫**：头顶上有没有人？
2. **左上侍卫**：左上角对角线有没有人？
3. **右上侍卫**：右上角对角线有没有人？

\`\`\`java
List<List<String>> result = new ArrayList<>();

public List<List<String>> solveNQueens(int n) {
    char[][] board = new char[n][n];
    for (char[] row : board) Arrays.fill(row, '.');
    backtrack(board, 0);
    return result;
}

void backtrack(char[][] board, int row) {
    if (row == board.length) {
        result.add(construct(board));
        return;
    }
    
    for (int col = 0; col < board.length; col++) {
        if (!isValid(board, row, col)) continue;
        
        board[row][col] = 'Q';
        backtrack(board, row + 1); // 去下一行
        board[row][col] = '.';     // 撤销
    }
}

boolean isValid(char[][] board, int row, int col) {
    int n = board.length;
    
    // 1. 列侍卫 (检查正上方)
    for (int i = 0; i < row; i++) {
        if (board[i][col] == 'Q') return false;
    }
    
    // 2. 左上侍卫 (检查左上对角线)
    for (int i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] == 'Q') return false;
    }
    
    // 3. 右上侍卫 (检查右上对角线)
    // 注意：不用检查当前行（每一行只放一个）
    // 注意：不用检查下方（还没放呢）
    for (int i = row - 1, j = col + 1; i >= 0 && j < n; i--, j++) {
        if (board[i][j] == 'Q') return false;
    }
    
    return true;
}

List<String> construct(char[][] board) {
    List<String> res = new ArrayList<>();
    for (char[] row : board) res.add(new String(row));
    return res;
}
\`\`\`
`
            }
        ]
    },
    {
        id: "greedy",
        title: "贪心算法",
        icon: "💰",
        tagClass: "bg-gradient-to-r from-green-500 to-emerald-500",
        sections: [
            {
                id: "greedy-stock",
                title: "1. 股票买卖",
                content: `
### 买卖股票的最佳时机

**核心思想**：最小买入进行检查然后最大利润一直更新。

\`\`\`java
public int maxProfit(int[] prices) {
    int minPrice = Integer.MAX_VALUE;
    int maxProfit = 0;
    for (int price : prices) {
        minPrice = Math.min(minPrice, price);
        maxProfit = Math.max(maxProfit, price - minPrice);
    }
    return maxProfit;
}
\`\`\`

> **贪心策略**：始终记录到目前为止的最低价格，计算当前价格卖出的利润。
`
            },
            {
                id: "greedy-jump",
                title: "2. 跳跃游戏",
                content: `
### 跳跃游戏

判断能否从起点跳到终点。

**核心思想**：维护能到达的最远位置。

\`\`\`java
public boolean canJump(int[] nums) {
    int maxReach = 0;
    for (int i = 0; i < nums.length; i++) {
        // 如果当前位置超过了能到达的最远位置，失败
        if (i > maxReach) return false;
        // 更新能到达的最远位置
        maxReach = Math.max(maxReach, i + nums[i]);
    }
    return true;
}
\`\`\`
`
            },
            {
                id: "greedy-jump-min",
                title: "3. 跳跃游戏II（最少次数）",
                content: `
### 跳跃游戏 II - 最少跳跃次数

**为什么是 \`length - 1\`？** 这是最大的坑。因为当我们到达最后一个元素时，我们已经不需要再跳了（所以我们就是直接到前一个就结束了到索引下标的n-2的位置结束）。

**下一轮的界限 (\`end\`)** 就在那儿！

\`\`\`java
public int jump(int[] nums) {
    int jumps = 0;
    int currentEnd = 0;
    int farthest = 0;
    
    // 注意：遍历到 length - 1，不包括最后一个
    for (int i = 0; i < nums.length - 1; i++) {
        // 更新能到达的最远位置
        farthest = Math.max(farthest, i + nums[i]);
        
        // 到达当前跳跃的边界，必须跳跃
        if (i == currentEnd) {
            jumps++;
            currentEnd = farthest;
        }
    }
    return jumps;
}
\`\`\`

> **关键理解**：\`currentEnd\` 是当前这一跳能到达的最远边界，到达边界时必须再跳一次。
`
            },
            {
                id: "greedy-partition-labels",
                title: "4. 划分字母区间 (Partition Labels)",
                content: `
### 划分字母区间 (Partition Labels)

欢迎来到 **代码透视眼解剖室**。

这道题是 **"贪心算法"** 的入门神题。别被代码里的 Map 和循环吓到，它的核心逻辑其实就像你在玩一个 **"圈地盘"** 的游戏。

**【核心贪心思想：橡皮筋扩地法】**
贪心的策略只有一句话：**"只要圈里有一个人想往外跑，圈子就必须扩大，直到圈住他最后一次出现的地方。"**

---

### 第一阶段：变量选角面试 (The Casting Call) —— 幼儿园视角

#### 1. \`int[] last\` (预言家的小本本)

* **幼儿园比喻：** 这是一个 **"最后行踪记录仪"**。
* **它的任务：** 我们先派侦查员（第一个循环）跑一遍全图，把每个字母 **最后一次出现的位置** 记下来。
    * 比如：'a' 最后一次出现在第 8 格，'b' 最后一次出现在第 5 格。
* **为什么要先记下来？** 因为贪心的时候，我们需要知道"最远得跑到哪"才能收工。

#### 2. \`int left, right\` (弹性的橡皮筋)

* **幼儿园比喻：** 这是一根 **"橡皮筋"** 的两头。
    * \`left\` 是钉死在墙上的那一头（当前片段的起点）。
    * \`right\` 是我们要用手拉着往右跑的那一头（当前片段的最远边界）。
* **贪心时刻：** \`right\` 不是固定的，它会随着圈进来的字母不断变大！

---

### 第二阶段：动作拆解与贪心解读 (Action & Boundaries) —— 逻辑视角

#### 动作一：全知全能的侦查 (预处理)

\`\`\`java
int[] last = new int[26];
for (int i = 0; i < s.length(); i++) {
    last[s.charAt(i) - 'a'] = i; 
}
\`\`\`

* **解读：** 这里会不断覆盖。比如 'a' 在 0, 2, 8 出现过，\`last['a' - 'a']\` 最后存的就是 \`8\`。
* **潜台词：** "只要看到 'a'，你的圈子至少得画到 8 那里去，否则就把 'a' 的兄弟拆散了！"

#### 动作二：贪心拉伸与切割 (核心循环)

\`\`\`java
for (int i = 0; i < s.length(); i++) {
    right = Math.max(right, last[s.charAt(i) - 'a']); // 贪心扩充
    if (right == i) { // 边界守卫
        res.add(i - left + 1); // 切割
        left = i + 1; // 重新钉钉子
    }
}
\`\`\`

* **1. 贪心扩充 (\`Math.max\`) —— "被动变大"**
    * **场景：** 假设现在的字符串是 \`abac...\`。
        * \`i=0\` ('a')：查表发现 'a' 最后出现在 8。橡皮筋 \`right\` 瞬间被撑大到 **8**。
        * \`i=1\` ('b')：查表发现 'b' 最后出现在 5。\`Math.max(8, 5)\` 还是 8。橡皮筋不用动。
    * **突发情况：** 假设 \`i=2\` 遇到了一个 'z'，查表发现 'z' 最后出现在 **20**！
        * **贪心执行：** 完了！虽然刚才以为 8 就能收工，但因为圈里混进了个 'z'，为了包住它的兄弟，\`right\` 必须被撑大到 **20**。
    * **结论：** 只要圈子没封口，进来的任何人都有权把圈子撑得更大。

* **2. 边界切割 (\`i == right\`) —— "终于解脱"**
    * **场景：** 你遍历到了 \`i = 8\`。
    * **检查：** 现在的 \`right\` 是多少？如果刚好也是 8。
    * **意义：** 这意味着 **从 \`left\` 到 8 这一段里，所有出现过的字母，它们的"最后一次出现"都不超过 8**。
    * **动作：** 安全了！**咔擦一刀**。切下来的长度是 \`8 - 0 + 1 = 9\`。
    * **清理现场：** \`left\` 设为 9，准备开始画下一个圈。

---

### 第三阶段：研究生级深度点拨 (The "Gotchas") —— 专家视角

#### 1. 为什么用 \`int[26]\` 而不是 HashMap？

* **新手写法：** \`Map<Character, Integer>\`。
* **架构师写法：** \`int[] last = new int[26];\`。
* **为什么？** HashMap 在底层涉及到哈希计算、链表/红黑树处理、自动装箱（int 转 Integer），内存占用大，速度慢。
* 题目通常只给小写字母 \`a-z\`。直接用 \`s.charAt(i) - 'a'\` 作为一个 0-25 的索引，访问速度是纯粹的内存偏移，快到飞起。

#### 2. 为什么是 \`i - left + 1\`？

* **口诀：** "算个数，尾减头加一"。
* 如果 \`left\` 是 0，\`i\` 是 8。你需要的是 0,1,2,3,4,5,6,7,8 一共 9 个数。

---

### 💡 完整代码 (Java)

\`\`\`java
public List<Integer> partitionLabels(String s) {
    int[] last = new int[26];
    // 1. 记录每个字符最后出现的位置
    for (int i = 0; i < s.length(); i++) {
        last[s.charAt(i) - 'a'] = i;
    }
    
    List<Integer> res = new ArrayList<>();
    int left = 0, right = 0;
    
    // 2. 贪心切割
    for (int i = 0; i < s.length(); i++) {
        right = Math.max(right, last[s.charAt(i) - 'a']);
        if (i == right) {
            res.add(i - left + 1);
            left = i + 1;
        }
    }
    
    return res;
}
\`\`\`
`
            }
        ]
    },
    {
        id: "dp",
        title: "动态规划",
        icon: "📊",
        tagClass: "bg-gradient-to-r from-orange-500 to-amber-500",
        sections: [
            {
                id: "dp-knapsack",
                title: "0-1背包 vs 完全背包",
                content: `
### 背包问题分类

#### 1. 怎么区分？看"拿取次数"

- **0-1 背包**：只有两个选择，**拿**或者**不拿**。每个物品只有 1 个。
  - *场景*：只有一块金条，你要么带走，要么留下，不能把金条切开或者变出两根来。
- **完全背包 (Unbounded Knapsack)**：只要背包装得下，每个物品可以**拿无数次**。
  - *场景*：硬币问题。题目说了"你可以认为每种硬币的数量是无限的"。

#### 2. 循环顺序的区别

在做一维数组优化时：

- **0-1 背包的关键特征**：内层循环（容量）必须**从大到小（倒序）**遍历。
  - *原因*：倒序是为了保证在算当前状态时，利用的是"上一层"的数据，防止一个物品被重复放入。
- **完全背包的关键特征**：内层循环（容量）必须**从小到大（正序）**遍历。
  - *原因*：正序意味着当前物品可以被重复使用。

| **问题类型** | **循环顺序** | **原因** |
|-------------|-------------|---------|
| 0-1 背包 | 外：物品 内：背包(倒序) | 倒序防止同一物品被重复放入 |
| 完全背包 - 求最值 | **无所谓** | 只要个数最少，先拿1还是先拿2没区别 |
| 完全背包 - 求组合数 | **必须：先物品，后背包** | 保证硬币按顺序加入，消除顺序差异 |
| 完全背包 - 求排列数 | **必须：先背包，后物品** | 每次都重新扫描所有硬币，允许顺序差异 |

> **心法**：求个数（Min/Max）不挑食，随便怎么循环；求方案数（How many ways）要小心，先物品是组合，先背包是排列。
`
            },
            {
                id: "dp-coin-change",
                title: "零钱兑换",
                content: `
### 零钱兑换

**初始化**：\`int[] dp = new int[amount + 1];\`

- 这里 \`dp[i]\` 存储的是状态。
- \`Arrays.fill(dp, amount + 1);\`：这步非常关键。
- **为什么是 \`amount + 1\`？** 这是一个**"伪无穷大"**。因为即使全用面值 1 的硬币，数量也只有 \`amount\` 个。如果最终结果比 \`amount\` 还大，说明根本凑不出来。这比用 \`Integer.MAX_VALUE\` 安全，避免了 \`+1\` 后整数溢出的风险。

**双层循环 (The Core)**：

- \`for (int i = 1; i <= amount; i++)\`：**外层循环**遍历所有金额（从 1 到 目标值）。这是"填表"的过程。
- \`for (int coin : coins)\`：**内层循环**尝试每一种硬币。这是"决策"的过程。

**转移逻辑**：

- \`if (coin <= i)\`：只有硬币面值小于当前金额时才能用。
- \`dp[i] = Math.min(dp[i], dp[i - coin] + 1);\`
- 这里翻译成白话就是：**当前金额的最优解 = min(我现在的解, 用了这枚硬币后的解 + 1)**。

\`\`\`java
public int coinChange(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    Arrays.fill(dp, amount + 1);
    dp[0] = 0;
    
    for (int i = 1; i <= amount; i++) {
        for (int coin : coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] > amount ? -1 : dp[amount];
}
\`\`\`
`
            },
            {
                id: "dp-subset-sum",
                title: "分割等和子集",
                content: `
### 分割等和子集

**场景：双胞胎分家产**

有一堆大小不一的金币（数组 \`nums\`），两个双胞胎兄弟要分家。规则是：**必须分得一模一样多**，不能把金币切开，也不能有剩下的。

**第一步：称重（奇偶性判断）**
- 如果总重是奇数：别忙活了，怎么分都不可能一样多。直接说"不行"。
- 如果总重是偶数：那每人必须拿一半。

**递推公式**：\`dp[j] = dp[j] || dp[j - num]\`

这句话的中文翻译是：
> "我要想凑出 \`j\` 这么大的重量，有两种办法，只要**任意一种能成功**，就算我成功。"

**为什么要倒着来 (j--)?**

**一句话结论**：**倒着遍历，是为了防止"一个数字被用了多次"。**

我们要解决的是 **0/1 背包**问题（每个数字只能用一次）。如果不倒着来，就会变成 **完全背包**问题（每个数字可以用无限次）。

\`\`\`java
public boolean canPartition(int[] nums) {
    int sum = 0;
    for (int num : nums) sum += num;
    
    // 奇数不可能平分
    if (sum % 2 != 0) return false;
    
    int target = sum / 2;
    boolean[] dp = new boolean[target + 1];
    dp[0] = true;
    
    for (int num : nums) {
        // 倒序遍历！防止重复使用
        for (int j = target; j >= num; j--) {
            dp[j] = dp[j] || dp[j - num];
        }
    }
    
    return dp[target];
}
\`\`\`

> **❤️所以就是你的大小是用小钱开始，但是背包容量从最大开始算**
`
            },
            {
                id: "dp-house-robber",
                title: "打家劫舍",
                content: `
### 打家劫舍

| **数学符号** | **代码变量** | **含义** |
|-------------|-------------|---------|
| dp[i-2] | \`prev2\` | **前前一家**的最优解 |
| dp[i-1] | \`prev1\` | **前一家**的最优解 |
| dp[i] | \`curr\` | **当前**计算出的最优解 |

**代码逻辑链条 (The Loop)**：

\`\`\`java
// 循环内部的魔法：
int curr = Math.max(prev1, prev2 + nums[i]); // 决策：偷还是不偷？

// 这一步最关键，叫做"时间推移"：
prev2 = prev1;  // 原来的"前一家"变成了下一轮的"前前一家"
prev1 = curr;   // 现在的"最新结果"变成了下一轮的"前一家"
\`\`\`

\`\`\`java
public int rob(int[] nums) {
    if (nums.length == 1) return nums[0];
    
    int prev2 = 0, prev1 = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        int curr = Math.max(prev1, prev2 + nums[i]);
        prev2 = prev1;
        prev1 = curr;
    }
    
    return prev1;
}
\`\`\`
`
            },
            {
                id: "dp-lis",
                title: "最长递增子序列",
                content: `
### 最长递增子序列 (LIS)

**初始化 (\`Arrays.fill(dp, 1)\`)**：
- 每个数字本身至少可以构成一个长度为 1 的子序列（只有它自己）。这是保底值。

**外层循环 (\`i\` from 1 to n)**：
- 我们逐个考察数组中的每个数字，试图以它为终点构建序列。

**内层循环 (\`j\` from 0 to i)**：
- 这是 O(N²) 的罪魁祸首。我们在扫描历史记录。
- \`if (nums[j] < nums[i])\`：**接龙条件**。只有前面的数比我小，我才能接在后面。
- \`dp[i] = Math.max(dp[i], dp[j] + 1)\`：**择优录取**。

\`\`\`java
public int lengthOfLIS(int[] nums) {
    int n = nums.length;
    int[] dp = new int[n];
    Arrays.fill(dp, 1);
    int maxLen = 1;
    
    for (int i = 1; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (nums[j] < nums[i]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        maxLen = Math.max(maxLen, dp[i]);
    }
    
    return maxLen;
}
\`\`\`
`
            },
            {
                id: "dp-max-product",
                title: "乘积最大子数组",
                content: `
### 乘积最大子数组

**为什么要带两个背包？** 因为前面可能有个很坏的"负数蘑菇"把你变成了很小的蚂蚁（也就是一个很大的负数，比如 -100）。一般人可能觉得"完了，我输了"。但在高手的眼里，这个 -100 是个**宝贝**！为什么？因为万一前面还有一个"负数蘑菇"（比如 -2）呢？只要那个 -100 再碰到 -2，瞬间就会变成 +200 的超级巨人！

所以，你手里必须时刻抓着两个数：
1. **最大值（maxProd）**：当前能变成的**最大巨人**。
2. **最小值（minProd）**：当前能变成的**最惨蚂蚁**（也就是最大的负数，作为**潜力股**留着翻盘用）。

**状态转移方程**：

$$f_{max}[i] = \\max(nums[i], f_{max}[i-1] \\times nums[i], f_{min}[i-1] \\times nums[i])$$

$$f_{min}[i] = \\min(nums[i], f_{max}[i-1] \\times nums[i], f_{min}[i-1] \\times nums[i])$$

\`\`\`java
public int maxProduct(int[] nums) {
    int maxProd = nums[0];
    int minProd = nums[0];
    int result = nums[0];
    
    for (int i = 1; i < nums.length; i++) {
        // 如果当前是负数，交换max和min
        if (nums[i] < 0) {
            int temp = maxProd;
            maxProd = minProd;
            minProd = temp;
        }
        
        maxProd = Math.max(nums[i], maxProd * nums[i]);
        minProd = Math.min(nums[i], minProd * nums[i]);
        
        result = Math.max(result, maxProd);
    }
    
    return result;
}
\`\`\`
`
            },
            {
                id: "dp-word-break",
                title: "单词拆分（DP版）",
                content: `
### 单词拆分 - 动态规划

**HashSet 使用**：理解为什么查表要用 Set。

**子字符串切片**：熟练掌握 \`substring(start, end)\` 的索引规则（左闭右开）。

**双重循环 DP**：外层遍历长度，内层寻找分割点。

**接力赛隐喻**：

这行代码在问两个问题，必须**同时**回答"Yes"，你才能在位置 \`i\` 插上胜利的旗帜：

1. **队友到了吗？ (\`dp[j]\`)**
   - 你要跑这最后一段路（从 \`j\` 到 \`i\`），前提是**必须有队友已经成功跑到了 \`j\` 这个位置**，并把接力棒交给你。
   
2. **这一段路通吗？ (\`dict.contains(s.substring(j, i))\`)**
   - 假设队友已经到了 \`j\`，现在轮到你跑从 \`j\` 到 \`i\` 这段路。
   - 这段路必须是一个**合法的单词**（也就是字典里有的路），你才能跑过去。

**总结**：**胜利（dp[i]） = 队友已到达起跑线（dp[j]） + 我跑的这段路是合法的（dict包含这段子串）**

\`\`\`java
public boolean wordBreak(String s, List<String> wordDict) {
    Set<String> dict = new HashSet<>(wordDict);
    int n = s.length();
    boolean[] dp = new boolean[n + 1];
    dp[0] = true;
    
    for (int i = 1; i <= n; i++) {
        for (int j = 0; j < i; j++) {
            if (dp[j] && dict.contains(s.substring(j, i))) {
                dp[i] = true;
                break;
            }
        }
    }
    
    return dp[n];
}
\`\`\`
`
            },
            {
                id: "dp-longest-valid-parentheses",
                title: "最长有效括号",
                content: `
### 最长有效括号

**目标**：用"搭积木"的比喻解释核心逻辑。

想象你在玩一种特殊的积木，只有两种形状：**左弯 \`(\`** 和 **右弯 \`)\`**。我们要找出能拼起来的、**最长的一条连续**积木。

- **规则**：只有 **右弯 \`)\`** 才能作为结尾。
- **情况一**：你手里拿着一个右弯 \`)\`，回头一看，前一个刚好是左弯 \`(\`。
  - **动作**：咔嚓！拼上了！这组长度是 2。
  - **如果前面还有？** 如果这对积木前面已经有一条拼好的长积木，那就把它们**粘在一起**，长度变长。
- **情况二**：你手里拿着一个右弯 \`)\`，回头一看，前一个也是右弯 \`)\`。

**公式推导**：

$$\\text{目标坐标} = \\text{锚点} - \\text{偏移量} - \\text{跨越长度}$$

$$\\text{前一段结尾} = \\text{匹配左括号坐标} - 1$$

$$= [(i - 1) - dp[i - 1]] - 1$$

$$= i - dp[i - 1] - 2$$

\`\`\`java
public int longestValidParentheses(String s) {
    int n = s.length();
    int[] dp = new int[n];
    int maxLen = 0;
    
    for (int i = 1; i < n; i++) {
        if (s.charAt(i) == ')') {
            if (s.charAt(i - 1) == '(') {
                // 情况1: ...()
                dp[i] = (i >= 2 ? dp[i - 2] : 0) + 2;
            } else if (i - dp[i - 1] > 0 && 
                       s.charAt(i - dp[i - 1] - 1) == '(') {
                // 情况2: ...))
                dp[i] = dp[i - 1] + 2 + 
                        (i - dp[i - 1] >= 2 ? dp[i - dp[i - 1] - 2] : 0);
            }
            maxLen = Math.max(maxLen, dp[i]);
        }
    }
    
    return maxLen;
}
\`\`\`
`
            },
            {
                id: "dp-longest-palindrome",
                title: "最长回文子串",
                content: `
### 最长回文子串 - 中心扩展法

**擂台赛模式 (The Big Picture)**

整个函数的核心逻辑并不是"一次算出结果"，而是**"一边找，一边更新擂主"**。

- **\`start\` 和 \`end\` 是什么？** 它们是**"当前的擂主"**。也就是**"到目前为止，我见过的最长的那个回文串"**的**起始**和**结束**坐标。
- **\`i\` 循环在干什么？** \`i\` 是**挑战者**。它带着每一个位置（字符）来挑战。
- **那段 \`if\` 代码在干什么？** 这就是**"踢馆"**的过程！

**长度计算公式**：\`right - left - 1\`

**原理**：因为 \`while\` 循环结束时，\`left\` 和 \`right\` 已经**多走了一步**（走到了不匹配或者越界的位置），所以我们要把这两个"多走的一步"减掉。

> **❤️多走的要中间部分**

**❤️平局要折腾**

代码里的判断条件 \`len > end - start\` 其实就变成了：

$$len > (\\text{真实长度} - 1)$$

在**整数**的世界里，**"大于 (Length - 1)"** 和 **"大于等于 Length"** 是完全等价的。

\`\`\`java
public String longestPalindrome(String s) {
    if (s == null || s.length() < 1) return "";
    int start = 0, end = 0;
    
    for (int i = 0; i < s.length(); i++) {
        int len1 = expandAroundCenter(s, i, i);     // 奇数长度
        int len2 = expandAroundCenter(s, i, i + 1); // 偶数长度
        int len = Math.max(len1, len2);
        
        if (len > end - start) {
            start = i - (len - 1) / 2;
            end = i + len / 2;
        }
    }
    
    return s.substring(start, end + 1);
}

int expandAroundCenter(String s, int left, int right) {
    while (left >= 0 && right < s.length() && 
           s.charAt(left) == s.charAt(right)) {
        left--;
        right++;
    }
    return right - left - 1;
}
\`\`\`
`
            },
            {
                id: "dp-lcs",
                title: "最长公共子序列",
                content: `
### 最长公共子序列 (LCS)

**1. 状态定义** \`int[][] dp = new int[m + 1][n + 1];\`

- 为什么是 \`m+1\` 和 \`n+1\`？
- 为了处理**空字符串**的情况。\`dp[0][j]\` 表示 \`text1\` 是空的，那公共子序列长度自然是 0。这也是"哨兵"思想。

**2. 核心推演 (The Transitions)**

请把 \`dp[i][j]\` 想象成一个网格上的点。我们要决定这个点的值，只能从**三个方向**看过来：

- **情况 A：字符匹配（命中！）**
  - 逻辑：\`text1[i]\` 和 \`text2[j]\` 是同一个字母。
  - 动作：**左上角 + 1**。
  - 代码：\`dp[i][j] = dp[i-1][j-1] + 1;\`
  
- **情况 B：字符不匹配（继承）**
  - 逻辑：这两个字符不一样，没法凑成一对。
  - 动作：**看左边，看上面，选大的**。
  - 代码：\`dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);\`

**3. 为什么是 Math.max?** 因为是"子序列"，不要求连续。如果不匹配，我们不能清零（那是求子串的逻辑），我们要**保留历史最好成绩**。

\`\`\`java
public int longestCommonSubsequence(String text1, String text2) {
    int m = text1.length(), n = text2.length();
    int[][] dp = new int[m + 1][n + 1];
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (text1.charAt(i - 1) == text2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }
    
    return dp[m][n];
}
\`\`\`
`
            },
            {
                id: "dp-edit-distance",
                title: "编辑距离",
                content: `
### 编辑距离

**1. 核心定义与状态**

$$dp[i][j]$$ = \`word1[0...i-1]\` 转换到 \`word2[0...j-1]\` 的最小操作数。

- **数组大小 \`[m+1][n+1]\`**：
  - 就像之前的背包问题一样，**第 0 行/列**代表**空字符串**。
  - \`dp[i][0]\`：把 \`word1\` 的前 \`i\` 个字符变成"空"，需要删 \`i\` 次。
  - \`dp[0][j]\`：把"空"变成 \`word2\` 的前 \`j\` 个字符，需要插 \`j\` 次。

**2. 第一性原理：上帝视角的三选一**

当我们在计算 \`dp[i][j]\` 时，我们只看三个"邻居"：

- **↖️ 左上角 (\`dp[i-1][j-1]\`): 替换 (Replace)**
  - 把 \`word1\` 的第 \`i\` 个变成 \`word2\` 的第 \`j\` 个。
  - 如果字符一样，代价+0；如果不一样，代价+1。
  
- **⬆️ 上方 (\`dp[i-1][j]\`): 删除 (Delete)**
  - \`word1\` 多冒出来一个第 \`i\` 个字符，把它**删掉**。
  
- **⬅️ 左方 (\`dp[i][j-1]\`): 插入 (Insert)**
  - \`word2\` 多了一个第 \`j\` 个字符，强行**插入**一个字符来匹配它。

**3. 索引偏移 (Off-by-one Error)**

- **代码**：\`word1.charAt(i - 1) == word2.charAt(j - 1)\`
- **原因**：\`dp\` 数组从 1 开始代表第一个字符，而字符串 \`String\` 从 0 开始。
  - \`dp[1]\` 对应 \`String[0]\`。
  - \`dp[i]\` 对应 \`String[i-1]\`。

\`\`\`java
public int minDistance(String word1, String word2) {
    int m = word1.length(), n = word2.length();
    int[][] dp = new int[m + 1][n + 1];
    
    // 初始化边界
    for (int i = 0; i <= m; i++) dp[i][0] = i;
    for (int j = 0; j <= n; j++) dp[0][j] = j;
    
    for (int i = 1; i <= m; i++) {
        for (int j = 1; j <= n; j++) {
            if (word1.charAt(i - 1) == word2.charAt(j - 1)) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                dp[i][j] = Math.min(
                    dp[i - 1][j - 1],  // 替换
                    Math.min(
                        dp[i - 1][j],  // 删除
                        dp[i][j - 1]   // 插入
                    )
                ) + 1;
            }
        }
    }
    
    return dp[m][n];
}
\`\`\`
`
            },
            {
                id: "dp-sentinel",
                title: "哨兵与数组大小",
                content: `
### 什么时候用哨兵（Sentinel）？即 \`size + 1\`

**核心口诀**：

> **只要问题中存在"空状态"有意义，就加哨兵。**

所谓的哨兵，就是 \`dp\` 数组的第 0 位（\`dp[0]\` 或 \`dp[0][0]\`）。

#### 1. 必须加哨兵的情况（最常见）

如果题目涉及**"前 i 个字符"**、**"前 i 个物品"**、**"凑齐 i 元钱"**，请务必开 \`n+1\` 的空间。

- **字符串问题 (LCS, 编辑距离)**：
  - 两个字符串比对，必须考虑"如果其中一个是空字符串"怎么办。
  - \`dp[0][0]\` 代表：空字符串 vs 空字符串，匹配长度为 0。
  - **数组大小**：\`new int[m+1][n+1]\`。
  
- **背包问题 (凑零钱, 分割等和子集)**：
  - 你要凑 \`target\` 元。
  - 必须考虑"凑 0 元"的情况（什么都不拿，也是一种方案）。
  - **数组大小**：\`new int[target + 1]\`。

#### 2. 不需要加哨兵的情况

如果题目是**"在这个格子上"**、**"以这个元素结尾"**，通常不需要空状态。

- **网格路径 (Unique Paths, Min Path Sum)**：
  - 你一开始就站在 \`(0, 0)\` 格子上，不存在"站在空虚里"的情况。
  - **数组大小**：\`new int[m][n]\`（和原图一样大）。
  
- **最长递增子序列 (LIS)**：
  - \`dp[i]\` 代表"以 \`nums[i]\` **结尾**的最长子序列"。
  - **数组大小**：\`new int[n]\`。

### ⚡️ 终极速查表 (Cheat Sheet)

| **场景** | **数组大小** | **返回值** | **取原数组** |
|---------|-------------|-----------|-------------|
| 有哨兵 (Size = N + 1) | \`new int[n + 1]\` | \`dp[n]\` | \`arr[i-1]\` |
| 无哨兵 (Size = N) | \`new int[n]\` | \`dp[n - 1]\` | \`arr[i]\` |

**总结一句话**：

问自己**"0"代表什么？**
- 如果"0"代表**"没有东西/空"** -> **开 N+1，返回 N，用 i-1 取值**。
- 如果"0"代表**"第0号元素/第0行"** -> **开 N，返回 N-1，用 i 取值**。
`
            }
        ]
    },
    {
        id: "index-boundary",
        title: "索引边界",
        icon: "📐",
        tagClass: "bg-gradient-to-r from-red-500 to-rose-500",
        sections: [
            {
                id: "index-formula",
                title: "三种区间公式",
                content: `
### ⏳ 一张表秒懂

| **公式** | **对应的区间** | **核心逻辑** | **典型应用场景** | **直觉口诀** |
|---------|---------------|-------------|-----------------|-------------|
| **R - L + 1** | **[L, R]** (闭区间) | **两头都算** | 统计元素个数、滑窗大小、数组切片(含头含尾) | **"数数手指头"** |
| **R - L** | **[L, R)** (左闭右开) | **算头不算尾** | Python切片、字符串长度、前缀和、时间差 | **"减法求距离"** |
| **R - L - 1** | **(L, R)** (开区间) | **两头都不算** | **单调栈**、两堵墙中间的空隙 | **"夹心饼干"** |

---

### 🔍 深度拆解：三个公式的物理意义

#### 1. \`R - L + 1\`: 队友模式 (全包含)

> **场景**：L 和 R 都是我们要的人，都要算进去。

- **定义**：我们要计算从第 L 个元素到第 R 个元素，**一共有多少个元素**。

- **例子**：
  - 你周一(L=1)上班，一直干到周五(R=5)，你一共上了几天班？
  - 计算：$5 - 1 + 1 = 5$ 天。
  - 如果不加 1，变成 $5-1=4$，你就少算了一天的工资。

\`\`\`
下标:  1   2   3   4   5
      L               R
计数:  ✅  ✅  ✅  ✅  ✅
结果:  5 - 1 + 1 = 5
\`\`\`

#### 2. \`R - L\`: 标尺模式 (❤️左闭右开就是开口就能找到目标索引)

> **场景**：L 是起点，R 是**终点后面的那个"出界点"**。

- **定义**：计算机科学中最常用的习惯。通常 R 指向的是"结束位置的下一位"。

- **例子**：
  - **Python 切片** \`arr[2:5]\`。意思是取下标 2, 3, 4。
  - L = 2 (起点)，R = 5 (边界)。
  - 长度 = $5 - 2 = 3$。

\`\`\`
下标:  2   3   4   5
      L           R (出界了)
计数:  ✅  ✅  ✅  ❌
结果:  5 - 2 = 3
\`\`\`

#### 3. \`R - L - 1\`: 墙壁模式 (全排除) 👈 **单调栈核心**

> **场景**：L 和 R 是两堵墙（或者两个坏人），我们只算**墙中间**夹着的空间。

- **定义**：L 是左边的限制，R 是右边的限制。我们要计算**限制之内**有多少个空位。

- **例子**：
  - **排队**：小明排在第 2 位 (L)，小红排在第 6 位 (R)。**他俩中间**隔了几个人？
  - 中间的人是：第 3, 4, 5 位。共 3 个人。
  - 计算：$6 - 2 - 1 = 3$。

\`\`\`
下标:  2   3   4   5   6
      L               R
身份: 墙  ✅  ✅  ✅  墙
结果:  6 - 2 - 1 = 3
\`\`\`
`
            },
            {
                id: "index-boundary-handling",
                title: "边框越界处理思考",
                content: `
### 边框越界处理思考

这种"上来就分段处理"的写法，实际上是一种**"分而治之"的工程思维**。它把一个复杂的 2D 问题，拆解成了"边缘特殊处理"和"中心通用处理"两个部分，从而**规避了在主循环里写一堆恶心的 \`if (i == 0 || j == 0)\` 判断**。

我将为你建立一套**"网格坐标敏感度"**的思维模型。

---

### 阶段一：👶 幼儿园直觉理解 (The Intuition)

**核心概念**：拼图要先拼**边框**，再填**中间**。

想象你在玩一个 1000 块的拼图。

1. **如果你上来就抓中间的一块**：你会很痛苦。为什么？因为你不知道它的上面是谁，也不知道它的左边是谁。你需要四处找参照物。
2. **高手的做法**：
   - 先把**第一排**（最上面那行）拼好。因为它们没有"上面"，只能一个接一个往右拼。
   - 先把**第一列**（最左边那列）拼好。因为它们没有"左边"，只能一个接一个往下拼。
   - **最后填中间**：这时候，无论你拿起中间的哪一块，它的上面和左边都已经拼好了！你只需要看一眼这两个邻居，就能决定怎么放。

**代码里的 \`i=1\` 和 \`j=1\`**，就是在说："别管边框了，边框我已经单独处理完了，现在我们只专心填中间的空缺。"

---

### 阶段二：👦 初中生实事求是 (The Context)

**为什么怕索引越界？** 因为计算机很笨。

- 如果你写 \`grid[i][j] += grid[i-1][j]\`，计算机会去查 \`i-1\`。
- 如果 \`i\` 是 \`0\`，\`i-1\` 就是 \`-1\`。
- 在 Java/C++ 里，访问数组下标 \`-1\` 会直接抛出异常（ArrayIndexOutOfBoundsException）或者访问脏数据。

**这一套"模板"在干什么？** 它把网格分成了三个**互不干扰**的区域：

1. **第一列 (Col 0)**：只能从上往下走。逻辑：\`自己 + 上面\`。
2. **第一行 (Row 0)**：只能从左往右走。逻辑：\`自己 + 左边\`。
3. **核心区 (Inner Grid)**：即 \`i >= 1\` 且 \`j >= 1\` 的区域。既能从上走，也能从左走。逻辑：\`自己 + min(上面, 左边)\`。

---

### 核心思维模型：DP 状态空间的"分区治理" (Zone Partitioning)

我将解题思维拆解为 **"3+1" 步骤**，只要按这个步骤想，索引永远不会错。

#### 步骤 1：定维度 (Dimensions)

- 拿到题目先看：由谁决定？
- 由行号 \`i\` 和列号 \`j\` 决定。
- 定义 \`m = grid.length\` (高), \`n = grid[0].length\` (宽)。
- **直觉检查**：最后的答案肯定在右下角，所以返回值的索引必然是 \`[m-1][n-1]\`。

#### 步骤 2：填边缘 (The Borders) —— 也就是 Base Cases

这是规避越界的核心。

- **处理第一列 (\`j=0\`)**：
  - 为什么循环 \`i\` 从 \`1\` 开始？
  - 因为 \`grid[0][0]\` 是起点，不用动。\`grid[1][0]\` 依赖 \`grid[0][0]\`。
  - **公式**：\`grid[i][0] += grid[i-1][0]\`。
  - **潜台词**：这里没有"左边"，别试图去访问 \`j-1\`。
  
- **处理第一行 (\`i=0\`)**：
  - 为什么循环 \`j\` 从 \`1\` 开始？
  - 同理，\`grid[0][1]\` 依赖 \`grid[0][0]\`。
  - **公式**：\`grid[0][j] += grid[0][j-1]\`。
  - **潜台词**：这里没有"上面"，别试图去访问 \`i-1\`。

#### 步骤 3：填核心 (The Core) —— 也就是 Recurrence Relation

- **安全区**：现在，所有的 \`i\` 至少是 1，所有的 \`j\` 至少是 1。
- 这意味着 \`i-1\` 最小是 0，\`j-1\` 最小是 0。**绝对安全，不会越界！**
- **循环设定**：\`for (int i = 1; i < m; i++)\`, \`for (int j = 1; j < n; j++)\`。
- **公式**：\`grid[i][j] += min(grid[i-1][j], grid[i][j-1])\`。

#### 步骤 4：拿结果 (The Result)

- 我们要的是终点。
- 终点坐标是 \`(行数-1, 列数-1)\`。
- \`return grid[m-1][n-1]\`。
`
            }
        ]
    },
    {
        id: "stack-heap",
        title: "栈与堆",
        icon: "📚",
        tagClass: "bg-gradient-to-r from-indigo-500 to-violet-500",
        sections: [
            {
                id: "monotonic-stack",
                title: "单调栈",
                content: `
### 单调栈核心计算

**哨兵机制 (The Sentinel)**

\`\`\`java
for (int i = 0; i <= n; i++) {
    int h = (i == n) ? 0 : heights[i];
\`\`\`

- **技巧**：循环条件是 \`i <= n\`，比数组长度多走了 1 步。
- **目的**：当 \`i == n\` 时，我们虚拟了一个高度为 \`0\` 的柱子。
- **为什么？** 如果数组是 \`[1, 2, 3, 4, 5]\`，栈里一直进货不计算。最后加一个 \`0\`，就像推土机一样，强制让栈里剩下的所有元素都遇到"右边界"，全部弹出来计算一遍。

**核心计算 (The Calculation)**

\`\`\`java
int height = heights[stack.pop()]; // 1. 取出主角高度
int width = stack.isEmpty() ? i : i - stack.peek() - 1; // 2. 计算宽度
maxArea = Math.max(maxArea, height * width); // 3. 更新最大值
\`\`\`

- **Pop (出栈)**：拿出栈顶元素，它就是我们要计算矩形高度的那个柱子。
- **Right (右边界)**：当前的 \`i\`。因为是 \`i\` 导致了它出栈。
- **Left (左边界)**：\`stack.peek()\`。这是栈里剩下的新栈顶。因为栈是单调递增的，新栈顶一定是刚刚弹出的那个元素左边第一个比它矮的。
- **Width (宽度)**：\`Right - Left - 1\`（即 \`i - stack.peek() - 1\`）。
- **特判**：如果 \`stack.isEmpty()\`，说明刚刚弹出的那个柱子左边没有比它矮的了，它的左边界延伸到了无穷远（索引 -1），宽度直接就是 \`i\`。

> **位置和索引差1，正常都是相对位置中间有几个，相减+1是全算上**

\`\`\`java
public int largestRectangleArea(int[] heights) {
    int n = heights.length;
    Stack<Integer> stack = new Stack<>();
    int maxArea = 0;
    
    for (int i = 0; i <= n; i++) {
        int h = (i == n) ? 0 : heights[i];
        
        while (!stack.isEmpty() && heights[stack.peek()] > h) {
            int height = heights[stack.pop()];
            int width = stack.isEmpty() ? i : i - stack.peek() - 1;
            maxArea = Math.max(maxArea, height * width);
        }
        stack.push(i);
    }
    
    return maxArea;
}
\`\`\`
`
            },
            {
                id: "heap-basics",
                title: "堆的应用",
                content: `
### 堆的三种典型应用

#### 1. 直接小根堆：然后把顶的出来

找第 K 小的元素，用小根堆弹出 K-1 次。

\`\`\`java
public int findKthSmallest(int[] nums, int k) {
    PriorityQueue<Integer> minHeap = new PriorityQueue<>();
    for (int num : nums) {
        minHeap.offer(num);
    }
    for (int i = 0; i < k - 1; i++) {
        minHeap.poll();
    }
    return minHeap.peek();
}
\`\`\`

#### 2. 高频：还得先统计一下才能研究

统计就是要用哈希进行统计，然后用堆排序。

\`\`\`java
public int[] topKFrequent(int[] nums, int k) {
    // 1. 统计频率
    Map<Integer, Integer> freq = new HashMap<>();
    for (int num : nums) {
        freq.put(num, freq.getOrDefault(num, 0) + 1);
    }
    
    // 2. 用小根堆维护 top k
    PriorityQueue<Integer> heap = new PriorityQueue<>(
        (a, b) -> freq.get(a) - freq.get(b)
    );
    
    for (int num : freq.keySet()) {
        heap.offer(num);
        if (heap.size() > k) {
            heap.poll();
        }
    }
    
    // 3. 输出结果
    int[] result = new int[k];
    for (int i = 0; i < k; i++) {
        result[i] = heap.poll();
    }
    return result;
}
\`\`\`

#### 3. 中位数：入学考试机制

### 数据流的中位数

**核心机制：入学考试 (Admission Test)**

我们要维护两个堆：
- **小根堆 (minHeap)**：存放 **精英班**（较大的那一般数）。
- **大根堆 (maxHeap)**：存放 **普通班**（较小的那一半数）。

**新数入班流程**：
1. **所有新生先去普通班报道**：\`maxHeap.offer(num)\`
2. **普通班第一名去精英班参加入学考试**：\`minHeap.offer(maxHeap.poll())\`
   - *潜台词*：你是普通班最强的，去看看你在精英班能排第几？
3. **平衡人数**：如果精英班人太多了（超过普通班），把精英班最弱的踢回普通班。
   - \`if (minHeap.size() > maxHeap.size()) maxHeap.offer(minHeap.poll());\`

\`\`\`java
class MedianFinder {
    PriorityQueue<Integer> maxHeap; // 普通班 (大根堆)
    PriorityQueue<Integer> minHeap; // 精英班 (小根堆)
    
    public MedianFinder() {
        maxHeap = new PriorityQueue<>((a, b) -> b - a);
        minHeap = new PriorityQueue<>();
    }
    
    public void addNum(int num) {
        // 1. 先进普通班 (大根堆)
        maxHeap.offer(num);
        // 2. 选拔最强的去精英班 (小根堆)
        minHeap.offer(maxHeap.poll());
        
        // 3. 平衡：保证普通班人数 >= 精英班
        if (minHeap.size() > maxHeap.size()) {
            maxHeap.offer(minHeap.poll());
        }
    }
    
    public double findMedian() {
        if (maxHeap.size() > minHeap.size()) {
            return maxHeap.peek();
        }
        return (maxHeap.peek() + minHeap.peek()) / 2.0;
    }
}
\`\`\`
`
            }
        ]
    },
    {
        id: "tricks",
        title: "技巧专题",
        icon: "🛠️",
        tagClass: "bg-gradient-to-r from-teal-500 to-cyan-500",
        sections: [
            {
                id: "tricks-majority",
                title: "1. 众数（摩尔投票法）",
                content: `
### 摩尔投票法

**核心思想**：不同元素互相抵消，最后剩下的就是众数。

\`\`\`java
public int majorityElement(int[] nums) {
    int candidate = 0;
    int count = 0;
    
    for (int num : nums) {
        if (count == 0) {
            candidate = num;
        }
        count += (num == candidate) ? 1 : -1;
    }
    
    return candidate;
}
\`\`\`

> **前提条件**：众数出现次数超过 n/2。
`
            },
            {
                id: "tricks-dutch-flag",
                title: "2. 荷兰国旗问题",
                content: `
### 处理相同元素相邻（荷兰国旗问题）

将数组分成三部分：小于、等于、大于某个值。

**三指针法**：
- \`low\`：小于区域的右边界
- \`mid\`：当前遍历位置
- \`high\`：大于区域的左边界

\`\`\`java
public void sortColors(int[] nums) {
    int low = 0, mid = 0, high = nums.length - 1;
    
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums, low, mid);
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums, mid, high);
            high--;
            // 注意：mid 不动，因为换过来的元素还没检查
        }
    }
}

void swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}
\`\`\`
`
            },
            {
                id: "tricks-next-permutation",
                title: "3. 下一个排列",
                content: `
### 下一个排列

找到下一个字典序更大的排列。

**步骤**：
1. 从右往左找第一个下降的位置 \`i\`
2. 从右往左找第一个大于 \`nums[i]\` 的位置 \`j\`
3. 交换 \`nums[i]\` 和 \`nums[j]\`
4. 反转 \`i+1\` 到末尾

\`\`\`java
public void nextPermutation(int[] nums) {
    int n = nums.length;
    int i = n - 2;
    
    // 1. 找第一个下降点
    while (i >= 0 && nums[i] >= nums[i + 1]) {
        i--;
    }
    
    if (i >= 0) {
        // 2. 找第一个大于 nums[i] 的
        int j = n - 1;
        while (nums[j] <= nums[i]) {
            j--;
        }
        // 3. 交换
        swap(nums, i, j);
    }
    
    // 4. 反转后面的部分
    reverse(nums, i + 1, n - 1);
}

void swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}

void reverse(int[] nums, int left, int right) {
    while (left < right) {
        swap(nums, left++, right--);
    }
}
\`\`\`
`
            },
            {
                id: "tricks-floyd",
                title: "4. 弗洛伊德龟兔赛跑",
                content: `
### 相遇问题（弗洛伊德龟兔赛跑）

用于检测链表中的环，以及找到环的入口。

**原理**：
- 快指针每次走 2 步，慢指针每次走 1 步
- 如果有环，它们一定会相遇
- 相遇后，将一个指针移到起点，两个指针同速前进，再次相遇点就是环的入口

\`\`\`java
public ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    
    // 1. 检测是否有环
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        
        if (slow == fast) {
            // 2. 找环的入口
            ListNode ptr = head;
            while (ptr != slow) {
                ptr = ptr.next;
                slow = slow.next;
            }
            return ptr;
        }
    }
    
    return null;
}
\`\`\`

**数学证明**：
- 设起点到环入口距离为 \`a\`，环入口到相遇点距离为 \`b\`，环长为 \`c\`
- 相遇时：慢指针走了 \`a + b\`，快指针走了 \`a + b + nc\`（n 为圈数）
- 因为快指针速度是慢指针的 2 倍：\`2(a + b) = a + b + nc\`
- 所以 \`a + b = nc\`，即 \`a = nc - b = (n-1)c + (c-b)\`
- 这意味着从起点走 \`a\` 步，等于从相遇点走 \`(n-1)\` 圈再走 \`c-b\` 步，都会到达环入口
`
            }
        ]
    },
    {
        id: "graph",
        title: "图论算法",
        icon: "🕸️",
        tagClass: "bg-gradient-to-r from-fuchsia-500 to-pink-500",
        sections: [
            {
                id: "graph-bfs-rotting-oranges",
                title: "1. 腐烂的橘子 (BFS)",
                content: `
### 腐烂的橘子 (Rotting Oranges)

这是一道标准的 **多源 BFS (Breadth-First Search)** 题目。

#### 核心思维：病毒扩散模型

想象这是一个 **"丧尸围城"** 的故事。
- **腐烂橘子**：丧尸（Source）。
- **新鲜橘子**：人类（Target）。
- **空格子**：墙壁。
- **每分钟**：丧尸可以向上下左右四个方向咬人，被咬的人下一分钟也会变成丧尸。

我们要求的是：**所有人类变成丧尸需要多少分钟？**

---

### 💡 幼儿园大班解题法 (The Kindergarten Guide)

#### 1. 急诊室挂号 (The Queue)
BFS 的核心是 **队列 (Queue)**。这就好比医院的急诊室。
- 开始时，所有 **"0号病人"** (一开始就烂的橘子) 都在排队。
- 医生 (CPU) 每次看一个病人，问他："你旁边有没有健康人？有的话咬一口。"
- 被咬的人（新丧尸）拿着号，自觉去队尾排队，等着下一轮去咬别人。

#### 2. 掐表计时 (The Stopwatch) —— 关键点！
很多同学写 BFS 容易漏掉这一步：**怎么计算是第几分钟？**

你不能看一个病人就过一分钟。而是一批！
比如现在的队列里有 5 个丧尸，这 5 个是 **"同一批"** 的。
我们要把这 5 个人 **"一次性处理完"**，才算过了 1 分钟。

> **变量 \`size\` 就是那个"暂停键"**。
> 在每一轮开始时，\`int size = queue.size();\`
> 这意味着："现在的这 \`size\` 个人，是这一分钟的全部工作量。等处理完这 \`size\` 个人，我再按秒表，时间 +1。"

#### 3. 幸存者名单 (The Survivor List)
我们需要一个变量 \`freshCount\`。
- 一开始数数有多少个健康人。
- 每次有人被咬了，\`freshCount--\`。
- 最后如果 \`freshCount > 0\`，说明有幸存者躲在墙角（永远被墙隔着，咬不到），返回 -1。

---

### 代码实现 (Java)

\`\`\`java
public int orangesRotting(int[][] grid) {
    if (grid == null || grid.length == 0) return 0;
    
    int rows = grid.length;
    int cols = grid[0].length;
    
    Queue<int[]> queue = new LinkedList<>();
    int freshCount = 0;
    
    // 1. 全局扫描：找出所有 0号病人，并统计幸存者
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < cols; j++) {
            if (grid[i][j] == 2) {
                queue.offer(new int[]{i, j}); // 丧尸入队
            } else if (grid[i][j] == 1) {
                freshCount++; // 统计人类
            }
        }
    }
    
    // 如果一开始就没人类，直接 0 分钟
    if (freshCount == 0) return 0;
    
    int minutes = 0;
    int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}}; // 十字架方向（Magic Cross）
    
    // 2. BFS 开始扩散
    while (!queue.isEmpty()) {
        int size = queue.size(); // ⏳ 这里的 snapshot 很关键！
        boolean infected = false; // 标记这一轮有没有人被咬
        
        for (int i = 0; i < size; i++) {
            int[] point = queue.poll();
            int r = point[0];
            int c = point[1];
            
            for (int[] dir : dirs) { // 向四个方向咬
                int nr = r + dir[0];
                int nc = c + dir[1];
                
                // 边界检查 + 必须是新鲜橘子
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == 1) {
                    grid[nr][nc] = 2; // 咬一口，变丧尸
                    freshCount--;     // 幸存者 -1
                    queue.offer(new int[]{nr, nc}); // 新丧尸去排队
                    infected = true;
                }
            }
        }
        
        if (infected) minutes++; // 只有真的咬到人了，时间才流逝
    }
    
    // 3. 检查是否有幸存者
    return freshCount == 0 ? minutes : -1;
}
\`\`\`

#### 细节避坑：

1.  **什么时候 mins++？**
    *   有的写法是放在 \`while\` 循环最后，然后最后返回 \`mins - 1\`（因为最后一层扩散出去虽然进了队列，但没有新鲜橘子可咬了，多算了一次）。
    *   我的写法是：\`boolean infected\`。只有**确实有橘子变烂**了，才算过了一分钟。这样逻辑更符合直觉。

2.  **\`grid[nr][nc] = 2\` 什么时候标？**
    *   **一定要在入队的时候马上标！** 不要等到出队的时候再标。
    *   如果不马上标为 2，同一个新鲜橘子可能会被两个不同的丧尸"同时发现"并入队两次，导致重复计算甚至错误。
`
            },
            {
                id: "graph-course-schedule",
                title: "2. 课程表 (Course Schedule)",
                content: `
### 课程表 (Course Schedule) - 拓扑排序

欢迎来到 **代码透视眼解剖室**。

这道题是经典的 **"课程表"** 问题（拓扑排序）。别被这一大坨代码吓到，其实它就在玩一个 **"解锁闯关"** 的游戏。

---

### 第一阶段：变量选角面试 (The Casting Call) —— 幼儿园视角

#### 1. \`int[] indegree\` (门锁计数器)

* **幼儿园比喻：** 这是一个 **"拦路虎名单"**。
* \`indegree[3] = 2\` 的意思就是：想上 3 号课？门上有 **2 把锁**（也就是必须先修完 2 门前置课），你暂时进不去。
* **为什么要用 \`int\` 数组？** 因为我们只需要记"几把锁"这个数字，查得最快。

#### 2. \`List<List<Integer>> graph\` (通知单/邻接表)

* **幼儿园比喻：** 这是一个 **"通关福利表"**。
* 它的作用是记录：**"如果我上完了这门课，能帮谁解锁？"**
* 比如 \`graph.get(1)\` 里存着 \`[3, 4]\`，意思是：你一旦把 1 号课上完，就可以跑去告诉 3 号和 4 号："嘿，我不拦着你们了，你们的门锁可以减一把了！"

#### 3. \`Queue<Integer> queue\` (等待上课的队列)

* **幼儿园比喻：** **"可以上课的排队通道"**。
* 谁能进这里？只有那些 **"门锁数量为 0"**（没有前置课，或者前置课都上完了）的课程。

---

### 第二阶段：动作拆解与奇怪语法精讲 (Action & Boundaries)

#### 步骤1：建图和计算入度

\`\`\`java
for (int[] r : prerequisites) {
    graph.get(r[1]).add(r[0]); // r[1] 是先修课，r[0] 是被解锁课
    indegree[r[0]]++;          // 给被依赖的课加一把锁
}
\`\`\`

* **为什么要这么写？**
    * 题目给的数据 \`prerequisites\` 里的每一行 \`r\` 长这样：\`[想上的课, 先修课]\`。例如 \`[0, 1]\` 意思是想上 0 号课，必须先修 1 号课。
    * **这里是反直觉的！** 数组里前一个是"结果"，后一个是"条件"。

* **语法1：\`graph.get(r[1]).add(r[0])\`**
    * **翻译：** 拿出 \`r[1]\`（先修课/条件）的通知单，把 \`r[0]\`（想上的课/结果）写上去。
    * **逻辑：** 因为我们要建立"**被依赖关系**"。只有我知道"我修完 1 号课能解锁 0 号课"，等我修完 1 的时候，我才能顺藤摸瓜找到 0 去解锁它。

* **语法2：\`indegree[r[0]]++\`**
    * **翻译：** 给 \`r[0]\`（想上的课）的门上 **加一把锁**。
    * **逻辑：** 因为它依赖别人，所以它的 **入度**（In-degree，也就是拦路虎的数量）要加 1。

#### 步骤2：入度为0入队

\`\`\`java
for (int i = 0; i < numCourses; i++) 
    if (indegree[i] == 0) queue.offer(i);
\`\`\`

* **动作：** 巡视一圈所有的教室。
* **解释：** 只要发现谁的门上 **没有锁**（\`indegree == 0\`)，说明这门课完全不需要预备知识，直接拎出来，扔进 \`queue\`（可以上课的队列）。

#### 步骤3：BFS拓扑排序

\`\`\`java
while (!queue.isEmpty()) {
    count++; // 既然出队了，说明这门课修完了，毕业证书+1
    for (int next : graph.get(queue.poll())) { 
        // 核心语法：最关键的一行！
        if (--indegree[next] == 0) queue.offer(next);
    }
}
\`\`\`

* **核心语法：\`if (--indegree[next] == 0)\`**
    * 这句话包含了 **三个动作**，顺序非常重要：
        1. **开锁 (\`--\`)**：先找到依赖我的这门后续课 \`next\`，把它的门锁减掉一把（前置减 1）。
        2. **查锁 (\`indegree[...]\`)**：减完之后，马上看看现在的锁还剩几把？
        3. **判断 (\`== 0\`)**：如果锁变成了 0，说明 **这是最后一把锁**！所有的前置课都搞定了！
        4. **入队 (\`offer\`)**：既然没锁了，赶紧把它扔进"可以上课队列"，下一轮就轮到它了。

---

### 第三阶段：研究生级深度点拨 (The "Gotchas")

#### 1. 为什么最后要 \`return count == numCourses\`？

* **陷阱：** 你以为队列空了就是所有课都上完了吗？**不一定！**
* **死锁危机（环）：** 如果课程 A 依赖 B，B 又依赖 A。它俩的入度永远不会变成 0，永远进不了队列。
* **判断依据：** \`count\` 记录了我们实际能"毕业"的课程数量。如果 \`count\` 小于 \`numCourses\`（总课数），说明有课程陷在死循环里出不来，不可能修完所有课，返回 \`false\`。

---

### 💡 完整代码 (Java)

\`\`\`java
public boolean canFinish(int numCourses, int[][] prerequisites) {
    int[] indegree = new int[numCourses];
    List<List<Integer>> graph = new ArrayList<>();
    
    // 1. 初始化图
    for (int i = 0; i < numCourses; i++) {
        graph.add(new ArrayList<>());
    }
    
    // 2. 建图 + 计算入度
    for (int[] r : prerequisites) {
        graph.get(r[1]).add(r[0]);
        indegree[r[0]]++;
    }
    
    // 3. 入度为0的课入队
    Queue<Integer> queue = new LinkedList<>();
    for (int i = 0; i < numCourses; i++) {
        if (indegree[i] == 0) queue.offer(i);
    }
    
    // 4. BFS拓扑排序
    int count = 0;
    while (!queue.isEmpty()) {
        count++;
        for (int next : graph.get(queue.poll())) {
            if (--indegree[next] == 0) queue.offer(next);
        }
    }
    
    return count == numCourses;
}
\`\`\`
`
            }
        ]
    },
    {
        id: "data-structure",
        title: "数据结构",
        icon: "🧱",
        tagClass: "bg-gradient-to-r from-gray-500 to-slate-500",
        sections: [
            {
                id: "ds-trie",
                title: "1. 字典树 (Trie)",
                content: `
### Trie（字典树）的代码解剖室

欢迎来到 **Trie（字典树）的代码解剖室**。

这是一个 **非常标准、教科书级别** 的 Trie 实现。它的最大亮点在于 **抽象出了一个私有的 \`find\` 方法**，极大地简化了 \`search\` 和 \`startsWith\` 的逻辑。

我是你的架构师，现在我们把这段代码拆开揉碎，看看它是怎么运转的。

---

### 第一阶段：变量选角面试 (The Casting Call) —— 幼儿园视角

![Trie Structure](/images/trie/trie-1-struct.png)

#### 1. 内部类 \`class TrieNode\` (房间的设计图)

* **幼儿园比喻：** 这是一个 **“多啦A梦的房间”**。
* **\`TrieNode[] children = new TrieNode[26]\`**：
    * **比喻：** 房间里有 26 扇 **任意门**。
    * **含义：** 第 0 扇门通往 \`'a'\` 房间，第 1 扇门通往 \`'b'\` 房间……
    * **初始状态：** 刚建好时，门后都是虚空 (\`null\`)，只有当你 \`insert\` 时，才会真的造出下一个房间。

* **\`boolean isEnd = false\`**：
    * **比喻：** 墙上挂的 **“结业证书”**。
    * **含义：** 如果你走到这个房间，墙上有证书 (\`true\`)，说明你刚才走过的路拼成了一个完整的单词（比如 "apple"）。如果没证书 (\`false\`)，说明这里只是个过道（比如 "app" 的最后一个 'p'）。

![Trie Node Detail](/images/trie/trie-2-node.png)

#### 2. \`private TrieNode root\` (酒店大堂)

* **幼儿园比喻：** **迷宫的唯一入口**。
* **作用：** 无论你要查什么词，或者存什么词，必须从这里出发。它是一个空节点，不代表任何字符，只负责连接第一层字母（a-z）。

#### 3. \`private TrieNode find(String s)\` (最关键的幕后英雄！)

* **身份：** 它是 **“探路斥候”**。
* **核心任务：** 它的任务很简单——“老板让我找字符串 \`s\`，我就照着地图走。如果路通了，我就把终点的那个房间（Node）带回来；如果路断了，我就回报 \`null\`。”
* **为什么要把它设为 private？**
    * 它是给内部用的工具人。外部用户只需要知道“有没有这个词”（boolean），不需要直接拿到底层的 Node 对象。

---

### 第二阶段：动作拆解与边界守卫 (Action & Boundaries) —— 逻辑视角

![Trie Operations](/images/trie/trie-3-example.png)

这段代码最精彩的地方在于 \`insert\`（造路）和 \`find\`（探路）的分离。

#### 1. \`insert(String word)\` —— 造路工程队

* **逻辑：** 这里的 \`if (node.children[i] == null)\` 是核心。
* **解释：**
    * 我要往 \`'a'\` 走，门是空的？-> **\`new TrieNode()\`** (立马造个新房间接上)。
    * 我要往 \`'a'\` 走，门后面有房间？-> **复用**！直接走进去。
* **收尾：** 循环结束，人站在最后一个字符的房间里，**\`node.isEnd = true\`**。啪！盖章，表示这就单词结尾。

#### 2. \`find(String s)\` —— 探路斥候 (核心复用逻辑)

* 这是一个辅助方法，被 \`search\` 和 \`startsWith\` 共同调用。
* **红绿灯逻辑 (\`if (node.children[i] == null) return null\`)：**
    * 比如树里只有 "apple"。
    * 我要找 "boy"。
    * 刚出发，查 \`'b'\` 的门。发现是 \`null\`（路断了）。
    * **立即停止！** 返回 \`null\`。不用再找后面的 \`'o'\` 和 \`'y'\` 了，开头都没了，后面肯定没有。
* **成功返回：** 如果循环顺利跑完，说明路是通的，返回停留在最后一个字符上的 \`node\`。

#### 3. \`search(String word)\` —— 严格的查岗员

\`\`\`java
public boolean search(String word) {
    TrieNode node = find(word);
    return node != null && node.isEnd;
}
\`\`\`

* **双重校验：**
    1. **\`node != null\`**：路必须是通的。（斥候没在半路掉坑里）。
    2. **\`&& node.isEnd\`**：终点房间必须有“结业证书”。
* *例子：* 树里有 "apple"。你查 "app"。
    * \`find("app")\` 会成功返回第二个 \`p\` 的节点（路通了）。
    * 但是！那个节点的 \`isEnd\` 是 \`false\`。
    * 结果：\`true && false\` = **\`false\`**。逻辑正确！

#### 4. \`startsWith(String prefix)\` —— 宽容的前缀王

\`\`\`java
public boolean startsWith(String prefix) {
    return find(prefix) != null;
}
\`\`\`

* **单一校验：**
    * 它只在乎 **“路通不通”**。
* *例子：* 树里有 "apple"。你查 "app"。
    * \`find("app")\` 返回节点（不为 null）。
    * 结果：**\`true\`**。逻辑正确！

---

### 第三阶段：研究生级深度点拨 (The "Gotchas") —— 专家视角

#### 1. 为什么要抽象出 \`find\` 方法？ (DRY 原则)

* **新手写法：** 在 \`search\` 里写一遍 for 循环，在 \`startsWith\` 里又写一遍 for 循环。代码重复率 90%。
* **高手写法：** 发现这两个功能的 **物理路径是一模一样的**，区别只在于 **到了终点怎么判断**。所以把“走路”这个动作提取成 \`find\`，既优雅又好维护。

#### 2. 空指针防御 (NPE)

* 在 \`search\` 方法中，\`node != null && node.isEnd\` 的顺序至关重要。
* **短路运算：** 如果 \`node\` 是 \`null\`（路断了），Java 会直接返回 \`false\`，**不会**去执行 \`node.isEnd\`。
* 如果你写反了：\`node.isEnd && node != null\`，当路断的时候，程序会试图访问 \`null\` 的属性，直接崩溃报错！

#### 3. 字符计算的隐含前提

* \`int i = c - 'a';\`
* 这段代码极其依赖 **输入数据纯洁性**。它默认输入全是小写字母。
* 如果输入里混进去一个 \`'A'\`（大写），\`'A' - 'a'\` 是负数，直接数组下标越界（IndexOutOfBounds）。
* **工程建议：** 实际面试或工作中，要问清楚字符集范围。如果是全字符，通常要把 \`TrieNode[]\` 换成 \`HashMap<Character, TrieNode>\`。

---

### 💡 完整代码

\`\`\`java
class Trie {
    class TrieNode {
        TrieNode[] children = new TrieNode[26];
        boolean isEnd = false;
    }
    private TrieNode root;
    public Trie() { root = new TrieNode(); }
    
    public void insert(String word) {
        TrieNode node = root;
        for (char c : word.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) node.children[i] = new TrieNode();
            node = node.children[i];
        }
        node.isEnd = true;
    }
    
    private TrieNode find(String s) {
        TrieNode node = root;
        for (char c : s.toCharArray()) {
            int i = c - 'a';
            if (node.children[i] == null) return null;
            node = node.children[i];
        }
        return node;
    }
    
    public boolean search(String word) {
        TrieNode node = find(word);
        return node != null && node.isEnd;
    }
    
    public boolean startsWith(String prefix) {
        return find(prefix) != null;
    }
}
\`\`\`
`
            }
        ]
    },
    {
        id: "interval",
        title: "区间专题",
        icon: "📏",
        tagClass: "bg-gradient-to-r from-orange-400 to-red-500",
        sections: [
            {
                id: "interval-merge",
                title: "1. 合并区间 (Merge Intervals)",
                content: `
### 合并区间 (Merge Intervals) 代码解剖室

欢迎来到 **代码透视眼解剖室**。

我们要解剖的是经典的 “**区间合并**” 问题。在还没写代码之前，先把透视眼打开，看看这道题的 **核心思想**：

**【核心思想：贪心 + 排序】**
这道题就像是要把一堆 **“散乱的时间段”** 整理成 **“连续的会议时间”**。
如果时间段是乱序的（比如早上8点一个会，晚上8点一个会，中午10点又一个会），你很难判断谁跟谁重叠。
**一定要先做的动作：** 按 **开始时间** 排序！排好序后，重叠只可能发生在“相邻”的两个会议之间。这样我们只需要 **遍历一次** 就能搞定。

**【变量设计思路】**
我们需要几个关键角色？

1. **输入数据** (\`intervals\`)：原来的一堆乱积木。
2. **最终成品箱** (\`res\`)：因为我们不知道合完之后还剩几个积木（可能 10 个合成了 1 个，也可能还是 10 个），数组长度定死很难办，所以必须用 **动态容器**。
3. **当前手中的积木** (\`curr\`)：这是一个 **指针**。我们需要时刻盯着“现在正在处理的这个长积木”，看它能不能继续吞并下一个。

---

### 第一阶段：变量选角面试 (The Casting Call) —— 幼儿园视角

#### 1. \`List<int[]> res\` (成品收纳箱)

* **幼儿园比喻：** 这是一个 **“魔法收纳袋”**。
* **为什么要用 List 不用数组？**
    * 数组 (\`int[][]\`) 就像是个 **固定格子的鸡蛋盒**。一开始你就得决定买几号的盒子。但这里我们可能合并很多，也可能不合并，**长度无法预测**。
    * \`ArrayList\` 是魔法袋，放多少东西它就自动撑多大，不用担心溢出或浪费空间。
* **初始化的讲究：** \`new ArrayList<>()\` 此时袋子是空的，准备往里装整理好的积木。

#### 2. \`int[] curr\` (手中的橡皮泥)

* **幼儿园比喻：** 这是你手里 **“正在捏的那条长长的橡皮泥”**。
* **核心作用（引用传递的奥秘）：**
    * 请注意代码里有一句 \`res.add(curr)\`。这意思是把 \`curr\` 放进袋子了吗？**不！** 是在袋子里登记了 \`curr\` 的 **地址**。
    * **高能预警：** 当你在循环里修改 \`curr[1]\`（把橡皮泥拉长）时，**收纳袋 \`res\` 里登记的那个东西也会跟着变长！** 因为它们指向的是同一块内存。这是这道题最省事的写法。

---

### 第二阶段：动作拆解与边界守卫 (Action & Boundaries) —— 逻辑视角

#### 0. 预处理：\`Arrays.sort(...)\` (排排坐)

* **逻辑：** 按照每个区间的 **左端点（开始时间）** 从小到大排序。
* **为什么要写 lambda \`(a, b) -> Integer.compare(a[0], b[0])\`？**
    * 告诉计算机：别管结束时间，只看 **开始时间**。谁开始得早，谁排前面。如果不排序，后面的逻辑全崩。

#### 1. \`if (curr[1] >= interval[0])\` (能连上吗？)

* **场景：** 你手里的橡皮泥 (\`curr\`) 结束时间是 10点，下一个积木 (\`interval\`) 开始时间是 9点。
* **判断：** 10点 >= 9点，说明 **有重叠**（或者刚好接上）。
* **动作：** \`curr[1] = Math.max(curr[1], interval[1])\`
* **为什么要取 Max？**
    * 情况A：手里的 [1, 10]，新来的 [2, 5]。包含关系，结束时间还是 10。
    * 情况B：手里的 [1, 10]，新来的 [9, 12]。延长关系，结束时间变成 12。
    * 所以我们要取 **两者中拖得最晚的时间** 作为新的结束点。这就是 **“贪心”**，尽可能把当前的区间撑得更长。

#### 2. \`else\` (断开了！)

* **场景：** 手里的橡皮泥 (\`curr\`) 结束时间是 10点，下一个积木 (\`interval\`) 开始时间是 12点。
* **判断：** 够不着了，中间有空隙。
* **动作：**
    1. \`curr = interval;\` —— **换手！** 旧的那条橡皮泥已经完工了（因为它已经在 \`res\` 里了，不用再 add 一遍旧的），现在把手伸向这个新的积木，把它当成新的“当前橡皮泥”。
    2. \`res.add(curr);\` —— **登记！** 赶紧把这个新积木登记到成品箱里。注意，这里是把新积木放进去，如果下一轮循环它还能合并，**箱子里的它也会自动变长**（再次利用引用的特性）。

---

### 第三阶段：研究生级深度点拨 (The "Gotchas") —— 专家视角

#### 1. 为什么不用最后再 add？

* 代码里一开始就 \`res.add(curr)\`，然后在 \`else\` 里又 \`res.add(curr)\`。
* **专家解析：** 这是一种 **“在线处理” (On-the-fly)** 模式。
    * 传统的写法可能是：算完了再 add。
    * 现在的写法是：**先占坑，后修改**。只要 \`curr\` 还在引用链上，我们就直接修改 \`curr\` 的内容（修改右边界），\`res\` 里存的那个对象自然就跟着变了。一旦断开，\`curr\` 指向新对象，再把新对象入库。这种写法代码极短，但对“引用”的理解要求很高。

#### 2. 也是最让你困惑的：\`return res.toArray(new int[res.size()][]);\`

* **问题：** 题目要求返回 \`int[][]\`（二维数组），但我们用的是 \`List<int[]>\`。怎么转？
* **解剖这行代码：**
    * \`res.toArray(...)\`: 这是 List 自带的方法，把列表变成数组。
    * \`new int[res.size()][]\`: 这是一个 **模板**。
        * Java 的泛型在运行时会被擦除，\`toArray()\`如果不传参数，它只能返回 \`Object[]\`，这会报错。
        * 你需要给它一个 **“样板数组”** 告诉它类型。
        * \`res.size()\`: 告诉它行数（有多少个区间）。
        * 第二个 \`[]\` 为空: 告诉它列数你自己看着办（其实就是引用原来的 int[]，不用重新分配内存）。
* **通俗比喻：**
    * 收银员（List）手里有一叠账单。
    * 老板（题目要求）只要一本装订好的账本（Array）。
    * 这句话就是：**“嘿 Java，给我拿个跟这叠账单一样厚的空本子 (\`new int[res.size()][]\`)，把账单填进去给我。”**

#### 3. 初始化的边界坑

* \`if (intervals.length <= 1) return intervals;\`
* 这行代码是 **保命符**。如果数组是空的，或者只有一个区间，根本不需要合并。
* 如果不写这行，后面的 \`intervals[0]\` 直接会抛出 \`ArrayIndexOutOfBoundsException\`（空数组里取第一个元素，报错）。

---

### 💡 完整代码 (Java)

\`\`\`java
public int[][] merge(int[][] intervals) {
    if (intervals.length <= 1) return intervals;

    // 1. 按左端点排序
    Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));

    List<int[]> res = new ArrayList<>();
    int[] curr = intervals[0];
    res.add(curr); // 先把第一个放进去占坑

    for (int[] interval : intervals) {
        // 2. 如果能合并（有重叠）
        if (curr[1] >= interval[0]) {
            // 贪心：谁结束得晚听谁的
            curr[1] = Math.max(curr[1], interval[1]);
            // 注意：因为 curr 已经在 res 里了，这里改 curr，res 里的也会变
        } else {
            // 3. 断开了，换下一个
            curr = interval;
            res.add(curr);
        }
    }

    return res.toArray(new int[res.size()][]);
}
\`\`\`
`
            },
            {
                id: "interval-first-missing-positive",
                title: "2. 缺失的第一个正数 (First Missing Positive)",
                content: `
### 缺失的第一个正数 (First Missing Positive)

这道题是经典的 **"循环排序/原地哈希"** 技巧。核心在于：把数组本身当成一个 **"隐形哈希表"**，让每个数回到它应该去的位置。

---

### 三个条件的含义 (三重守卫)

\`\`\`java
while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i])
\`\`\`

* **条件1: \`nums[i] > 0\`** → 负数和 0 对我们没用，直接跳过。
* **条件2: \`nums[i] <= n\`** → 如果数字大于 \`n\`，它肯定不是答案。
* **条件3: \`nums[nums[i] - 1] != nums[i]\`** → 如果目标位置已经有个跟你一模一样的人了，就别换了，避免死循环。

---

### 💡 完整代码 (Java)

\`\`\`java
public int firstMissingPositive(int[] nums) {
    int n = nums.length;
    for (int i = 0; i < n; i++) {
        while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {
            int correctPos = nums[i] - 1;
            swap(nums, i, correctPos);
        }
    }
    for (int i = 0; i < n; i++) {
        if (nums[i] != i + 1) return i + 1;
    }
    return n + 1;
}

private void swap(int[] nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}
\`\`\`
`
            },
            {
                id: "interval-product-except-self",
                title: "3. 除自身以外数组的乘积 (Product Except Self)",
                content: `
### 除自身以外数组的乘积 (Product of Array Except Self)

这道题的核心：对于每一个数字 \`i\`，它的结果就是：
**（它左边所有数的乘积） × （它右边所有数的乘积）**。

---

### 变量角色

#### 1. \`int[] answer\` (变身记分牌)

* **上半场：** 它扮演"左边积数组"。\`answer[i]\` 存的是第 \`i\` 个小朋友 **左边所有人** 乘起来是多少。
* **下半场：** 它变身"最终结果"。我们将把"右边的积"乘进去。

#### 2. \`int R\` (流动的扫描仪)

* 这是一个 **"右边积累加器"**。我们在第二遍从右往左走的时候，用它累积右边的乘积。

---

### 💡 完整代码 (Java)

\`\`\`java
public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] answer = new int[n];
    
    // 1. 算左边积
    answer[0] = 1;
    for (int i = 1; i < n; i++) {
        answer[i] = nums[i - 1] * answer[i - 1];
    }
    
    // 2. 乘右边积
    int R = 1;
    for (int i = n - 1; i >= 0; i--) {
        answer[i] = answer[i] * R;
        R *= nums[i];
    }
    
    return answer;
}
\`\`\`
`
            },
            {
                id: "interval-rotate-matrix",
                title: "4. 旋转矩阵 (Rotate Matrix)",
                content: `
### 旋转矩阵 (Rotate Matrix)

这道题要求将矩阵顺时针旋转 90 度。最优雅的解法是 **两步变换**：

1. **转置 (Transpose)**：沿对角线交换元素
2. **反射 (Reflect)**：每行左右翻转

![Symmetric Swap Logic](/images/spiral/symmetric-swap.png)

---

### 第一步：转置 (Transpose)

\`\`\`java
for (int i = 0; i < n; i++) {
    for (int j = i + 1; j < n; j++) { // 注意：j 从 i+1 开始
        int temp = matrix[i][j];
        matrix[i][j] = matrix[j][i];
        matrix[j][i] = temp;
    }
}
\`\`\`

* **为什么 \`j\` 从 \`i+1\` 开始？**
    * 因为我们只需要交换对角线 **上方** 的元素。
    * 如果 \`j\` 从 0 开始，就会把元素交换两次，相当于没有交换。

### 第二步：反射 (Reflect)

\`\`\`java
for (int i = 0; i < n; i++) {
    for (int j = 0; j < n / 2; j++) { // 只需要到中点
        int temp = matrix[i][j];
        matrix[i][j] = matrix[i][n - 1 - j];
        matrix[i][n - 1 - j] = temp;
    }
}
\`\`\`

* **为什么 \`j < n/2\`？**
    * 因为我们是 **对称交换**，左手 (\`j\`) 和右手 (\`n-1-j\`) 同时移动。
    * 如果超过中点，就会把元素又换回来了。
    * 见上面图示：\`j\` (左手) 和 \`n-1-j\` (右手) 在镜像线 (n/2) 两侧对称移动。

---

### 💡 完整代码 (Java)

\`\`\`java
public void rotate(int[][] matrix) {
    int n = matrix.length;
    
    // 1. 转置 (Transpose)
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[j][i];
            matrix[j][i] = temp;
        }
    }
    
    // 2. 反射 (Reflect)
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n / 2; j++) {
            int temp = matrix[i][j];
            matrix[i][j] = matrix[i][n - 1 - j];
            matrix[i][n - 1 - j] = temp;
        }
    }
}
\`\`\`
`
            },
            {
                id: "interval-spiral-matrix",
                title: "5. 螺旋矩阵 (Spiral Matrix)",
                content: `
### 螺旋矩阵 (Spiral Matrix)

这道题最容易写出Bug的地方是：**"交叉角怎么处理"**（比如四个角会不会重复走？会不会撞车？）

核心心法：**"吃完一层，拆一面墙"**。

---

### 四面会移动的墙

* \`top\`：天花板
* \`bottom\`：地板  
* \`left\`：左墙
* \`right\`：右墙

**核心逻辑：** 天花板爬完一行就塌下来(\`top++\`)，右墙爬完一列就左移(\`right--\`)，直到房间塌了。

---

### 关键：向左/向上的 \`if\` 守卫

\`\`\`java
// 3. 向左走 (关键if)
if (top <= bottom) {
    for (int j = right; j >= left; j--) res.add(matrix[bottom][j]);
    bottom--;
}

// 4. 向上走 (关键if)  
if (left <= right) {
    for (int i = bottom; i >= top; i--) res.add(matrix[i][left]);
    left++;
}
\`\`\`

这两个 \`if\` 是 **防"回头草"的**。如果天花板和地板已经重合，说明这一行已经被 Step 1 吃掉了，Step 3 必须闭嘴。

---

### 💡 完整代码 (Java)

\`\`\`java
public List<Integer> spiralOrder(int[][] matrix) {
    List<Integer> res = new ArrayList<>();
    if (matrix == null || matrix.length == 0) return res;
    
    int top = 0, bottom = matrix.length - 1;
    int left = 0, right = matrix[0].length - 1;
    
    while (top <= bottom && left <= right) {
        // 1. 向右走
        for (int j = left; j <= right; j++) res.add(matrix[top][j]);
        top++;
        
        // 2. 向下走
        for (int i = top; i <= bottom; i++) res.add(matrix[i][right]);
        right--;
        
        // 3. 向左走 (关键if)
        if (top <= bottom) {
            for (int j = right; j >= left; j--) res.add(matrix[bottom][j]);
            bottom--;
        }
        
        // 4. 向上走 (关键if)
        if (left <= right) {
            for (int i = bottom; i >= top; i--) res.add(matrix[i][left]);
            left++;
        }
    }
    
    return res;
}
\`\`\`
`
            }
        ]
    },
    bilibiliProjectData
];

export function getCategoryById(id: string): Category | undefined {
    return algorithmData.find(cat => cat.id === id);
}

export function getSectionById(categoryId: string, sectionId: string): Section | undefined {
    const category = getCategoryById(categoryId);
    return category?.sections.find(sec => sec.id === sectionId);
}
