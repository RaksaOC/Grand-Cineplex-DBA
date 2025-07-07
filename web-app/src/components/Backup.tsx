'use client';

import { useState } from 'react';
import { Download, Database, FileText, Copy, Check, Trash, AlertTriangle } from 'lucide-react';
import dotenv from 'dotenv';
import JSZip from 'jszip';
import {
    BACKUP_SCRIPT,
    RECOVERY_SCRIPT,
    ENV_TEMPLATE,
    README_CONTENT,
    INSTRUCTIONS,
    FILE_STRUCTURE,
    FILE_STRUCTURE_NOTE
} from '@/utils/data';

export default function Backup() {
    dotenv.config();
    const [isGenerating, setIsGenerating] = useState(false);
    const [backupScript, setBackupScript] = useState('');
    const [recoveryScript, setRecoveryScript] = useState('');
    const [copiedBackup, setCopiedBackup] = useState(false);
    const [copiedRecovery, setCopiedRecovery] = useState(false);

    const generateScripts = async () => {
        setIsGenerating(true);

        const backupContent = BACKUP_SCRIPT;
        const recoveryContent = RECOVERY_SCRIPT;

        // Simulate typing effect for both scripts simultaneously
        setBackupScript('');
        setRecoveryScript('');
        const maxLength = Math.max(backupContent.length, recoveryContent.length);

        for (let i = 0; i < maxLength; i++) {
            await new Promise(resolve => setTimeout(resolve, 0.001)); // Faster typing
            if (i < backupContent.length) {
                setBackupScript(backupContent.substring(0, i + 1));
            }
            if (i < recoveryContent.length) {
                setRecoveryScript(recoveryContent.substring(0, i + 1));
            }
        }

        setIsGenerating(false);
    };

    const downloadScripts = async () => {
        if (!backupScript || !recoveryScript) return;

        try {
            // Create a new zip file
            const zip = new JSZip();

            // Create backup directory (empty folder)
            zip.folder('backup');

            // Add Python scripts
            zip.file('backup.py', backupScript);
            zip.file('recovery.py', recoveryScript);

            // Create .env.example and .env as separate text files
            const envContent = Object.entries(ENV_TEMPLATE)
                .map(([key, value]) => `${key}="${value}"`)
                .join('\n');
            zip.file('.env.example', envContent);
            zip.file('.env', "");

            // Add README
            zip.file('README.md', README_CONTENT);

            // Generate the zip file with maximum compression
            const content = await zip.generateAsync({
                type: 'blob',
                compression: 'DEFLATE',
                compressionOptions: { level: 9 }
            });

            // Create download link and trigger download
            const url = URL.createObjectURL(content);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'backup-recovery-scripts.zip';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to create zip file:', err);
        }
    };

    const copyToClipboard = async (script: string, isBackup: boolean) => {
        if (!script) return;

        try {
            await navigator.clipboard.writeText(script);
            if (isBackup) {
                setCopiedBackup(true);
                setTimeout(() => setCopiedBackup(false), 2000);
            } else {
                setCopiedRecovery(true);
                setTimeout(() => setCopiedRecovery(false), 2000);
            }
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const clearScripts = () => {
        setBackupScript('');
        setRecoveryScript('');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Database Backup & Recovery</h1>
                <p className="text-slate-400 mt-1">Generate backup and recovery scripts for your PostgreSQL database</p>
            </div>

            {/* Instructions and File Structure Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Instructions */}
                <div className="bg-black border border-slate-700 rounded-xl p-6 overflow-x-auto">
                    <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
                    <div className="space-y-3 text-sm text-slate-400">
                        {INSTRUCTIONS.map(({ step, text, code, warning }) => (
                            <div key={step} className="flex items-start space-x-3">
                                <span className="bg-sky-500/20 text-sky-400 px-2 py-1 rounded text-xs font-medium">{step}</span>
                                <div>
                                    <p>{text}</p>
                                    {code && (
                                        <div className="mt-2 font-mono text-xs bg-slate-800/50 p-3 rounded text-wrap whitespace-pre-line">
                                            {code}
                                        </div>
                                    )}
                                    {warning && (
                                        <p className="mt-2 text-yellow-500/80 flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4" />
                                            {warning}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* File Structure */}
                <div className="bg-black border border-slate-700 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">File Structure</h3>
                    <div className="font-mono text-sm text-slate-400 whitespace-pre rounded bg-slate-800/50 p-4">
                        {FILE_STRUCTURE}
                    </div>
                    <p className="text-xs text-slate-500 mt-3">{FILE_STRUCTURE_NOTE}</p>
                </div>
            </div>

            {/* Scripts Section */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Scripts</h3>
                <button
                    onClick={generateScripts}
                    disabled={isGenerating}
                    className="bg-sky-500/20 border border-sky-500/30 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                    {isGenerating ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Generating...</span>
                        </>
                    ) : (
                        <>
                            <FileText className="w-4 h-4" />
                            <span>Generate Scripts</span>
                        </>
                    )}
                </button>
            </div>

            {/* Generated Scripts */}
            {(backupScript || recoveryScript) && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Backup Script */}
                    <div className="bg-black border border-slate-700 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-slate-700">
                            <div className="flex items-center space-x-2">
                                <Database className="w-5 h-5 text-sky-400" />
                                <h3 className="font-semibold text-white">Backup Script</h3>
                            </div>
                            <button
                                onClick={() => copyToClipboard(backupScript, true)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                                title="Copy to clipboard"
                            >
                                {copiedBackup ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="p-4 max-h-[1000px] overflow-auto">
                            <pre className="text-sm text-slate-300 whitespace-pre-wrap">
                                {backupScript}
                            </pre>
                        </div>
                    </div>

                    {/* Recovery Script */}
                    <div className="bg-black border border-slate-700 rounded-xl overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-slate-700">
                            <div className="flex items-center space-x-2">
                                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                <h3 className="font-semibold text-white">Recovery Script</h3>
                            </div>
                            <button
                                onClick={() => copyToClipboard(recoveryScript, false)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                                title="Copy to clipboard"
                            >
                                {copiedRecovery ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="p-4 max-h-[1000px] overflow-auto">
                            <pre className="text-sm text-slate-300 whitespace-pre-wrap">
                                {recoveryScript}
                            </pre>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {(backupScript || recoveryScript) && (
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={clearScripts}
                        disabled={isGenerating}
                        className={`px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors flex items-center space-x-2 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Trash className="w-4 h-4" />
                        <span>Clear</span>
                    </button>
                    <button
                        onClick={downloadScripts}
                        className="bg-sky-500/20 border border-sky-500/30 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-sky-500/30 flex items-center space-x-2"
                    >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                    </button>
                </div>
            )}
        </div>
    );
}