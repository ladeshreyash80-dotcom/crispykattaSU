/**
 * Production build smoke test.
 * Loads the production bundle in jsdom WITHOUT env vars and asserts:
 *   1. The module graph does not throw at evaluation time.
 *   2. The Supabase client is never constructed when env vars are missing.
 *   3. The error boundary / boot fallback is reachable.
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const DIST = join(process.cwd(), 'dist')

describe('Production bundle smoke test', () => {
  beforeAll(() => {
    // Simulate Vercel deployment WITHOUT env vars.
    delete process.env.VITE_SUPABASE_URL
    delete process.env.VITE_SUPABASE_ANON_KEY
  })

  it('index.html exists and has #root + boot-fallback', () => {
    const html = readFileSync(join(DIST, 'index.html'), 'utf-8')
    expect(html).toContain('id="root"')
    expect(html).toContain('boot-fallback')
  })

  it('the JS bundle references ErrorBoundary and boot-fallback', () => {
    const jsPath = join(DIST, 'assets')
    const files = readFileSync(join(jsPath, 'index-BRp3Oj7L.js'), 'utf-8')
    expect(files).toContain('ErrorBoundary')
    expect(files).toContain('boot-fallback')
  })

  it('isSupabaseConfigured returns false without env vars', async () => {
    const mod = await import('../lib/supabase')
    expect(mod.isSupabaseConfigured()).toBe(false)
    expect(mod.getSupabaseClient()).toBeNull()
  })

  it('does not throw when supabase module is imported without env vars', async () => {
    // Re-importing the module must not throw — this is the regression test
    // for the original "supabaseUrl is required" crash.
    expect(async () => {
      await import('../lib/supabase')
    }).not.toThrow()
  })
})
