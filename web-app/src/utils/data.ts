// Backup scripts content
export const BACKUP_SCRIPT = `#!/usr/bin/env python3
"""
Database Backup Script
Supports both one-time backup and scheduled backups
"""

import os
import subprocess
import sys
import time
import schedule
import argparse
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def ensure_backup_dir():
    """Ensure backup directory exists"""
    script_dir = os.path.dirname(os.path.abspath(__file__))
    backup_dir = os.path.join(script_dir, 'backup')
    if not os.path.exists(backup_dir):
        os.makedirs(backup_dir)
    return backup_dir

def create_backup():
    """Create a single backup of the database"""
    # Database connection
    DATABASE_URL = os.getenv("DATABASE_URL")
    DATABASE_NAME = os.getenv("DATABASE_NAME")
    
    if not all([DATABASE_URL, DATABASE_NAME]):
        print("❌ Missing required environment variables!")
        print("💡 Make sure you have a .env file with:")
        print("   - DATABASE_URL=your_connection_string")
        print("   - DATABASE_NAME=your_database_name")
        sys.exit(1)
    
    # Ensure backup directory exists
    backup_dir = ensure_backup_dir()
    
    # Generate timestamp for unique filename
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    backup_filename = f"{DATABASE_NAME}_{timestamp}.sql"
    backup_path = os.path.join(backup_dir, backup_filename)
    
    print("🚀 Starting database backup...")
    print(f"📁 Backup file: {backup_filename}")
    print(f"📂 Backup directory: {backup_dir}")
    print(f"⏰ Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("-" * 50)
    
    try:
        # Build pg_dump command for full backup
        cmd = [
            'pg_dump',
            DATABASE_URL,
            '-f', backup_path,
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
            print(f"📊 File size: {os.path.getsize(backup_path)} bytes")
            return True
        else:
            print("❌ Backup failed!")
            print("Error:", result.stderr)
            return False
            
    except FileNotFoundError:
        print("❌ pg_dump not found!")
        print("💡 Please install PostgreSQL client tools:")
        print("   macOS: brew install postgresql")
        print("   Ubuntu: sudo apt-get install postgresql-client")
        print("   Windows: Download from https://www.postgresql.org/download/")
        return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

def cleanup_old_backups(days=7):
    """Remove backups older than specified days"""
    try:
        backup_dir = ensure_backup_dir()
        now = time.time()
        max_age = days * 24 * 60 * 60
        DATABASE_NAME = os.getenv("DATABASE_NAME")

        for filename in os.listdir(backup_dir):
            if filename.startswith(DATABASE_NAME + '_') and filename.endswith('.sql'):
                filepath = os.path.join(backup_dir, filename)
                if os.path.getmtime(filepath) < (now - max_age):
                    os.remove(filepath)
                    print(f"🗑️  Removed old backup: {filename}")
    except Exception as e:
        print(f"❌ Error cleaning up old backups: {e}")

def run_scheduler(interval_hours=1, retention_days=7):
    """Run the backup scheduler"""
    print(f"🚀 Starting backup scheduler")
    print(f"📅 Schedule:")
    print(f"   - Backups: Every {interval_hours} hour(s)")
    print(f"   - Cleanup: Every day at midnight")
    print(f"   - Retention: {retention_days} days")
    print("-" * 50)

    # Schedule backup based on interval
    if interval_hours == 1:
        schedule.every().hour.do(create_backup)
    else:
        schedule.every(interval_hours).hours.do(create_backup)
    
    # Schedule cleanup at midnight
    schedule.every().day.at("00:00").do(cleanup_old_backups, days=retention_days)
    
    # Run first backup immediately
    create_backup()
    
    try:
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
    except KeyboardInterrupt:
        print("\n⏹️  Backup scheduler stopped")
        sys.exit(0)

def main():
    parser = argparse.ArgumentParser(description='Database Backup Tool')
    parser.add_argument('--schedule', action='store_true', help='Run in scheduler mode')
    parser.add_argument('--interval', type=int, default=1, help='Backup interval in hours (default: 1)')
    parser.add_argument('--retention', type=int, default=7, help='Backup retention in days (default: 7)')
    
    args = parser.parse_args()
    
    if args.schedule:
        run_scheduler(args.interval, args.retention)
    else:
        create_backup()

if __name__ == "__main__":
    main()`;

export const RECOVERY_SCRIPT = `#!/usr/bin/env python3
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
        print("💡 Make sure you have backup files!")
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
    main()`;

// Environment variables template
export const ENV_TEMPLATE = {
  DATABASE_URL: "postgresql://username:password@host:port/dbname",
  DATABASE_NAME: "your_database_name",
};

// README content
export const README_CONTENT = `# Database Backup & Recovery

1. Copy \`.env.example\` to \`.env\` and configure your database credentials
2. Install required packages:
   \`\`\`bash
   pip install python-dotenv inquirer schedule
   \`\`\`
3. Create backups:
   \`\`\`bash
   # One-time backup
   python backup.py

   # Scheduled backups
   python backup.py --schedule --interval 1 --retention 7
   \`\`\`
4. Recover from backup:
   \`\`\`bash
   python recovery.py
   \`\`\``;

// Instructions steps
export const INSTRUCTIONS = [
  {
    step: 1,
    text: "Click Generate Scripts to create both backup and recovery scripts",
  },
  {
    step: 2,
    text: "Download the scripts - this will create a folder with all necessary files",
  },
  {
    step: 3,
    text: "Copy .env.example to .env and configure your database credentials",
    code: `DATABASE_URL="postgresql://username:password@host:port/dbname"
DATABASE_NAME="your_database_name"`,
  },
  {
    step: 4,
    text: "Install required packages",
    code: "pip install python-dotenv inquirer schedule",
  },
  {
    step: 5,
    text: "Run backup script with options",
    code: `# One-time backup
python backup.py

# Scheduled backup
python backup.py --schedule --interval 1 --retention 7`,
  },
  {
    step: 6,
    text: "For recovery (only when needed)",
    code: "python recovery.py",
    warning: "Only use recovery when you have existing backups!",
  },
];

// File structure example
export const FILE_STRUCTURE = `.
├── .env
├── .env.example
├── backup/
│   ├── database_20240315_120000.sql
│   ├── database_20240315_130000.sql
│   ├── database_20240315_140000.sql
│   └── database_20240315_150000.sql
├── backup.py
└── recovery.py`;

// File structure note
export const FILE_STRUCTURE_NOTE =
  "* Backup files are automatically managed based on retention settings";
