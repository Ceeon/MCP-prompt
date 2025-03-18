# MCP-prompt

这是一个使用 Model Context Protocol (MCP) 实现的任务管理工具。该工具提供了通过 MCP 协议访问任务管理 API 的能力。

## 功能

- 获取所有任务列表
- 根据任务名称获取特定任务详情

## 安装

```bash
npm install
```

## 使用方法

```bash
node server.js
```

这个服务器将使用标准输入输出 (stdio) 与 MCP 客户端通信。

## 依赖

- @modelcontextprotocol/sdk
- zod
- node-fetch