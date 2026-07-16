-- Migración 003: reporte largo por proyecto y detalle largo por subtarea

ALTER TABLE projects ADD COLUMN report TEXT;
ALTER TABLE tasks ADD COLUMN detail TEXT;
