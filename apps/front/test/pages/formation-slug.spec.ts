import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, ref } from 'vue'
import FormationPage from '~/pages/formations/[famille]/[slug].vue'

const seoMock = vi.fn()
const headMock = vi.fn()
const createErrorMock = vi.fn((e: { statusCode: number; statusMessage: string }) => {
  const err = new Error(e.statusMessage) as Error & { statusCode: number }
  err.statusCode = e.statusCode
  return err
})

let routeMock: { params: { famille?: string; slug?: string } }

vi.stubGlobal('ref', ref)
vi.stubGlobal('computed', computed)
vi.stubGlobal('definePageMeta', vi.fn())
vi.stubGlobal('useRoute', () => routeMock)
vi.stubGlobal('createError', createErrorMock)
vi.stubGlobal('useContentSeo', seoMock)
vi.stubGlobal('useHead', headMock)

vi.mock('@vueuse/core', () => ({
  useElementSize: () => ({ height: { value: 0 } })
}))

const stubs = {
  NuxtLink: { template: '<a><slot /></a>' },
  Button: { template: '<button><slot /></button>' },
  Badge: { template: '<span><slot /></span>' },
  Card: { template: '<div><slot /></div>' },
  CardHeader: { template: '<div><slot /></div>' },
  CardContent: { template: '<div><slot /></div>' },
  SessionCard: { props: ['title'], template: '<div class="session-card">{{ title }}</div>' },
  CenterFormationCard: {
    props: ['title'],
    template: '<div class="similaire-card">{{ title }}</div>'
  },
  CtaBanner: { template: '<div><slot /></div>' },
  IconDownload: true,
  IconCheck: true,
  IconAward: true,
  IconChevronRight: true
}

const validParams = {
  famille: 'caces-conduite-engins',
  slug: 'caces-r489-chariots-elevateurs'
}

describe('pages/formations/[famille]/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    routeMock = { params: { ...validParams } }
  })

  it('affiche la fiche CACES R489 pour les bons paramètres', () => {
    const wrapper = mount(FormationPage, { global: { stubs } })

    expect(wrapper.text()).toContain('CACES R489 — Conduite de chariots élévateurs')
    expect(wrapper.text()).toContain('À propos de cette formation')
    expect(wrapper.text()).toContain('Prochaines sessions')
    expect(wrapper.findAll('.session-card')).toHaveLength(3)
    expect(wrapper.findAll('.similaire-card')).toHaveLength(3)
    expect(wrapper.text()).toContain('Sessions dès le 12 sept.')
  })

  it('définit le SEO et le JSON-LD Course', () => {
    mount(FormationPage, { global: { stubs } })

    expect(seoMock).toHaveBeenCalledWith(
      expect.objectContaining({
        seo_title: 'CACES R489 — Conduite de chariots élevateurs'
      }),
      'CACES R489 — Conduite de chariots élevateurs'
    )
    const ldJson = headMock.mock.calls[0]![0].script[0].innerHTML
    expect(JSON.parse(ldJson)['@type']).toBe('Course')
  })

  it('jette une 404 pour une famille inconnue', () => {
    routeMock = { params: { ...validParams, famille: 'inconnue' } }

    expect(() => mount(FormationPage, { global: { stubs } })).toThrow('Page introuvable')
    expect(createErrorMock).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }))
  })

  it('jette une 404 pour un slug inconnu', () => {
    routeMock = { params: { ...validParams, slug: 'inconnu' } }

    expect(() => mount(FormationPage, { global: { stubs } })).toThrow('Page introuvable')
    expect(createErrorMock).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 404 }))
  })
})
