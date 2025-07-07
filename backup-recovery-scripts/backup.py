#!/usr/bin/env python3
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
    # Railway database connection
    DATABASE_URL = os.getenv("DATABASE_URL")
    DATABASE_NAME = os.getenv("DATABASE_NAME")
    
    if not DATABASE_URL:
        print("❌ DATABASE_URL not found in environment variables!")
        print("💡 Make sure you have a .env file with DATABASE_URL=your_connection_string")
        sys.exit(1)
    
    if not DATABASE_NAME:
        print("❌ DATABASE_NAME not found in environment variables!")
        print("💡 Make sure you have a .env file with DATABASE_NAME=your_database_name")
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
    main()