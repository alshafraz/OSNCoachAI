// src/application/operations/domain/models/SystemEvent.ts

export interface SystemEvent {
  id: string;
  eventType: 'AUTHENTICATION' | 'AUTHORIZATION' | 'ADMIN_ACTION' | 'SECURITY_ALERT' | 'METRIC_BREACH' | 'MAINTENANCE';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  actor: string; // user identifier or service name
  description: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  timestamp: Date;
}
