# GPT PLUS HANDOFF — OMNI SKILLS OLYMPIAD / OSO

You are continuing work on an existing production Next.js App Router project named Omni Skills Olympiad / OSO.

## First instruction
Before writing code, inspect the uploaded repository deeply. Do not assume file names, schema names, routes, components, or database models. Treat the uploaded ZIP as the source of truth.

## Project nature
OSO is a skill-development, assessment, daily challenge, competition, ranking, recognition, and opportunity platform for engineering students and colleges.

## Tech stack to verify from package.json
- Next.js App Router
- TypeScript
- React
- Tailwind/CSS modules
- Framer Motion where already used
- Prisma/database layer
- Existing API routes
- Existing auth/dashboard/admin/quiz/assessment/ranking flows

## Current development rule
Do not redesign or break unrelated modules. Preserve:
- auth
- login
- onboarding
- dashboard
- admin
- quizzes
- assessments
- competitions
- rankings
- existing database schema
- Prisma models
- Supabase/database configuration
- API routes unless explicitly required

## Public-site work context
Recent work focuses on the public homepage:
- premium hero section
- dynamic homepage stats
- final cinematic CTA section
- restoring the progressive “What OSO Connects” style from the previous public site
- maintaining associations/partners section using logos in /public
- making UI premium, cinematic, engineering-focused, modern, responsive, and interactive

## Very important UI requirement
The desired homepage must feel like a national-level skill olympiad platform:
- premium dark cinematic hero
- engineering students around laptop
- dynamic stats from backend where possible
- progressive journey sections
- partner logo marquee
- final cinematic CTA
- no plain boring boxes
- no oversized typography
- no vertical taller frame.
- no static disconnected sections

## Backend stats requirement
Use existing backend/database layer. Do not invent a new system.
Stats should be read safely from the existing models where available:
- Active Students
- Colleges
- Competitions
- Unified Ecosystem = 1

Use fallbacks only when database is unavailable. Do not crash homepage.

## Code-output rule
Whenever code is requested, provide complete copy-paste-ready implementation:
- exact file paths
- full file contents or safe patch commands
- validation commands
- rollback commands
- no placeholders
, provide complete copy-paste-ready implementation:
- exact file paths
- full file contents or safe patch commands
- validation commands
- no “add this somewhere”
- no partial snippets

## Local Windows environment
Project path:
C:\OmniSKillsOlympiad\Silicon-skillathon-git

Downloaded assistant files are usually in:
C:\Users\LENOVO\Downloads

Use the stored casing exactly:
C:\OmniSKillsOlympiad
not:
C:\OmniSkillsOlympiad

## First task for you
Inspect the repository and produce a project understanding report covering:
1. project overview
2. tech stack
3. folder architecture
4. public homepage structure
5. current public-site components
6. backend/database layer
7. auth and protected flows
8. API routes
9. Prisma/database models
10. current UI implementation status
11. what was recently changed
12. build risks
13. safest next implementation plan

Do not modify files until the user asks for implementation.
