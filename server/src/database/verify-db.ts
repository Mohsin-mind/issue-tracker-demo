import {
  User,
  Project,
  ProjectMember,
  BoardColumn,
  Issue,
  Label,
  Comment,
  sequelize,
} from '../models';

export const runDatabaseVerification = async (): Promise<boolean> => {
  console.log('\n========================================');
  console.log('🧪 RUNNING PHASE 2 DATABASE TEST SUITE');
  console.log('========================================\n');

  let passedTests = 0;
  let totalTests = 6;

  try {
    // Test 1: Verify users and attributes
    console.log('🔹 Test 1: Verifying User models & attributes...');
    const users = await User.findAll({ order: [['name', 'ASC']] });
    if (users.length >= 4 && users[0].avatar_color.startsWith('#')) {
      console.log(`   ✅ PASSED: Found ${users.length} valid users with avatar hex colors.`);
      passedTests++;
    } else {
      console.error(`   ❌ FAILED: Expected at least 4 users with hex avatar colors, found ${users.length}.`);
    }

    // Test 2: Verify projects & unique key constraint
    console.log('\n🔹 Test 2: Verifying Project models & unique key constraint...');
    const wolfProject = await Project.findOne({ where: { key: 'WOLF' } });
    const appProject = await Project.findOne({ where: { key: 'APP' } });

    if (wolfProject && appProject) {
      // Test duplicate project key rejection
      try {
        await Project.create({
          name: 'Duplicate Key Test',
          key: 'WOLF',
          description: 'Should fail',
        });
        console.error('   ❌ FAILED: Duplicate project key WOLF was not rejected.');
      } catch (err: any) {
        console.log('   ✅ PASSED: Projects exist and duplicate key was strictly rejected.');
        passedTests++;
      }
    } else {
      console.error('   ❌ FAILED: WOLF or APP project missing.');
    }

    // Test 3: Verify project members associations
    console.log('\n🔹 Test 3: Verifying Project-Member associations...');
    if (wolfProject) {
      const wolfMembers = await wolfProject.getMembers();
      if (wolfMembers.length === 4) {
        console.log(`   ✅ PASSED: Project WOLF has ${wolfMembers.length} assigned members.`);
        passedTests++;
      } else {
        console.error(`   ❌ FAILED: Expected 4 members for WOLF, found ${wolfMembers.length}.`);
      }
    }

    // Test 4: Verify issue key numbering & project-scoped uniqueness
    console.log('\n🔹 Test 4: Verifying Issue unique numbering (project_id, issue_number)...');
    if (wolfProject) {
      try {
        await Issue.create({
          project_id: wolfProject.id,
          column_id: (await BoardColumn.findOne({ where: { project_id: wolfProject.id } }))!.id,
          issue_number: 1, // Already exists for WOLF
          title: 'Duplicate Issue Number Test',
          priority: (await Issue.findOne())!.priority,
          reporter_id: users[0].id,
          position: 9999,
        });
        console.error('   ❌ FAILED: Duplicate issue_number 1 was not rejected.');
      } catch (err: any) {
        console.log('   ✅ PASSED: Composite unique index (project_id, issue_number) enforced.');
        passedTests++;
      }
    }

    // Test 5: Verify Kanban column positions and issue ordering
    console.log('\n🔹 Test 5: Verifying BoardColumn ordering and Issue positions...');
    if (wolfProject) {
      const columns = await BoardColumn.findAll({
        where: { project_id: wolfProject.id },
        order: [['position', 'ASC']],
      });

      const isOrdered = columns.every((col, idx) => col.position === idx);
      if (columns.length === 5 && isOrdered) {
        console.log('   ✅ PASSED: All 5 Kanban columns are sequentially ordered by position (0 to 4).');
        passedTests++;
      } else {
        console.error('   ❌ FAILED: Column count or ordering is invalid.');
      }
    }

    // Test 6: Verify Seeder data integrity (eager-loaded relationships)
    console.log('\n🔹 Test 6: Verifying Eager-Loaded board state (issues, labels, comments)...');
    const totalIssues = await Issue.count();
    const totalLabels = await Label.count();
    const totalComments = await Comment.count();

    const sampleIssue = await Issue.findOne({
      where: { issue_number: 3 },
      include: [
        { model: Label, as: 'labels' },
        { model: Comment, as: 'comments' },
        { model: User, as: 'assignee' },
      ],
    });

    if (
      totalIssues >= 22 &&
      totalLabels >= 10 &&
      totalComments >= 3 &&
      sampleIssue &&
      sampleIssue.comments!.length > 0 &&
      sampleIssue.labels!.length > 0
    ) {
      console.log(
        `   ✅ PASSED: Seed data verified with ${totalIssues} issues, ${totalLabels} labels, and ${totalComments} comments.`
      );
      passedTests++;
    } else {
      console.error('   ❌ FAILED: Eager-loaded relations incomplete.');
    }

    console.log('\n========================================');
    console.log(`🏁 TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
    console.log('========================================\n');

    return passedTests === totalTests;
  } catch (error) {
    console.error('❌ Verification test execution failed with error:', error);
    return false;
  } finally {
    await sequelize.close().catch(() => {});
  }
};

// If run directly from CLI
if (require.main === module) {
  runDatabaseVerification()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
