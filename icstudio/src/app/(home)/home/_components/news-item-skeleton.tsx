"use client"

export function NewsItemSkeleton() {
        return (
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
              {/* Date skeleton */}
              <div className="md:w-24 text-center md:text-left">
                <div className="inline-flex flex-col items-center md:items-start">
                  <div className="h-4 w-12 bg-white/10 rounded mb-2"></div>
                  <div className="h-8 w-8 bg-white/10 rounded"></div>
                </div>
              </div>
      
              {/* Content skeleton */}
              <div className="flex-1">
                <div className="h-12 bg-white/10 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-white/10 rounded w-full mb-2"></div>
                <div className="h-6 bg-white/10 rounded w-2/3"></div>
              </div>
      
              {/* Arrow indicator skeleton */}
              <div className="hidden md:block w-12 h-12 rounded-full bg-white/5"></div>
            </div>
      
            {/* Separator line */}
            <div className="h-px w-full bg-white/10 mt-12"></div>
          </div>
        )
      }
      