'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const NewsCardLoading = () => {
      return (
            <>
                  {[...Array(6)].map((_, i) => (
                        <Card key={i} className="bg-gray-900 border-gray-800">
                              <CardContent className="p-0">
                                    <Skeleton className="h-48 w-full rounded-t-lg" />
                                    <div className="p-6">
                                          <Skeleton className="h-6 w-3/4 mb-4" />
                                          <Skeleton className="h-4 w-full mb-2" />
                                          <Skeleton className="h-4 w-2/3" />
                                    </div>
                              </CardContent>
                        </Card>
                  ))}
            </>
      );
};

export default NewsCardLoading;
