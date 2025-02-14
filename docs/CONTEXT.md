# AtomicKids - Technical Documentation

This document outlines the technical specifications, app flow, and features for the Kids Habit App implementation.

## Core Components

### 1. User Management
- **Authentication Flow**
  - Email/password signup (no verification required)
  - Login with credentials
  - Password-protected parent mode (PIN: 1234)

### 2. Parent Mode
- **Child Profile Management**
  - Create/edit child profiles
  - Configure avatars
  - Manage multiple children independently
- **Task Configuration**
  - Create/edit daily tasks
  - Assign pictograms to tasks
- **Character System**
  - Create unlockable characters
  - Set streak requirements
  - Configure reward mechanics

### 3. Child Mode
- **Task Interface**
  - Display daily tasks
  - Track completion status
  - Show progress ("X of Y complete")
- **Streak System**
  - Increment on full daily completion
  - Reset on missed days
  - Unlock characters at thresholds
- **Character Management**
  - Display available/locked characters
  - Allow avatar selection
  - Persist unlocked status

## Technical Requirements

### Data Persistence
- User credentials
- Child profiles
- Task configurations
- Streak counts
- Character unlock status

### UI/UX Considerations
- Responsive design
- Child-friendly interface
- Clear visual feedback
- Intuitive navigation

### Security
- Parent mode PIN protection
- Data isolation between profiles
- Secure authentication

## Tech Stack
- Frontend: React Native with TypeScript, Expo, and Expo Router
- Backend/Database: Supabase
- UI Framework: React Native Paper
- AI Processing: DeepSeek

## Database Schema

### Tables

1. **users**
   - id: uuid (primary key)
   - email: string
   - password_hash: string
   - created_at: timestamp
   - parent_pin: string

2. **children**
   - id: uuid (primary key)
   - user_id: uuid (foreign key -> users.id)
   - name: string
   - avatar_url: string
   - current_streak: integer
   - highest_streak: integer
   - created_at: timestamp

3. **tasks**
   - id: uuid (primary key)
   - child_id: uuid (foreign key -> children.id)
   - title: string
   - description: string
   - pictogram_url: string
   - is_active: boolean
   - created_at: timestamp

4. **task_completions**
   - id: uuid (primary key)
   - task_id: uuid (foreign key -> tasks.id)
   - child_id: uuid (foreign key -> children.id)
   - completed_at: timestamp
   - completion_date: date

5. **characters**
   - id: uuid (primary key)
   - name: string
   - image_url: string
   - streak_requirement: integer
   - is_default: boolean

6. **unlocked_characters**
   - id: uuid (primary key)
   - child_id: uuid (foreign key -> children.id)
   - character_id: uuid (foreign key -> characters.id)
   - unlocked_at: timestamp

## Project Structure

### User Onboarding
