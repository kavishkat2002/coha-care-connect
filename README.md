# COHA Health Intelligence

You are a Senior Product Designer, Senior UI/UX Designer, Full Stack Engineer, and Healthcare SaaS Architect.

Design and build a production-quality healthcare platform called:

COHA AI

AI-Powered Intelligent Healthcare & Early Cancer Screening Platform

IMPORTANT DESIGN RULES

• Build a clean, modern, premium healthcare SaaS application.

• Use a minimal design language.

• DO NOT use neon colors.

• DO NOT use glowing effects.

• DO NOT use glassmorphism.

• DO NOT use futuristic cyberpunk styles.

• Keep generous whitespace.

• Rounded corners.

• Soft shadows only.

• Professional healthcare appearance.

• Similar design quality to Stripe, Notion, Linear, Vercel, and modern hospital systems.

• Light theme first.

• Fully responsive.

• Accessible UI.

• Smooth but subtle animations only.

Tech Stack

React

TypeScript

TailwindCSS

shadcn/ui

Framer Motion

Supabase Authentication

Supabase Database

PostgreSQL

==================================================

PROJECT OVERVIEW

COHA AI is not simply an AI cancer detection website.

It is a complete AI-powered healthcare ecosystem combining

• Appointment Booking

• AI Healthcare Assistant

• Medical Image Analysis

• Medical Report Analysis

• Hospital Recommendation

• Specialist Recommendation

• Telemedicine

• Digital Health Record

• Personalized Health Timeline

==================================================

USER ROLES

Patient

Doctor

Hospital Administrator

System Administrator

==================================================

LANDING WEBSITE

Create a premium landing page.

Sections

Navigation

Hero

Platform Overview

How It Works

Healthcare Services

AI Features

Cancer Screening

Telemedicine

Statistics

Testimonials

FAQ

Contact

Footer

Hero CTA

Book Appointment

Try AI Assistant

==================================================

AUTHENTICATION

Login

Register

Forgot Password

Role Selection

Patient

Doctor

Hospital

==================================================

PATIENT DASHBOARD

Dashboard Overview

Health Summary

Upcoming Appointments

Recent Reports

Notifications

AI Health Assistant

Medical Timeline

Quick Actions

Book Appointment

Start AI Chat

Upload Report

Upload Medical Image

==================================================

PATIENT HAS TWO MAIN OPTIONS

OPTION 01

Traditional Appointment Booking

OPTION 02

AI Healthcare Assistant

==================================================

OPTION 01

MANUAL BOOKING FLOW

Search Doctor

Search Hospital

Search by Specialty

Choose Branch

View Doctor Ratings

View Hospital Ratings

Check Availability

Book Appointment

Payment

Booking Confirmation

QR Ticket

Appointment History

==================================================

OPTION 02

AI HEALTHCARE ASSISTANT

The AI assistant is the primary intelligent entry point.

Patient can

Chat naturally

Describe symptoms

Upload infected area images

Upload medical reports

Upload prescriptions

Upload laboratory reports

Upload previous diagnoses

Upload scans

The AI Assistant should understand the user's intention.

Examples

"I have a mouth ulcer."

"I have a skin rash."

"I have breast pain."

"I have an eye infection."

"I need a dermatologist."

==================================================

AI WORKFLOW

Patient Message

↓

Intent Detection

↓

If image uploaded

Send to Medical Vision AI

↓

If report uploaded

Send to Medical Report AI

↓

If symptoms only

Use AI Symptom Analysis

↓

Generate

Possible Conditions

Risk Level

Confidence Score

Summary

Recommendation

↓

Explain results in simple language

↓

Recommend

Hospital

Hospital Branch

Medical Department

Best Specialist

Available Appointment Slots

Telemedicine Option

==================================================

IMPORTANT

The AI must NEVER claim to diagnose diseases.

The UI should always display

"This is an AI-assisted health assessment and should not replace professional medical advice."

==================================================

MEDICAL IMAGE ANALYSIS

Support

Oral

Skin

Breast

Eye

Workflow

Upload

Image Quality Check

Image Enhancement

Lesion Detection

Risk Assessment

Confidence Score

Heatmap

Clinical Explanation

Recommendation

==================================================

MEDICAL REPORT ANALYSIS

Patient uploads

Blood Reports

MRI

CT

Biopsy

Laboratory Reports

PDF

Images

AI summarizes

Highlights abnormal values

Explains report in simple language

Suggests relevant specialist

Stores report

==================================================

RECOMMENDATION ENGINE

Recommend hospitals using

Patient location

Medical specialty

Doctor ratings

Hospital ratings

Availability

Distance

Experience

Queue length

Display

Top Rated

Nearest

Most Available

==================================================

DOCTOR PROFILE

Photo

Specialization

Experience

Languages

Hospital

Ratings

Reviews

Availability

Consultation Fee

Book Button

==================================================

HOSPITAL PROFILE

Hospital Information

Branches

Departments

Doctors

Ratings

Facilities

Emergency

Location

Contact

==================================================

TELEMEDICINE

Available Online Doctors

Video Consultation

Voice Consultation

Chat Consultation

Digital Prescription

Follow-up Booking

==================================================

PATIENT PROFILE

Personal Information

Medical History

Past Diseases

Current Medications

Allergies

Family History

Uploaded Reports

Medical Images

Appointments

Treatments

Health Timeline

==================================================

PERSONAL HEALTH INTELLIGENCE

The platform continuously builds a health profile using

Appointments

Medical Reports

Uploaded Images

Previous Symptoms

Treatments

Doctor Visits

The AI provides

Personalized Health Insights

Preventive Recommendations

Suggested Specialists

Health Trends

Future Risk Monitoring

==================================================

COMING SOON

Wearable Device Integration

Apple Health

Google Fit

Samsung Health

Fitbit

Garmin

Display as "Coming Soon"

==================================================

DOCTOR DASHBOARD

Today's Appointments

Patient Queue

Patient Timeline

Medical Reports

AI Assessments

Diagnosis

Prescription

Follow-up

Telemedicine

Analytics

==================================================

HOSPITAL DASHBOARD

Doctors

Departments

Appointments

Patients

Revenue

Analytics

Ratings

Reports

==================================================

ADMIN DASHBOARD

Users

Doctors

Hospitals

Appointments

Reports

AI Monitoring

Analytics

CMS

Settings

==================================================

DESIGN SYSTEM

Primary

#2563EB

Success

#16A34A

Warning

#F59E0B

Danger

#DC2626

Background

#F8FAFC

Cards

White

Soft Shadow

Border Radius 16px

Typography

Inter

Icons

Lucide

Spacing

Large

Minimal

Professional

==================================================

UI COMPONENTS

Reusable Components

Modern Cards

Tables

Forms

Charts

Search

Filters

Pagination

Notifications

Breadcrumbs

Dialogs

Drawers

Responsive Navigation

==================================================

PROJECT STRUCTURE

Organize into

Landing

Authentication

Patient Portal

Doctor Portal

Hospital Portal

Admin Portal

Shared Components

Services

Hooks

Utilities

Layouts

==================================================

IMPORTANT

Generate every page as production-quality UI.

Create reusable components.

Maintain consistent spacing.

Keep everything modular.

Prioritize clean UX over decorative effects.

Do not implement AI models yet.

Create placeholder services and APIs for future AI integration.

Build the complete frontend architecture as if this product will be deployed commercially.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://coha-care-connect.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/229e7751-5475-4f6a-9738-1c57186e6dba).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
