import { TablePrivileges } from "@/types/RolesData";
import { getPrivDescription } from "@/utils/getInfo";
import axios from "axios";
import { Check, ChevronRight, Save } from "lucide-react";
import { useEffect, useState } from "react";

interface Table {
    name: string;
    privileges: string[];
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
    onClick,
    privileges = [],
    isSelected,
}: {
    table: string,
    isAccessible: boolean,
    onClick?: () => void,
    privileges?: string[],
    isSelected?: boolean,
}) => {
    return (
        <div
            className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${isSelected
                ? 'bg-sky-500/20 border-sky-500/50 text-sky-400'
                : isAccessible
                    ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                    : 'bg-black border-slate-600 text-slate-400 hover:border-slate-500'
                }`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-medium">{table}</h4>
                    {isAccessible && privileges.length > 0 && (
                        <p className="text-xs mt-1 text-slate-500">
                            {privileges.join(', ')}
                        </p>
                    )}
                </div>
                {!isAccessible && (
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                )}
            </div>
        </div>
    );
}

const PrivilegeSelector = ({
    privileges,
    onChange
}: {
    privileges: string[],
    onChange: (privileges: string[]) => void
}) => {
    return (
        <div className="grid grid-cols-2 gap-2">
            {privileges.map((privilege) => (
                console.log("privilages selector rendering", privilege),
                <div
                    key={privilege}
                    onClick={() => {
                        const newPrivileges = privileges.includes(privilege)
                            ? privileges.filter(p => p !== privilege)
                            : [...privileges, privilege];
                        onChange(newPrivileges);
                    }}
                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${privileges.includes(privilege)
                        ? 'bg-sky-500/10 border-sky-500/30 text-sky-400'
                        : 'bg-black border-slate-600 text-slate-400 hover:border-slate-500'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-sm">{privilege}</span>
                            <span className="text-xs text-slate-500">{getPrivDescription(privilege)}</span>
                        </div>
                        <div className={`flex items-center justify-center w-5 h-5 rounded-full border border-slate-600 ${privileges.includes(privilege) ? 'bg-sky-700' : ''
                            }`}>
                            {privileges.includes(privilege) && <Check className="w-3 h-3 text-white" />}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function EditTable({ allTables, accessibleTables, selectedRole, onSuccess }: EditTableProps) {
    const [allPrivileges, setAllPrivileges] = useState<string[]>([]);
    const [selectedTable, setSelectedTable] = useState<string | null>(null);
    const [tablePrivileges, setTablePrivileges] = useState<Map<string, string[]>>(
        new Map(accessibleTables.map(table => [table.name, table.privileges]))
    );

    useEffect(() => {
        const fetchPrivileges = async () => {
            try {
                const response = await axios.get(`/api/privileges`);
                setAllPrivileges(response.data);
            } catch (error) {
                console.error("Error fetching privileges:", error);
            }
        }
        fetchPrivileges();
    }, []);

    const handleSave = async () => {
        try {
            const tables = Array.from(tablePrivileges.entries()).map(([name, privileges]) => ({
                name,
                privileges
            }));
            await axios.patch(`/api/roles/${selectedRole}/table`, { tables });
            onSuccess();
        } catch (error) {
            console.error("Error saving tables:", error);
        }
    }

    const handlePrivilegeChange = (privileges: string[]) => {
        if (!selectedTable) return;
        setTablePrivileges(new Map(tablePrivileges.set(selectedTable, privileges)));
    }

    const inaccessibleTables = allTables.filter(
        table => !tablePrivileges.has(table.name)
    );

    return (
        <div className="p-6 space-y-8">
            <p className="text-sm text-slate-400">Changes for role <span className="font-medium text-white">&quot;{selectedRole}&quot;</span></p>
            {/* Accessible Tables Section */}
            <div>
                <h3 className="text-lg font-medium text-white mb-4">Accessible Tables</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.from(tablePrivileges.entries()).map(([name, privileges]) => (
                        <TableCard
                            key={name}
                            table={name}
                            isAccessible={true}
                            privileges={privileges}
                            onClick={() => {
                                setSelectedTable(name);
                            }}
                            isSelected={selectedTable === name}
                        />
                    ))}
                </div>
            </div>

            {/* Inaccessible Tables Section */}
            <div>
                <h3 className="text-lg font-medium text-white mb-4">Inaccessible Tables</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {inaccessibleTables.map((table) => (
                        <TableCard
                            key={table.name}
                            table={table.name}
                            isAccessible={false}
                            isSelected={selectedTable === table.name}
                            onClick={() => {
                                setSelectedTable(table.name);
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Privilege Selection Section */}
            {selectedTable && (
                <div>
                    <h3 className="text-lg font-medium text-white mb-4">
                        Privileges
                    </h3>
                    <div className="w-full">
                        <PrivilegeSelector
                            privileges={allPrivileges}
                            onChange={handlePrivilegeChange}
                        />
                    </div>
                </div>
            )}

            {/* Save Button */}
            <div className="flex items-center justify-end">
                <button
                    className="text-white flex items-center gap-2 bg-sky-700/50 border border-sky-500/30 px-4 py-2 rounded-lg"
                    onClick={handleSave}
                >
                    <Save className="w-5 h-5" /> Save Changes
                </button>
            </div>
        </div>
    );
}