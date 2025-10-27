# Data Model - City Workflow Approval System

## Core Entities

### User
Represents system users (employees, approvers, admins)

```typescript
interface User {
  id: string; // UUID
  email: string; // Unique, indexed
  employeeId: string; // Unique city employee ID
  firstName: string;
  lastName: string;
  department: string;
  division: string;
  workPhone: string;
  supervisorName: string;
  supervisorEmail: string;
  role: UserRole; // APPLICANT, APPROVER_L1, APPROVER_L2, ADMIN
  isActive: boolean;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
  // Security fields
  passwordHash: string; // bcrypt with cost 12
  mfaEnabled: boolean;
  mfaSecret?: string; // Encrypted
  failedLoginAttempts: number;
  lockedUntil?: Date;
}

enum UserRole {
  APPLICANT = "APPLICANT",
  APPROVER_L1 = "APPROVER_L1",
  APPROVER_L2 = "APPROVER_L2",
  ADMIN = "ADMIN"
}
```

### Application
Represents different city applications (CIS, Munis, etc.)

```typescript
interface Application {
  id: string; // UUID
  name: string; // CIS, Munis, Custom Application Name
  code: string; // Unique identifier (CIS, MUNIS, etc.)
  description: string;
  isActive: boolean;
  requiresApproval: boolean;
  minApprovalLevels: number; // 2-5
  maxApprovalLevels: number; // 2-5
  approvalWorkflow: ApprovalWorkflowConfig;
  customFields: ApplicationField[]; // Dynamic fields per application
  createdAt: Date;
  updatedAt: Date;
}

interface ApplicationField {
  id: string;
  name: string;
  type: FieldType; // TEXT, SELECT, CHECKBOX, DATE, etc.
  label: string;
  required: boolean;
  options?: string[]; // For SELECT fields
  validation?: FieldValidation;
  order: number;
}

enum FieldType {
  TEXT = "TEXT",
  SELECT = "SELECT",
  CHECKBOX = "CHECKBOX",
  DATE = "DATE",
  NUMBER = "NUMBER",
  EMAIL = "EMAIL",
  PHONE = "PHONE"
}
```

### ApplicationRequest
Main entity for approval requests

```typescript
interface ApplicationRequest {
  id: string; // UUID
  requestNumber: string; // Auto-generated (e.g., REQ-2024-0001)
  userId: string; // Foreign key to User
  applicationId: string; // Foreign key to Application
  status: RequestStatus;
  priority: RequestPriority;

  // Request details
  requestType: RequestType; // NEW_ACCOUNT, EXISTING_ACCOUNT, LOCK_ACCOUNT
  environment: ApplicationEnvironment; // PROD, TEST, BOTH
  justification: string; // Business justification text
  requestedRoles: string[]; // Array of role names

  // Dynamic field values (JSON)
  fieldValues: Record<string, any>;

  // Approval workflow
  currentLevel: number; // Current approval level (1-n)
  totalLevels: number; // Total approval levels for this request
  approvalChain: ApprovalStep[];

  // Timestamps
  submittedAt: Date;
  completedAt?: Date;
  expiresAt?: Date;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string; // User ID
  updatedBy: string; // User ID
}

enum RequestStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CHANGES_REQUESTED = "CHANGES_REQUESTED",
  EXPIRED = "EXPIRED"
}

enum RequestPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT"
}

enum RequestType {
  NEW_ACCOUNT = "NEW_ACCOUNT",
  EXISTING_ACCOUNT = "EXISTING_ACCOUNT",
  LOCK_ACCOUNT = "LOCK_ACCOUNT"
}

enum ApplicationEnvironment {
  PROD = "PROD",
  TEST = "TEST",
  BOTH = "BOTH"
}
```

### ApprovalStep
Represents individual steps in the approval workflow

```typescript
interface ApprovalStep {
  id: string; // UUID
  requestId: string; // Foreign key to ApplicationRequest
  level: number; // Approval level (1-n)
  stepOrder: number; // Order within level for parallel approvals
  approverId: string; // Foreign key to User
  status: ApprovalStatus;
  action: ApprovalAction;
  comments: string;
  delegatedTo?: string; // User ID if delegated

  // Timestamps
  assignedAt: Date;
  actionAt?: Date;
  dueAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

enum ApprovalStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CHANGES_REQUESTED = "CHANGES_REQUESTED",
  DELEGATED = "DELEGATED",
  EXPIRED = "EXPIRED"
}

enum ApprovalAction {
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  REQUEST_CHANGES = "REQUEST_CHANGES",
  DELEGATE = "DELEGATE"
}
```

### ApplicationRole
Available roles for each application

```typescript
interface ApplicationRole {
  id: string; // UUID
  applicationId: string; // Foreign key to Application
  name: string; // Role name (e.g., "BSC Billing Workshop")
  description: string;
  permissions: string[]; // Array of permission strings
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### ApprovalWorkflowConfig
Configuration for approval workflows per application

```typescript
interface ApprovalWorkflowConfig {
  levels: ApprovalLevel[];
  allowParallelApproval: boolean;
  requireAllApprovals: boolean; // All approvers at level must approve
  autoEscalation?: AutoEscalationConfig;
}

interface ApprovalLevel {
  level: number;
  name: string; // e.g., "Department Manager", "IT Director"
  approvers: ApproverConfig[];
  requiredApprovals: number; // How many approvals needed at this level
  timeLimit?: number; // Hours before escalation
}

