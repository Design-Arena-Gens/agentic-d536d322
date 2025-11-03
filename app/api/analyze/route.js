import { NextResponse } from 'next/server';
import { parseGitHubUrl, getTree, fetchRawFile, isLikelyTextFile } from '../../../lib/github';
import { runReviewer } from '../../../lib/agents/reviewer';
import { runBugFinder } from '../../../lib/agents/bugFinder';
import { runRefactor } from '../../../lib/agents/refactor';

export const runtime = 'nodejs';

export async function POST(request) {
  const started = Date.now();
  try {
    const { repoUrl, branch: inputBranch } = await request.json();
    const parsed = parseGitHubUrl(repoUrl || '');
    if (!parsed || !parsed.owner || !parsed.repo) {
      return NextResponse.json({ error: 'Invalid GitHub repository URL' }, { status: 400 });
    }
    const branch = inputBranch || parsed.branch || 'main';

    const paths = await getTree(parsed.owner, parsed.repo, branch);
    if (!paths.length) {
      return NextResponse.json({ error: 'Repository tree not found or empty' }, { status: 404 });
    }

    const interesting = paths.filter(isLikelyTextFile);
    const LIMIT_FILES = 200;
    const selected = interesting.slice(0, LIMIT_FILES);

    const files = [];
    let totalBytes = 0;
    for (const p of selected) {
      const text = await fetchRawFile(parsed.owner, parsed.repo, branch, p);
      if (text == null) continue;
      totalBytes += text.length;
      if (totalBytes > 2 * 1024 * 1024) break; // 2MB cap
      files.push({ path: p, content: text });
    }

    const reviewer = runReviewer(files);
    const bugFinder = runBugFinder(files);
    const refactor = runRefactor(files);

    const ms = Date.now() - started;
    const total = reviewer.issues.length + bugFinder.issues.length + refactor.suggestions.length;

    return NextResponse.json({
      reviewer,
      bugFinder,
      refactor,
      summary: { files: files.length, total, ms }
    });
  } catch (e) {
    return NextResponse.json({ error: e?.message || 'Unknown error' }, { status: 500 });
  }
}
