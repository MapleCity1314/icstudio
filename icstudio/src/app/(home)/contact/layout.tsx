import { ReactNode } from "react"

const ContactLayout = ({
        children
}:{
        children:ReactNode
}) => {
        return (
                <div>
                        { children }
                </div>
        )
}

export default ContactLayout