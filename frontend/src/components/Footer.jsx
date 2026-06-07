export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-green-600 flex items-center justify-center text-white font-bold">
              G
            </span>
            <div>
              <div className="font-bold text-gray-800 dark:text-gray-100">GreenGrid</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Smart green energy platform</div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-green-600 dark:hover:text-green-500">About</a>
            <a href="#" className="hover:text-green-600 dark:hover:text-green-500">Contact</a>
            <a href="#" className="hover:text-green-600 dark:hover:text-green-500">Privacy</a>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} GreenGrid
          </div>
        </div>
      </div>
    </footer>
  )
}
