<template>
  <div class="help-container">
    <el-page-header @back="$router.push('/home')">
      <template #title>
        <span>返回</span>
      </template>
      <template #content>
        <span class="page-title">帮助指南</span>
      </template>
    </el-page-header>

    <div class="help-content">
      <el-tabs v-model="activeTab" class="help-tabs">
        <!-- 使用指南 -->
        <el-tab-pane label="使用指南" name="guide">
          <div class="guide-section">
            <h2>欢迎使用智识笔记</h2>
            <p class="intro">智识笔记是一款面向学生群体的个人知识库管理系统，帮助您高效构建个人知识体系。</p>
            
            <el-card class="guide-card">
              <template #header>
                <div class="guide-header">
                  <el-icon size="20"><Document /></el-icon>
                  <span>1. 如何创建知识点？</span>
                </div>
              </template>
              <div class="guide-content">
                <p>方式一：手动创建</p>
                <ol>
                  <li>点击左侧导航栏的"新建知识点"按钮</li>
                  <li>填写知识点标题和内容（支持 Markdown 格式）</li>
                  <li>选择或创建分类和标签</li>
                  <li>点击"创建知识点"保存</li>
                </ol>
                <p>方式二：AI 智能导入</p>
                <ol>
                  <li>点击"导入文件"进入导入页面</li>
                  <li>上传 PDF、Word、TXT 或图片文件</li>
                  <li>AI 自动提取知识点</li>
                  <li>校正后保存为知识点</li>
                </ol>
              </div>
            </el-card>
            
            <el-card class="guide-card">
              <template #header>
                <div class="guide-header">
                  <el-icon size="20"><Folder /></el-icon>
                  <span>2. 如何管理分类和标签？</span>
                </div>
              </template>
              <div class="guide-content">
                <p>分类管理：</p>
                <ol>
                  <li>在左侧导航栏可以查看和选择分类</li>
                  <li>进入"分类管理"页面可以创建、编辑、删除分类</li>
                  <li>支持多层级分类结构</li>
                </ol>
                <p>标签管理：</p>
                <ol>
                  <li>进入"标签管理"页面</li>
                  <li>可以创建自定义颜色的标签</li>
                  <li>每个知识点可以添加多个标签</li>
                </ol>
              </div>
            </el-card>
            
            <el-card class="guide-card">
              <template #header>
                <div class="guide-header">
                  <el-icon size="20"><DataLine /></el-icon>
                  <span>3. 如何使用知识图谱？</span>
                </div>
              </template>
              <div class="guide-content">
                <ol>
                  <li>进入"知识图谱"页面查看知识关联</li>
                  <li>点击"添加节点"创建新的分类或知识点节点</li>
                  <li>点击"添加连线"建立知识点之间的关联</li>
                  <li>支持拖拽调整节点位置</li>
                  <li>点击节点可以跳转到对应的知识点详情</li>
                </ol>
              </div>
            </el-card>
            
            <el-card class="guide-card">
              <template #header>
                <div class="guide-header">
                  <el-icon size="20"><Search /></el-icon>
                  <span>4. 如何搜索知识点？</span>
                </div>
              </template>
              <div class="guide-content">
                <ol>
                  <li>在顶部搜索框输入关键词</li>
                  <li>支持按分类、标签、时间范围筛选</li>
                  <li>搜索结果会高亮显示关键词</li>
                  <li>点击结果可查看知识点详情</li>
                </ol>
              </div>
            </el-card>
          </div>
        </el-tab-pane>

        <!-- Markdown 教程 -->
        <el-tab-pane label="Markdown 教程" name="markdown">
          <div class="markdown-guide">
            <h2>Markdown 语法指南</h2>
            <p>智识笔记支持完整的 Markdown 语法，以下是常用语法说明：</p>
            
            <el-card class="syntax-card">
              <template #header>标题</template>
              <div class="syntax-content">
                <pre># 一级标题
## 二级标题
### 三级标题</pre>
              </div>
            </el-card>
            
            <el-card class="syntax-card">
              <template #header>加粗和斜体</template>
              <div class="syntax-content">
                <pre>**加粗文本**
