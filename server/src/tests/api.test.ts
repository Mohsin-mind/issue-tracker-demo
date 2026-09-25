import { Server } from 'http';
import app from '../app';
import { Project, BoardColumn, User, Issue, Comment, sequelize } from '../models';

export const runApiTests = async (): Promise<boolean> => {
  console.log('\n========================================');
  console.log('🧪 RUNNING PHASE 3 BACKEND API TEST SUITE');
  console.log('========================================\n');

  let passedTests = 0;
  const totalTests = 7;

  // Start temporary HTTP server to test real HTTP requests with fetch
  const testPort = 5999;
  const server: Server = await new Promise((resolve) => {
    const s = app.listen(testPort, () => resolve(s));
  });

  const baseUrl = `http://localhost:${testPort}/api`;

  try {
    // Test 1: Health check endpoint
    console.log('🔹 Test 1: GET /api/health');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthJson = await healthRes.json();
    if (healthRes.status === 200 && healthJson.success === true && healthJson.data.status === 'UP') {
      console.log('   ✅ PASSED: Health endpoint returned 200 and standard envelope.');
      passedTests++;
    } else {
      console.error('   ❌ FAILED: Health endpoint failed:', healthJson);
    }

    // Test 2: Projects listing with aggregated counts
    console.log('\n🔹 Test 2: GET /api/projects');
    const projectsRes = await fetch(`${baseUrl}/projects`);
    const projectsJson = await projectsRes.json();
    if (
      projectsRes.status === 200 &&
      projectsJson.success === true &&
      Array.isArray(projectsJson.data) &&
      projectsJson.data.length >= 2 &&
      projectsJson.data[0].issues_count !== undefined
    ) {
      console.log(
        `   ✅ PASSED: Found ${projectsJson.data.length} projects with eager-loaded counts.`
      );
      passedTests++;
    } else {
      console.error('   ❌ FAILED: Projects listing failed:', projectsJson);
    }

    // Test 3: Project Board endpoint (nested columns, issues, labels, comments)
    console.log('\n🔹 Test 3: GET /api/projects/:projectId/board');
    const wolfProject = await Project.findOne({ where: { key: 'WOLF' } });
    if (!wolfProject) throw new Error('WOLF project missing');

    const boardRes = await fetch(`${baseUrl}/projects/${wolfProject.id}/board`);
    const boardJson = await boardRes.json();
    if (
      boardRes.status === 200 &&
      boardJson.success === true &&
      boardJson.data.columns.length === 5 &&
      boardJson.data.columns[0].issues[0]?.issue_key?.startsWith('WOLF-')
    ) {
      console.log(
        `   ✅ PASSED: Project board returned 5 ordered columns with formatted issue keys (e.g. ${boardJson.data.columns[0].issues[0].issue_key}).`
      );
      passedTests++;
    } else {
      console.error('   ❌ FAILED: Board endpoint structure invalid:', boardJson);
    }

    // Test 4: Project Statistics
    console.log('\n🔹 Test 4: GET /api/projects/:projectId/statistics');
    const statsRes = await fetch(`${baseUrl}/projects/${wolfProject.id}/statistics`);
    const statsJson = await statsRes.json();
    if (
      statsRes.status === 200 &&
      statsJson.success === true &&
      statsJson.data.totalIssues > 0 &&
      statsJson.data.openIssues !== undefined
    ) {
      console.log(
        `   ✅ PASSED: Statistics returned: Total: ${statsJson.data.totalIssues}, Open: ${statsJson.data.openIssues}, InProgress: ${statsJson.data.inProgressIssues}, Done: ${statsJson.data.completedIssues}.`
      );
      passedTests++;
    } else {
      console.error('   ❌ FAILED: Statistics endpoint failed:', statsJson);
    }

    // Test 5: Create Issue with Joi validation & auto-incrementing key
    console.log('\n🔹 Test 5: POST /api/issues (validation & atomic creation)');
    const reporter = await User.findOne();
    const backlogCol = await BoardColumn.findOne({
      where: { project_id: wolfProject.id, name: 'Backlog' },
    });

    // Subtest: Reject invalid project membership
    const randomUser = await User.create({
      name: 'Non Member',
      email: `nonmember_${Date.now()}@test.com`,
      avatar_color: '#000000',
    });

    const invalidAssigneeRes = await fetch(`${baseUrl}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: wolfProject.id,
        columnId: backlogCol!.id,
        title: 'Invalid Member Assignment',
        reporterId: reporter!.id,
        assigneeId: randomUser.id,
      }),
    });
    const invalidAssigneeJson = await invalidAssigneeRes.json();

    // Subtest: Valid issue creation
    const validIssueRes = await fetch(`${baseUrl}/issues`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: wolfProject.id,
        columnId: backlogCol!.id,
        title: 'Phase 3 Automated Test Ticket',
        priority: 'HIGH',
        reporterId: reporter!.id,
      }),
    });
    const validIssueJson = await validIssueRes.json();

    if (
      invalidAssigneeRes.status === 400 &&
      validIssueRes.status === 201 &&
      validIssueJson.data.issue_key?.startsWith('WOLF-')
    ) {
      console.log(
        `   ✅ PASSED: Non-member assignee rejected with 400, and valid issue created with key ${validIssueJson.data.issue_key}.`
      );
      passedTests++;
    } else {
      console.error('   ❌ FAILED: Issue creation test failed:', {
        invalidAssigneeJson,
        validIssueJson,
      });
    }

    // Test 6: Move Issue (Kanban DND endpoint)
    console.log('\n🔹 Test 6: PATCH /api/issues/:issueId/move');
    const todoCol = await BoardColumn.findOne({
      where: { project_id: wolfProject.id, name: 'To Do' },
    });
    const moveRes = await fetch(`${baseUrl}/issues/${validIssueJson.data.id}/move`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        targetColumnId: todoCol!.id,
        newPosition: 500.5,
      }),
    });
    const moveJson = await moveRes.json();

    if (
      moveRes.status === 200 &&
      moveJson.success === true &&
      moveJson.data.columnId === todoCol!.id &&
      moveJson.data.position === 500.5
    ) {
      console.log('   ✅ PASSED: Issue position and column updated atomically via DND move.');
      passedTests++;
    } else {
      console.error('   ❌ FAILED: Move endpoint failed:', moveJson);
    }

    // Test 7: Comment lifecycle (POST & DELETE) and clean cascade
    console.log('\n🔹 Test 7: Comment lifecycle POST /api/issues/:id/comments & DELETE');
    const commentRes = await fetch(
      `${baseUrl}/issues/${validIssueJson.data.id}/comments`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: reporter!.id,
          body: 'Automated test comment message',
        }),
      }
    );
    const commentJson = await commentRes.json();

    const deleteCommentRes = await fetch(
      `${baseUrl}/comments/${commentJson.data.id}`,
      { method: 'DELETE' }
    );
    const deleteCommentJson = await deleteCommentRes.json();

    // Clean up created test issue
    await fetch(`${baseUrl}/issues/${validIssueJson.data.id}`, { method: 'DELETE' });
    await randomUser.destroy().catch(() => {});

    if (commentRes.status === 201 && deleteCommentRes.status === 200) {
      console.log('   ✅ PASSED: Comment created and deleted cleanly with standard envelopes.');
      passedTests++;
    } else {
      console.error('   ❌ FAILED: Comment lifecycle failed:', {
        commentJson,
        deleteCommentJson,
      });
    }

    console.log('\n========================================');
    console.log(`🏁 API TEST RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
    console.log('========================================\n');

    return passedTests === totalTests;
  } catch (err) {
    console.error('❌ API Test suite execution failed:', err);
    return false;
  } finally {
    server.close();
    await sequelize.close().catch(() => {});
  }
};

// If run directly from CLI
if (require.main === module) {
  runApiTests()
    .then((success) => process.exit(success ? 0 : 1))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
