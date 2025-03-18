#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fetch from 'node-fetch';

// 创建 MCP 服务器
const server = new McpServer({
  name: "MCP 任务管理",
  version: "1.0.2"
});

// Worker 域名 - 公开信息
const WORKER_DOMAIN = "api.chengfeng.me";

// 获取所有任务
server.tool(
  "get_all_tasks",
  {},
  async () => {
    try {
      const workerUrl = `https://${WORKER_DOMAIN}`;
      const response = await fetch(`${workerUrl}/tasks`);
      
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }
      
      const tasks = await response.json();
      
      // 只返回任务的基本信息
      const tasksInfo = tasks.map(task => ({
        id: task.id,
        name: task.name,
        created_at: task.created_at,
        content_preview: task.content ? `${task.content.substring(0, 100)}...` : ''
      }));
      
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            status: 'success',
            message: '成功获取所有任务',
            data: tasksInfo
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            status: 'error',
            message: `获取任务失败: ${error.message}`
          }, null, 2)
        }],
        isError: true
      };
    }
  }
);

// 根据名称获取任务
server.tool(
  "get_task_by_name",
  { name: z.string() },
  async ({ name }) => {
    try {
      const workerUrl = `https://${WORKER_DOMAIN}`;
      
      // 先获取所有任务
      const response = await fetch(`${workerUrl}/tasks`);
      
      if (!response.ok) {
        throw new Error(`请求失败: ${response.status} ${response.statusText}`);
      }
      
      const allTasks = await response.json();
      
      // 查找匹配名称的任务
      const task = allTasks.find(t => t.name === name);
      
      if (!task) {
        throw new Error(`未找到名称为 "${name}" 的任务`);
      }
      
      // 获取任务详情
      const detailResponse = await fetch(`${workerUrl}/tasks/${task.id}`);
      
      if (!detailResponse.ok) {
        throw new Error(`获取详情失败: ${detailResponse.status} ${detailResponse.statusText}`);
      }
      
      const taskDetail = await detailResponse.json();
      
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            status: 'success',
            message: `成功获取名称为 "${name}" 的任务`,
            data: taskDetail
          }, null, 2)
        }]
      };
    } catch (error) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({
            status: 'error',
            message: `获取任务失败: ${error.message}`
          }, null, 2)
        }],
        isError: true
      };
    }
  }
);

// 连接 MCP 服务器
const transport = new StdioServerTransport();
server.connect(transport); 