*斜体文本*
***加粗斜体***</pre>
              </div>
            </el-card>
            
            <el-card class="syntax-card">
              <template #header>列表</template>
              <div class="syntax-content">
                <pre>- 无序列表项
- 另一个列表项

1. 有序列表项
2. 第二个列表项</pre>
              </div>
            </el-card>
            
            <el-card class="syntax-card">
              <template #header>链接和图片</template>
              <div class="syntax-content">
                <pre>[链接文字](URL)
![图片描述](图片URL)</pre>
              </div>
            </el-card>
            
            <el-card class="syntax-card">
              <template #header>代码块</template>
              <div class="syntax-content">
                <pre>```javascript
function hello() {
  console.log('Hello, World!');
}
```</pre>
              </div>
            </el-card>
            
            <el-card class="syntax-card">
              <template #header>引用和分割线</template>
              <div class="syntax-content">
                <pre>> 引用文本

---</pre>
              </div>
            </el-card>
            
            <el-card class="syntax-card">
              <template #header>表格</template>
              <div class="syntax-content">
                <pre>| 列1 | 列2 | 列3 |
| --- | --- | --- |
| 内容1 | 内容2 | 内容3 |</pre>
              </div>
            </el-card>
          </div>
        </el-tab-pane>

        <!-- FAQ -->
        <el-tab-pane label="常见问题" name="faq">
          <div class="faq-section">
            <h2>常见问题</h2>
            
            <el-collapse>
              <el-collapse-item title="支持哪些文件格式？" name="1">
                <p>智识笔记支持以下文件格式：</p>
                <ul>
                  <li>PDF 文档（.pdf）</li>
                  <li>Word 文档（.doc, .docx）</li>
                  <li>纯文本文件（.txt）</li>
                  <li>图片文件（.jpg, .jpeg, .png, .gif, .bmp）</li>
                </ul>
              </el-collapse-item>
              
              <el-collapse-item title="我的数据存储在哪里？" name="2">
                <p>知识点以 Markdown 格式保存在本地，确保您的数据安全可控。同时，系统会维护一个数据库索引，方便快速搜索和管理。</p>
              </el-collapse-item>
              
              <el-collapse-item title="如何联系客服？" name="3">
                <p>如果您在使用过程中遇到问题，可以通过以下方式联系我们：</p>
                <ul>
                  <li>邮箱：support@smartknowledge.com</li>
                  <li>使用帮助页面右下角的反馈入口</li>
                </ul>
              </el-collapse-item>
              
              <el-collapse-item title="AI 提取功能如何工作？" name="4">
                <p>AI 提取功能调用 DeepSeek API 分析您上传的文件，自动识别和提取知识点，生成标题、摘要和标签建议。您可以校正后保存。</p>
              </el-collapse-item>
              
              <el-collapse-item title="如何导出我的数据？" name="5">
                <p>您可以在知识库中导出全部知识点，所有知识点以 Markdown 格式存储，可以轻松迁移到其他平台。</p>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Document, Folder, DataLine, Search } from '@element-plus/icons-vue'

const activeTab = ref('guide')
</script>

<style scoped>
.help-container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-title {
  font-weight: 600;
  color: #303133;
}

.help-content {
  margin-top: 24px;
  background: #fff;
  padding: 24px;
  border-radius: 8px;
}

.guide-section h2 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 16px;
}

.guide-section .intro {
  font-size: 16px;
  color: #606266;
  margin-bottom: 24px;
}

.guide-card {
  margin-bottom: 16px;
}

.guide-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.guide-content {
  font-size: 14px;
  line-height: 1.8;
  color: #606266;
}

.guide-content p {
  margin-bottom: 8px;
  font-weight: 500;
}

.guide-content ol {
  padding-left: 24px;
}

.guide-content li {
  margin-bottom: 4px;
}

.markdown-guide h2 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 16px;
}

.markdown-guide > p {
  font-size: 16px;
  color: #606266;
  margin-bottom: 24px;
}

.syntax-card {
  margin-bottom: 16px;
}

.syntax-content pre {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  font-family: Consolas, Monaco, monospace;
  font-size: 13px;
  overflow-x: auto;
}

.faq-section h2 {
  font-size: 24px;
  color: #303133;
  margin-bottom: 24px;
}
</style>
