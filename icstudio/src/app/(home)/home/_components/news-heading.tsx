interface SectionHeadingProps {
        title: string
        subtitle?: string
      }
      
      export function SectionHeading({ title, subtitle }: SectionHeadingProps) {
        return (
          <div className="flex flex-col items-center mb-24">
            <div className="flex items-center w-full">
              <div className="h-px flex-grow bg-white/10"></div>
              <h2 className="text-4xl md:text-5xl font-light px-6 tracking-wider text-white uppercase">{title}</h2>
              <div className="h-px flex-grow bg-white/10"></div>
            </div>
      
            {subtitle && <p className="text-white/60 text-lg mt-6 max-w-2xl text-center font-light">{subtitle}</p>}
          </div>
        )
      }
      