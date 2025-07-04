import { TablePrivileges } from "@/types/RolesData";
import { getPrivDescription } from "@/utils/getInfo";
import axios from "axios";
import { Check, Save } from "lucide-react";
import { useState } from "react";

interface EditPrivilegesProps {
    allPrivileges: string[];
    accessiblePrivileges: string[];
    selectedTable: TablePrivileges;
    selectedRole: string;
    onSuccess: () => void;
}

const PrivilegeCard = (privilege: string, isAccessible: boolean, onToggle: (privilege: string, isAccessible: boolean) => void) => {
    const [isToggled, setIsToggled] = useState<boolean>(isAccessible);
    return (
        <div className={`p-4 rounded-lg bg-black border border-slate-600 transition-all duration-200 cursor-pointer ${isToggled
            ? 'bg-sky-500/10 text-sky-400'
            : ' text-slate-400 hover:border-slate-500'
            }`} onClick={() => {
                setIsToggled(!isToggled);
                onToggle(privilege, !isAccessible);
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

export default function EditPrivileges({ allPrivileges, accessiblePrivileges, selectedTable, selectedRole, onSuccess }: EditPrivilegesProps) {
    const [selectedPrivileges, setSelectedPrivileges] = useState<Set<string>>(new Set(accessiblePrivileges));

    const handleSave = async () => {
        const response = await axios.patch(`/api/roles/${selectedRole}/privileges`, {
            table: selectedTable.name,
            updatedPrivileges: Array.from(selectedPrivileges)
        });
        if (response.status === 200) {
            onSuccess();
        }
    }

    return (
        <div className="p-6">
            <p className="text-sm pb-6 text-slate-400">Changes for role <span className="font-medium text-white">&quot;{selectedRole}&quot;</span> & table <span className="font-medium text-white">&quot;{selectedTable.name}&quot;</span></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allPrivileges.sort().map((privilege) => {
                    const isAccessible = accessiblePrivileges.includes(privilege);
                    return (
                        PrivilegeCard(privilege, isAccessible, (privilege: string, isAccessible: boolean) => {
                            const newSelectedPrivileges = new Set(selectedPrivileges);
                            if (isAccessible) {
                                newSelectedPrivileges.add(privilege);
                            } else {
                                newSelectedPrivileges.delete(privilege);
                            }
                            setSelectedPrivileges(newSelectedPrivileges);
                        })
                    );
                })}
            </div>
            <div className="flex items-center justify-end">
                <button
                    disabled={Array.from(selectedPrivileges).sort().join(',') === accessiblePrivileges.sort().join(',')}
                    className="text-white flex items-center gap-2 bg-sky-700/50 border border-sky-500/30 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                >
                    <Save className="w-5 h-5" /> Save
                </button>
            </div>
        </div>
    );
}