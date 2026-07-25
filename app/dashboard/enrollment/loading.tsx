export default function Loading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">

      <div className="animate-pulse">

        <div className="h-8 w-96 bg-gray-200 rounded mb-4"></div>

        <div className="h-4 w-72 bg-gray-200 rounded mb-10"></div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">

          {Array.from({ length: 8 }).map((_, index) => (

            <div
              key={index}
              className="border rounded-lg overflow-hidden bg-white shadow-sm"
            >
              <div className="h-36 bg-gray-200"></div>

              <div className="p-3 space-y-3">

                <div className="h-4 bg-gray-200 rounded"></div>

                <div className="h-3 bg-gray-100 rounded"></div>

                <div className="h-3 bg-gray-100 rounded w-2/3"></div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}