import { ReactNode } from "react"


const HomeLayout = ({
        children
}: {
        children:ReactNode
}) => {
        return (
                <div>
                        
                                { children }
                        
                </div>
        )
}

export default HomeLayout