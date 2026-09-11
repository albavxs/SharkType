import SceneWrapper from '@/components/three/SceneWrapper'

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div
      data-admin-shell
      className="relative min-h-screen overflow-x-hidden"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      <SceneWrapper />
      <div className="relative z-10 min-h-screen">{children}</div>
      <style>{`
        [data-admin-shell] main {
          background-color: transparent !important;
        }
        [data-admin-shell] section {
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
      `}</style>
    </div>
  )
}
