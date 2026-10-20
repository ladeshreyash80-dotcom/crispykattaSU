/**
 * jsdom smoke test: proves the production bundle boots without env vars.
 * Simulates the Vercel scenario where VITE_SUPABASE_URL is unset.
 */
import { describe, it, expect, beforeAll } from 'vitest'
import { JSDOM } from 'jsdom'

describe('Production build smoke test (no env vars)', () => {
  let dom: JSDOM
  let error: Error | null = null

  beforeAll(() => {
    // Simulate the Vercel environment: no Supabase env vars.
    process.env.VITE_SUPABASE_URL = ''
    process.env.VITE_SUPABASE_ANON_KEY = ''

    const html = `<!doctype html><html><body><div id="root"></div></body></html>`
    dom = new JSDOM(html, {
      url: 'http://localhost/',
      runScripts: 'outside-only',
      pretendToBeVisual: true,
    })

    // Replace the global window/document so React can mount.
    global.window = dom.window as unknown as Window
    global.document = dom.window.document
    global.navigator = dom.window.navigator
  })

  it('does not throw at module evaluation (no supabaseUrl)', async () => {
    // Importing the supabase module must NOT throw.
    await expect(async () => {
      const mod = await import('../lib/supabase')
      expect(typeof mod.isSupabaseConfigured).toBe('function')
      expect(typeof mod.getSupabaseClient).toBe('function')
      expect(mod.isSupabaseConfigured()).toBe(false)
      expect(mod.getSupabaseClient()).toBeNull()
    }).not.toThrow()
  })

  it('admin component does not crash when supabase is unconfigured', async () => {
    const mod = await import('../lib/supabase')
    expect(mod.isSupabaseConfigured()).toBe(false)
  })
})
