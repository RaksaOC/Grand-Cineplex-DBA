#!/usr/bin/env python3
"""
Database Recovery Script
Restore database from a backup file
"""

import os
import sys
import subprocess
from datetime import datetime
import inquirer
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def get_backup_files():
    """Get list of available backup files"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    backup_dir = os.path.join(script_dir, 'backup')
    
    if not os.path.exists(backup_dir):
        print("❌ No backup directory found!")
        sys.exit(1)
    
    backup_files = []
    for file in os.listdir(backup_dir):
        if file.endswith('.sql'):
            # Get file creation time
            file_path = os.path.join(backup_dir, file)
            creation_time = datetime.fromtimestamp(os.path.getctime(file_path))
            size_mb = os.path.getsize(file_path) / (1024 * 1024)  # Convert to MB
            
            backup_files.append({
                'name': f"{file} ({creation_time.strftime('%Y-%m-%d %H:%M:%S')}) - {size_mb:.2f}MB",
                'value': file_path
            })
    
    if not backup_files:
        print("❌ No backup files found in backup directory!")
        print("💡 Make sure you have backup files!")
        sys.exit(1)
        
    return sorted(backup_files, key=lambda x: x['name'], reverse=True)  # Most recent first

def recover_database(backup_file):
    """Recover database from backup file"""
    DATABASE_URL = os.getenv("DATABASE_URL")
    DATABASE_NAME = os.getenv("DATABASE_NAME")
    
    if not all([DATABASE_URL, DATABASE_NAME]):
        print("❌ Missing required environment variables!")
        print("💡 Make sure you have a .env file with:")
        print("   - DATABASE_URL=your_connection_string")
        print("   - DATABASE_NAME=your_database_name")
        sys.exit(1)
    
    # Extract connection details from DATABASE_URL
    # Format: postgresql://username:password@host:port/dbname
    try:
        import re
        match = re.match(r'postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/.*', DATABASE_URL)
        if not match:
            raise ValueError("Invalid DATABASE_URL format")
        
        username, password, host, port = match.groups()
        
        # Set environment variables for psql
        os.environ['PGUSER'] = username
        os.environ['PGPASSWORD'] = password
        os.environ['PGHOST'] = host
        os.environ['PGPORT'] = port
        
    except Exception as e:
        print(f"❌ Error parsing DATABASE_URL: {e}")
        sys.exit(1)
    
    print("\n🔄 Starting database recovery process...")
    print(f"📊 Target database: {DATABASE_NAME}")
    print(f"📁 Using backup file: {os.path.basename(backup_file)}")
    print("-" * 50)
    
    try:
        # Drop existing database if it exists
        print("🗑️  Dropping existing database...")
        drop_cmd = [
            'dropdb',
            '--if-exists',
            '-h', host,
            '-p', port,
            DATABASE_NAME
        ]
        subprocess.run(drop_cmd, check=True, capture_output=True)
        
        # Create new database
        print("🆕 Creating new database...")
        create_cmd = [
            'createdb',
            '-h', host,
            '-p', port,
            DATABASE_NAME
        ]
        subprocess.run(create_cmd, check=True, capture_output=True)
        
        # Restore from backup
        print("📥 Restoring from backup...")
        restore_cmd = [
            'psql',
            '-h', host,
            '-p', port,
            '-d', DATABASE_NAME,
            '-f', backup_file
        ]
        result = subprocess.run(restore_cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print("\n✅ Database recovery completed successfully!")
        else:
            print("\n❌ Error during recovery:")
            print(result.stderr)
            sys.exit(1)
            
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Error during recovery process: {e}")
        print("Error output:", e.stderr.decode() if e.stderr else "No error output")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)

def main():
    print("🔄 Database Recovery Tool")
    print("-" * 50)
    
    # Get available backup files
    backup_files = get_backup_files()
    
    # Create selection prompt
    questions = [
        inquirer.List('backup_file',
                     message="Select a backup file to recover from",
                     choices=[file['name'] for file in backup_files],
                     carousel=True)
    ]
    
    # Get user selection
    try:
        answers = inquirer.prompt(questions)
        if not answers:  # User pressed Ctrl+C
            print("\n⚠️  Recovery cancelled")
            sys.exit(0)
            
        # Find selected file path
        selected_file = next(file['value'] for file in backup_files 
                           if file['name'] == answers['backup_file'])
        
        # Confirm recovery
        confirm = inquirer.prompt([
            inquirer.Confirm('continue',
                           message='⚠️  This will REPLACE the existing database. Continue?',
                           default=False)
        ])
        
        if confirm and confirm['continue']:
            recover_database(selected_file)
        else:
            print("\n⚠️  Recovery cancelled")
            sys.exit(0)
            
    except KeyboardInterrupt:
        print("\n⚠️  Recovery cancelled")
        sys.exit(0)

if __name__ == "__main__":
    main()
