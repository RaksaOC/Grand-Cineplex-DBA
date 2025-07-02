import { RolesData, TablePrivileges } from "@/app/types/RolesData";
import { Check, Save } from "lucide-react";
import { useState } from "react";

interface Table {
    name: string;
    isAccessible: boolean;
}

interface EditTableProps {
    allTables: TablePrivileges[];
    accessibleTables: TablePrivileges[];
    selectedRole: string;
    onSave: () => void;
}

const TableCard = (table: Table, onToggle: (table: Table) => void) => {
    const [isToggled, setIsToggled] = useState<boolean>(table.isAccessible);
    return (
        <div
            key={table.name}
            onClick={() => {
                setIsToggled(!isToggled);
                onToggle({ name: table.name, isAccessible: !isToggled });
            }}
            className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${isToggled
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                : 'bg-black border-slate-600 text-slate-400 hover:border-slate-500'
                }`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-medium">{table.name}</h4>
                </div>
                <div className={`flex items-center justify-center w-6 h-6 rounded-full border border-slate-600 ${isToggled ? 'bg-sky-700' : ''}`}>
                    {isToggled && <Check className="w-4 h-4  text-white" />}
                </div>
            </div>
        </div>
    );
}

export default function EditTable({ allTables, accessibleTables, selectedRole, onSave }: EditTableProps) {
    const [selectedTables, setSelectedTables] = useState<Table[]>([]);

    const handleSave = () => {
        // TODO: Save the selected tables


        // this is just to call to the parent to return to the normal view mode
        onSave();
    }

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allTables.map((table) => {
                    const isAccessible = accessibleTables.some(t => t.name === table.name);
                    return TableCard({ name: table.name, isAccessible: isAccessible }, (table: Table) => {
                        setSelectedTables(selectedTables.map(t => t.name === table.name ? table : t));
                    });
                })}
            </div>
            <div className="flex items-center justify-end mt-4">
                <button className="text-white flex items-center gap-2 bg-sky-700/50 border border-sky-500/30  px-4 py-2 rounded-lg" onClick={() => onSave()}>
                    <Save className="w-5 h-5" /> Save
                </button>
            </div>
        </div>
    );
}