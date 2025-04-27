import { Navbar } from "@/components/navbar"

export default function Loading() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="h-8 bg-muted rounded w-1/4 mb-6 animate-pulse"></div>

          <div className="mb-8">
            <div className="rounded-lg bg-card border p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="bg-muted rounded-full w-16 h-16"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded w-32"></div>
                  <div className="h-4 bg-muted rounded w-48"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="h-10 bg-muted rounded w-64 mb-6 animate-pulse"></div>

          <div className="rounded-lg bg-card border animate-pulse">
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <div className="h-5 bg-muted rounded w-32"></div>
                <div className="h-4 bg-muted rounded w-48"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-24"></div>
                  <div className="h-10 bg-muted rounded w-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-24"></div>
                  <div className="h-10 bg-muted rounded w-full"></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="h-5 bg-muted rounded w-16"></div>
                <div className="h-10 bg-muted rounded w-full"></div>
              </div>

              <div className="space-y-2">
                <div className="h-5 bg-muted rounded w-24"></div>
                <div className="h-10 bg-muted rounded w-full"></div>
              </div>

              <div className="h-10 bg-muted rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
