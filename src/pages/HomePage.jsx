import Header from '../components/Header'
import ControlsRow from '../components/ControlsRow'
import NewsGallery from '../components/NewsGallery'
import FavoritesSection from '../components/FavoritesSection'

function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-100 px-4 py-6 text-zinc-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <Header />
        <ControlsRow />
        <NewsGallery />
        <FavoritesSection />
      </div>
    </main>
  )
}

export default HomePage
