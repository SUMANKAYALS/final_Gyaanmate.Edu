import CodingSubmission from '../models/CodingSubmission.js';
import { codingProblems, getProblemBySlug, toProblemDetail, toProblemSummary } from '../data/codingProblems.js';

function buildProgress(submissions = []) {
  const solved = new Set();
  const attemptsByProblem = {};
  submissions.forEach((submission) => {
    attemptsByProblem[submission.problemSlug] = (attemptsByProblem[submission.problemSlug] || 0) + 1;
    if (submission.status === 'Accepted') solved.add(submission.problemSlug);
  });

  return {
    solved: Array.from(solved),
    attemptsByProblem,
    totalSubmissions: submissions.length,
  };
}

export async function getCodingProblems(req, res) {
  const userId = req.user?._id;
  const submissions = userId
    ? await CodingSubmission.find({ user: userId }).select('problemSlug status').lean()
    : [];
  const progress = buildProgress(submissions);
  const problems = codingProblems.map((problem) => ({
    ...toProblemSummary(problem),
    solved: progress.solved.includes(problem.slug),
    attempts: progress.attemptsByProblem[problem.slug] || 0,
  }));

  res.json({
    problems,
    stats: {
      totalProblems: codingProblems.length,
      solvedCount: progress.solved.length,
      totalSubmissions: progress.totalSubmissions,
    },
  });
}

export async function getCodingProblem(req, res) {
  const problem = getProblemBySlug(req.params.slug);
  if (!problem) return res.status(404).json({ message: 'Coding problem not found' });

  const latestSubmission = req.user?._id
    ? await CodingSubmission.findOne({ user: req.user._id, problemSlug: problem.slug })
        .sort({ createdAt: -1 })
        .select('status code passedTests totalTests runtimeMs createdAt')
        .lean()
    : null;

  res.json({ problem: toProblemDetail(problem), latestSubmission });
}

export function getCodingProblemTests(req, res) {
  const problem = getProblemBySlug(req.params.slug);
  if (!problem) return res.status(404).json({ message: 'Coding problem not found' });

  res.json({
    slug: problem.slug,
    functionName: problem.functionName,
    tests: problem.tests,
  });
}

export async function createCodingSubmission(req, res) {
  const problem = getProblemBySlug(req.params.slug);
  if (!problem) return res.status(404).json({ message: 'Coding problem not found' });

  const {
    code,
    language = 'javascript',
    status,
    passedTests = 0,
    totalTests = problem.tests.length,
    runtimeMs = 0,
    error = '',
  } = req.body;

  if (!code?.trim()) return res.status(400).json({ message: 'Code is required' });
  if (!['Accepted', 'Wrong Answer', 'Runtime Error'].includes(status)) {
    return res.status(400).json({ message: 'Invalid submission status' });
  }

  const submission = await CodingSubmission.create({
    user: req.user._id,
    problemSlug: problem.slug,
    problemTitle: problem.title,
    language,
    code,
    status,
    passedTests,
    totalTests,
    runtimeMs,
    error,
  });

  res.status(201).json({ submission });
}

export async function getMyCodingSubmissions(req, res) {
  const submissions = await CodingSubmission.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  res.json({ submissions });
}
