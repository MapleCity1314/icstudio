import FuzzyText from "@/components/anime/FuzzyText/FuzzyText";

const Page = () => {
      return (
            <div className="flex flex-col items-center justify-center h-screen">
                  <FuzzyText baseIntensity={0.2} hoverIntensity={0.5} enableHover={true}>
                        404
                  </FuzzyText>
                  <p className="text-2xl">Page not found</p>
            </div>
      );
};

export default Page;
