#!/usr/bin/env node
// Basic MCP server for Google Maps operations
const { McpServer } = require('@modelcontextprotocol/sdk/server/mcp');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio');
const { z } = require('zod');

(async () => {
  const server = new McpServer({
    name: 'google-maps',
    version: '1.0.0',
    description: 'MCP server providing simple Google Maps capabilities.'
  });

  server.registerTool('geocode', {
    title: 'Geocode address',
    description: 'Convert a street address to latitude and longitude using Google Maps Geocoding API.',
    inputSchema: z.object({
      address: z.string()
    })
  }, async ({ address }) => {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey)
      throw new Error('GOOGLE_MAPS_API_KEY environment variable is required');

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok)
      throw new Error(`Geocoding failed with status ${response.status}`);
    const data = await response.json();
    const location = data.results?.[0]?.geometry?.location;
    if (!location)
      throw new Error('No results found');
    return {
      content: [{ type: 'json', json: location }]
    };
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
})();
