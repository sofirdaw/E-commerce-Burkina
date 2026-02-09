export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Page non trouvée
        </h2>
        <p className="text-gray-600 mb-8">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <a 
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}
