"use client"
import { Menu as HamIcon } from "lucide-react"

export default function SideBarToggle( {onToggle}: { onToggle: () => void}){

    return(
        <button onClick={onToggle} className="bg-yellow-200 p-2 rounded shadow-md"
        ><HamIcon/></button>
    )
}