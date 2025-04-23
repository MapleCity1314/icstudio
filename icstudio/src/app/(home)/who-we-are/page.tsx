import Ribbons from '@/components/anime/Ribbons/Ribbons';

const Page = () => {
      return (
            <div className="flex flex-col items-center justify-center h-screen">
                  <div className="absolute top-0 left-0 w-full h-full z-0">
                        <Ribbons
                              baseThickness={30}
                              colors={['#ff9346', '#7cff67', '#ffee51', '#00d8ff']}
                              speedMultiplier={0.4}
                              maxAge={500}
                              enableFade={true}
                              enableShaderEffect={true}
                              offsetFactor={0.05}
                        />
                  </div>

                  <div className="z-20">
                        <h1>Who We Are 占位符</h1>
                  </div>
            </div>
      );
};

export default Page;
