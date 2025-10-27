# Quick Start Guide - City Workflow Approval System

## Development Environment Setup

### Prerequisites
- Node.js 20+ & npm
- PostgreSQL 14+
- Redis 6+ (for session caching and queues)
- Git

### 1. Clone and Install
```bash
git clone <repository-url>
cd city-workflow-approval-system
npm install
```

### 2. Environment Configuration
Create `.env.local` file:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/city_workflow"

# Redis
REDIS_URL="redis://localhost:6379"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email (SendGrid)
SENDGRID_API_KEY="your-sendgrid-api-key"
FROM_EMAIL="noreply@city.gov"

# DocuSign Integration
DOCUSIGN_INTEGRATION_KEY="your-docusign-key"
DOCUSIGN_SECRET="your-docusign-secret"
DOCUSIGN_ACCOUNT_ID="your-docusign-account"
DOCUSIGN_BASE_URL="https://demo.docusign.net"

# Security
BCRYPT_ROUNDS=12
SESSION_MAX_AGE=1800
```

### 3. Database Setup
```bash
# Create database
createdb city_workflow

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Seed initial data (applications, admin user)
npm run db:seed
```

### 4. Development Server
```bash
# Start development server
npm run dev

# Start worker for email queue (separate terminal)
npm run worker:dev
```

Access the application at `http://localhost:3000`

## User Roles and Permissions

### Role Hierarchy
- **APPLICANT**: Can submit application requests, view own requests
- **APPROVER_L1**: Can approve level 1 requests, view assigned approvals
- **APPROVER_L2**: Can approve level 2+ requests, view assigned approvals
- **ADMIN**: Full system access, user management, application configuration

### Default Admin Account
After seeding, use these credentials:
- Email: `admin@city.gov`
- Password: `TempPassword123!`

**⚠️ Change this password immediately after first login**

## Creating Your First Application Request

### 1. User Registration
1. Navigate to `/register`
2. Fill out registration form with valid city employee information
3. Wait for admin approval (if required) or use auto-approved domain

### 2. Submit Application Request
1. Login with your credentials
2. Click "New Request" button
3. Select application type (CIS, Munis, etc.)
4. Fill out required fields:
   - Request type (New Account, Existing Account, Lock Account)
   - Environment (Production, Test, Both)
   - Business justification (minimum 50 characters)
   - Requested roles (select from available options)
5. Review and submit request

### 3. Track Request Status
- View all your requests on the dashboard
- Click on request number for detailed status
- Receive email notifications on status changes
- Respond to change requests if required

## Admin Configuration

### 1. Configure Applications
1. Login as admin
2. Navigate to Admin → Applications
3. Click "Add Application"
4. Configure:
   - Application name and code
   - Approval levels (2-5)
   - Custom fields for requests
   - Available roles
5. Set up approval workflow with approver assignments

### 2. Manage Users
1. Navigate to Admin → Users
2. View user list with filters
3. Edit user roles and permissions
4. Activate/deactivate accounts
5. View user activity and audit logs

### 3. Monitor Approvals
1. Navigate to Admin → Approvals
2. View all pending approvals across system
3. Override or reassign approvals if needed
4. Generate reports on approval metrics

## Testing

### Run Tests
```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

### Test Data
Use the seeded test accounts:
- `test.user@city.gov` / `TestPassword123!` (Applicant)
- `test.approver@city.gov` / `TestPassword123!` (Approver L1)
- `test.admin@city.gov` / `TestPassword123!` (Admin)

## Common Development Tasks

### Adding New Application Type
1. Update application configuration in admin panel
2. Add custom fields as needed
3. Configure approval workflow
4. Test end-to-end flow

### Modifying Approval Workflow
1. Navigate to Admin → Applications → Edit
2. Update approval levels and approvers
3. Test with sample requests
4. Update documentation

### Customizing Email Templates
1. Edit templates in `/lib/email/templates/`
2. Update template variables if needed
3. Test email delivery
4. Verify spam folder placement

### Adding New User Role
1. Update `UserRole` enum in data model
2. Add role-based permissions
3. Update UI components
4. Test access control

## Performance Optimization

### Database Optimization
- Ensure all indexes are created
- Monitor slow query log
- Use connection pooling
- Implement read replicas for reporting

### Frontend Optimization
- Enable Next.js image optimization
- Implement code splitting for heavy components
- Use React.memo for expensive renders
- Optimize bundle size with tree shaking

### Caching Strategy
- Redis for session storage
- Next.js cache for static content
- Database query result caching
- CDN for static assets

## Troubleshooting

### Common Issues

**Database Connection Errors**
- Check PostgreSQL service status
- Verify connection string in `.env.local`
- Ensure database exists and user has permissions

**Authentication Issues**
- Check NextAuth configuration
- Verify JWT secret is set
- Clear browser cookies and retry

**Email Delivery Problems**
- Verify SendGrid API key
- Check spam folder
- Review email template syntax

**Approval Workflow Stuck**
- Check approver assignments
- Verify user roles and permissions
- Review approval step status

### Debug Mode
Enable debug logging:
```bash
DEBUG=city-workflow:* npm run dev
```

### Performance Monitoring
- Check API response times in browser dev tools
- Monitor database query performance
- Use Next.js analytics for real user metrics
- Set up alerts for performance degradation

## Deployment

### Production Build
```bash
npm run build
npm run start
```

### Environment Variables for Production
- Use production database URL
- Set production NextAuth secret
- Configure production email service
- Set up monitoring and logging

### Database Migrations
```bash
npx prisma migrate deploy
```

### Health Checks
- `/api/health` - Basic health check
- `/api/health/db` - Database connectivity
- `/api/health/redis` - Redis connectivity

## Support and Documentation

### Internal Documentation
- API documentation: `/api-docs`
- Database schema: `prisma/schema.prisma`
- Component documentation: Storybook (if configured)

### External Resources
- NextAuth.js documentation
- Prisma ORM documentation
- PostgreSQL documentation
- shadcn/ui component library

### Getting Help
1. Check existing documentation
2. Review error logs
3. Search closed issues
4. Contact development team
5. Submit bug reports with reproduction steps

## Security Checklist

- [ ] Change default admin password
- [ ] Configure HTTPS/TLS
- [ ] Set up rate limiting
- [ ] Enable audit logging
- [ ] Configure backup procedures
- [ ] Set up monitoring alerts
- [ ] Review user permissions regularly
- [ ] Update dependencies frequently
- [ ] Conduct security audits
- [ ] Test disaster recovery procedures