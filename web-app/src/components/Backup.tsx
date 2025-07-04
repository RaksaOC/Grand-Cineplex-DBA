'use client';

import { useState } from 'react';
import { Download, Database, FileText, Copy, Check, Trash } from 'lucide-react';
import dotenv from 'dotenv';

export default function Backup() {
    dotenv.config();
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedScript, setGeneratedScript] = useState('');
    const [copied, setCopied] = useState(false);

    const generateBackupScript = async () => {
        setIsGenerating(true);

        const script = `#!/usr/bin/env python3
"""
Railway Database Backup Script
Generated on ${new Date().toLocaleDateString()}
This script will create a full backup of your Railway PostgreSQL database.
"""

import os
import subprocess
import sys
from datetime import datetime

def main():
    # Railway database connection (replace with your actual connection details)
    DATABASE_URL = ${process.env.DATABASE_URL}
    
    # Generate timestamp for unique filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_filename = f"railway_backup_{timestamp}.sql"
    
    print("🚀 Starting Railway database backup...")
    print(f"📁 Backup file: {backup_filename}")
    print(f"⏰ Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)
    
    try:
        # Build pg_dump command for full backup
        cmd = [
            'pg_dump',
            DATABASE_URL,
            '-f', backup_filename,
            '--verbose',
            '--no-password',
            '--clean',
            '--if-exists'
        ]
        
        print("🔧 Running pg_dump command...")
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Backup completed successfully!")
            print(f"📄 File saved as: {backup_filename}")
            print(f"📊 File size: {os.path.getsize(backup_filename)} bytes")
        else:
            print("❌ Backup failed!")
            print("Error:", result.stderr)
            sys.exit(1)
            
    except FileNotFoundError:
        print("❌ pg_dump not found!")
        print("💡 Please install PostgreSQL client tools:")
        print("   macOS: brew install postgresql")
        print("   Ubuntu: sudo apt-get install postgresql-client")
        print("   Windows: Download from https://www.postgresql.org/download/")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()`;

        // Simulate typing effect
        setGeneratedScript('');
        for (let i = 0; i < script.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 5));
            setGeneratedScript(script.substring(0, i + 1));
        }

        setIsGenerating(false);
    };

    const downloadScript = () => {
        if (!generatedScript) return;

        const blob = new Blob([generatedScript], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `railway_backup_script_${new Date().toISOString().split('T')[0]}.py`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const copyToClipboard = async () => {
        if (!generatedScript) return;

        try {
            await navigator.clipboard.writeText(generatedScript);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const clearScript = () => {
        setGeneratedScript('');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Database Backup</h1>
                <p className="text-slate-400 mt-1">Generate backup scripts for your Railway PostgreSQL database</p>
            </div>

            {/* Instructions */}
            <div className="bg-black border border-slate-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">How to Use</h3>
                <div className="space-y-3 text-sm text-slate-400">
                    <div className="flex items-start space-x-3">
                        <span className="bg-sky-500/20 text-sky-400 px-2 py-1 rounded text-xs font-medium">1</span>
                        <p>Click &quot;Generate Backup Script&quot; to create a Python backup script</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <span className="bg-sky-500/20 text-sky-400 px-2 py-1 rounded text-xs font-medium">2</span>
                        <p>Download the script and save it to your local machine</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <span className="bg-sky-500/20 text-sky-400 px-2 py-1 rounded text-xs font-medium">3</span>
                        <p>Replace the DATABASE_URL in the script with your Railway connection string</p>
                    </div>
                    <div className="flex items-start space-x-3">
                        <span className="bg-sky-500/20 text-sky-400 px-2 py-1 rounded text-xs font-medium">4</span>
                        <p>Run the script</p>
                    </div>
                </div>
            </div>

            {/* Backup Configuration */}
            <div className="bg-black border border-slate-700 rounded-xl p-6">
                <button
                    onClick={generateBackupScript}
                    disabled={isGenerating}
                    className="w-full bg-sky-500/20 border border-sky-500/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                    {isGenerating ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Generating Script...</span>
                        </>
                    ) : (
                        <>
                            <FileText className="w-5 h-5" />
                            <span>Generate Backup Script</span>
                        </>
                    )}
                </button>

                {/* <div className="space-y-4"> */}
                {/* <div className="flex items-center space-x-3 p-4 bg-slate-800/50 border border-slate-600 rounded-lg">
                        <div className="w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                        </div>
                        <div>
                            <h3 className="font-medium text-white">Full Database Backup</h3>
                            <p className="text-sm text-slate-400">Complete backup including schema, data, indexes, and constraints</p>
                        </div>
                    </div> */}

                {/* <button
                        onClick={generateBackupScript}
                        disabled={isGenerating}
                        className="w-full bg-sky-500/20 border border-sky-500/30 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-sky-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {isGenerating ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Generating Script...</span>
                            </>
                        ) : (
                            <>
                                <FileText className="w-5 h-5" />
                                <span>Generate Backup Script</span>
                            </>
                        )}
                    </button> */}
                {/* </div> */}
            </div>



            {/* Generated Script */}
            {generatedScript && (
                <div className="bg-black border border-slate-700 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-700">
                        <div className="flex items-center space-x-2">
                            <FileText className="w-5 h-5 text-sky-400" />
                            <h3 className="font-semibold text-white">Generated Backup Script</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={copyToClipboard}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                                title="Copy to clipboard"
                                disabled={isGenerating}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={clearScript}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
                                title="Clear Script"
                                disabled={isGenerating}
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                            <button
                                onClick={downloadScript}
                                className="bg-sky-500/20 border border-sky-500/30 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:bg-sky-500/30 flex items-center space-x-2"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download</span>
                            </button>
                        </div>
                    </div>
                    <div className="p-4">
                        <pre className="text-sm text-slate-300  overflow-x-auto whitespace-pre-wrap">
                            {generatedScript}
                        </pre>
                    </div>
                </div>
            )}


        </div>
    );
}