export const codingProblems = [
  {
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Arrays',
    tags: ['Array', 'Hash Map'],
    estimatedMinutes: 15,
    acceptance: 72,
    functionName: 'twoSum',
    prompt:
      'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume exactly one answer exists, and you may not use the same element twice.',
    inputFormat: 'nums: number[], target: number',
    outputFormat: 'number[] containing the two indices in any order',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Exactly one valid pair exists'],
    starterCode: `function twoSum(nums, target) {
  // Return the two indices whose values add up to target.
}`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    tests: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1], public: true, unordered: true },
      { args: [[3, 2, 4], 6], expected: [1, 2], public: true, unordered: true },
      { args: [[3, 3], 6], expected: [0, 1], public: false, unordered: true },
      { args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4], public: false, unordered: true },
    ],
  },
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stacks',
    tags: ['Stack', 'String'],
    estimatedMinutes: 12,
    acceptance: 68,
    functionName: 'isValid',
    prompt:
      'Given a string containing only brackets, determine whether every opening bracket is closed by the same type of bracket and in the correct order.',
    inputFormat: 's: string',
    outputFormat: 'boolean',
    constraints: ['1 <= s.length <= 10^4', 's contains only (), {}, and [] characters'],
    starterCode: `function isValid(s) {
  // Return true when the bracket sequence is valid.
}`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "([)]"', output: 'false' },
    ],
    tests: [
      { args: ['()'], expected: true, public: true },
      { args: ['()[]{}'], expected: true, public: true },
      { args: ['([)]'], expected: false, public: false },
      { args: ['{[]}'], expected: true, public: false },
    ],
  },
  {
    slug: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    category: 'Greedy',
    tags: ['Array', 'Greedy'],
    estimatedMinutes: 18,
    acceptance: 75,
    functionName: 'maxProfit',
    prompt:
      'Given prices where prices[i] is the price of a stock on day i, choose one day to buy and one later day to sell. Return the maximum profit, or 0 if no profit is possible.',
    inputFormat: 'prices: number[]',
    outputFormat: 'number',
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    starterCode: `function maxProfit(prices) {
  // Return the best profit from one buy and one sell.
}`,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5' },
      { input: 'prices = [7,6,4,3,1]', output: '0' },
    ],
    tests: [
      { args: [[7, 1, 5, 3, 6, 4]], expected: 5, public: true },
      { args: [[7, 6, 4, 3, 1]], expected: 0, public: true },
      { args: [[2, 4, 1]], expected: 2, public: false },
      { args: [[1, 2, 3, 4, 5]], expected: 4, public: false },
    ],
  },
  {
    slug: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    category: 'Hashing',
    tags: ['Array', 'Hash Map', 'String'],
    estimatedMinutes: 25,
    acceptance: 61,
    functionName: 'groupAnagrams',
    prompt:
      'Given an array of strings, group the anagrams together. The answer can be returned in any order, but each group must contain words that are anagrams of one another.',
    inputFormat: 'strs: string[]',
    outputFormat: 'string[][]',
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters'],
    starterCode: `function groupAnagrams(strs) {
  // Return an array of anagram groups.
}`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]' },
    ],
    tests: [
      { args: [['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']], public: true, unorderedGroups: true },
      { args: [['']], expected: [['']], public: true, unorderedGroups: true },
      { args: [['a']], expected: [['a']], public: false, unorderedGroups: true },
      { args: [['abc', 'bca', 'cab', 'foo', 'ofo']], expected: [['abc', 'bca', 'cab'], ['foo', 'ofo']], public: false, unorderedGroups: true },
    ],
  },
  {
    slug: 'product-of-array-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    category: 'Prefix Products',
    tags: ['Array', 'Prefix', 'Interview'],
    estimatedMinutes: 30,
    acceptance: 58,
    functionName: 'productExceptSelf',
    prompt:
      'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all elements of nums except nums[i]. Solve it without using division.',
    inputFormat: 'nums: number[]',
    outputFormat: 'number[]',
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30', 'Do not use division'],
    starterCode: `function productExceptSelf(nums) {
  // Return product of every element except self.
}`,
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
    ],
    tests: [
      { args: [[1, 2, 3, 4]], expected: [24, 12, 8, 6], public: true },
      { args: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0], public: true },
      { args: [[2, 3, 4, 5]], expected: [60, 40, 30, 24], public: false },
      { args: [[0, 0]], expected: [0, 0], public: false },
    ],
  },
  {
    slug: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    tags: ['String', 'Sliding Window', 'Hash Set'],
    estimatedMinutes: 28,
    acceptance: 53,
    functionName: 'lengthOfLongestSubstring',
    prompt:
      'Given a string s, find the length of the longest substring without repeating characters.',
    inputFormat: 's: string',
    outputFormat: 'number',
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols, and spaces'],
    starterCode: `function lengthOfLongestSubstring(s) {
  // Return the longest length with all unique characters.
}`,
    examples: [
      { input: 's = "abcabcbb"', output: '3' },
      { input: 's = "bbbbb"', output: '1' },
    ],
    tests: [
      { args: ['abcabcbb'], expected: 3, public: true },
      { args: ['bbbbb'], expected: 1, public: true },
      { args: ['pwwkew'], expected: 3, public: false },
      { args: [''], expected: 0, public: false },
    ],
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    category: 'Binary Search',
    tags: ['Array', 'Binary Search'],
    estimatedMinutes: 12,
    acceptance: 79,
    functionName: 'search',
    prompt:
      'Given a sorted array nums and a target value, return the index if the target is found. Otherwise, return -1. Your solution should run in O(log n) time.',
    inputFormat: 'nums: number[], target: number',
    outputFormat: 'number',
    constraints: ['1 <= nums.length <= 10^5', 'nums is sorted in ascending order', 'All values in nums are unique'],
    starterCode: `function search(nums, target) {
  // Return the index of target, or -1 when absent.
}`,
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' },
    ],
    tests: [
      { args: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, public: true },
      { args: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, public: true },
      { args: [[5], 5], expected: 0, public: false },
      { args: [[1, 3, 5, 7, 9, 11], 1], expected: 0, public: false },
    ],
  },
  {
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    category: 'Intervals',
    tags: ['Array', 'Sorting', 'Intervals'],
    estimatedMinutes: 30,
    acceptance: 57,
    functionName: 'merge',
    prompt:
      'Given an array of intervals where intervals[i] = [start, end], merge every overlapping interval and return the non-overlapping intervals sorted by start time.',
    inputFormat: 'intervals: number[][]',
    outputFormat: 'number[][]',
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start <= end <= 10^4'],
    starterCode: `function merge(intervals) {
  // Return merged, non-overlapping intervals.
}`,
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
    ],
    tests: [
      { args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]], public: true },
      { args: [[[1, 4], [4, 5]]], expected: [[1, 5]], public: true },
      { args: [[[1, 4], [0, 2], [3, 5]]], expected: [[0, 5]], public: false },
      { args: [[[1, 4]]], expected: [[1, 4]], public: false },
    ],
  },
  {
    slug: 'kth-largest-element',
    title: 'Kth Largest Element',
    difficulty: 'Medium',
    category: 'Heap',
    tags: ['Array', 'Heap', 'Sorting'],
    estimatedMinutes: 25,
    acceptance: 64,
    functionName: 'findKthLargest',
    prompt:
      'Given an integer array nums and an integer k, return the kth largest element in the array. It is the kth largest in sorted order, not the kth distinct value.',
    inputFormat: 'nums: number[], k: number',
    outputFormat: 'number',
    constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    starterCode: `function findKthLargest(nums, k) {
  // Return the kth largest value.
}`,
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4' },
    ],
    tests: [
      { args: [[3, 2, 1, 5, 6, 4], 2], expected: 5, public: true },
      { args: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4, public: true },
      { args: [[1], 1], expected: 1, public: false },
      { args: [[-1, 2, 0], 2], expected: 0, public: false },
    ],
  },
  {
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    tags: ['DP', 'Math'],
    estimatedMinutes: 15,
    acceptance: 71,
    functionName: 'climbStairs',
    prompt:
      'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb either 1 or 2 steps. Return the number of distinct ways to reach the top.',
    inputFormat: 'n: number',
    outputFormat: 'number',
    constraints: ['1 <= n <= 45'],
    starterCode: `function climbStairs(n) {
  // Return how many distinct ways can reach step n.
}`,
    examples: [
      { input: 'n = 2', output: '2' },
      { input: 'n = 3', output: '3' },
    ],
    tests: [
      { args: [2], expected: 2, public: true },
      { args: [3], expected: 3, public: true },
      { args: [1], expected: 1, public: false },
      { args: [10], expected: 89, public: false },
    ],
  },
  {
    slug: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    tags: ['DP', 'BFS', 'Array'],
    estimatedMinutes: 35,
    acceptance: 46,
    functionName: 'coinChange',
    prompt:
      'Given coin denominations and a target amount, return the fewest number of coins needed to make that amount. Return -1 if the amount cannot be made.',
    inputFormat: 'coins: number[], amount: number',
    outputFormat: 'number',
    constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10^4', '1 <= coins[i] <= 2^31 - 1'],
    starterCode: `function coinChange(coins, amount) {
  // Return the minimum number of coins, or -1.
}`,
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3' },
      { input: 'coins = [2], amount = 3', output: '-1' },
    ],
    tests: [
      { args: [[1, 2, 5], 11], expected: 3, public: true },
      { args: [[2], 3], expected: -1, public: true },
      { args: [[1], 0], expected: 0, public: false },
      { args: [[2, 5, 10, 1], 27], expected: 4, public: false },
    ],
  },
  {
    slug: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    category: 'Graphs',
    tags: ['DFS', 'BFS', 'Matrix'],
    estimatedMinutes: 32,
    acceptance: 55,
    functionName: 'numIslands',
    prompt:
      'Given a 2D grid of "1" land and "0" water, count the number of islands. An island is surrounded by water and connected horizontally or vertically.',
    inputFormat: 'grid: string[][]',
    outputFormat: 'number',
    constraints: ['1 <= rows, cols <= 300', 'grid[i][j] is "0" or "1"'],
    starterCode: `function numIslands(grid) {
  // Return the number of connected land components.
}`,
    examples: [
      { input: 'grid = [["1","1","0"],["0","1","0"],["1","0","1"]]', output: '3' },
    ],
    tests: [
      { args: [[[ '1', '1', '0' ], [ '0', '1', '0' ], [ '1', '0', '1' ]]], expected: 3, public: true },
      { args: [[[ '1', '1', '1' ], [ '0', '1', '0' ], [ '1', '1', '1' ]]], expected: 1, public: true },
      { args: [[[ '0', '0' ], [ '0', '0' ]]], expected: 0, public: false },
      { args: [[[ '1' ]]], expected: 1, public: false },
    ],
  },
  {
    slug: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    category: 'Graphs',
    tags: ['Graph', 'Topological Sort', 'DFS'],
    estimatedMinutes: 35,
    acceptance: 49,
    functionName: 'canFinish',
    prompt:
      'There are numCourses courses labeled from 0 to numCourses - 1. Given prerequisite pairs [a, b], decide whether you can finish all courses.',
    inputFormat: 'numCourses: number, prerequisites: number[][]',
    outputFormat: 'boolean',
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000'],
    starterCode: `function canFinish(numCourses, prerequisites) {
  // Return false when the prerequisite graph has a cycle.
}`,
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true' },
      { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false' },
    ],
    tests: [
      { args: [2, [[1, 0]]], expected: true, public: true },
      { args: [2, [[1, 0], [0, 1]]], expected: false, public: true },
      { args: [4, [[1, 0], [2, 1], [3, 2]]], expected: true, public: false },
      { args: [3, [[0, 1], [1, 2], [2, 0]]], expected: false, public: false },
    ],
  },
  {
    slug: 'binary-tree-level-order-traversal',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    category: 'Trees',
    tags: ['Tree', 'BFS', 'Queue'],
    estimatedMinutes: 28,
    acceptance: 63,
    functionName: 'levelOrder',
    prompt:
      'Given a binary tree represented as nested objects with val, left, and right properties, return its values level by level from top to bottom.',
    inputFormat: 'root: { val: number, left?: object|null, right?: object|null } | null',
    outputFormat: 'number[][]',
    constraints: ['0 <= number of nodes <= 2000'],
    starterCode: `function levelOrder(root) {
  // Return node values grouped by tree level.
}`,
    examples: [
      { input: 'root = { val: 3, left: { val: 9 }, right: { val: 20, left: { val: 15 }, right: { val: 7 } } }', output: '[[3],[9,20],[15,7]]' },
    ],
    tests: [
      { args: [{ val: 3, left: { val: 9, left: null, right: null }, right: { val: 20, left: { val: 15, left: null, right: null }, right: { val: 7, left: null, right: null } } }], expected: [[3], [9, 20], [15, 7]], public: true },
      { args: [{ val: 1, left: null, right: null }], expected: [[1]], public: true },
      { args: [null], expected: [], public: false },
      { args: [{ val: 1, left: { val: 2, left: { val: 4, left: null, right: null }, right: null }, right: { val: 3, left: null, right: null } }], expected: [[1], [2, 3], [4]], public: false },
    ],
  },
  {
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    category: 'Linked List',
    tags: ['Linked List', 'Pointers'],
    estimatedMinutes: 18,
    acceptance: 76,
    functionName: 'reverseList',
    prompt:
      'Given a linked list represented as an array of node values, return the values of the linked list after reversing it. This mirrors the pointer problem while keeping the practice runner simple.',
    inputFormat: 'head: number[]',
    outputFormat: 'number[]',
    constraints: ['0 <= head.length <= 5000', '-5000 <= node value <= 5000'],
    starterCode: `function reverseList(head) {
  // Return the values in reversed linked-list order.
}`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
    ],
    tests: [
      { args: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1], public: true },
      { args: [[1, 2]], expected: [2, 1], public: true },
      { args: [[]], expected: [], public: false },
      { args: [[9]], expected: [9], public: false },
    ],
  },
  {
    slug: 'implement-queue-using-stacks',
    title: 'Implement Queue Using Stacks',
    difficulty: 'Easy',
    category: 'Queues',
    tags: ['Queue', 'Stack', 'Design'],
    estimatedMinutes: 22,
    acceptance: 67,
    functionName: 'runQueueOperations',
    prompt:
      'Simulate a FIFO queue using only stack-style operations internally. Given operations, return the results produced by peek, pop, and empty calls.',
    inputFormat: 'operations: string[], values: number[]',
    outputFormat: '(number|boolean)[]',
    constraints: ['operations contains push, pop, peek, and empty', 'push consumes the next value from values'],
    starterCode: `function runQueueOperations(operations, values) {
  // Return outputs for pop, peek, and empty operations.
}`,
    examples: [
      { input: 'operations = ["push","push","peek","pop","empty"], values = [1,2]', output: '[1,1,false]' },
    ],
    tests: [
      { args: [['push', 'push', 'peek', 'pop', 'empty'], [1, 2]], expected: [1, 1, false], public: true },
      { args: [['empty', 'push', 'empty', 'pop', 'empty'], [7]], expected: [true, false, 7, true], public: true },
      { args: [['push', 'push', 'pop', 'peek', 'pop', 'empty'], [4, 5]], expected: [4, 5, 5, true], public: false },
      { args: [['push', 'peek', 'peek', 'pop'], [10]], expected: [10, 10, 10], public: false },
    ],
  },
  {
    slug: 'subsets',
    title: 'Subsets',
    difficulty: 'Medium',
    category: 'Backtracking',
    tags: ['Backtracking', 'Array', 'Recursion'],
    estimatedMinutes: 26,
    acceptance: 74,
    functionName: 'subsets',
    prompt:
      'Given an integer array nums of unique elements, return all possible subsets. The solution set must not contain duplicate subsets.',
    inputFormat: 'nums: number[]',
    outputFormat: 'number[][]',
    constraints: ['1 <= nums.length <= 10', 'All nums values are unique'],
    starterCode: `function subsets(nums) {
  // Return every subset of nums.
}`,
    examples: [
      { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' },
    ],
    tests: [
      { args: [[1, 2, 3]], expected: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]], public: true, unorderedGroups: true },
      { args: [[0]], expected: [[], [0]], public: true, unorderedGroups: true },
      { args: [[1, 2]], expected: [[], [1], [2], [1, 2]], public: false, unorderedGroups: true },
      { args: [[4, 5, 6]], expected: [[], [4], [5], [4, 5], [6], [4, 6], [5, 6], [4, 5, 6]], public: false, unorderedGroups: true },
    ],
  },
  {
    slug: 'single-number',
    title: 'Single Number',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    tags: ['Bit', 'Array'],
    estimatedMinutes: 14,
    acceptance: 78,
    functionName: 'singleNumber',
    prompt:
      'Given a non-empty array where every element appears twice except for one, return the element that appears only once.',
    inputFormat: 'nums: number[]',
    outputFormat: 'number',
    constraints: ['1 <= nums.length <= 3 * 10^4', 'Every element appears twice except one'],
    starterCode: `function singleNumber(nums) {
  // Return the only value that appears once.
}`,
    examples: [
      { input: 'nums = [2,2,1]', output: '1' },
      { input: 'nums = [4,1,2,1,2]', output: '4' },
    ],
    tests: [
      { args: [[2, 2, 1]], expected: 1, public: true },
      { args: [[4, 1, 2, 1, 2]], expected: 4, public: true },
      { args: [[1]], expected: 1, public: false },
      { args: [[-1, -1, -7]], expected: -7, public: false },
    ],
  },
  {
    slug: 'palindrome-number',
    title: 'Palindrome Number',
    difficulty: 'Easy',
    category: 'Math',
    tags: ['Math'],
    estimatedMinutes: 12,
    acceptance: 61,
    functionName: 'isPalindrome',
    prompt:
      'Given an integer x, return true if x reads the same forward and backward. Negative numbers are not palindromes.',
    inputFormat: 'x: number',
    outputFormat: 'boolean',
    constraints: ['-2^31 <= x <= 2^31 - 1'],
    starterCode: `function isPalindrome(x) {
  // Return true when x reads the same backward.
}`,
    examples: [
      { input: 'x = 121', output: 'true' },
      { input: 'x = -121', output: 'false' },
    ],
    tests: [
      { args: [121], expected: true, public: true },
      { args: [-121], expected: false, public: true },
      { args: [10], expected: false, public: false },
      { args: [0], expected: true, public: false },
    ],
  },
  {
    slug: 'sort-colors',
    title: 'Sort Colors',
    difficulty: 'Medium',
    category: 'Sorting',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    estimatedMinutes: 24,
    acceptance: 66,
    functionName: 'sortColors',
    prompt:
      'Given an array nums with values 0, 1, and 2 representing colors, return the array sorted in-place order: all 0s, then 1s, then 2s.',
    inputFormat: 'nums: number[]',
    outputFormat: 'number[]',
    constraints: ['1 <= nums.length <= 300', 'nums[i] is 0, 1, or 2'],
    starterCode: `function sortColors(nums) {
  // Return nums sorted as 0s, then 1s, then 2s.
}`,
    examples: [
      { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]' },
    ],
    tests: [
      { args: [[2, 0, 2, 1, 1, 0]], expected: [0, 0, 1, 1, 2, 2], public: true },
      { args: [[2, 0, 1]], expected: [0, 1, 2], public: true },
      { args: [[0]], expected: [0], public: false },
      { args: [[1, 2, 0, 1, 2, 0, 1]], expected: [0, 0, 1, 1, 1, 2, 2], public: false },
    ],
  },
  {
    slug: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    category: 'Two Pointers',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    estimatedMinutes: 25,
    acceptance: 59,
    functionName: 'maxArea',
    prompt:
      'Given heights of vertical lines, choose two lines that together with the x-axis contain the most water. Return the maximum area.',
    inputFormat: 'height: number[]',
    outputFormat: 'number',
    constraints: ['2 <= height.length <= 10^5', '0 <= height[i] <= 10^4'],
    starterCode: `function maxArea(height) {
  // Return the largest water container area.
}`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
    ],
    tests: [
      { args: [[1, 8, 6, 2, 5, 4, 8, 3, 7]], expected: 49, public: true },
      { args: [[1, 1]], expected: 1, public: true },
      { args: [[4, 3, 2, 1, 4]], expected: 16, public: false },
      { args: [[1, 2, 1]], expected: 2, public: false },
    ],
  },
];

export function getProblemBySlug(slug) {
  return codingProblems.find((problem) => problem.slug === slug);
}

export function toProblemSummary(problem) {
  const { tests, starterCode, examples, constraints, prompt, inputFormat, outputFormat, ...summary } = problem;
  return {
    ...summary,
    publicTestCount: tests.filter((test) => test.public).length,
    hiddenTestCount: tests.filter((test) => !test.public).length,
  };
}

export function toProblemDetail(problem) {
  return {
    ...problem,
    tests: problem.tests.filter((test) => test.public),
    totalTestCount: problem.tests.length,
  };
}
