#!/usr/bin/env node
// Basic MCP server for simple local file management
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio');
const { z } = require('zod');
const fs = require('fs/promises');
const path = require('path');

(async () => {
  const server = new McpServer({
    name: 'file-management',
    version: '1.0.0',
    description: 'MCP server offering simple file read/write tools.'
  });

  server.registerTool('read_file', {
    title: 'Read file',
    description: 'Read a UTF-8 text file from disk.',
    inputSchema: z.object({
      path: z.string()
    })
  }, async ({ path: filePath }) => {
    const absPath = path.resolve(filePath);
    const content = await fs.readFile(absPath, 'utf-8');
    return {
      content: [{ type: 'text', text: content }]
    };
  });

  server.registerTool('write_file', {
    title: 'Write file',
    description: 'Write UTF-8 text content to a file on disk.',
    inputSchema: z.object({
      path: z.string(),
      content: z.string()
    })
  }, async ({ path: filePath, content }) => {
    const absPath = path.resolve(filePath);
    await fs.writeFile(absPath, content, 'utf-8');
    return {
      content: [{ type: 'text', text: `Wrote ${absPath}` }]
    };
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
