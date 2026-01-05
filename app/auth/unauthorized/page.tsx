import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Accès refusé
        </h1>

        <p className="text-gray-700 mb-6">
          Vous n’avez pas les permissions nécessaires pour accéder à cette page.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Retour au dashboard
          </Link>

          <Link
            href="/auth/signin"
            className="w-full py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Se reconnecter
          </Link>
        </div>
      </div>
    </div>
  );
}
