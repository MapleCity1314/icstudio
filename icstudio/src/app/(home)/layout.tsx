import { ReactNode } from "react"
import HomeNav from '../../components/nav';
import { Footer } from '../../components/footer';

const Layout = ({
        children
}:{
        children:ReactNode
}) => {
        return (
                <div>
                        <HomeNav />
                        { children }
                        <Footer />
                </div>
        )
}

export default Layout
