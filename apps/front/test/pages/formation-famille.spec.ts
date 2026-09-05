import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, Suspense } from 'vue'
import FamillePage from '~/pages/formations/[famille]/index.vue'

const seoMock = vi.fn()
const sanitizeMock = vi.fn((html: string) => html)
const itemBySlugMock = vi.fn()

vi.stubGlobal('useRoute', () => ({ params: { famille: 'securite-prevention' } }))
vi.stubGlobal('useDirectusItemBySlug', itemBySlugMock)
vi.stubGlobal('useContentSeo', seoMock)

async function mountPage() {
  const Host = defineComponent({
    render() {
      return h(Suspense, () => h(FamillePage))
    }
  })
  // sanitizeHtml n'est utilisé que dans le template : il se résout via
  // globalProperties (auto-import Nuxt), pas via les globals JS.
  const wrapper = mount(Host, {
    global: {
      config: {
        globalProperties: {
          sanitizeHtml: sanitizeMock
        } as unknown as import('vue').ComponentCustomProperties
      }
    }
  })
  await flushPromises()
  return wrapper
}

describe('pages/formations/[famille]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    itemBySlugMock.mockResolvedValue({
      name: 'Sécurité & prévention',
      intro: '<p>Intro <strong>famille</strong></p>'
    })
  })

  it('charge la famille par slug et affiche nom + intro sanitizée', async () => {
    const wrapper = await mountPage()

    expect(itemBySlugMock).toHaveBeenCalledWith(
      'familles_formation',
      'securite-prevention',
      'famille-securite-prevention'
    )
    expect(wrapper.text()).toContain('Sécurité & prévention')
    expect(sanitizeMock).toHaveBeenCalledWith('<p>Intro <strong>famille</strong></p>')
    expect(wrapper.html()).toContain('<strong>famille</strong>')
  })

  it('définit le SEO depuis la famille', async () => {
    await mountPage()

    expect(seoMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Sécurité & prévention' }),
      'Sécurité & prévention'
    )
  })
})
