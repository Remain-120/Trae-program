<template>
  <div class="graph-container">
    <el-page-header @back="$router.push('/home')">
      <template #title>
        <span>返回</span>
      </template>
      <template #content>
        <span class="page-title">知识图谱</span>
      </template>
    </el-page-header>

    <div class="graph-content">
      <!-- 工具栏 -->
      <div class="graph-toolbar">
        <el-button @click="handleAddNode">
          <el-icon><Plus /></el-icon>
          添加节点
        </el-button>
        <el-button @click="handleAddEdge">
          <el-icon><Connection /></el-icon>
          添加连线
        </el-button>
        <el-button @click="handleAutoLayout">
          <el-icon><Operation /></el-icon>
          自动布局
        </el-button>
        <el-button @click="loadGraphData">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
        
        <div class="zoom-controls">
          <el-button size="small" @click="zoomOut">
            <el-icon><ZoomOut /></el-icon>
          </el-button>
          <span class="zoom-level">{{ Math.round(zoomLevel * 100) }}%</span>
          <el-button size="small" @click="zoomIn">
            <el-icon><ZoomIn /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- 图谱画布 -->
      <div class="graph-canvas" ref="graphContainer">
        <div ref="chartRef" class="chart"></div>
        
        <el-empty v-if="!graphData.nodes.length" description="暂无图谱数据">
          <el-button type="primary" @click="handleAddNode">添加第一个节点</el-button>
        </el-empty>
      </div>

      <!-- 图例 -->
      <div class="graph-legend" v-if="graphData.nodes.length">
        <div class="legend-item">
          <span class="legend-dot category"></span>
          <span>分类节点</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot knowledge"></span>
          <span>知识点节点</span>
        </div>
      </div>
    </div>

    <!-- 添加节点对话框 -->
    <el-dialog v-model="showNodeDialog" title="添加节点" width="400px">
      <el-form :model="nodeForm" label-width="80px">
        <el-form-item label="节点名称">
          <el-input v-model="nodeForm.name" placeholder="请输入节点名称" />
        </el-form-item>
        <el-form-item label="节点类型">
          <el-radio-group v-model="nodeForm.type">
            <el-radio label="category">分类</el-radio>
            <el-radio label="knowledge">知识点</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showNodeDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddNode">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加连线对话框 -->
    <el-dialog v-model="showEdgeDialog" title="添加连线" width="400px">
      <el-form :model="edgeForm" label-width="80px">
        <el-form-item label="起始节点">
          <el-select v-model="edgeForm.source" placeholder="选择起始节点" style="width: 100%">
            <el-option
              v-for="node in graphData.nodes"
              :key="node.id"
              :label="node.name"
              :value="node.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="目标节点">
          <el-select v-model="edgeForm.target" placeholder="选择目标节点" style="width: 100%">
            <el-option
              v-for="node in graphData.nodes"
              :key="node.id"
              :label="node.name"
              :value="node.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关系描述">
          <el-input v-model="edgeForm.label" placeholder="请输入关系描述" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showEdgeDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmAddEdge">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import * as echarts from 'echarts'
import api from '../../api'
import { ElMessage } from 'element-plus'
import { Plus, Connection, Operation, Refresh, ZoomIn, ZoomOut } from '@element-plus/icons-vue'

const graphContainer = ref(null)
const chartRef = ref(null)
let chart = null

const zoomLevel = ref(1)
const showNodeDialog = ref(false)
const showEdgeDialog = ref(false)

const nodeForm = reactive({
  name: '',
  type: 'knowledge'
})

const edgeForm = reactive({
  source: '',
  target: '',
  label: ''
})

const graphData = reactive({
  nodes: [],
  edges: []
})

onMounted(async () => {
  await loadGraphData()
  await nextTick()
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (chart) {
    chart.dispose()
  }
})

async function loadGraphData() {
  try {
    const res = await api.get('/api/graph/data')
    graphData.nodes = res.data.nodes || []
    graphData.edges = res.data.edges || []
    updateChart()
  } catch (error) {
    console.error('加载图谱数据失败:', error)
  }
}

