import type { Metadata } from 'next'
import IntentLanding from '@/components/seo/IntentLanding'
import { buildSeoMetadata } from '@/lib/seo'

export const metadata: Metadata = buildSeoMetadata({
  title: 'Treino de digitacao online | SharkType',
  description: 'Treine digitacao com textos, ingles e snippets de programacao. SharkType ajuda a ganhar velocidade, precisao e consistencia.',
  path: '/treino-de-digitacao',
  keywords: ['treino de digitacao', 'site para treinar digitacao', 'teste de digitacao', 'digitacao para programacao'],
})

export default function TreinoDeDigitacaoPage() {
  return (
    <IntentLanding
      eyebrow="Treino de digitacao"
      title="Treine digitacao com foco em velocidade, precisao e codigo"
      description="O SharkType combina pratica de digitacao tradicional, textos em idiomas e snippets reais de programacao para criar memoria muscular util no dia a dia."
      points={[
        'Pratique os primeiros snippets gratuitamente.',
        'Use trilhas de programacao, DevOps, web e idiomas.',
        'Acompanhe WPM, precisao, XP, streak e ranking.',
      ]}
    />
  )
}
