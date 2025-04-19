"use server"

import Image from 'next/image';

const HomeLoading = () => {
        return (
                <div className="flex flex-col items-center justify-center w-full h-full">
                        {/*加载gif */}
                        <div className="w-10 h-10">
                                <Image src="/loading.gif" alt="loading" width={100} height={100} />
                        </div>
                </div>
        )
}

export default HomeLoading;