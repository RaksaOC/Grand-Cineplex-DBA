import { TablePrivileges } from "@/app/types/RolesData";
import { getPrivDescription } from "@/app/utils/getInfo";
import { Check, Save } from "lucide-react";
import { useState } from "react";

interface EditPrivilegesProps {
    allPrivileges: string[];
    accessiblePrivileges: string[];
    selectedTable: TablePrivileges;
    selectedRole: string;
    onSave: () => void;
}

const PrivilegeCard = (privilege: string, isAccessible: boolean, onToggle: (privilege: string) => void) => {
    const [isToggled, setIsToggled] = useState<boolean>(isAccessible);
    return (
        <div className={`p-4 rounded-lg bg-black border border-slate-600 transition-all duration-200 cursor-pointer ${isToggled
            ? 'bg-sky-500/10 text-sky-400'
            : ' text-slate-400 hover:border-slate-500'
            }`} onClick={() => {
                setIsToggled(!isToggled);
                onToggle(privilege);
            }}>
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-medium">{privilege}</h4>
                    <p className="text-sm mt-1 text-slate-400 opacity-75">{getPrivDescription(privilege)}</p>
                </div>
                <div className={`flex items-center justify-center w-6 h-6 rounded-full border border-slate-600 ${isToggled ? 'bg-sky-700' : ''}`}>
                    {isToggled && <Check className="w-4 h-4  text-white" />}
                </div>
            </div>
        </div>
    );
}

export default function EditPrivileges({ allPrivileges, accessiblePrivileges, selectedTable, selectedRole, onSave }: EditPrivilegesProps) {
    const [selectedPrivileges, setSelectedPrivileges] = useState<string[]>(accessiblePrivileges);

    const handleSave = () => {
        // TODO: Save the selected privileges

        // this is just to call to the parent to return to the normal view mode
        onSave();
    }

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allPrivileges.sort().map((privilege) => {
                    const isAccessible = accessiblePrivileges.includes(privilege);
                    return (
                        PrivilegeCard(privilege, isAccessible, (privilege: string) => { })
                    );
                })}
            </div>
            <div className="flex items-center justify-end">
                <button className="text-white flex items-center gap-2 bg-sky-700/50 border border-sky-500/30  px-4 py-2 rounded-lg" onClick={() => handleSave()}>
                    <Save className="w-5 h-5" />
                    <span>Save</span>
                </button>
            </div>
        </div>
    );
}