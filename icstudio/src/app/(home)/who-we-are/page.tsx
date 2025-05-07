"use client"

import Ribbons from '@/components/anime/Ribbons/Ribbons';
import LoadingIcon from '@/components/loading-icon';
import { Suspense, useEffect, useState } from 'react';
import HeroSection from './sections/hero-section/hero-section';

export async function getRibbonLoading() {
      return (
            <LoadingIcon
                  isLoading={true}
                  fullScreen={false}
            />
      );
}

const Page = () => {

      //['#836FFF', '#15F5BA', '#69F2FF','#00d8ff']
      const [ colors,setColors ] = useState(['#836FFF', '#15F5BA', '#69F2FF','#00d8ff'])

      


      return (
            <div className="flex flex-col items-center justify-center h-screen">
                  <div className="absolute top-0 left-0 w-full h-screen z-20">
                        <Suspense fallback={getRibbonLoading()}>
                              <Ribbons
                                    baseThickness={30}
                                    colors={colors}
                                    speedMultiplier={0.4}
                                    maxAge={500}
                                    enableFade={true}
                                    enableShaderEffect={true}
                                    offsetFactor={0.05}
                              />
                        </Suspense>
                  </div>

                  <div className="z-10">
                        <HeroSection />
                  </div>
            </div>
      );
};

export default Page;