function initChart() {
  if (!chartRef.value) return
  
  chart = echarts.init(chartRef.value)
  
  chart.on('click', (params) => {
    if (params.dataType === 'node') {
      const node = graphData.nodes.find(n => n.id === params.data.id)
      if (node) {
        if (node.type === 'knowledge') {
          window.location.href = `/knowledge/detail/${node.id}`
        }
      }
    }
  })
  
  updateChart()
}

function updateChart() {
  if (!chart) return
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        if (params.dataType === 'node') {
          return `${params.data.label}<br/>类型: ${params.data.type === 'category' ? '分类' : '知识点'}`
        } else if (params.dataType === 'edge') {
          return params.data.label || '关联'
        }
        return ''
      }
    },
    series: [
      {
        type: 'graph',
        layout: 'force',
        animation: true,
        symbolSize: (val, params) => {
          return params.data.type === 'category' ? 60 : 45
        },
        roam: true,
        label: {
          show: true,
          formatter: '{b}',
          fontSize: 12
        },
        lineStyle: {
          width: 2,
          curveness: 0.3,
          color: '#409eff'
        },
        edgeLabel: {
          show: true,
          formatter: '{c}',
          fontSize: 10
        },
        itemStyle: {
          color: (params) => {
            return params.data.type === 'category' ? '#409eff' : '#67c23a'
          }
        },
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 4
          }
        },
        data: graphData.nodes.map(node => ({
          id: node.id,
          name: node.name,
          label: node.name,
          type: node.type,
          draggable: true
        })),
        links: graphData.edges.map(edge => ({
          source: edge.source,
          target: edge.target,
          label: edge.label,
          lineStyle: {
            curveness: edge.label ? 0.2 : 0
          }
        })),
        force: {
          repulsion: 200,
          edgeLength: 150,
          layoutAnimation: true
        }
      }
    ]
  }
  
  chart.setOption(option)
}

function handleResize() {
  if (chart) {
    chart.resize()
  }
}

function handleAddNode() {
  nodeForm.name = ''
  nodeForm.type = 'knowledge'
  showNodeDialog.value = true
}

async function confirmAddNode() {
  if (!nodeForm.name.trim()) {
    ElMessage.warning('请输入节点名称')
    return
  }
  
  try {
    await api.post('/api/graph/node/add', {
      name: nodeForm.name,
      type: nodeForm.type
    })
    ElMessage.success('添加成功')
    showNodeDialog.value = false
    await loadGraphData()
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

function handleAddEdge() {
  if (graphData.nodes.length < 2) {
    ElMessage.warning('至少需要两个节点才能添加连线')
    return
  }
  
  edgeForm.source = ''
  edgeForm.target = ''
  edgeForm.label = ''
  showEdgeDialog.value = true
}

async function confirmAddEdge() {
  if (!edgeForm.source || !edgeForm.target) {
    ElMessage.warning('请选择起始和目标节点')
    return
  }
  
  try {
    await api.post('/api/graph/edge/add', {
      source: edgeForm.source,
      target: edgeForm.target,
      label: edgeForm.label
    })
    ElMessage.success('添加成功')
    showEdgeDialog.value = false
    await loadGraphData()
  } catch (error) {
    ElMessage.error('添加失败')
  }
}

function handleAutoLayout() {
  updateChart()
  ElMessage.success('已重新布局')
}

function zoomIn() {
  zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2)
  chart?.setOption({
    series: [{
      zoom: zoomLevel.value
    }]
  })
}

function zoomOut() {
  zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5)
  chart?.setOption({
    series: [{
      zoom: zoomLevel.value
    }]
  })
}
</script>

<style scoped>
.graph-container {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}

.page-title {
  font-weight: 600;
  color: #303133;
}

.graph-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  background: #fff;
  border-radius: 8px;
  padding: 16px;
}

.graph-toolbar {
  display: flex;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 16px;
}

.zoom-controls {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.zoom-level {
  font-size: 14px;
  color: #606266;
  min-width: 50px;
  text-align: center;
}

.graph-canvas {
  flex: 1;
  position: relative;
  min-height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 400px;
}

.graph-legend {
  display: flex;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
  margin-top: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #606266;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.legend-dot.category {
  background: #409eff;
}

.legend-dot.knowledge {
  background: #67c23a;
}
</style>
