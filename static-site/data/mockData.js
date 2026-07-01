const mockData = {
    categories: [
        { id: 1, name: '计算机', parentId: 0, children: [
            { id: 4, name: '编程语言', parentId: 1 },
            { id: 5, name: '数据结构与算法', parentId: 1 },
            { id: 6, name: '数据库', parentId: 1 }
        ]},
        { id: 2, name: '数学', parentId: 0, children: [
            { id: 7, name: '线性代数', parentId: 2 },
            { id: 8, name: '概率论', parentId: 2 }
        ]},
        { id: 3, name: '英语', parentId: 0, children: [] }
    ],
    
    tags: [
        { id: 1, name: 'Vue', color: '#409eff' },
        { id: 2, name: 'Java', color: '#67c23a' },
        { id: 3, name: '算法', color: '#e6a23c' },
        { id: 4, name: '数据库', color: '#f56c6c' },
        { id: 5, name: '学习笔记', color: '#909399' },
        { id: 6, name: '面试', color: '#d3adf7' }
    ],
    
    knowledge: [
        {
            id: 1,
            title: 'Vue 3 Composition API 入门',
            summary: 'Composition API 是 Vue 3 引入的一套基于函数的 API，相比 Options API，它提供了更好的代码组织和逻辑复用能力。',
            content: '# Vue 3 Composition API 入门\n\n## 什么是 Composition API\n\nComposition API 是 Vue 3 引入的一套基于函数的 API，相比 Options API，它提供了更好的代码组织和逻辑复用能力。\n\n## 核心概念\n\n### ref 和 reactive\n\n```javascript\nimport { ref, reactive } from \'vue\'\n\n// ref 用于基本类型\nconst count = ref(0)\nconsole.log(count.value) // 0\n\n// reactive 用于对象\nconst state = reactive({\n  name: \'John\',\n  age: 30\n})\nconsole.log(state.name) // John\n```\n\n### computed\n\n```javascript\nimport { computed } from \'vue\'\n\nconst doubled = computed(() => count.value * 2)\n```\n\n### watch\n\n```javascript\nimport { watch } from \'vue\'\n\nwatch(count, (newVal, oldVal) => {\n  console.log(`count changed from ${oldVal} to ${newVal}`)\n})\n```\n\n## 优势\n\n1. **更好的代码组织** - 相关逻辑可以放在一起\n2. **更好的逻辑复用** - 通过组合函数复用逻辑\n3. **更好的类型推断** - 对 TypeScript 更友好\n\n## 总结\n\nComposition API 为 Vue 开发者提供了更灵活的代码组织方式，特别适合大型项目和需要复用逻辑的场景。',
            categoryId: 4,
            tagIds: [1, 5],
            createTime: '2024-01-15T10:30:00',
            updateTime: '2024-01-15T10:30:00'
        },
        {
            id: 2,
            title: 'Java 多线程编程指南',
            summary: '多线程是 Java 中重要的并发编程概念，掌握多线程可以显著提升程序性能。本文介绍线程的创建、同步机制和常用并发工具类。',
            content: '# Java 多线程编程指南\n\n## 什么是线程\n\n线程是程序执行的最小单元，一个进程可以包含多个线程。多线程可以同时执行多个任务，提高程序的并发性。\n\n## 创建线程\n\n### 方式一：继承 Thread 类\n\n```java\nclass MyThread extends Thread {\n    @Override\n    public void run() {\n        System.out.println(\"Thread running\");\n    }\n}\n\nMyThread thread = new MyThread();\nthread.start();\n```\n\n### 方式二：实现 Runnable 接口\n\n```java\nclass MyRunnable implements Runnable {\n    @Override\n    public void run() {\n        System.out.println(\"Runnable running\");\n    }\n}\n\nThread thread = new Thread(new MyRunnable());\nthread.start();\n```\n\n### 方式三：使用 Callable 和 Future\n\n```java\nCallable<Integer> task = () -> {\n    return 42;\n};\n\nExecutorService executor = Executors.newSingleThreadExecutor();\nFuture<Integer> future = executor.submit(task);\nInteger result = future.get();\n```\n\n## 线程同步\n\n### synchronized 关键字\n\n```java\npublic synchronized void increment() {\n    count++;\n}\n```\n\n### Lock 接口\n\n```java\nLock lock = new ReentrantLock();\nlock.lock();\ntry {\n    count++;\n} finally {\n    lock.unlock();\n}\n```\n\n## 常用并发工具\n\n- `ExecutorService` - 线程池\n- `CountDownLatch` - 计数器\n- `CyclicBarrier` - 循环屏障\n- `Semaphore` - 信号量\n- `ConcurrentHashMap` - 并发集合',
            categoryId: 4,
            tagIds: [2, 5],
            createTime: '2024-01-14T14:20:00',
            updateTime: '2024-01-14T14:20:00'
        },
        {
            id: 3,
            title: '快速排序算法详解',
            summary: '快速排序是一种高效的排序算法，平均时间复杂度为 O(n log n)。本文详细讲解快速排序的原理、实现和优化策略。',
            content: '# 快速排序算法详解\n\n## 算法原理\n\n快速排序采用分治策略，通过选择一个基准元素，将数组分成两部分，使得左边的元素都小于基准，右边的元素都大于基准，然后递归排序左右两部分。\n\n## 实现步骤\n\n1. 选择基准元素（通常选第一个或最后一个）\n2. 分区：将数组分为两部分\n3. 递归排序左右子数组\n\n## 代码实现\n\n```javascript\nfunction quickSort(arr) {\n    if (arr.length <= 1) return arr;\n    \n    const pivot = arr[0];\n    const left = [];\n    const right = [];\n    \n    for (let i = 1; i < arr.length; i++) {\n        if (arr[i] < pivot) {\n            left.push(arr[i]);\n        } else {\n            right.push(arr[i]);\n        }\n    }\n    \n    return [...quickSort(left), pivot, ...quickSort(right)];\n}\n```\n\n## 时间复杂度\n\n| 情况 | 复杂度 |\n|------|--------|\n| 最好 | O(n log n) |\n| 平均 | O(n log n) |\n| 最坏 | O(n^2) |\n\n## 优化策略\n\n1. **随机选择基准** - 避免最坏情况\n2. **三数取中** - 选择第一个、中间、最后一个的中位数\n3. **尾递归优化** - 减少递归调用栈\n4. **小数组改用插入排序** - 对于小数组，插入排序更快',
            categoryId: 5,
            tagIds: [3, 6],
            createTime: '2024-01-13T09:45:00',
            updateTime: '2024-01-13T09:45:00'
        },
        {
            id: 4,
            title: 'MySQL 索引优化指南',
            summary: '索引是提高数据库查询性能的关键。本文介绍 MySQL 索引的原理、类型和优化策略，帮助你写出高效的 SQL 查询。',
            content: '# MySQL 索引优化指南\n\n## 什么是索引\n\n索引是数据库中用于加速数据查找的数据结构，类似于书籍的目录。合理使用索引可以显著提高查询性能。\n\n## 索引类型\n\n### B-Tree 索引\n\nB-Tree 是 MySQL 默认的索引类型，支持范围查询和排序。\n\n### Hash 索引\n\nHash 索引只支持等值查询，不支持范围查询。\n\n### Full-text 索引\n\n全文索引用于全文搜索。\n\n## 创建索引\n\n```sql\n-- 创建普通索引\nCREATE INDEX idx_name ON users(name);\n\n-- 创建唯一索引\nCREATE UNIQUE INDEX idx_email ON users(email);\n\n-- 创建复合索引\nCREATE INDEX idx_name_age ON users(name, age);\n```\n\n## 索引优化策略\n\n### 1. 最左前缀原则\n\n复合索引遵循最左前缀原则，查询条件必须从最左边的列开始。\n\n### 2. 避免索引失效\n\n- 避免在索引列上使用函数\n- 避免使用 != 或 <> 操作符\n- 避免使用 LIKE \'%xxx%\'\n- 避免类型转换\n\n### 3. 覆盖索引\n\n如果查询只需要索引列，可以避免回表查询。\n\n## 查看索引使用情况\n\n```sql\nEXPLAIN SELECT * FROM users WHERE name = \'John\';\n```\n\n## 总结\n\n合理使用索引可以极大提升查询性能，但过多的索引会降低写操作性能，需要权衡。',
            categoryId: 6,
            tagIds: [4, 6],
            createTime: '2024-01-12T16:00:00',
            updateTime: '2024-01-12T16:00:00'
        },
        {
            id: 5,
            title: 'Git 常用命令总结',
            summary: 'Git 是目前最流行的版本控制系统。本文总结了日常开发中最常用的 Git 命令，帮助你高效管理代码版本。',
            content: '# Git 常用命令总结\n\n## 基础命令\n\n### 初始化仓库\n\n```bash\ngit init\ngit clone <url>\n```\n\n### 查看状态\n\n```bash\ngit status\ngit log\ngit log --oneline\ngit log --graph\n```\n\n## 工作流\n\n### 添加和提交\n\n```bash\ngit add .\ngit commit -m \"commit message\"\ngit commit -am \"commit message\"\n```\n\n### 分支操作\n\n```bash\ngit branch\ngit branch <name>\ngit checkout <name>\ngit checkout -b <name>\ngit merge <name>\ngit branch -d <name>\n```\n\n### 远程操作\n\n```bash\ngit remote add origin <url>\ngit push -u origin main\ngit pull\ngit fetch\n```\n\n## 高级技巧\n\n### 撤销操作\n\n```bash\ngit checkout -- <file>\ngit reset HEAD <file>\ngit revert <commit>\ngit reset --hard <commit>\n```\n\n### 暂存\n\n```bash\ngit stash\ngit stash list\ngit stash apply\ngit stash pop\ngit stash drop\n```\n\n### 标签\n\n```bash\ngit tag <tag-name>\ngit tag -a <tag-name> -m \"tag message\"\ngit push origin <tag-name>\n```\n\n## 总结\n\n掌握这些常用命令可以应对大部分日常开发场景，建议多加练习形成肌肉记忆。',
            categoryId: 4,
            tagIds: [5],
            createTime: '2024-01-11T11:30:00',
            updateTime: '2024-01-11T11:30:00'
        },
        {
            id: 6,
            title: '线性代数基础知识',
            summary: '线性代数是计算机科学和机器学习的数学基础。本文介绍向量、矩阵、行列式等核心概念。',
            content: '# 线性代数基础知识\n\n## 向量\n\n### 向量表示\n\n向量可以表示为一个有序数组：\n\n```\nv = [v1, v2, v3]\n```\n\n### 向量运算\n\n**加法：**\n```\nu + v = [u1+v1, u2+v2, u3+v3]\n```\n\n**数乘：**\n```\nkv = [kv1, kv2, kv3]\n```\n\n**点积：**\n```\nu · v = u1v1 + u2v2 + u3v3\n```\n\n## 矩阵\n\n### 矩阵表示\n\n```\nA = [[a11, a12],\n     [a21, a22]]\n```\n\n### 矩阵运算\n\n**加法：** 对应元素相加\n**乘法：** 行乘列求和\n\n## 行列式\n\n### 2x2 行列式\n\n```\ndet(A) = a11*a22 - a12*a21\n```\n\n### 3x3 行列式\n\n```\ndet(A) = a11(a22a33 - a23a32) - a12(a21a33 - a23a31) + a13(a21a32 - a22a31)\n```\n\n## 特征值和特征向量\n\n```\nAv = λv\n```\n\n其中 λ 是特征值，v 是特征向量。\n\n## 应用场景\n\n- 机器学习中的数据变换\n- 计算机图形学中的旋转和平移\n- 数据压缩中的 PCA 算法',
            categoryId: 7,
            tagIds: [5],
            createTime: '2024-01-10T14:00:00',
            updateTime: '2024-01-10T14:00:00'
        },
        {
            id: 7,
            title: 'HTTP 请求方法详解',
            summary: 'HTTP 协议定义了多种请求方法，每种方法有不同的语义。本文详细介绍 GET、POST、PUT、DELETE 等常用方法的区别和使用场景。',
            content: '# HTTP 请求方法详解\n\n## 常用请求方法\n\n### GET\n\nGET 用于获取资源，不应该产生副作用。\n\n**特点：**\n- 请求参数放在 URL 中\n- 有长度限制\n- 可以被缓存\n- 可以被书签收藏\n\n```bash\nGET /users?id=1 HTTP/1.1\nHost: example.com\n```\n\n### POST\n\nPOST 用于创建资源或提交数据。\n\n**特点：**\n- 请求参数放在请求体中\n- 无长度限制\n- 不应该被缓存\n\n```bash\nPOST /users HTTP/1.1\nHost: example.com\nContent-Type: application/json\n\n{\"name\": \"John\", \"age\": 30}\n```\n\n### PUT\n\nPUT 用于更新资源，应该是幂等的。\n\n**特点：**\n- 更新整个资源\n- 幂等操作\n\n```bash\nPUT /users/1 HTTP/1.1\nHost: example.com\nContent-Type: application/json\n\n{\"name\": \"John\", \"age\": 31}\n```\n\n### DELETE\n\nDELETE 用于删除资源，应该是幂等的。\n\n```bash\nDELETE /users/1 HTTP/1.1\nHost: example.com\n```\n\n### PATCH\n\nPATCH 用于部分更新资源。\n\n```bash\nPATCH /users/1 HTTP/1.1\nHost: example.com\nContent-Type: application/json\n\n{\"age\": 31}\n```\n\n## 方法对比\n\n| 方法 | 用途 | 幂等 | 可缓存 |\n|------|------|------|--------|\n| GET | 获取资源 | 是 | 是 |\n| POST | 创建资源 | 否 | 否 |\n| PUT | 更新资源 | 是 | 否 |\n| DELETE | 删除资源 | 是 | 否 |\n| PATCH | 部分更新 | 否 | 否 |\n\n## 注意事项\n\n- 避免使用 GET 进行有副作用的操作\n- POST 不保证幂等，需要注意重复提交问题\n- PUT 和 DELETE 应该实现为幂等操作',
            categoryId: 4,
            tagIds: [5],
            createTime: '2024-01-09T10:15:00',
            updateTime: '2024-01-09T10:15:00'
        },
        {
            id: 8,
            title: 'CSS Flexbox 布局指南',
            summary: 'Flexbox 是 CSS3 引入的弹性布局模型，可以轻松实现各种复杂的布局。本文介绍 Flexbox 的核心概念和常用属性。',
            content: '# CSS Flexbox 布局指南\n\n## 什么是 Flexbox\n\nFlexbox（弹性盒子）是 CSS3 引入的一种布局模式，可以轻松实现各种复杂的布局，特别是在响应式设计中非常有用。\n\n## 基本概念\n\n### Flex Container\n\n设置 `display: flex` 的元素称为 Flex 容器。\n\n### Flex Items\n\n容器的直接子元素称为 Flex 项目。\n\n## 容器属性\n\n### flex-direction\n\n决定主轴方向：\n\n```css\n.container {\n  flex-direction: row;     /* 默认，水平方向 */\n  flex-direction: row-reverse;\n  flex-direction: column;  /* 垂直方向 */\n  flex-direction: column-reverse;\n}\n```\n\n### justify-content\n\n控制主轴方向上的对齐方式：\n\n```css\n.container {\n  justify-content: flex-start;  /* 默认，左对齐 */\n  justify-content: flex-end;    /* 右对齐 */\n  justify-content: center;      /* 居中 */\n  justify-content: space-between; /* 两端对齐 */\n  justify-content: space-around;  /* 均匀分布 */\n}\n```\n\n### align-items\n\n控制交叉轴方向上的对齐方式：\n\n```css\n.container {\n  align-items: flex-start;\n  align-items: flex-end;\n  align-items: center;\n  align-items: stretch;  /* 默认，拉伸 */\n  align-items: baseline; /* 基线对齐 */\n}\n```\n\n### flex-wrap\n\n控制是否换行：\n\n```css\n.container {\n  flex-wrap: nowrap;  /* 默认，不换行 */\n  flex-wrap: wrap;    /* 换行 */\n  flex-wrap: wrap-reverse;\n}\n```\n\n## 项目属性\n\n### flex-grow\n\n项目的放大比例：\n\n```css\n.item {\n  flex-grow: 1;  /* 等分剩余空间 */\n}\n```\n\n### flex-shrink\n\n项目的缩小比例：\n\n```css\n.item {\n  flex-shrink: 0;  /* 不缩小 */\n}\n```\n\n### flex-basis\n\n项目的初始大小：\n\n```css\n.item {\n  flex-basis: 200px;\n}\n```\n\n## 常用布局示例\n\n### 居中布局\n\n```css\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n```\n\n### 两端对齐\n\n```css\n.container {\n  display: flex;\n  justify-content: space-between;\n}\n```\n\n## 总结\n\nFlexbox 是现代 CSS 布局的基础，掌握它可以轻松实现各种复杂布局，大大提高开发效率。',
            categoryId: 4,
            tagIds: [5],
            createTime: '2024-01-08T15:30:00',
            updateTime: '2024-01-08T15:30:00'
        }
    ]
};
