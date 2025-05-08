'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Link, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const NewsCard = () => {
      return (
            <>
                  {relatedNews.map((item) => (
                        <Link href={`/news/${item.slug}`} key={item.id} className="group">
                              <Card className="bg-gray-900 border-gray-800 overflow-hidden h-full transition-all duration-300 hover:border-gray-700">
                                    <CardContent className="p-0 h-full flex flex-col">
                                          <div className="relative h-48 overflow-hidden">
                                                <Image
                                                      src={
                                                            item.image ||
                                                            `/placeholder.svg?height=400&width=600&query=${item.title}`
                                                      }
                                                      alt={item.title}
                                                      width={600}
                                                      height={400}
                                                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                          </div>
                                          <div className="p-6 flex-1 flex flex-col">
                                                <div className="text-sm text-white/60 mb-3">
                                                      {item.month} {item.day}
                                                </div>
                                                <h3 className="text-xl font-medium text-white mb-3 group-hover:text-white/90 transition-colors duration-300">
                                                      {item.title}
                                                </h3>
                                                <div className="flex items-center text-white/70 text-sm mt-auto group-hover:text-white transition-colors duration-300">
                                                      <span>阅读更多</span>
                                                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                                                </div>
                                          </div>
                                    </CardContent>
                              </Card>
                        </Link>
                  ))}
            </>
      );
};

export default NewsCard;