interface ApproverConfig {
  type: ApproverType;
  userId?: string; // For SPECIFIC_USER
  role?: UserRole; // For ROLE_BASED
  department?: string; // For DEPARTMENT_MANAGER
  supervisorOf?: string; // For SUPERVISOR_OF_REQUESTER
}

enum ApproverType {
  SPECIFIC_USER = "SPECIFIC_USER",
  ROLE_BASED = "ROLE_BASED",
  DEPARTMENT_MANAGER = "DEPARTMENT_MANAGER",
  SUPERVISOR_OF_REQUESTER = "SUPERVISOR_OF_REQUESTER"
}
```

### AuditLog
Immutable audit trail for all system actions

```typescript
interface AuditLog {
  id: string; // UUID
  userId: string; // User who performed action
  action: AuditAction;
  entityType: EntityType;
  entityId: string; // ID of affected entity
  oldValues?: Record<string, any>; // Previous values (JSON)
  newValues?: Record<string, any>; // New values (JSON)
  metadata?: Record<string, any>; // Additional context (JSON)
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  // Immutable fields - cannot be modified
  hash: string; // SHA256 hash of log entry for tamper detection
  previousHash?: string; // Hash of previous entry for chain validation
}

enum AuditAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  LOGIN = "LOGIN",
  LOGOUT = "LOGOUT",
  PASSWORD_CHANGE = "PASSWORD_CHANGE",
  DELEGATE = "DELEGATE"
}

enum EntityType {
  USER = "USER",
  APPLICATION = "APPLICATION",
  APPLICATION_REQUEST = "APPLICATION_REQUEST",
  APPROVAL_STEP = "APPROVAL_STEP",
  APPLICATION_ROLE = "APPLICATION_ROLE"
}
```

### Notification
Email and in-app notifications

```typescript
interface Notification {
  id: string; // UUID
  userId: string; // Recipient
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>; // Additional data (JSON)
  isRead: boolean;
  emailSent: boolean;
  emailSentAt?: Date;
  readAt?: Date;
  createdAt: Date;
}

enum NotificationType {
  REQUEST_SUBMITTED = "REQUEST_SUBMITTED",
  APPROVAL_REQUIRED = "APPROVAL_REQUIRED",
  REQUEST_APPROVED = "REQUEST_APPROVED",
  REQUEST_REJECTED = "REQUEST_REJECTED",
  CHANGES_REQUESTED = "CHANGES_REQUESTED",
  DELEGATION_ASSIGNED = "DELEGATION_ASSIGNED"
}
```

## Relationships

```
User (1) ←→ (N) ApplicationRequest
User (1) ←→ (N) ApprovalStep
User (1) ←→ (N) AuditLog
User (1) ←→ (N) Notification

Application (1) ←→ (N) ApplicationRequest
Application (1) ←→ (N) ApplicationRole
Application (1) ←→ (1) ApprovalWorkflowConfig

ApplicationRequest (1) ←→ (N) ApprovalStep
ApplicationRequest (1) ←→ (N) AuditLog
```

## Validation Rules

### User Validation
- Email must be valid city government domain
- Employee ID must be unique and match city format
- Password must meet complexity requirements (12+ chars, mixed case, numbers, symbols)
- Work phone must be valid format

### ApplicationRequest Validation
- Required fields based on application configuration
- Justification minimum 50 characters
- Requested roles must exist for application
- Cannot submit if user has pending requests for same application

### ApprovalStep Validation
- Approver must have required permissions
- Comments required for rejections and change requests
- Cannot approve own requests
- Must be assigned to approver before action

## Database Indexes

```sql
-- Performance indexes
CREATE INDEX idx_user_email ON User(email);
CREATE INDEX idx_user_employee_id ON User(employeeId);
CREATE INDEX idx_application_request_user_id ON ApplicationRequest(userId);
CREATE INDEX idx_application_request_status ON ApplicationRequest(status);
CREATE INDEX idx_application_request_submitted ON ApplicationRequest(submittedAt);
CREATE INDEX idx_approval_step_request_id ON ApprovalStep(requestId);
CREATE INDEX idx_approval_step_approver_id ON ApprovalStep(approverId);
CREATE INDEX idx_approval_step_status ON ApprovalStep(status);
CREATE INDEX idx_audit_log_entity ON AuditLog(entityType, entityId);
CREATE INDEX idx_audit_log_timestamp ON AuditLog(timestamp);
CREATE INDEX idx_notification_user_read ON Notification(userId, isRead);

-- Full-text search indexes
CREATE INDEX idx_application_request_justification ON ApplicationRequest USING gin(to_tsvector('english', justification));
```

## Data Retention Policies

- **Active Requests**: Retained indefinitely until completed
- **Completed Requests**: Retained for 7 years (government requirement)
- **Audit Logs**: Retained for 7 years, immutable
- **User Data**: Retained for 7 years after account deactivation
- **Notifications**: Retained for 1 year
- **Draft Requests**: Auto-deleted after 90 days of inactivity

## Security Considerations

- All PII encrypted at rest using AES-256
- Password hashes using bcrypt with cost factor 12
- Session tokens stored encrypted in Redis
- API keys and credentials stored in environment variables
- Field-level encryption for sensitive application data
- Row-level security for multi-tenant data isolation