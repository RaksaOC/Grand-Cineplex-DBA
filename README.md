# Database Administration System

A comprehensive database management system with scalable data generation utilities and a modern web interface for database administration.

## 📚 Table of Contents

- [🌟 Overview](#-overview)
- [💻 Tech Stack](#-tech-stack)
- [🚀 Getting Started](#-getting-started)
  - [📊 Database Setup](#-database-setup)
  - [🔧 Data Generation Process](#-data-generation-process)
  - [🌐 Web Application Setup](#-web-application-setup)
- [✨ Features](#-features)
- [📁 Project Structure](#-project-structure)
- [💾 Backup & Recovery](#-backup--recovery)
- [🔧 Configuration](#-configuration)

## 🌟 Overview

This project provides a complete solution for managing any PostgreSQL database system, featuring scalable data generation, comprehensive user management, and a modern administrative interface. The system is designed to handle database operations with role-based access control, granular permissions, and interactive database management tools.

**Key Highlights:**

- 📈 Scalable data generation (small, medium, large datasets)
- 🛡️ Secure authentication and authorization
- 🎭 Advanced role and privilege management
- 📊 Interactive database schema visualization
- 💻 Built-in SQL console for database queries
- 📱 Modern, responsive web interface

> 🎬 **Note:** The included data generation scripts are configured for cinema/movie theater operations, which were used during development and testing. However, the web application is designed to work with any PostgreSQL database structure.

## 💻 Tech Stack

### 🗄️ Database

- **PostgreSQL** - Primary database engine
- **Custom DDL** - Optimized schema with enums, triggers, and constraints
- **Indexing** - Performance-optimized table structures

### 🐍 Data Generation

- **Python 3.x** - Core scripting language
- **Pandas** - CSV manipulation and data processing
- **Shell Scripts** - Automated data insertion workflows

### 🌐 Web Application

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **TailwindCSS** - Modern styling framework
- **Axios** - HTTP client for API requests

## 🚀 Getting Started

### 📊 Database Setup

1. **Create PostgreSQL Database**

   ```sql
   CREATE DATABASE grand_cineplex;
   ```

2. **Initialize Schema**
   ```bash
   psql -d your_database -f DDL_UPDATED.sql
   ```
   > 📋 The DDL file contains the cinema database schema used for development. You can replace this with your own schema or modify it to suit your needs.

### 🔧 Data Generation Process

The data generation system provides three configurable dataset sizes to suit different testing and deployment needs.

#### Step 1: Configure Data Size 📏

Navigate to `/data-scripts` and choose your desired dataset size:

- **`values_small.py`** - Lightweight dataset for development
- **`values_medium.py`** - Moderate dataset for testing
- **`values_large.py`** - Production-scale dataset

Each values file contains the same data generation formulas but with different scaling factors for record counts.

#### Step 2: Generate CSV Files 📄

```bash
cd data-scripts
python convert_csv.py
```

Change the import to the your desired values

**What this script does:**

- Imports your selected values configuration
- Generates realistic cinema data following the DDL schema (used for development)
- Creates properly formatted CSV files with correct data types
- Considers all database constraints and relationships
- Outputs files to respective directories (`csv_small/`, `csv_medium/`, `csv_large/`)

> 🎬 **Development Note:** The data generation is specifically configured for cinema operations, you can tweak this script to fit your updated DDL.

Got it! Here's a short and clean version with improved styling while keeping your original structure:

---

### 📥 Step 3: Database Population

1. **Go to dataset folder:**

   ```bash
   cd csv_small  # or csv_medium, csv_large
   ```

2. **Set up DB script:**

   ```bash
   touch insert_database.sh
   cp insert_database.sh.example insert_database.sh
   ```

   Edit it with your DB credentials:

   ```bash
   DATABASE_URL="your_connection_string"
   ```

3. **Insert data:**

   ```bash
   chmod +x insert_database.sh
   ./insert_database.sh
   ```

> Uses `COPY` for fast imports with error handling and progress logs.

---

### 🌐 Web App Setup

1. **Enter project:**

   ```bash
   cd web-app
   ```

2. **Install deps:**

   ```bash
   npm install
   ```

3. **Setup env:**

   ```bash
   touch .env
   cp .env.example .env
   ```

   Fill in `.env` with your config.

4. **Start dev server:**

   ```bash
   npm run dev
   ```

## ✨ Features

### 🔐 Authentication & Security

- **Secure Login System** - Username/password authentication for superuser access
- **Session Management** - Persistent login sessions with automatic timeout
- **Access Control** - Restricted access to authorized personnel only

### 👥 User Management

- **Create Users** - Add new database users with custom configurations
- **Edit Users** - Modify user properties and settings
- **User Overview** - View all database users and their current status
- **Password Management** - Secure password updates and resets

### 🎭 Role & Privilege Management

- **Create Roles** - Define custom roles with specific permissions
- **Edit Roles** - Modify role permissions and inheritance
- **Delete Roles** - Remove unused roles safely
- **Granular Permissions** - Table-level privilege control (SELECT, INSERT, UPDATE, DELETE)
- **Privilege Assignment** - Assign roles to users with inheritance support

### 📊 Database Overview & Schema

- **Interactive Schema Viewer** - Visual representation of database structure
- **Table Relationships** - View foreign key relationships and constraints
- **Attribute Details** - Column types, constraints, and indexes
- **Database Statistics** - Table sizes, row counts, and performance metrics

### 💻 SQL Console

- **Read-Only Queries** - Execute SELECT statements safely
- **Result Formatting** - Clean, readable query results
- **Query History** - Access previously executed commands
- **Result Export** - Copy results for external use

### 📥 Database Backup Tools

- **Python Script Generation** - Download custom backup scripts
- **Automated Backups** - Schedule regular database backups
- **Backup Management** - Organize and manage backup files

## 💾 Backup & Recovery

> 🚧 **Coming Soon** - Advanced backup and recovery features are currently in development.

## 🔧 Configuration

### Database Configuration

- Ensure PostgreSQL is running and accessible
- Configure connection strings in shell scripts
- Set up appropriate user permissions

### Web Application Configuration

- Configure environment variables for database connection
- Set up authentication credentials
- Configure session management settings

### Data Generation Configuration

- Adjust scaling factors in values files
- Customize data generation parameters
- Configure output directories

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and open a pull request - it will be much appreciated.
