import { getLinksByPage } from "@/server/actions/link"
import ShortCard from "@/app/components/ShortCard"
import { Link } from "@/app/interfaces"


const ShortGrid = async () => {

    const links = await getLinksByPage() as Link[]

    return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
        {
            links.map(link => <ShortCard key={link.id} {...link} /> )
        }
    </div>
}

export default ShortGrid