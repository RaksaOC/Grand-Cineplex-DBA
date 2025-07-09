import api from "@/config/api";
import { TablePrivileges } from "@/types/RolesData";
import { Check, Save } from "lucide-react";
import { useState } from "react";
import Error from "./modals/Error";

interface Table {
    name: string;
    isAccessible: boolean;
}

interface EditTableProps {
    allTables: TablePrivileges[];
    accessibleTables: TablePrivileges[];
    selectedRole: string;
    onSuccess: () => void;
}

const TableCard = ({
    table,
    isAccessible,
    onToggle
}: {
    table: string,
    isAccessible: boolean,
    onToggle: (table: string, isAccessible: boolean) => void
}) => {
    return (
        <div
            onClick={() => onToggle(table, !isAccessible)}
            className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${isAccessible
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                : 'bg-black border-slate-600 text-slate-400 hover:border-slate-500'
                }`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-medium">{table}</h4>
                </div>
                <div className={`flex items-center justify-center w-6 h-6 rounded-full border border-slate-600 ${isAccessible ? 'bg-sky-700' : ''
                    }`}>
                    {isAccessible && <Check className="w-4 h-4 text-white" />}
                </div>
            </div>
        </div>
    );
}

export default function EditTable({ allTables, accessibleTables, selectedRole, onSuccess }: EditTableProps) {
    const [selectedTables, setSelectedTables] = useState<Set<string>>(
        new Set(accessibleTables.map(table => table.name))
    );
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleToggle = (tableName: string, isAccessible: boolean) => {
        const newSelectedTables = new Set(selectedTables);
        if (isAccessible) {
            newSelectedTables.add(tableName);
        } else {
            newSelectedTables.delete(tableName);
        }
        setSelectedTables(newSelectedTables);
    };

    const handleSave = async () => {
        try {
            await api.patch(`/roles/${selectedRole}/table`, {
                updatedTables: Array.from(selectedTables)
            });
            onSuccess();
        } catch (error: any) {
            setIsError(true);
            // Check if error response exists and has data
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Failed to save tables. Please try again.');
            }
        }
    }

    return (
        <div className="p-6 space-y-6">
            <p className="text-sm text-slate-400">
                Changes for role <span className="font-medium text-white">&quot;{selectedRole}&quot;</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allTables.map((table) => (
                    <TableCard
                        key={table.name}
                        table={table.name}
                        isAccessible={selectedTables.has(table.name)}
                        onToggle={handleToggle}
                    />
                ))}
            </div>
            <div className="flex items-center justify-end">
                <button
                    disabled={selectedTables.size === accessibleTables.length}
                    className="text-white flex items-center gap-2 bg-sky-700/50 border border-sky-500/30 px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleSave}
                >
                    <Save className="w-5 h-5" /> Save
                </button>
            </div>
            <Error isOpen={isError} onClose={() => setIsError(false)} message={errorMessage} />
        </div>
    );
}