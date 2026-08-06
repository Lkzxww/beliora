-- Align Agenda UI fields with persisted appointments.
ALTER TYPE "AppointmentStatus" ADD VALUE IF NOT EXISTS 'CONFIRMED';

ALTER TABLE "Appointment" ADD COLUMN "notes" TEXT;
