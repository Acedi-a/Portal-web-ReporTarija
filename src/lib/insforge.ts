import { createClient } from '@insforge/sdk'

const baseUrl = import.meta.env.VITE_INSFORGE_URL ?? 'https://pxbe3x64.us-east.insforge.app'
const anonKey =
  import.meta.env.VITE_INSFORGE_ANON_KEY ??
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxMzY0Njl9.T6z_vnrraL41JmoXMLoQQS1BEbSZrp3s7qdgg38WXJc'

export const insforge = createClient({
  baseUrl,
  anonKey,
})
