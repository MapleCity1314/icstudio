import { redirect } from "next/navigation"

const Page = () => {

        redirect('/building')
        return (
                <div className="space-y-4">
                        <div className="flex flex-col items-center justify-center h-screen">
                                <h1>资源页占位符</h1>
                        </div>
                </div>
        )
}

export default Page