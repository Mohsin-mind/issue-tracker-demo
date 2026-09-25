import {
  User,
  Project,
  ProjectMember,
  BoardColumn,
  Issue,
  Label,
  IssueLabel,
  Comment,
  sequelize,
} from '../../models';
import { IssuePriority, DEFAULT_COLUMNS } from '../../constants/status.constants';

export const seedDemoData = async (): Promise<void> => {
  console.log('🌱 Starting database seeding with realistic demo data...');

  const transaction = await sequelize.transaction();

  try {
    // 1. Seed Users
    console.log('👤 Seeding demo users...');
    const users = await User.bulkCreate(
      [
        {
          name: 'John Smith',
          email: 'john.smith@example.com',
          avatar_color: '#6366f1', // Indigo
        },
        {
          name: 'Sarah Wilson',
          email: 'sarah.wilson@example.com',
          avatar_color: '#ec4899', // Pink
        },
        {
          name: 'David Brown',
          email: 'david.brown@example.com',
          avatar_color: '#10b981', // Emerald
        },
        {
          name: 'Emily Davis',
          email: 'emily.davis@example.com',
          avatar_color: '#f59e0b', // Amber
        },
      ],
      { transaction, returning: true }
    );

    const [john, sarah, david, emily] = users;

    // 2. Seed Projects
    console.log('📁 Seeding demo projects...');
    const projectWolf = await Project.create(
      {
        name: 'Estate Planning Platform',
        key: 'WOLF',
        description:
          'Comprehensive legal estate planning platform offering digital questionnaires, beneficiary validations, asset distributions, and automated notarized PDF generation.',
      },
      { transaction }
    );

    const projectApp = await Project.create(
      {
        name: 'Internal Admin Platform',
        key: 'APP',
        description:
          'Internal operations suite for staff access controls, payment auditing, compliance reporting, and customer telemetry monitoring.',
      },
      { transaction }
    );

    // 3. Assign Project Members
    console.log('🤝 Assigning project members...');
    await ProjectMember.bulkCreate(
      [
        // WOLF members: John, Sarah, David, Emily
        { project_id: projectWolf.id, user_id: john.id },
        { project_id: projectWolf.id, user_id: sarah.id },
        { project_id: projectWolf.id, user_id: david.id },
        { project_id: projectWolf.id, user_id: emily.id },
        // APP members: John, Sarah, David
        { project_id: projectApp.id, user_id: john.id },
        { project_id: projectApp.id, user_id: sarah.id },
        { project_id: projectApp.id, user_id: david.id },
      ],
      { transaction }
    );

    // 4. Seed Board Columns
    console.log('📋 Creating default Kanban columns...');
    const wolfColumns = await BoardColumn.bulkCreate(
      DEFAULT_COLUMNS.map((col) => ({
        project_id: projectWolf.id,
        name: col.name,
        position: col.position,
      })),
      { transaction, returning: true }
    );

    const appColumns = await BoardColumn.bulkCreate(
      DEFAULT_COLUMNS.map((col) => ({
        project_id: projectApp.id,
        name: col.name,
        position: col.position,
      })),
      { transaction, returning: true }
    );

    const wolfColMap: Record<string, BoardColumn> = {};
    wolfColumns.forEach((c) => (wolfColMap[c.name] = c));

    const appColMap: Record<string, BoardColumn> = {};
    appColumns.forEach((c) => (appColMap[c.name] = c));

    // 5. Seed Labels
    console.log('🏷️ Creating project labels...');
    const wolfLabels = await Label.bulkCreate(
      [
        { project_id: projectWolf.id, name: 'Feature', color: '#3b82f6' },
        { project_id: projectWolf.id, name: 'Bug', color: '#ef4444' },
        { project_id: projectWolf.id, name: 'Legal', color: '#10b981' },
        { project_id: projectWolf.id, name: 'UI/UX', color: '#ec4899' },
        { project_id: projectWolf.id, name: 'Backend', color: '#8b5cf6' },
        { project_id: projectWolf.id, name: 'Performance', color: '#f59e0b' },
      ],
      { transaction, returning: true }
    );

    const appLabels = await Label.bulkCreate(
      [
        { project_id: projectApp.id, name: 'Security', color: '#ef4444' },
        { project_id: projectApp.id, name: 'DevOps', color: '#6366f1' },
        { project_id: projectApp.id, name: 'API', color: '#3b82f6' },
        { project_id: projectApp.id, name: 'Billing', color: '#10b981' },
      ],
      { transaction, returning: true }
    );

    const wolfLabelMap: Record<string, Label> = {};
    wolfLabels.forEach((l) => (wolfLabelMap[l.name] = l));

    const appLabelMap: Record<string, Label> = {};
    appLabels.forEach((l) => (appLabelMap[l.name] = l));

    // 6. Seed Issues for WOLF Project (14 issues)
    console.log('📌 Seeding issues for WOLF (Estate Planning Platform)...');
    const wolfIssuesData = [
      {
        project_id: projectWolf.id,
        column_id: wolfColMap['Backlog'].id,
        issue_number: 10,
        title: 'Audit log export to encrypted S3 bucket',
        description: 'Provide an automated daily export of user legal disclosures and audit trails to cold storage.',
        priority: IssuePriority.LOW,
        assignee_id: david.id,
        reporter_id: john.id,
        position: 1000,
        due_date: '2026-11-01',
        labels: [wolfLabelMap['Backend'], wolfLabelMap['Legal']],
      },
      {
        project_id: projectWolf.id,
        column_id: wolfColMap['Backlog'].id,
        issue_number: 11,
        title: 'GDPR user data erasure endpoint',
        description: 'Implement self-serve data purge endpoint in compliance with Article 17 regulations.',
        priority: IssuePriority.MEDIUM,
        assignee_id: null,
        reporter_id: sarah.id,
        position: 2000,
        due_date: '2026-11-15',
        labels: [wolfLabelMap['Backend'], wolfLabelMap['Legal']],
      },
      {
        project_id: projectWolf.id,
        column_id: wolfColMap['Backlog'].id,
        issue_number: 12,
        title: 'Client intake wizard step 4 redesign',
        description: 'Streamline marital status and child guardianship questions for simplified mobile entry.',
        priority: IssuePriority.LOW,
        assignee_id: emily.id,
        reporter_id: john.id,
        position: 3000,
        due_date: null,
        labels: [wolfLabelMap['UI/UX']],
      },
      {
        project_id: projectWolf.id,
        column_id: wolfColMap['Backlog'].id,
        issue_number: 13,
        title: 'Optimize Postgres queries on board dashboard',
        description: 'Add composite indexes on column_id and position to reduce query time during heavy loads.',
        priority: IssuePriority.MEDIUM,
        assignee_id: david.id,
        reporter_id: david.id,
        position: 4000,
        due_date: '2026-10-30',
        labels: [wolfLabelMap['Performance'], wolfLabelMap['Backend']],
      },
      {
        project_id: projectWolf.id,
        column_id: wolfColMap['Backlog'].id,
        issue_number: 14,
        title: 'Implement dark mode WCAG AA compliance',
        description: 'Ensure color contrast for badges and secondary typography meets accessibility criteria.',
        priority: IssuePriority.LOW,
        assignee_id: emily.id,
        reporter_id: sarah.id,
        position: 5000,
        due_date: null,
        labels: [wolfLabelMap['UI/UX']],
      },
      {
        project_id: projectWolf.id,
        column_id: wolfColMap['To Do'].id,
        issue_number: 7,
        title: 'Design responsive mobile layout for notary step',
        description: 'Provide a dedicated touch-friendly signature interface when clients sign on mobile devices.',
        priority: IssuePriority.HIGH,
        assignee_id: emily.id,
        reporter_id: john.id,
        position: 1000,
        due_date: '2026-10-10',
        labels: [wolfLabelMap['UI/UX'], wolfLabelMap['Feature']],
      },
      {
        project_id: projectWolf.id,
        column_id: wolfColMap['To Do'].id,
        issue_number: 8,
        title: 'Implement passwordless magic link login for clients',
        description: 'Allow clients to resume estate questionnaires via secure tokenized email links without password barriers.',
        priority: IssuePriority.MEDIUM,
        assignee_id: sarah.id,
        reporter_id: david.id,
        position: 2000,
        due_date: '2026-10-18',
        labels: [wolfLabelMap['Feature'], wolfLabelMap['Backend']],
      },
      {
        project_id: projectWolf.id,
        column_id: wolfColMap['To Do'].id,
        issue_number: 9,
        title: 'Add multi-currency support for international assets',
        description: 'Allow valuation of offshore bank accounts and foreign real estate with live ECB currency conversions.',
        priority: IssuePriority.LOW,
        assignee_id: david.id,
        reporter_id: sarah.id,
        position: 3000,
        due_date: '2026-10-25',
        labels: [wolfLabelMap['Feature']],
      },
      {
        project_id: projectWolf.id,
        column_id: wolfColMap['In Progress'].id,
        issue_number: 4,
        title: 'Improve dashboard velocity & load performance',
        description: 'Refactor TanStack Query caching to eliminate waterfall requests when switching between projects.',
        priority: IssuePriority.HIGH,
        assignee_id: john.id,
        reporter_id: david.id,
        position: 1000,
        due_date: '2026-10-05',
        labels: [wolfLabelMap['Performance']],
      },
      {
        project_id: projectWolf.id,
        column_id: wolfColMap['In Progress'].id,
        issue_number: 5,
        title: 'Add document watermark preview in PDF viewer',
        description: 'Render "DRAFT" watermark diagonally across generated PDFs until final attorney approval.',
        priority: IssuePriority.MEDIUM,
        assignee_id: sarah.id,
        reporter_id: emily.id,
        position: 2000,
        due_date: '2026-10-08',
        labels: [wolfLabelMap['Feature'], wolfLabelMap['Legal']],
      },
      {
        project_id: projectWolf.id,
        column_id: wolfColMap['In Progress'].id,
        issue_number: 6,
        title: 'Integrate DocuSign webhook verification',
        description: 'Verify HMAC signatures on incoming envelope completion webhooks before updating will status.',
        priority: IssuePriority.URGENT,
        assignee_id: david.id,
        reporter_id: john.id,
        position: 3000,
        due_date: '2026-10-03',
        labels: [wolfLabelMap['Backend']],
      },
      {
        project_id: projectWolf.id,
        column_id: wolfColMap['Review'].id,
        issue_number: 3,
        title: 'Add beneficiary percentage allocation validation',
        description: 'Enforce that primary beneficiary allocations sum to exactly 100% before allowing advance to step 5.',
        priority: IssuePriority.URGENT,
        assignee_id: sarah.id,
        reporter_id: john.id,
        position: 1000,
        due_date: '2026-09-30',
        labels: [wolfLabelMap['Bug'], wolfLabelMap['Legal']],
      },
      {
        project_id: projectWolf.id,
        column_id: wolfColMap['Done'].id,
        issue_number: 1,
        title: 'Create estate plan questionnaire data model',
        description: 'Establish initial schema for wills, trusts, health care proxies, and durable power of attorney.',
        priority: IssuePriority.HIGH,
        assignee_id: john.id,
        reporter_id: john.id,
        position: 1000,
        due_date: '2026-09-20',
        labels: [wolfLabelMap['Feature'], wolfLabelMap['Legal']],
      },
      {
        project_id: projectWolf.id,
        column_id: wolfColMap['Done'].id,
        issue_number: 2,
        title: 'Fix PDF generation crash on non-ASCII symbols',
        description: 'Resolved font embedding defect in pdfkit that caused memory exhaustion on special accented names.',
        priority: IssuePriority.URGENT,
        assignee_id: david.id,
        reporter_id: sarah.id,
        position: 2000,
        due_date: '2026-09-22',
        labels: [wolfLabelMap['Bug']],
      },
    ];

    for (const item of wolfIssuesData) {
      const { labels, ...issueData } = item;
      const issue = await Issue.create(issueData, { transaction });
      if (labels && labels.length > 0) {
        await IssueLabel.bulkCreate(
          labels.map((l) => ({ issue_id: issue.id, label_id: l.id })),
          { transaction }
        );
      }

      // Add comments to key issues
      if (item.issue_number === 3) {
        await Comment.create(
          {
            issue_id: issue.id,
            user_id: john.id,
            body: 'Legal team validated the 100% total invariant. Ready for code review!',
          },
          { transaction }
        );
        await Comment.create(
          {
            issue_id: issue.id,
            user_id: sarah.id,
            body: 'Reviewed PR #42. Added unit tests for edge cases with 3 decimal precision percentages.',
          },
          { transaction }
        );
      }

      if (item.issue_number === 2) {
        await Comment.create(
          {
            issue_id: issue.id,
            user_id: david.id,
            body: 'Patched in release v1.4.1. Unicode test suite now runs green on CI.',
          },
          { transaction }
        );
      }
    }

    // 7. Seed Issues for APP Project (8 issues)
    console.log('📌 Seeding issues for APP (Internal Admin Platform)...');
    const appIssuesData = [
      {
        project_id: projectApp.id,
        column_id: appColMap['Backlog'].id,
        issue_number: 7,
        title: 'Prometheus metrics exporter for API latencies',
        description: 'Expose /metrics endpoint tracking p95 and p99 response times per route handler.',
        priority: IssuePriority.LOW,
        assignee_id: david.id,
        reporter_id: john.id,
        position: 1000,
        due_date: '2026-11-20',
        labels: [appLabelMap['DevOps']],
      },
      {
        project_id: projectApp.id,
        column_id: appColMap['Backlog'].id,
        issue_number: 8,
        title: 'Migrate legacy secrets to AWS Secrets Manager',
        description: 'Deprecate unencrypted config variables and integrate IAM role-based secret resolution.',
        priority: IssuePriority.MEDIUM,
        assignee_id: null,
        reporter_id: sarah.id,
        position: 2000,
        due_date: '2026-11-25',
        labels: [appLabelMap['Security']],
      },
      {
        project_id: projectApp.id,
        column_id: appColMap['To Do'].id,
        issue_number: 5,
        title: 'User suspension and revocation audit trail',
        description: 'Record administrator IP, reason code, and timestamp whenever an employee account is disabled.',
        priority: IssuePriority.HIGH,
        assignee_id: sarah.id,
        reporter_id: john.id,
        position: 1000,
        due_date: '2026-10-12',
        labels: [appLabelMap['Security'], appLabelMap['API']],
      },
      {
        project_id: projectApp.id,
        column_id: appColMap['To Do'].id,
        issue_number: 6,
        title: 'Bulk CSV employee invite import',
        description: 'Support uploading CSV spreadsheets up to 500 rows to bulk invite support agents.',
        priority: IssuePriority.MEDIUM,
        assignee_id: david.id,
        reporter_id: sarah.id,
        position: 2000,
        due_date: '2026-10-15',
        labels: [appLabelMap['API']],
      },
      {
        project_id: projectApp.id,
        column_id: appColMap['In Progress'].id,
        issue_number: 3,
        title: 'Stripe webhook billing reconciliation daemon',
        description: 'Handle customer.subscription.deleted events and gracefully downgrade organizational tier.',
        priority: IssuePriority.URGENT,
        assignee_id: john.id,
        reporter_id: sarah.id,
        position: 1000,
        due_date: '2026-10-04',
        labels: [appLabelMap['Billing'], appLabelMap['API']],
      },
      {
        project_id: projectApp.id,
        column_id: appColMap['In Progress'].id,
        issue_number: 4,
        title: 'Add Redis cache layer to global search',
        description: 'Cache frequent search prefix queries with 60-second TTL to reduce database CPU spikes.',
        priority: IssuePriority.HIGH,
        assignee_id: david.id,
        reporter_id: john.id,
        position: 2000,
        due_date: '2026-10-09',
        labels: [appLabelMap['DevOps']],
      },
      {
        project_id: projectApp.id,
        column_id: appColMap['Review'].id,
        issue_number: 2,
        title: 'Fix session expiration race condition on tab restore',
        description: 'Refresh token rotation triggered simultaneous invalidations when multiple tabs reopened.',
        priority: IssuePriority.HIGH,
        assignee_id: sarah.id,
        reporter_id: david.id,
        position: 1000,
        due_date: '2026-09-29',
        labels: [appLabelMap['Security']],
      },
      {
        project_id: projectApp.id,
        column_id: appColMap['Done'].id,
        issue_number: 1,
        title: 'Implement RBAC role permission matrix for staff',
        description: 'Configured role hierarchy: SuperAdmin, OperationsLead, SupportTier2, Auditor.',
        priority: IssuePriority.HIGH,
        assignee_id: john.id,
        reporter_id: john.id,
        position: 1000,
        due_date: '2026-09-18',
        labels: [appLabelMap['Security'], appLabelMap['API']],
      },
    ];

    for (const item of appIssuesData) {
      const { labels, ...issueData } = item;
      const issue = await Issue.create(issueData, { transaction });
      if (labels && labels.length > 0) {
        await IssueLabel.bulkCreate(
          labels.map((l) => ({ issue_id: issue.id, label_id: l.id })),
          { transaction }
        );
      }

      if (item.issue_number === 3) {
        await Comment.create(
          {
            issue_id: issue.id,
            user_id: john.id,
            body: 'Webhook handler implemented with idempotent invoice ID check.',
          },
          { transaction }
        );
      }
    }

    await transaction.commit();
    console.log('✅ All demo data seeded successfully!');
  } catch (error) {
    await transaction.rollback();
    console.error('❌ Seeding failed with error:', error);
    throw error;
  }
};

// If run directly from CLI
if (require.main === module) {
  seedDemoData()
    .then(async () => {
      await sequelize.close().catch(() => {});
      console.log('🎉 Seeding complete.');
      process.exit(0);
    })
    .catch(async (err) => {
      await sequelize.close().catch(() => {});
      console.error('❌ Seeding error:', err);
      process.exit(1);
    });
}
